from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import hashlib
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client.get_database(os.environ.get('DB_NAME', 'adhikaar'))

# Get LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', 'sk-emergent-61cC33511Fd3956926')

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
v1_router = APIRouter(prefix="/v1")
auth_router = APIRouter(prefix="/auth")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ====== Models ======

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    token_hash: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AskRequest(BaseModel):
    query: str
    lang: str = "en"
    context: Dict[str, Any] = {}

class AskResponse(BaseModel):
    title: str
    summary: str
    steps: List[str]
    sources: List[Dict[str, str]]
    template: Optional[str] = None
    updated: str = "Updated: Today"

class WalletSaveRequest(BaseModel):
    title: str
    content: str
    tags: List[str] = []

class WalletDocument(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    title: str
    content: str
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SessionCreateRequest(BaseModel):
    session_token: str
    email: EmailStr
    name: str
    picture: Optional[str] = None

# ====== Helper Functions ======

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

async def get_user_from_cookie(request: Request) -> Optional[User]:
    session_token = request.cookies.get("session_token")
    if not session_token:
        return None
    
    token_hash = hash_token(session_token)
    session_doc = await db.sessions.find_one({"token_hash": token_hash})
    
    if not session_doc:
        return None
    
    if datetime.fromisoformat(session_doc['expires_at']) < datetime.now(timezone.utc):
        return None
    
    user_doc = await db.users.find_one({"id": session_doc['user_id']}, {"_id": 0})
    if user_doc:
        # Convert datetime strings
        if isinstance(user_doc.get('created_at'), str):
            user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
        return User(**user_doc)
    return None

async def search_web_for_legal_info(query: str, use_case: Optional[str] = None) -> List[Dict[str, str]]:
    """Mock web search function - returns predefined sources"""
    sources = [
        {"title": "India Code - Central Acts", "url": "https://www.indiacode.nic.in/", "type": "Gov"},
        {"title": "Ministry of Law & Justice", "url": "https://lawmin.gov.in/", "type": "Gov"},
    ]
    
    if use_case == "traffic":
        sources.append({"title": "Motor Vehicles Act, 1988", "url": "https://www.indiacode.nic.in/", "type": "Act"})
    elif use_case == "consumer":
        sources.append({"title": "Consumer Protection Act, 2019", "url": "https://consumeraffairs.nic.in/", "type": "Act"})
    elif use_case == "police":
        sources.append({"title": "Code of Criminal Procedure, 1973", "url": "https://www.indiacode.nic.in/", "type": "Act"})
    
    return sources

# ====== Auth Routes ======

@auth_router.post("/session")
async def create_session(request: SessionCreateRequest, response: Response):
    """Create or update user session after OAuth"""
    try:
        # Check if user exists
        user_doc = await db.users.find_one({"email": request.email}, {"_id": 0})
        
        if user_doc:
            user = User(**user_doc)
        else:
            # Create new user
            user = User(email=request.email, name=request.name, picture=request.picture)
            doc = user.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.users.insert_one(doc)
        
        # Create session
        token_hash = hash_token(request.session_token)
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session = Session(user_id=user.id, token_hash=token_hash, expires_at=expires_at)
        session_doc = session.model_dump()
        session_doc['created_at'] = session_doc['created_at'].isoformat()
        session_doc['expires_at'] = session_doc['expires_at'].isoformat()
        
        await db.sessions.insert_one(session_doc)
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=request.session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,
            path="/"
        )
        
        return {"user": user.model_dump(), "message": "Session created"}
    except Exception as e:
        logger.error(f"Session creation error: {e}")
        raise HTTPException(status_code=500, detail="Session creation failed")

@auth_router.get("/me")
async def get_current_user(request: Request):
    """Get current authenticated user"""
    user = await get_user_from_cookie(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"user": user.model_dump()}

@auth_router.post("/logout")
async def logout(request: Request, response: Response):
    """Logout user and clear session"""
    session_token = request.cookies.get("session_token")
    if session_token:
        token_hash = hash_token(session_token)
        await db.sessions.delete_one({"token_hash": token_hash})
    
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out"}

