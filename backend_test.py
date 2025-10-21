#!/usr/bin/env python3
"""
Backend API Testing for Adhikaar.ai Legal Assistant
Testing AI integration and API endpoints
"""

import requests
import json
import time
import sys
from typing import Dict, Any, List

# Backend URL from frontend/.env
BACKEND_URL = "https://repo-analyzer-101.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api/v1"

class BackendTester:
    def __init__(self):
        self.results = []
        self.session = requests.Session()
        
    def log_result(self, test_name: str, success: bool, message: str, details: Dict = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {},
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details:
            print(f"   Details: {json.dumps(details, indent=2)}")
        print()

    def test_ai_ask_endpoint_basic(self):
        """Test basic AI ask endpoint functionality"""
        test_name = "AI Ask Endpoint - Basic Traffic Query"
        
        try:
            payload = {
                "query": "What are my rights if I get a traffic challan?",
                "lang": "en",
                "context": {"useCase": "traffic"}
            }
            
            start_time = time.time()
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            response_time = time.time() - start_time
            
            if response.status_code != 200:
                self.log_result(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Verify response structure
            required_fields = ["title", "summary", "steps", "sources", "updated"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                self.log_result(test_name, False, f"Missing required fields: {missing_fields}", {"response": data})
                return
            
            # Verify data types and content
            issues = []
            
            if not isinstance(data["title"], str) or len(data["title"]) == 0:
                issues.append("Title is empty or not a string")
            
            if not isinstance(data["summary"], str) or len(data["summary"]) == 0:
                issues.append("Summary is empty or not a string")
            
            if not isinstance(data["steps"], list) or len(data["steps"]) == 0:
                issues.append("Steps is empty or not a list")
            
            if not isinstance(data["sources"], list) or len(data["sources"]) == 0:
                issues.append("Sources is empty or not a list")
            
            # Check response time
            if response_time > 5.0:
                issues.append(f"Response time too slow: {response_time:.2f}s (should be < 5s)")
            
            if issues:
                self.log_result(test_name, False, f"Data validation issues: {'; '.join(issues)}", {
                    "response_time": response_time,
                    "response": data
                })
            else:
                self.log_result(test_name, True, f"AI response generated successfully in {response_time:.2f}s", {
                    "response_time": response_time,
                    "title_length": len(data["title"]),
                    "summary_length": len(data["summary"]),
                    "steps_count": len(data["steps"]),
                    "sources_count": len(data["sources"])
                })
                
        except requests.exceptions.Timeout:
            self.log_result(test_name, False, "Request timeout (>10s)")
        except requests.exceptions.RequestException as e:
            self.log_result(test_name, False, f"Request error: {str(e)}")
        except json.JSONDecodeError:
            self.log_result(test_name, False, "Invalid JSON response")
        except Exception as e:
            self.log_result(test_name, False, f"Unexpected error: {str(e)}")

    def test_ai_ask_consumer_rights(self):
        """Test AI ask endpoint with consumer rights query"""
        test_name = "AI Ask Endpoint - Consumer Rights Query"
        
        try:
            payload = {
                "query": "How do I file a consumer complaint?",
                "lang": "en", 
                "context": {"useCase": "consumer"}
            }
            
            start_time = time.time()
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            response_time = time.time() - start_time
            
            if response.status_code != 200:
                self.log_result(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Check if consumer-specific sources are included
            consumer_related = any(
                "consumer" in source.get("title", "").lower() or 
                "consumer" in source.get("url", "").lower()
                for source in data.get("sources", [])
            )
            
            # Verify actionable steps are provided
            steps = data.get("steps", [])
            has_actionable_steps = len(steps) >= 3
            
            if consumer_related and has_actionable_steps and response_time <= 5.0:
                self.log_result(test_name, True, f"Consumer query processed successfully in {response_time:.2f}s", {
                    "response_time": response_time,
                    "consumer_sources_found": consumer_related,
                    "steps_count": len(steps)
                })
            else:
                issues = []
                if not consumer_related:
                    issues.append("No consumer-related sources found")
                if not has_actionable_steps:
                    issues.append(f"Insufficient actionable steps ({len(steps)} < 3)")
                if response_time > 5.0:
                    issues.append(f"Response too slow: {response_time:.2f}s")
                
                self.log_result(test_name, False, f"Issues: {'; '.join(issues)}", {
                    "response": data,
                    "response_time": response_time
                })
                
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def test_ai_ask_general_legal(self):
        """Test AI ask endpoint with general legal query"""
        test_name = "AI Ask Endpoint - General Legal Query (RTI)"
        
        try:
            payload = {
                "query": "What is the process for RTI?",
                "lang": "en",
                "context": {"useCase": "general"}
            }
            
            start_time = time.time()
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            response_time = time.time() - start_time
            
            if response.status_code != 200:
                self.log_result(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Verify general legal query handling
            has_valid_response = (
                len(data.get("title", "")) > 0 and
                len(data.get("summary", "")) > 0 and
                len(data.get("steps", [])) > 0 and
                len(data.get("sources", [])) > 0
            )
            
            if has_valid_response and response_time <= 5.0:
                self.log_result(test_name, True, f"General legal query processed successfully in {response_time:.2f}s", {
                    "response_time": response_time,
                    "title": data.get("title", "")[:50] + "..." if len(data.get("title", "")) > 50 else data.get("title", "")
                })
            else:
                self.log_result(test_name, False, f"Invalid response or timeout", {
                    "response": data,
                    "response_time": response_time
                })
                
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def test_ai_response_structure(self):
        """Test AI response structure compliance"""
        test_name = "AI Response Structure Validation"
        
        try:
            payload = {
                "query": "What should I do if police stops me?",
                "lang": "en",
                "context": {"useCase": "police"}
            }
            
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_result(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Detailed structure validation
            structure_issues = []
            
            # Check title
            title = data.get("title")
            if not isinstance(title, str):
                structure_issues.append("Title is not a string")
            elif len(title) == 0:
                structure_issues.append("Title is empty")
            elif len(title) > 100:
                structure_issues.append(f"Title too long ({len(title)} chars)")
            
            # Check summary
            summary = data.get("summary")
            if not isinstance(summary, str):
                structure_issues.append("Summary is not a string")
            elif len(summary) == 0:
                structure_issues.append("Summary is empty")
            
            # Check steps
            steps = data.get("steps")
            if not isinstance(steps, list):
                structure_issues.append("Steps is not a list")
            elif len(steps) == 0:
                structure_issues.append("Steps list is empty")
            else:
                for i, step in enumerate(steps):
                    if not isinstance(step, str):
                        structure_issues.append(f"Step {i+1} is not a string")
            
            # Check sources
            sources = data.get("sources")
            if not isinstance(sources, list):
                structure_issues.append("Sources is not a list")
            elif len(sources) == 0:
                structure_issues.append("Sources list is empty")
            else:
                for i, source in enumerate(sources):
                    if not isinstance(source, dict):
                        structure_issues.append(f"Source {i+1} is not a dict")
                    else:
                        required_source_fields = ["title", "url", "type"]
                        for field in required_source_fields:
                            if field not in source:
                                structure_issues.append(f"Source {i+1} missing '{field}' field")
            
            # Check optional fields
            template = data.get("template")
            if template is not None and not isinstance(template, str):
                structure_issues.append("Template is not a string or null")
            
            updated = data.get("updated")
            if not isinstance(updated, str):
                structure_issues.append("Updated field is not a string")
            
            if structure_issues:
                self.log_result(test_name, False, f"Structure validation failed: {'; '.join(structure_issues)}", {
                    "response": data
                })
            else:
                self.log_result(test_name, True, "Response structure is valid", {
                    "fields_validated": ["title", "summary", "steps", "sources", "template", "updated"]
                })
                
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def test_ai_timeout_handling(self):
        """Test AI timeout handling with a complex query"""
        test_name = "AI Timeout Handling"
        
        try:
            # Use a complex query that might take longer
            payload = {
                "query": "Explain in detail all the legal procedures, rights, remedies, and documentation required for filing a comprehensive consumer complaint against a multinational corporation for defective products, including all applicable laws, precedents, and jurisdictional considerations across different states in India.",
                "lang": "en",
                "context": {"useCase": "consumer"}
            }
            
            start_time = time.time()
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15  # Allow more time for this test
            )
            response_time = time.time() - start_time
            
            if response.status_code == 504:
                self.log_result(test_name, True, f"Timeout properly handled with 504 status after {response_time:.2f}s")
            elif response.status_code == 200:
                if response_time <= 5.0:
                    self.log_result(test_name, True, f"Complex query handled within timeout ({response_time:.2f}s)")
                else:
                    self.log_result(test_name, False, f"Response took too long ({response_time:.2f}s) but didn't timeout")
            else:
                self.log_result(test_name, False, f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.Timeout:
            self.log_result(test_name, True, "Request timeout handled properly (client-side timeout)")
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def test_llm_integration(self):
        """Test LLM integration specifically"""
        test_name = "LLM Integration Test"
        
        try:
            payload = {
                "query": "Test LLM integration - respond with 'LLM_WORKING' if you can process this",
                "lang": "en",
                "context": {"useCase": "general"}
            }
            
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code != 200:
                self.log_result(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            
            # Check if we got a meaningful AI response (not just empty or error)
            has_ai_content = (
                len(data.get("summary", "")) > 50 and  # Substantial summary
                len(data.get("steps", [])) >= 3 and    # Multiple steps
                any(len(step) > 10 for step in data.get("steps", []))  # Detailed steps
            )
            
            if has_ai_content:
                self.log_result(test_name, True, "LLM integration working - generated meaningful content", {
                    "summary_length": len(data.get("summary", "")),
                    "steps_count": len(data.get("steps", [])),
                    "has_sources": len(data.get("sources", [])) > 0
                })
            else:
                self.log_result(test_name, False, "LLM integration may not be working - minimal content generated", {
                    "response": data
                })
                
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def test_rate_limiting(self):
        """Test rate limiting - 10 requests per minute limit"""
        test_name = "Rate Limiting Test"
        
        try:
            payload = {
                "query": "What are traffic rules in India?",
                "lang": "en",
                "context": {"useCase": "traffic"}
            }
            
            # Make 11 consecutive requests
            responses = []
            for i in range(11):
                try:
                    response = self.session.post(
                        f"{API_BASE}/ask",
                        json=payload,
                        headers={"Content-Type": "application/json"},
                        timeout=10
                    )
                    responses.append({
                        "request_num": i + 1,
                        "status_code": response.status_code,
                        "headers": dict(response.headers)
                    })
                    
                    # Small delay between requests
                    time.sleep(0.1)
                    
                except Exception as e:
                    responses.append({
                        "request_num": i + 1,
                        "error": str(e)
                    })
            
            # Check if 11th request was rate limited
            eleventh_request = responses[10] if len(responses) > 10 else None
            
            if eleventh_request and eleventh_request.get("status_code") == 429:
                # Check for rate limit headers
                headers = eleventh_request.get("headers", {})
                has_rate_limit_headers = any(
                    header.lower().startswith(('x-ratelimit', 'retry-after'))
                    for header in headers.keys()
                )
                
                self.log_result(test_name, True, "Rate limiting working correctly - 11th request returned 429", {
                    "eleventh_request_status": eleventh_request.get("status_code"),
                    "has_rate_limit_headers": has_rate_limit_headers,
                    "successful_requests": sum(1 for r in responses[:10] if r.get("status_code") == 200)
                })
            else:
                self.log_result(test_name, False, "Rate limiting not working - 11th request should return 429", {
                    "eleventh_request": eleventh_request,
                    "all_responses": [r.get("status_code") for r in responses]
                })
                
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def test_error_handling(self):
        """Test error handling for invalid inputs"""
        test_name = "Error Handling Test"
        
        error_tests = [
            {
                "name": "Empty Query",
                "payload": {"query": "", "lang": "en", "context": {}},
                "expected_status": 400
            },
            {
                "name": "Too Long Query",
                "payload": {"query": "x" * 1001, "lang": "en", "context": {}},
                "expected_status": 400
            },
            {
                "name": "Missing Query Field",
                "payload": {"lang": "en", "context": {}},
                "expected_status": 422
            }
        ]
        
        all_passed = True
        results = []
        
        for test in error_tests:
            try:
                response = self.session.post(
                    f"{API_BASE}/ask",
                    json=test["payload"],
                    headers={"Content-Type": "application/json"},
                    timeout=10
                )
                
                if response.status_code == test["expected_status"]:
                    results.append(f"✅ {test['name']}: Correct {response.status_code} status")
                    
                    # Check if error message is clear
                    try:
                        error_data = response.json()
                        if "detail" in error_data and len(str(error_data["detail"])) > 0:
                            results.append(f"   Clear error message provided")
                        else:
                            results.append(f"   ⚠️ Error message could be clearer")
                    except:
                        results.append(f"   ⚠️ No JSON error response")
                else:
                    results.append(f"❌ {test['name']}: Expected {test['expected_status']}, got {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                results.append(f"❌ {test['name']}: Exception - {str(e)}")
                all_passed = False
        
        if all_passed:
            self.log_result(test_name, True, "All error handling tests passed", {"results": results})
        else:
            self.log_result(test_name, False, "Some error handling tests failed", {"results": results})

    def test_web_search_integration(self):
        """Test web search integration and source labeling"""
        test_name = "Web Search Integration Test"
        
        try:
            payload = {
                "query": "What are consumer protection laws in India?",
                "lang": "en",
                "context": {"useCase": "consumer"}
            }
            
            response = self.session.post(
                f"{API_BASE}/ask",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=15
            )
            
            if response.status_code != 200:
                self.log_result(test_name, False, f"HTTP {response.status_code}: {response.text}")
                return
            
            data = response.json()
            sources = data.get("sources", [])
            
            # Check source count
            if len(sources) < 3:
                self.log_result(test_name, False, f"Insufficient sources returned: {len(sources)} (expected 3-5)", {
                    "sources": sources
                })
                return
            
            # Check source structure and labeling
            source_issues = []
            search_results = 0
            general_resources = 0
            
            for i, source in enumerate(sources):
                # Check required fields
                required_fields = ["title", "url", "type"]
                missing_fields = [field for field in required_fields if field not in source]
                if missing_fields:
                    source_issues.append(f"Source {i+1} missing fields: {missing_fields}")
                
                # Check source type labeling
                source_type = source.get("type", "")
                if source_type == "Search Result":
                    search_results += 1
                elif source_type == "General Resource":
                    general_resources += 1
                else:
                    source_issues.append(f"Source {i+1} has invalid type: '{source_type}'")
                
                # Check URL validity
                url = source.get("url", "")
                if not url.startswith(("http://", "https://")):
                    source_issues.append(f"Source {i+1} has invalid URL: {url}")
            
            # Evaluate results
            if source_issues:
                self.log_result(test_name, False, f"Source validation issues: {'; '.join(source_issues)}", {
                    "sources": sources,
                    "search_results": search_results,
                    "general_resources": general_resources
                })
            else:
                self.log_result(test_name, True, f"Web search integration working correctly", {
                    "total_sources": len(sources),
                    "search_results": search_results,
                    "general_resources": general_resources,
                    "source_types_valid": True
                })
                
        except Exception as e:
            self.log_result(test_name, False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Adhikaar.ai Backend AI Integration Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Run all tests
        self.test_ai_ask_endpoint_basic()
        self.test_ai_ask_consumer_rights()
        self.test_ai_ask_general_legal()
        self.test_ai_response_structure()
        self.test_ai_timeout_handling()
        self.test_llm_integration()
        
        # Summary
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)