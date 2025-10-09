{
  "product": {
    "name": "Adhikaar.ai",
    "tagline": "Your AI Legal Helper for India – cited answers in under 5 seconds",
    "audience": ["students", "tenants", "gig workers", "urban migrants"],
    "brand_values": ["Trust & Security", "Accessibility", "Empowerment", "Verified & Cited"]
  },
  "design_personality": {
    "attributes": ["trustworthy", "clear", "empowering", "fast"],
    "style_fusion": "Swiss-Style information hierarchy + Dark functional UI + Glassmorphism accents only on secondary elements + Bento grid for use-cases",
    "layout_pattern": ["F-pattern for answers", "Bento grid for quick use cases", "Sticky utilities rail on desktop"]
  },
  "color_system": {
    "source_palette_hex": {
      "background": "#0B0F14",
      "surface": "#121923",
      "card": "#0F141B",
      "text": "#E8EEF4",
      "subtext": "#A7B4C2",
      "accent_mint": "#35E0B8",
      "accent_indigo": "#6CA8FF",
      "success": "#15C27E",
      "warning": "#FFB020",
      "destructive": "#FF6B6B"
    },
    "semantic_tokens_hsl": {
      "--background": "213 29% 6%",       
      "--foreground": "210 45% 93%",      
      "--card": "213 28% 8%",            
      "--card-foreground": "210 45% 93%",
      "--popover": "214 31% 10%",
      "--popover-foreground": "210 45% 93%",
      "--primary": "167 74% 54%",         
      "--primary-foreground": "210 45% 10%",
      "--secondary": "215 100% 71%",      
      "--secondary-foreground": "214 31% 10%",
      "--muted": "214 16% 24%",
      "--muted-foreground": "210 19% 71%",
      "--accent": "215 30% 16%",         
      "--accent-foreground": "210 45% 93%",
      "--success": "154 80% 42%",
      "--warning": "37 100% 56%",
      "--destructive": "357 100% 70%",
      "--destructive-foreground": "214 31% 10%",
      "--border": "214 16% 24%",
      "--input": "214 16% 24%",
      "--ring": "167 74% 54%",
      "--chart-1": "167 74% 54%",
      "--chart-2": "215 100% 71%",
      "--chart-3": "37 100% 56%",
      "--chart-4": "154 80% 42%",
      "--chart-5": "210 19% 71%",
      "--radius": "0.625rem"
    },
    "usage": {
      "backgrounds": "Use solid near-black backgrounds for reading areas. Keep gradients strictly decorative behind hero and section dividers only.",
      "links": "Use secondary (indigo) for links; underline on hover/focus only.",
      "states": {
        "focus": "outline-ring using --ring with 2px offset",
        "hover": "slight elevation on cards (shadow-md) and 2% lightness shift",
        "selected": "border using --ring and bg-accent"
      }
    },
    "gradients": {
      "allowed_examples": [
        "radial at 20% 10%: rgba(53,224,184,0.18) 0%, rgba(108,168,255,0.12) 45%, rgba(18,25,35,0) 70%",
        "linear 135deg: #0B0F14 0%, rgba(53,224,184,0.08) 30%, rgba(108,168,255,0.10) 60%, #0B0F14 90%"
      ],
      "rules": [
        "Max 20% of viewport coverage",
        "Never on text-heavy blocks or small UI elements",
        "No saturated purple/pink or green-to-blue high-sat blends"
      ]
    }
  },
  "typography": {
    "fonts": {
      "display": "EB Garamond, 'Times New Roman', Georgia, serif",
      "sans": "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif"
    },
    "utility_classes": {
      "h1": "font-display tracking-tight text-4xl sm:text-5xl lg:text-6xl",
      "h2": "font-display text-base sm:text-lg",
      "body": "font-sans text-sm sm:text-base leading-7 text-foreground",
      "subtle": "text-sm text-muted-foreground"
    },
    "pairing_rationale": "EB Garamond provides authoritative, editorial tone for headings; Inter ensures high readability for dense legal content."
  },
  "spacing_and_layout": {
    "grid": {
      "mobile": "1 column with 16px gap",
      "tablet": "6 columns, 16px gutters",
      "desktop": "12 columns, 24px gutters, 1200px max content width"
    },
    "whitespace": "Use 2–3x spacing vs instinct. Section vertical padding: py-12 md:py-20.",
    "containers": {
      "default": "mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-[1200px]",
      "edge_to_edge": "w-full px-0"
    }
  },
  "logo_concept": {
    "direction": "Shield + scale-of-justice integrated into the negative space of the letter A",
    "description": "Geometric shield outline with an upward A in the center. Crossbar of A forms a simplified balance scale; a small Ashoka Chakra dot sits at the apex. Primary mark in Accent Mint (#35E0B8) on dark background; monochrome variant for small sizes.",
    "do_nots": ["No skeuomorphic 3D metal renders", "No purple hues", "No busy gradients"]
  },
  "ui_ux_patterns_for_legal_content": {
    "answer_block_structure": [
      "Title summarizing the right or guidance",
      "Short verdict line (max 160 chars)",
      "Action steps list (bullet, 3–5 items)",
      "Expandable 'Why' section",
      "Expandable sources with citations and deep links",
      "Template suggestions when relevant"
    ],
    "presentation_rules": [
      "Chunk content into 2–4 sentence paragraphs",
      "Always show last-updated date and jurisdiction (India)",
      "Use badges: Verified, Source Type (Act, Govt Site, Court)",
      "Provide copy-to-clipboard for sections with data-testid attributes"
    ],
    "police_stop_quick_card": [
      "Top: 'Your rights now' with 3 key bullets",
      "Buttons: Record, SOS, Lawyer, all large and spaced",
      "Short disclaimers anchored at bottom"
    ]
  },
  "components": {
    "header": {
      "description": "Sticky header with shield/logo, 'Adhikaar.ai Secure' lock badge, 24/7 badge, and quick chips",
      "shadcn": ["navigation-menu", "badge", "button", "popover"],
      "structure_jsx": "<header className=\"sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60\" data-testid=\"global-header\">\n  <div className=\"mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between\">\n    <div className=\"flex items-center gap-3\">\n      <button className=\"flex items-center gap-2\" aria-label=\"Home\" data-testid=\"header-logo-button\">\n        <span className=\"inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400/80 to-sky-400/70 text-background shadow\">A</span>\n        <span className=\"font-display text-lg\">Adhikaar.ai</span>\n      </button>\n      <span className=\"hidden sm:inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground\" data-testid=\"secure-badge\">\n        <i class=\"lucide lucide-shield-check text-emerald-400\"></i> Secure\n      </span>\n      <span className=\"hidden sm:inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground\" data-testid=\"availability-badge\">\n        <i class=\"lucide lucide-sun text-sky-400\"></i> 24/7\n      </span>\n    </div>\n    <div className=\"hidden md:flex items-center gap-2\">\n      <button className=\"h-9 px-3 rounded-md border text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring\" data-testid=\"header-login-button\">Log in</button>\n      <button className=\"h-9 px-3 rounded-md bg-primary text-[13px] text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring\" data-testid=\"header-start-button\">Start free</button>\n    </div>\n  </div>\n</header>",
      "micro_interactions": ["Header becomes slightly translucent on scroll (backdrop-blur)", "Badges scale-105 on hover with transition-colors, transition-shadow"]
    },
    "search_bar": {
      "description": "Central AI query with inline hints and command menu fallback",
      "shadcn": ["input", "button", "command", "popover", "badge"],
      "structure_jsx": "<div className=\"relative\" data-testid=\"ai-search-container\">\n  <input className=\"w-full h-12 rounded-md bg-card border border-border px-4 pr-28 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring\" placeholder=\"Ask: Can police check my phone during a traffic stop?\" data-testid=\"ai-search-input\"/>\n  <div className=\"absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2\">\n    <button className=\"h-9 px-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring\" data-testid=\"ai-search-submit-button\">Ask</button>\n  </div>\n  <div className=\"mt-2 flex flex-wrap gap-2\">\n    <span className=\"inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-foreground cursor-pointer\" data-testid=\"hint-chip-traffic\">Traffic challan</span>\n    <span className=\"inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-foreground cursor-pointer\" data-testid=\"hint-chip-tenancy\">Tenancy deposit</span>\n  </div>\n</div>",
      "micro_interactions": ["Hint chips ripple on click (scale-98 then 100)", "Show Command palette (cmdk) for recent queries"]
    },
    "use_case_chips": {
      "description": "Quick access to 5 core use cases as large pills",
      "shadcn": ["badge", "button"],
      "layout": "Bento-like row that wraps: Traffic, Tenancy, Consumer, Police, Employment",
      "states": "selected state uses bg-accent and ring",
      "test_ids": ["chip-traffic", "chip-tenancy", "chip-consumer", "chip-police", "chip-employment"]
    },
    "answer_block": {
      "description": "Primary result with verdict, steps, and expandable sources",
      "shadcn": ["card", "accordion", "separator", "badge", "button", "popover"],
      "structure_jsx": "<section className=\"mt-6\" data-testid=\"answer-block\">\n  <div className=\"rounded-lg border bg-card p-5 shadow-sm\">\n    <div className=\"flex items-start justify-between gap-3\">\n      <h2 className=\"font-display text-lg\" data-testid=\"answer-title\">You can request the challan to be reviewed</h2>\n      <span className=\"text-xs text-muted-foreground\" data-testid=\"answer-updated\">Updated: Today</span>\n    </div>\n    <p className=\"mt-2 text-muted-foreground\" data-testid=\"answer-summary\">Under the Motor Vehicles Act, officers may issue challans; you have the right to dispute within 15 days.</p>\n    <ul className=\"mt-4 space-y-2\" data-testid=\"answer-steps\">\n      <li>1. Verify details on e-Challan portal</li>\n      <li>2. File online representation with evidence</li>\n      <li>3. Attend virtual hearing if scheduled</li>\n    </ul>\n    <div className=\"mt-4 flex gap-2\">\n      <button className=\"h-9 px-3 rounded-md bg-secondary text-secondary-foreground\" data-testid=\"answer-copy-button\">Copy</button>\n      <button className=\"h-9 px-3 rounded-md border\" data-testid=\"answer-save-button\">Save to Case Wallet</button>\n    </div>\n    <div className=\"mt-5\">\n      <div className=\"text-xs uppercase tracking-wide text-muted-foreground\">Sources</div>\n      <div className=\"mt-2\">\n        <details className=\"group\" data-testid=\"answer-sources\">\n          <summary className=\"cursor-pointer list-none text-sm text-foreground hover:underline\">View 3 citations</summary>\n          <ol className=\"mt-2 space-y-1 text-sm\">\n            <li><a className=\"text-secondary underline\" href=\"#\" target=\"_blank\" rel=\"noopener\" data-testid=\"citation-1\">Motor Vehicles Act, Sec 206</a></li>\n            <li><a className=\"text-secondary underline\" href=\"#\" target=\"_blank\" rel=\"noopener\" data-testid=\"citation-2\">Govt eChallan Portal</a></li>\n          </ol>\n        </details>\n      </div>\n    </div>\n  </div>\n</section>",
      "micro_interactions": ["Reveal-on-scroll for card (fade+slide)", "Copy shows success toast via Sonner"]
    },
    "template_card": {
      "description": "Cards for legal letters/complaints with copy/download",
      "shadcn": ["card", "button", "dropdown-menu", "badge"],
      "states": "Disabled state shows lock if auth needed",
      "test_ids": ["template-download-button", "template-copy-button"],
      "notes": "For date inputs inside templates, use shadcn calendar"
    },
    "case_wallet": {
      "description": "Saved docs and case timeline",
      "shadcn": ["tabs", "table", "badge", "progress", "accordion"],
      "data": "Docs table + Timeline with dated events and statuses",
      "micro_interactions": ["Droppable area to add files", "Timeline nodes glow on hover"],
      "test_ids": ["case-wallet-tab", "timeline-panel", "doc-row"]
    },
    "sos_panel": {
      "description": "Verified helplines and emergency actions",
      "shadcn": ["card", "button"],
      "ui": "Large single-task buttons: Police, Women Helpline, Legal Aid, with location note",
      "test_ids": ["sos-police-button", "sos-women-button", "sos-legal-aid-button"]
    },
    "rights_library": {
      "description": "Searchable library of rights with filters",
      "shadcn": ["command", "badge", "tabs", "scroll-area"],
      "test_ids": ["rights-search-input", "rights-result-item"],
      "micro_interactions": ["Keyboard / to focus search", "Result highlight on arrow keys"]
    }
  },
  "page_layouts": {
    "home_hero": {
      "structure": ["Header", "Hero: headline + search", "Use case chips", "Trust strip"],
      "classes": "relative bg-[radial-gradient(20%_20%_at_20%_10%,rgba(53,224,184,0.18)_0%,rgba(108,168,255,0.12)_45%,rgba(11,15,20,0)_70%)]",
      "content": {
        "headline": "Know your rights. Act with confidence.",
        "subhead": "India-specific, cited legal guidance in seconds"
      }
    },
    "answer_page": {
      "structure": ["Search bar", "Answer block", "Related templates", "SOS rail (desktop)"]
    },
    "wallet_page": {
      "structure": ["Tabs: Documents, Timeline", "Saved templates", "Export"]
    }
  },
  "motion_and_micro_interactions": {
    "principles": ["Fast and calm", "Motion aids comprehension", "No gratuitous bounces"],
    "library": "framer-motion",
    "variants_js": "export const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.24, ease: 'easeOut' } } };\nexport const scaleTap = { whileTap: { scale: 0.98 } };",
    "scroll_reveal": "Use IntersectionObserver to add motion only once per section"
  },
  "accessibility": {
    "contrast": "All text must pass WCAG AA on dark surfaces.",
    "focus": "Visible 2px ring using --ring; never rely only on color.",
    "language": "Use plain English with Indian legal context; localize Hindi later.",
    "aria": "Aria-live for answer loading; label all control groups.",
    "testing": "Every interactive and key informational element must include data-testid using kebab-case describing the role."
  },
  "image_urls": [
    {
      "category": "hero",
      "description": "Indian high court facade in dramatic light, to be used subtly as a blurred, low-opacity backdrop mask on hero",
      "url": "https://images.unsplash.com/photo-1577516664771-bdf14fef37c4?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "section-divider",
      "description": "Black-and-white judicial building as a faint overlay texture for trust section",
      "url": "https://images.unsplash.com/photo-1706967733543-b4f0a863bdd2?crop=entropy&cs=srgb&fm=jpg&q=85"
    },
    {
      "category": "library-header",
      "description": "Interior atrium/courthouse roof pattern used as subtle masked background in Rights Library header",
      "url": "https://images.pexels.com/photos/28470529/pexels-photo-28470529.jpeg"
    }
  ],
  "component_path": {
    "button": "./components/ui/button",
    "badge": "./components/ui/badge",
    "card": "./components/ui/card",
    "accordion": "./components/ui/accordion",
    "tabs": "./components/ui/tabs",
    "table": "./components/ui/table",
    "command": "./components/ui/command",
    "calendar": "./components/ui/calendar",
    "select": "./components/ui/select",
    "toast": "./components/ui/sonner", 
    "input": "./components/ui/input",
    "popover": "./components/ui/popover",
    "separator": "./components/ui/separator"
  },
  "tokens_css_snippet": "@layer base {\n  .dark {\n    --background: 213 29% 6%;\n    --foreground: 210 45% 93%;\n    --card: 213 28% 8%;\n    --card-foreground: 210 45% 93%;\n    --popover: 214 31% 10%;\n    --popover-foreground: 210 45% 93%;\n    --primary: 167 74% 54%;\n    --primary-foreground: 210 45% 10%;\n    --secondary: 215 100% 71%;\n    --secondary-foreground: 214 31% 10%;\n    --muted: 214 16% 24%;\n    --muted-foreground: 210 19% 71%;\n    --accent: 215 30% 16%;\n    --accent-foreground: 210 45% 93%;\n    --success: 154 80% 42%;\n    --warning: 37 100% 56%;\n    --destructive: 357 100% 70%;\n    --destructive-foreground: 214 31% 10%;\n    --border: 214 16% 24%;\n    --input: 214 16% 24%;\n    --ring: 167 74% 54%;\n    --radius: 10px;\n  }\n}",
  "buttons": {
    "variants": {
      "primary": {
        "shape": "medium radius",
        "classes": "inline-flex items-center justify-center h-10 px-4 rounded-[10px] bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed",
        "motion": "press scale to 0.98 + subtle shadow increase"
      },
      "secondary": {
        "shape": "medium radius",
        "classes": "inline-flex items-center justify-center h-10 px-4 rounded-[10px] bg-secondary text-secondary-foreground hover:brightness-110 focus-visible:ring-2 focus-visible:ring-ring",
        "motion": "color shift on hover"
      },
      "ghost": {
        "shape": "sharp",
        "classes": "h-10 px-4 rounded-md border border-border bg-transparent hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring",
        "motion": "minimal"
      }
    },
    "sizes": {"sm": "h-8 px-3", "md": "h-10 px-4", "lg": "h-12 px-5"}
  },
  "libraries_and_install": {
    "framer_motion": {
      "command": "yarn add framer-motion",
      "usage": "import { motion } from 'framer-motion'"
    },
    "recharts": {
      "command": "yarn add recharts",
      "usage": "For wallet stats or timelines if needed"
    },
    "lottie": {
      "command": "yarn add lottie-react",
      "usage": "Small verification animations (shield check)"
    }
  },
  "patterns_and_examples": {
    "answer_loading_skeleton": "<div className=\"space-y-3\" data-testid=\"answer-loading\"><div className=\"h-5 w-2/3 bg-accent/50 rounded\"></div><div className=\"h-4 w-full bg-accent/40 rounded\"></div><div className=\"h-4 w-5/6 bg-accent/40 rounded\"></div></div>",
    "toast_success_example": "import { Toaster, toast } from './components/ui/sonner'\n// ...\n<button onClick={() => toast.success('Copied to clipboard')} data-testid=\"copy-toast-trigger\">Copy</button>\n<Toaster />"
  },
  "data_testid_rules": {
    "convention": "kebab-case; describe role and action",
    "required_on": ["buttons", "links", "form inputs", "menus", "error messages", "balances/counts", "confirmation text"],
    "examples": [
      "data-testid=\"ai-search-input\"",
      "data-testid=\"answer-copy-button\"",
      "data-testid=\"case-wallet-tab\"",
      "data-testid=\"sos-police-button\""
    ]
  },
  "trust_elements": {
    "visuals": ["Shield icon + 'Secure' badge in header", "Cited sources with domain pill (gov.in, nic.in, court.gov)", "Last updated timestamp", "Bank-grade encryption note in footer"],
    "content": ["Explain sources and model limitations", "Display jurisdiction clearly"]
  },
  "responsive_rules": {
    "mobile_first": true,
    "mobile": ["Single-column, 16px side padding", "Sticky bottom SOS on rights pages"],
    "tablet": ["Two-column: content + utilities"],
    "desktop": ["12-col grid with right sidebar for SOS and case actions"]
  },
  "images_and_textures": {
    "noise_css": "background-image: url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'300\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'2\\'/><feColorMatrix type=\\'saturate\\' values=\\'0\\'/><feComponentTransfer><feFuncA type=\\'table\\' tableValues=\\'0 0.06\\'/></feComponentTransfer></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(%23n)\\'/></svg>');",
    "usage": "Apply to large hero and section backgrounds at opacity 0.06 to avoid flat visuals"
  },
  "search_references": [
    {"title": "AI Legal Assistant UIs (Dribbble)", "url": "https://dribbble.com/shots/25164100-Emmi-AI-Legal-Assistant-Interface-Design-The-Ash-Product"},
    {"title": "Smart Interface Patterns under stress", "url": "https://smart-interface-design-patterns.com/articles/stress/"},
    {"title": "Government UX case study: Emergency SOS", "url": "https://www.ux4g.gov.in/case-studies/ux4g-112-emergency.php"}
  ],
  "instructions_to_main_agent": [
    "Set <html class='dark'> to activate dark token set.",
    "Install framer-motion and sonner already present to wire micro-interactions.",
    "Use only shadcn components from src/components/ui for dropdowns, toasts, calendars.",
    "Apply gradients only to hero and section wrappers; never on cards or text blocks.",
    "Ensure every interactive element includes a data-testid attribute as specified.",
    "Adhere to Text Size Hierarchy for H1/H2/Body across pages.",
    "For templates requiring dates, use ./components/ui/calendar.",
    "Do not center-align the entire app container; align text left with grid.",
    "Avoid 'transition: all'; specify property transitions on hoverable elements only.",
    "No purple in chat/AI areas; use mint/indigo system colors."
  ],
  "qa_checklist_before_ship": [
    "All headings use font-display; body uses font-sans",
    "Contrast check passes AA for smallest text",
    "data-testid present on all interactive and key information",
    "Gradient coverage under 20% of viewport",
    "Focus rings visible and non-obstructive",
    "Mobile sticky SOS works and is not blocked by OS UI"
  ]
}