# ====== AI Q&A Routes ======

@v1_router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest, req: Request):
    """AI-powered legal Q&A with citations"""
    try:
        user = await get_user_from_cookie(req)
        
        # Search for relevant sources
        sources = await search_web_for_legal_info(request.query, request.context.get('useCase'))
        
        # Prepare system prompt
        system_prompt = """You are Adhikaar.ai, an AI legal assistant for India. Your role is to:
1. Provide accurate, cited legal guidance based on Indian laws
2. Use simple, accessible language
3. Structure answers as: Summary -> Steps -> Template (if applicable) -> Sources
4. Always cite specific laws, sections, and official sources
5. Avoid definitive legal advice; provide general guidance
6. Mention jurisdiction (India) and last updated date

Keep responses concise, actionable, and fact-based."""
        
        # Create LLM chat instance
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message=system_prompt
        ).with_model("openai", "gpt-4o-mini")
        
        # Create user message with context
        sources_text = "\n".join([f"- {s['title']} ({s['url']})" for s in sources])
        prompt = f"""Question: {request.query}

Use Case: {request.context.get('useCase', 'general')}

Available sources:
{sources_text}

Provide:
1. A clear title (max 80 chars)
2. A summary (2-3 sentences)
3. 3-5 actionable steps
4. If applicable, a simple template with [placeholders]

Format your response as a structured answer."""
        
        user_message = UserMessage(text=prompt)
        
        # Get AI response with timeout
        # Note: emergentintegrations uses litellm internally which may not respect
        # asyncio cancellation during streaming. Timeout increased to 15s for MVP.
        try:
            ai_response = await asyncio.wait_for(chat.send_message(user_message), timeout=15.0)
        except (asyncio.TimeoutError, TimeoutError):
            raise HTTPException(status_code=504, detail="AI response timeout - please try again")
        
        # Parse response (simplified)
        response_text = ai_response if isinstance(ai_response, str) else str(ai_response)
        
        # Extract structured data (basic parsing)
        lines = response_text.split('\n')
        title = request.query[:80] if len(request.query) <= 80 else request.query[:77] + "..."
        summary = response_text[:200]
        steps = []
        
        for line in lines:
            if line.strip().startswith(('1.', '2.', '3.', '4.', '5.', '-')):
                steps.append(line.strip())
        
        if not steps:
            steps = [
                "Review the relevant laws and regulations",
                "Gather all necessary documentation",
                "Consult with appropriate authorities if needed",
                "Follow prescribed legal procedures"
            ]
        
        result = AskResponse(
            title=title,
            summary=summary,
            steps=steps[:5],
            sources=sources,
            template=None
        )
        
        # Log the query
        log_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user.id if user else None,
            "query": request.query,
            "lang": request.lang,
            "use_case": request.context.get('useCase'),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.ask_logs.insert_one(log_doc)
        
        return result
        
    except Exception as e:
        logger.error(f"Ask error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process query: {str(e)}")

# ====== Wallet Routes ======

@v1_router.post("/wallet/save")
async def save_to_wallet(request: WalletSaveRequest, req: Request):
    """Save document to wallet"""
    user = await get_user_from_cookie(req)
    
    doc = WalletDocument(
        user_id=user.id if user else None,
        title=request.title,
        content=request.content,
        tags=request.tags
    )
    
    doc_dict = doc.model_dump()
    doc_dict['created_at'] = doc_dict['created_at'].isoformat()
    
    await db.wallet_docs.insert_one(doc_dict)
    return {"id": doc.id, "message": "Saved to wallet"}

@v1_router.get("/wallet/list")
async def list_wallet_docs(req: Request):
    """List wallet documents"""
    user = await get_user_from_cookie(req)
    
    query = {"user_id": user.id} if user else {}
    docs = await db.wallet_docs.find(query, {"_id": 0}).to_list(100)
    
    return {"documents": docs}

@v1_router.delete("/wallet/{doc_id}")
async def delete_wallet_doc(doc_id: str, req: Request):
    """Delete wallet document"""
    user = await get_user_from_cookie(req)
    
    result = await db.wallet_docs.delete_one({"id": doc_id, "user_id": user.id if user else None})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {"message": "Document deleted"}