<General UI UX Design Guidelines>  
    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms
    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text
   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json

 **GRADIENT RESTRICTION RULE**
NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc
NEVER use dark gradients for logo, testimonial, footer etc
NEVER let gradients cover more than 20% of the viewport.
NEVER apply gradients to text-heavy content or reading areas.
NEVER use gradients on small UI elements (<100px width).
NEVER stack multiple gradient layers in the same viewport.

**ENFORCEMENT RULE:**
    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

**How and where to use:**
   • Section backgrounds (not content backgrounds)
   • Hero section header content. Eg: dark to light to dark color
   • Decorative overlays and accent elements only
   • Hero section with 2-3 mild color
   • Gradients creation can be done for any angle say horizontal, vertical or diagonal

- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**

</Font Guidelines>

- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. 
   
- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.
   
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly
    Eg: - if it implies playful/energetic, choose a colorful scheme
           - if it implies monochrome/minimal, choose a black–white/neutral scheme

**Component Reuse:**
	- Prioritize using pre-existing components from src/components/ui when applicable
	- Create new components that match the style and conventions of existing components when needed
	- Examine existing components to understand the project's component patterns before creating new ones

**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component

**Best Practices:**
	- Use Shadcn/UI as the primary component library for consistency and accessibility
	- Import path: ./components/[component-name]

**Export Conventions:**
	- Components MUST use named exports (export const ComponentName = ...)
	- Pages MUST use default exports (export default function PageName() {...})

**Toasts:**
  - Use `sonner` for toasts"
  - Sonner component are located in `/app/src/components/ui/sonner.tsx`

Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.
</General UI UX Design Guidelines>