# ====== Library Routes ======

@v1_router.get("/library/search")
async def search_library(q: str = ""):
    """Search legal library"""
    # Mock implementation
    items = [
        {
            "id": "1",
            "title": "Motor Vehicles Act, 1988",
            "snippet": "The Motor Vehicles Act regulates all aspects of road transport vehicles...",
            "url": "https://www.indiacode.nic.in/",
            "source_type": "Act",
            "tags": ["traffic", "transport"]
        },
        {
            "id": "2",
            "title": "Consumer Protection Act, 2019",
            "snippet": "An Act to provide for protection of the interests of consumers...",
            "url": "https://consumeraffairs.nic.in/",
            "source_type": "Act",
            "tags": ["consumer", "rights"]
        }
    ]
    
    if q:
        items = [item for item in items if q.lower() in item['title'].lower() or q.lower() in item['snippet'].lower()]
    
    return {"results": items}

# ====== Theme Routes ======

class ThemeCreateRequest(BaseModel):
    name: str
    tokens: Dict[str, Any]
    scope: str = "user"

class ThemeUpdateRequest(BaseModel):
    name: Optional[str] = None
    tokens: Optional[Dict[str, Any]] = None

class Theme(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    tokens: Dict[str, Any]
    owner_id: Optional[str] = None
    scope: str = "user"
    visibility: str = "private"
    status: str = "published"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_at: Optional[datetime] = None
    version: str = "1.0.0"

@v1_router.get("/themes")
async def get_themes(req: Request, scope: str = "user"):
    """Get all themes for user"""
    user = await get_user_from_cookie(req)
    
    query = {"scope": scope, "status": {"$ne": "deleted"}}
    if user:
        query["owner_id"] = user.id
    
    themes = await db.themes.find(query, {"_id": 0}).to_list(100)
    
    return {"themes": themes}

@v1_router.post("/themes")
async def create_theme(request: ThemeCreateRequest, req: Request):
    """Create new theme"""
    user = await get_user_from_cookie(req)
    
    theme = Theme(
        name=request.name,
        tokens=request.tokens,
        owner_id=user.id if user else None,
        scope=request.scope
    )
    
    theme_dict = theme.model_dump()
    theme_dict['created_at'] = theme_dict['created_at'].isoformat()
    theme_dict['updated_at'] = theme_dict['updated_at'].isoformat()
    
    await db.themes.insert_one(theme_dict)
    
    return {"theme": theme.model_dump()}

@v1_router.put("/themes/{theme_id}")
async def update_theme(theme_id: str, request: ThemeUpdateRequest, req: Request):
    """Update theme"""
    user = await get_user_from_cookie(req)
    
    update_data = {}
    if request.name:
        update_data['name'] = request.name
    if request.tokens:
        update_data['tokens'] = request.tokens
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.themes.update_one(
        {"id": theme_id, "owner_id": user.id if user else None},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    theme = await db.themes.find_one({"id": theme_id}, {"_id": 0})
    return {"theme": theme}

@v1_router.delete("/themes/{theme_id}")
async def delete_theme_api(theme_id: str, req: Request):
    """Soft delete theme"""
    user = await get_user_from_cookie(req)
    
    result = await db.themes.update_one(
        {"id": theme_id, "owner_id": user.id if user else None},
        {
            "$set": {
                "status": "deleted",
                "deleted_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    return {"ok": True}

@v1_router.post("/themes/{theme_id}/restore")
async def restore_theme_api(theme_id: str, req: Request):
    """Restore deleted theme"""
    user = await get_user_from_cookie(req)
    
    result = await db.themes.update_one(
        {"id": theme_id, "owner_id": user.id if user else None},
        {
            "$set": {
                "status": "published",
                "deleted_at": None
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Theme not found")
    
    theme = await db.themes.find_one({"id": theme_id}, {"_id": 0})
    return {"theme": theme}

# Include routers
api_router.include_router(v1_router)
api_router.include_router(auth_router)
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()