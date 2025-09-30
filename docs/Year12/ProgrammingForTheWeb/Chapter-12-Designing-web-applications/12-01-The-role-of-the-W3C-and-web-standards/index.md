# 12.1 The role of the W3C and web standards

## Why it matters

The World Wide Web Consortium (W3C) develops the standards that make the web work consistently across different browsers, devices, and users. Understanding these standards helps you build web applications that are accessible, secure, and work reliably for everyone.

## Concepts

### The World Wide Web Consortium (W3C)

The W3C is an international community that develops open standards to ensure the long-term growth of the Web. Founded by Tim Berners-Lee in 1994, it brings together organizations, developers, and users to create guidelines that help the web remain accessible, interoperable, and useful.

```python
class WebStandardsDemo:
    """Demonstrate how web standards affect development decisions."""
    
    def __init__(self):
        self.w3c_standards = {
            "HTML": "Structure and semantics",
            "CSS": "Presentation and styling", 
            "XML": "Data exchange format",
            "SVG": "Scalable vector graphics",
            "WCAG": "Web accessibility guidelines",
            "WebRTC": "Real-time communication",
            "WebAssembly": "High-performance web applications"
        }
    
    def demonstrate_standards_impact(self):
        """Show how W3C standards ensure consistency."""
        print("=== How W3C Standards Help Developers ===")
        
        # Example: Semantic HTML following W3C standards
        semantic_html_example = """
        <!-- W3C-compliant semantic structure -->
        <article>
            <header>
                <h1>Article Title</h1>
                <time datetime="2024-01-15">January 15, 2024</time>
            </header>
            <main>
                <p>Article content that screen readers can understand...</p>
            </main>
            <footer>
                <address>Author: Jane Smith</address>
            </footer>
        </article>
        """
        
        print("Semantic HTML benefits:")
        print("✓ Screen readers understand document structure")
        print("✓ Search engines can extract meaningful data")
        print("✓ Consistent behavior across all browsers")
        print("✓ Better maintainability and debugging")
        
        return semantic_html_example
    
    def show_standards_evolution(self):
        """Demonstrate how standards evolve with web needs."""
        html_evolution = [
            {"version": "HTML 1.0", "year": 1991, "focus": "Basic document structure"},
            {"version": "HTML 4.01", "year": 1999, "focus": "Separation of content and presentation"},
            {"version": "XHTML 1.0", "year": 2000, "focus": "XML compliance and stricter syntax"},
            {"version": "HTML5", "year": 2014, "focus": "Rich media, APIs, semantic elements"},
            {"version": "HTML Living Standard", "year": "Ongoing", "focus": "Continuous evolution"}
        ]
        
        print("\n=== Evolution of HTML Standards ===")
        for standard in html_evolution:
            print(f"{standard['version']} ({standard['year']}): {standard['focus']}")

# Example usage
standards_demo = WebStandardsDemo()
standards_demo.demonstrate_standards_impact()
standards_demo.show_standards_evolution()

```text

### Web Accessibility Initiative (WAI) and accessibility guidelines

The WAI develops guidelines and resources to make the web accessible to people with disabilities. The Web Content Accessibility Guidelines (WCAG) provide the foundation for web accessibility standards worldwide.

```python
class AccessibilityChecker:
    """Tools for checking and implementing web accessibility."""
    
    def __init__(self):
        self.wcag_principles = {
            "Perceivable": "Information must be presentable in ways users can perceive",
            "Operable": "Interface components must be operable by all users", 
            "Understandable": "Information and UI operation must be understandable",
            "Robust": "Content must be robust enough for various assistive technologies"
        }
    
    def check_image_accessibility(self, images):
        """Check if images have proper alt text."""
        print("=== Image Accessibility Check ===")
        
        for image in images:
            issues = []
            
            # Check for alt text
            if not image.get("alt"):
                issues.append("Missing alt text")
            elif len(image["alt"]) < 10 and image["type"] != "decorative":
                issues.append("Alt text may be too brief")
            
            # Check for decorative images
            if image.get("type") == "decorative" and image.get("alt") != "":
                issues.append("Decorative images should have empty alt text")
            
            # Check for complex images
            if image.get("complex") and not image.get("longdesc"):
                issues.append("Complex images need detailed descriptions")
            
            status = "❌ Issues found" if issues else "✅ Accessible"
            print(f"{image['src']}: {status}")
            for issue in issues:
                print(f"  - {issue}")
    
    def generate_accessible_form(self):
        """Create an accessible form following WCAG guidelines."""
        accessible_form = {
            "structure": """
            <form role="form" aria-labelledby="contact-heading">
                <h2 id="contact-heading">Contact Information</h2>
                
                <fieldset>
                    <legend>Personal Details</legend>
                    
                    <label for="fullname">
                        Full Name <span aria-label="required">*</span>
                    </label>
                    <input type="text" 
                           id="fullname" 
                           name="fullname"
                           required 
                           aria-describedby="name-help"
                           aria-invalid="false">
                    <div id="name-help" class="help-text">
                        Enter your first and last name
                    </div>
                    
                    <label for="email">
                        Email Address <span aria-label="required">*</span>
                    </label>
                    <input type="email" 
                           id="email" 
                           name="email"
                           required 
                           aria-describedby="email-help">
                    <div id="email-help" class="help-text">
                        We'll use this to contact you
                    </div>
                </fieldset>
                
                <button type="submit" aria-describedby="submit-help">
                    Send Message
                </button>
                <div id="submit-help" class="help-text">
                    Press Enter or click to submit the form
                </div>
            </form>
            """,
            "css_requirements": """
            /* Focus indicators for keyboard navigation */
            input:focus, button:focus {
                outline: 2px solid #0066cc;
                outline-offset: 2px;
            }
            
            /* High contrast for visibility */
            .help-text {
                color: #333;
                font-size: 0.9em;
            }
            
            /* Error states */
            [aria-invalid="true"] {
                border: 2px solid #d73502;
            }
            """,
            "accessibility_features": [
                "Semantic HTML structure with proper headings",
                "Labels associated with form controls",
                "ARIA attributes for screen readers",
                "Keyboard navigation support",
                "High contrast color scheme",
                "Clear error messaging",
                "Descriptive help text"
            ]
        }
        
        print("=== Accessible Form Features ===")
        for feature in accessible_form["accessibility_features"]:
            print(f"✓ {feature}")
        
        return accessible_form
    
    def check_color_contrast(self, foreground, background):
        """Simple color contrast checker (simplified for demo)."""
        # In reality, this would calculate actual contrast ratios
        contrast_examples = [
            {"fg": "#000000", "bg": "#ffffff", "ratio": 21, "wcag_aa": True, "wcag_aaa": True},
            {"fg": "#767676", "bg": "#ffffff", "ratio": 4.54, "wcag_aa": True, "wcag_aaa": False},
            {"fg": "#949494", "bg": "#ffffff", "ratio": 3.0, "wcag_aa": False, "wcag_aaa": False}
        ]
        
        print("\n=== Color Contrast Examples ===")
        for example in contrast_examples:
            aa_status = "✅ PASS" if example["wcag_aa"] else "❌ FAIL"
            aaa_status = "✅ PASS" if example["wcag_aaa"] else "❌ FAIL"
            
            print(f"Foreground: {example['fg']}, Background: {example['bg']}")
            print(f"  Contrast Ratio: {example['ratio']}:1")
            print(f"  WCAG AA (4.5:1): {aa_status}")
            print(f"  WCAG AAA (7:1): {aaa_status}")

# Example usage
accessibility = AccessibilityChecker()

# Test image accessibility
sample_images = [
    {"src": "logo.png", "alt": "Company Logo", "type": "informative"},
    {"src": "decoration.png", "alt": "", "type": "decorative"},
    {"src": "chart.png", "alt": "Sales data", "type": "complex", "complex": True},
    {"src": "icon.png", "alt": "", "type": "informative"}  # Missing alt text
]

accessibility.check_image_accessibility(sample_images)
accessibility.generate_accessible_form()
accessibility.check_color_contrast("#767676", "#ffffff")

```text

### Internationalisation (i18n) and localisation (l10n)

Internationalisation prepares software to support multiple languages and regions, while localisation adapts software for specific markets. These practices make web applications usable worldwide.

```python
import datetime
from decimal import Decimal

class InternationalisationDemo:
    """Demonstrate i18n and l10n concepts for web applications."""
    
    def __init__(self):
        self.supported_locales = {
            "en-US": {
                "language": "English",
                "region": "United States",
                "currency": "USD",
                "date_format": "MM/DD/YYYY",
                "number_format": "1,234.56"
            },
            "en-AU": {
                "language": "English", 
                "region": "Australia",
                "currency": "AUD",
                "date_format": "DD/MM/YYYY",
                "number_format": "1,234.56"
            },
            "de-DE": {
                "language": "German",
                "region": "Germany", 
                "currency": "EUR",
                "date_format": "DD.MM.YYYY",
                "number_format": "1.234,56"
            },
            "ja-JP": {
                "language": "Japanese",
                "region": "Japan",
                "currency": "JPY", 
                "date_format": "YYYY/MM/DD",
                "number_format": "1,234"
            }
        }
        
        self.translations = {
            "en-US": {
                "welcome": "Welcome to our website",
                "price": "Price",
                "add_to_cart": "Add to Cart",
                "total": "Total"
            },
            "de-DE": {
                "welcome": "Willkommen auf unserer Website",
                "price": "Preis", 
                "add_to_cart": "In den Warenkorb",
                "total": "Gesamt"
            },
            "ja-JP": {
                "welcome": "私たちのウェブサイトへようこそ",
                "price": "価格",
                "add_to_cart": "カートに追加", 
                "total": "合計"
            }
        }
    
    def format_currency(self, amount, locale):
        """Format currency according to locale conventions."""
        locale_info = self.supported_locales.get(locale, self.supported_locales["en-US"])
        currency = locale_info["currency"]
        
        # Simplified currency formatting (real apps would use proper libraries)
        if locale == "en-US":
            return f"${amount:,.2f}"
        elif locale == "en-AU":
            return f"A${amount:,.2f}"
        elif locale == "de-DE":
            formatted = f"{amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
            return f"{formatted} €"
        elif locale == "ja-JP":
            return f"¥{amount:,.0f}"
        
        return f"{currency} {amount}"
    
    def format_date(self, date_obj, locale):
        """Format dates according to locale conventions."""
        locale_info = self.supported_locales.get(locale, self.supported_locales["en-US"])
        
        if locale == "en-US":
            return date_obj.strftime("%m/%d/%Y")
        elif locale == "en-AU":
            return date_obj.strftime("%d/%m/%Y")  
        elif locale == "de-DE":
            return date_obj.strftime("%d.%m.%Y")
        elif locale == "ja-JP":
            return date_obj.strftime("%Y/%m/%d")
        
        return date_obj.strftime("%Y-%m-%d")  # ISO format fallback
    
    def translate_interface(self, locale):
        """Translate interface elements."""
        translations = self.translations.get(locale, self.translations["en-US"])
        locale_info = self.supported_locales.get(locale, self.supported_locales["en-US"])
        
        print(f"=== Interface in {locale_info['language']} ({locale}) ===")
        
        # Simulate an e-commerce interface
        product_price = Decimal("29.99")
        current_date = datetime.date.today()
        
        print(f"{translations['welcome']}")
        print(f"{translations['price']}: {self.format_currency(product_price, locale)}")
        print(f"[{translations['add_to_cart']}]")
        print(f"{translations['total']}: {self.format_currency(product_price * 2, locale)}")
        print(f"Date: {self.format_date(current_date, locale)}")
        print()
    
    def demonstrate_text_direction(self):
        """Show how text direction affects layout."""
        text_directions = {
            "LTR": {
                "languages": ["English", "German", "French"],
                "layout": "Left-to-right reading, navigation on left",
                "css": "direction: ltr; text-align: left;"
            },
            "RTL": {
                "languages": ["Arabic", "Hebrew", "Persian"], 
                "layout": "Right-to-left reading, navigation on right",
                "css": "direction: rtl; text-align: right;"
            }
        }
        
        print("=== Text Direction Considerations ===")
        for direction, info in text_directions.items():
            print(f"{direction} Languages: {', '.join(info['languages'])}")
            print(f"  Layout: {info['layout']}")
            print(f"  CSS: {info['css']}")
            print()

# Example usage
i18n_demo = InternationalisationDemo()

# Show same interface in different locales
locales = ["en-US", "en-AU", "de-DE", "ja-JP"]
for locale in locales:
    i18n_demo.translate_interface(locale)

i18n_demo.demonstrate_text_direction()

```text

### Web security standards and recommended patterns

The W3C develops security standards and recommends patterns that help protect web applications and users from various threats.

```python
import hashlib
import secrets
import base64

class WebSecurityStandards:
    """Demonstrate W3C security standards and patterns."""
    
    def __init__(self):
        self.security_headers = {
            "Content-Security-Policy": "Prevents XSS attacks by controlling resource loading",
            "Strict-Transport-Security": "Forces HTTPS connections",
            "X-Frame-Options": "Prevents clickjacking attacks",
            "X-Content-Type-Options": "Prevents MIME type sniffing",
            "Referrer-Policy": "Controls referrer information sharing"
        }
    
    def demonstrate_csp_policy(self):
        """Show Content Security Policy implementation."""
        print("=== Content Security Policy (CSP) Examples ===")
        
        csp_policies = {
            "Basic": "default-src 'self'",
            "With CDN": "default-src 'self'; script-src 'self' https://cdn.example.com",
            "Strict": "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:",
            "Development": "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
        }
        
        for policy_name, policy in csp_policies.items():
            print(f"{policy_name} Policy:")
            print(f"  Content-Security-Policy: {policy}")
            print()
    
    def implement_secure_headers(self):
        """Generate secure HTTP headers for web applications."""
        secure_headers = {
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY", 
            "X-XSS-Protection": "1; mode=block",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
        }
        
        print("=== Recommended Security Headers ===")
        for header, value in secure_headers.items():
            print(f"{header}: {value}")
        
        return secure_headers
    
    def demonstrate_secure_authentication(self):
        """Show secure authentication patterns."""
        print("\n=== Secure Authentication Patterns ===")
        
        # Password hashing (using built-in hashlib for demo)
        password = "user_password_123"
        salt = secrets.token_hex(16)
        
        # Simulate password hashing (real apps should use bcrypt/scrypt/argon2)
        password_hash = hashlib.pbkdf2_hmac('sha256', 
                                           password.encode('utf-8'), 
                                           salt.encode('utf-8'), 
                                           100000)
        
        print("Password Security:")
        print(f"✓ Original password: {password}")
        print(f"✓ Salt: {salt}")
        print(f"✓ Hashed: {base64.b64encode(password_hash).decode()}")
        print("✓ Never store plain-text passwords")
        print("✓ Use strong hashing algorithms (bcrypt, scrypt, Argon2)")
        print("✓ Add salt to prevent rainbow table attacks")
        
        # Session security
        session_token = secrets.token_urlsafe(32)
        print(f"\nSession Security:")
        print(f"✓ Secure session token: {session_token}")
        print("✓ Use HTTPS-only cookies")
        print("✓ Set HttpOnly flag to prevent XSS")
        print("✓ Use SameSite attribute for CSRF protection")
        
        return {
            "password_hash": base64.b64encode(password_hash).decode(),
            "salt": salt,
            "session_token": session_token
        }
    
    def show_input_validation_patterns(self):
        """Demonstrate secure input handling."""
        print("\n=== Input Validation and Sanitization ===")
        
        validation_examples = [
            {
                "input": "<script>alert('xss')</script>",
                "type": "XSS attempt",
                "safe_output": "&lt;script&gt;alert('xss')&lt;/script&gt;",
                "method": "HTML entity encoding"
            },
            {
                "input": "'; DROP TABLE users; --",
                "type": "SQL injection attempt", 
                "safe_output": "Use parameterized queries",
                "method": "Prepared statements"
            },
            {
                "input": "user@example.com",
                "type": "Email validation",
                "safe_output": "user@example.com",
                "method": "Regex + domain validation"
            }
        ]
        
        for example in validation_examples:
            print(f"Input: {example['input']}")
            print(f"  Type: {example['type']}")
            print(f"  Safe handling: {example['safe_output']}")
            print(f"  Method: {example['method']}")
            print()

# Example usage
security = WebSecurityStandards()
security.demonstrate_csp_policy()
security.implement_secure_headers()
security.demonstrate_secure_authentication()
security.show_input_validation_patterns()

```text

### Privacy and privacy-by-design principles

Privacy-by-design builds privacy protection into web applications from the start, rather than adding it as an afterthought.

```python
class PrivacyByDesign:
    """Implement privacy-by-design principles for web applications."""
    
    def __init__(self):
        self.privacy_principles = {
            "Proactive": "Prevent privacy invasions before they occur",
            "Default": "Maximum privacy protection without user action",
            "Embedded": "Privacy built into system design, not bolted on",
            "Full_Functionality": "All legitimate interests accommodated",
            "End_to_End": "Privacy throughout the data lifecycle",
            "Visibility": "All stakeholders can verify privacy practices",
            "Respect": "User privacy as the highest priority"
        }
    
    def implement_data_minimization(self):
        """Show data minimization in practice."""
        print("=== Data Minimization Examples ===")
        
        user_registration_examples = {
            "Traditional (Over-collection)": {
                "fields": ["email", "password", "first_name", "last_name", "phone", 
                          "address", "date_of_birth", "gender", "income_range"],
                "privacy_score": "❌ Poor - Collects unnecessary data"
            },
            "Privacy-by-Design": {
                "fields": ["email", "password"],
                "optional_fields": ["display_name"],
                "privacy_score": "✅ Good - Minimal necessary data"
            }
        }
        
        for approach, details in user_registration_examples.items():
            print(f"{approach}:")
            print(f"  Required: {details['fields']}")
            if "optional_fields" in details:
                print(f"  Optional: {details['optional_fields']}")
            print(f"  Assessment: {details['privacy_score']}")
            print()
    
    def demonstrate_consent_management(self):
        """Show proper consent implementation."""
        print("=== GDPR-Compliant Consent Management ===")
        
        consent_categories = {
            "essential": {
                "purpose": "Core functionality (login, security)",
                "required": True,
                "description": "Necessary for the service to work"
            },
            "analytics": {
                "purpose": "Understanding usage patterns",
                "required": False, 
                "description": "Helps us improve the service"
            },
            "marketing": {
                "purpose": "Personalized recommendations", 
                "required": False,
                "description": "Shows relevant content and offers"
            },
            "advertising": {
                "purpose": "Targeted advertising",
                "required": False,
                "description": "Displays ads based on interests"
            }
        }
        
        print("Consent Interface Design:")
        for category, details in consent_categories.items():
            status = "Required" if details["required"] else "Optional"
            print(f"□ {category.title()} - {status}")
            print(f"  Purpose: {details['purpose']}")
            print(f"  Description: {details['description']}")
            print()
        
        print("Key Requirements:")
        print("✓ Granular consent (not all-or-nothing)")
        print("✓ Clear, plain language descriptions")
        print("✓ Easy to withdraw consent")
        print("✓ Pre-ticked boxes not allowed")
        print("✓ Consent records must be maintained")
    
    def implement_data_retention_policy(self):
        """Show automatic data deletion policies."""
        print("\n=== Data Retention and Deletion ===")
        
        retention_policies = {
            "user_accounts": {
                "active_retention": "Indefinite while account active",
                "inactive_deletion": "Delete after 3 years of inactivity",
                "deletion_method": "Secure overwrite"
            },
            "session_logs": {
                "active_retention": "30 days for security analysis", 
                "inactive_deletion": "Automatic deletion after 30 days",
                "deletion_method": "Automatic log rotation"
            },
            "analytics_data": {
                "active_retention": "26 months for trend analysis",
                "inactive_deletion": "Anonymize after 26 months",
                "deletion_method": "Remove personally identifiable information"
            }
        }
        
        for data_type, policy in retention_policies.items():
            print(f"{data_type.replace('_', ' ').title()}:")
            print(f"  Retention: {policy['active_retention']}")
            print(f"  Deletion: {policy['inactive_deletion']}")
            print(f"  Method: {policy['deletion_method']}")
            print()
    
    def create_privacy_dashboard(self):
        """Design a user privacy control dashboard."""
        privacy_controls = {
            "Data Download": "Export all your data in machine-readable format",
            "Data Deletion": "Permanently delete your account and all data",
            "Consent Management": "View and modify your consent preferences", 
            "Data Usage": "See how your data is being used",
            "Third-party Sharing": "Control data sharing with partners",
            "Communication Preferences": "Manage email and notification settings"
        }
        
        print("=== User Privacy Dashboard ===")
        for control, description in privacy_controls.items():
            print(f"[{control}]")
            print(f"  {description}")
            print()
        
        print("Dashboard Features:")
        print("✓ One-click data export (JSON/CSV)")
        print("✓ Clear deletion timelines and consequences")
        print("✓ Real-time consent status")
        print("✓ Audit log of data access")
        print("✓ Simple, non-technical language")

# Example usage
privacy = PrivacyByDesign()
privacy.implement_data_minimization()
privacy.demonstrate_consent_management()
privacy.implement_data_retention_policy()
privacy.create_privacy_dashboard()

```text

### Machine-readable data standards

Standards like ARIA, microdata, and JSON-LD help machines understand web content, improving accessibility and search engine optimization.

```python
import json

class MachineReadableData:
    """Demonstrate machine-readable data standards."""
    
    def __init__(self):
        self.aria_roles = {
            "button": "Interactive element that triggers actions",
            "navigation": "Collection of navigational links",
            "main": "Primary content of the page",
            "banner": "Site header with logo and navigation",
            "complementary": "Supporting content like sidebars"
        }
    
    def demonstrate_aria_attributes(self):
        """Show ARIA (Accessible Rich Internet Applications) usage."""
        print("=== ARIA Attributes for Accessibility ===")
        
        aria_examples = {
            "Dynamic Content": """
            <div id="status" role="status" aria-live="polite">
                Form submitted successfully
            </div>
            <!-- Screen readers announce changes automatically -->
            """,
            
            "Interactive Widget": """
            <div role="tablist">
                <button role="tab" 
                        aria-selected="true" 
                        aria-controls="panel1"
                        id="tab1">
                    Overview
                </button>
                <button role="tab" 
                        aria-selected="false" 
                        aria-controls="panel2"
                        id="tab2">
                    Details
                </button>
            </div>
            <div role="tabpanel" id="panel1" aria-labelledby="tab1">
                Overview content here...
            </div>
            """,
            
            "Form Enhancement": """
            <input type="password" 
                   id="password"
                   aria-describedby="pwd-help"
                   aria-invalid="false"
                   aria-required="true">
            <div id="pwd-help">
                Password must be at least 8 characters
            </div>
            """
        }
        
        for example_name, html in aria_examples.items():
            print(f"{example_name}:")
            print(html.strip())
            print()
    
    def create_microdata_example(self):
        """Show HTML5 microdata for structured data."""
        print("=== HTML5 Microdata Example ===")
        
        microdata_html = """
        <article itemscope itemtype="http://schema.org/Article">
            <header>
                <h1 itemprop="headline">
                    Getting Started with Web Standards
                </h1>
                <p>
                    By <span itemprop="author" itemscope itemtype="http://schema.org/Person">
                        <span itemprop="name">Jane Smith</span>
                    </span>
                    on <time itemprop="datePublished" datetime="2024-01-15">
                        January 15, 2024
                    </time>
                </p>
            </header>
            
            <div itemprop="articleBody">
                <p>This article explains the importance of web standards...</p>
            </div>
            
            <footer>
                <p>Published by 
                    <span itemprop="publisher" itemscope itemtype="http://schema.org/Organization">
                        <span itemprop="name">Tech Education Hub</span>
                    </span>
                </p>
            </footer>
        </article>
        """
        
        print("Microdata provides:")
        print("✓ Search engines understand content structure")
        print("✓ Rich snippets in search results")
        print("✓ Better content discovery")
        print("✓ Semantic meaning for machines")
        print()
        print("HTML with microdata:")
        print(microdata_html.strip())
    
    def create_json_ld_example(self):
        """Show JSON-LD structured data."""
        print("\n=== JSON-LD Structured Data ===")
        
        json_ld_data = {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": "Web Development Fundamentals",
            "description": "Learn HTML, CSS, and JavaScript basics",
            "provider": {
                "@type": "Organization",
                "name": "Tech Education Hub",
                "url": "https://techeducation.example.com"
            },
            "instructor": {
                "@type": "Person", 
                "name": "Jane Smith",
                "jobTitle": "Senior Web Developer"
            },
            "courseMode": ["online", "self-paced"],
            "duration": "PT40H",
            "educationalLevel": "Beginner",
            "programmingLanguage": ["HTML", "CSS", "JavaScript"],
            "offers": {
                "@type": "Offer",
                "price": "99.00",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
            }
        }
        
        print("JSON-LD Script Tag:")
        print('<script type="application/ld+json">')
        print(json.dumps(json_ld_data, indent=2))
        print('</script>')
        
        print("\nBenefits of JSON-LD:")
        print("✓ Separate from HTML markup")
        print("✓ Easier to maintain and validate")
        print("✓ Rich search result features")
        print("✓ Voice assistant optimization")
        print("✓ Knowledge graph integration")
    
    def demonstrate_semantic_html(self):
        """Show semantic HTML5 elements."""
        print("\n=== Semantic HTML5 Structure ===")
        
        semantic_structure = """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Semantic Page Structure</title>
        </head>
        <body>
            <header role="banner">
                <nav role="navigation">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                    </ul>
                </nav>
            </header>
            
            <main role="main">
                <article>
                    <header>
                        <h1>Article Title</h1>
                        <time datetime="2024-01-15">January 15, 2024</time>
                    </header>
                    <section>
                        <h2>Section Heading</h2>
                        <p>Content goes here...</p>
                    </section>
                </article>
                
                <aside role="complementary">
                    <h2>Related Links</h2>
                    <ul>
                        <li><a href="#related1">Related Article</a></li>
                    </ul>
                </aside>
            </main>
            
            <footer role="contentinfo">
                <address>
                    Contact: <a href="mailto:info@example.com">info@example.com</a>
                </address>
            </footer>
        </body>
        </html>
        """
        
        print("Semantic benefits:")
        print("✓ Screen readers navigate easily")
        print("✓ Search engines understand content hierarchy")
        print("✓ Consistent cross-browser behavior")
        print("✓ Future-proof markup structure")
        print()
        print("Structure example:")
        print(semantic_structure.strip())

# Example usage
machine_data = MachineReadableData()
machine_data.demonstrate_aria_attributes()
machine_data.create_microdata_example()
machine_data.create_json_ld_example()
machine_data.demonstrate_semantic_html()

```text

## Try it

/// details | Exercise 1: Accessibility Audit Tool
    type: question
    open: false

Create a simple accessibility audit tool that checks a webpage structure for common issues:

1. Check for missing alt text on images

2. Verify proper heading hierarchy (h1, h2, h3, etc.)

3. Ensure form labels are properly associated

4. Test color contrast ratios

5. Generate a report with recommendations

/// details | Sample Solution
    type: success
    open: false

```python
class AccessibilityAuditor:
    def __init__(self):
        self.issues = []
        self.recommendations = []
    
    def audit_page_structure(self, page_data):
        """Audit a page for accessibility issues."""
        self.issues = []
        self.recommendations = []
        
        # Check images
        self._check_images(page_data.get('images', []))
        
        # Check headings
        self._check_heading_hierarchy(page_data.get('headings', []))
        
        # Check forms
        self._check_form_labels(page_data.get('forms', []))
        
        # Check colors
        self._check_color_contrast(page_data.get('colors', []))
        
        return self._generate_report()
    
    def _check_images(self, images):
        """Check image accessibility."""
        for img in images:
            if not img.get('alt'):
                self.issues.append({
                    'type': 'Missing alt text',
                    'element': f"<img src='{img['src']}'>",
                    'severity': 'high',
                    'wcag': '1.1.1'
                })
                self.recommendations.append(
                    f"Add descriptive alt text to {img['src']}"
                )
    
    def _check_heading_hierarchy(self, headings):
        """Check heading structure."""
        if not headings:
            return
            
        current_level = 0
        for heading in headings:
            level = int(heading['level'])
            
            if level == 1 and current_level > 0:
                self.issues.append({
                    'type': 'Multiple H1 tags',
                    'element': f"<h{level}>{heading['text']}</h{level}>",
                    'severity': 'medium',
                    'wcag': '1.3.1'
                })
            
            if level > current_level + 1:
                self.issues.append({
                    'type': 'Skipped heading level',
                    'element': f"<h{level}>{heading['text']}</h{level}>",
                    'severity': 'medium', 
                    'wcag': '1.3.1'
                })
                self.recommendations.append(
                    f"Use heading levels sequentially (h{current_level+1} before h{level})"
                )
            
            current_level = max(current_level, level)
    
    def _check_form_labels(self, forms):
        """Check form label associations."""
        for form in forms:
            for field in form.get('fields', []):
                if not field.get('label') and not field.get('aria_label'):
                    self.issues.append({
                        'type': 'Missing form label',
                        'element': f"<input name='{field['name']}'>",
                        'severity': 'high',
                        'wcag': '1.3.1'
                    })
                    self.recommendations.append(
                        f"Add label or aria-label to {field['name']} field"
                    )
    
    def _check_color_contrast(self, colors):
        """Check color contrast ratios."""
        for color_pair in colors:
            # Simplified contrast check
            if color_pair.get('contrast_ratio', 0) < 4.5:
                self.issues.append({
                    'type': 'Low color contrast',
                    'element': f"fg: {color_pair['foreground']}, bg: {color_pair['background']}",
                    'severity': 'high',
                    'wcag': '1.4.3'
                })
                self.recommendations.append(
                    "Increase color contrast to at least 4.5:1"
                )
    
    def _generate_report(self):
        """Generate accessibility audit report."""
        report = {
            'total_issues': len(self.issues),
            'issues_by_severity': {
                'high': len([i for i in self.issues if i['severity'] == 'high']),
                'medium': len([i for i in self.issues if i['severity'] == 'medium']),
                'low': len([i for i in self.issues if i['severity'] == 'low'])
            },
            'issues': self.issues,
            'recommendations': self.recommendations,
            'wcag_compliance': 'fail' if self.issues else 'pass'
        }
        
        return report

# Example usage
auditor = AccessibilityAuditor()

sample_page = {
    'images': [
        {'src': 'logo.png', 'alt': 'Company Logo'},
        {'src': 'chart.png'},  # Missing alt text
    ],
    'headings': [
        {'level': 1, 'text': 'Main Title'},
        {'level': 3, 'text': 'Subsection'},  # Skipped h2
    ],
    'forms': [
        {
            'fields': [
                {'name': 'email', 'label': 'Email Address'},
                {'name': 'password'},  # Missing label
            ]
        }
    ],
    'colors': [
        {'foreground': '#767676', 'background': '#ffffff', 'contrast_ratio': 3.0}  # Too low
    ]
}

report = auditor.audit_page_structure(sample_page)
print(f"Accessibility Issues Found: {report['total_issues']}")
for issue in report['issues']:
    print(f"- {issue['type']}: {issue['element']} (WCAG {issue['wcag']})")

```text

///
///

/// details | Exercise 2: Privacy-Compliant Cookie Manager
    type: question
    open: false

Build a GDPR-compliant cookie consent manager:

1. Categorize cookies (essential, analytics, marketing)

2. Implement granular consent controls

3. Provide clear descriptions of data usage

4. Allow easy consent withdrawal

5. Generate consent records for compliance

/// details | Sample Solution
    type: success
    open: false

```python
import json
import datetime
from typing import Dict, List

class CookieConsentManager:
    def __init__(self):
        self.cookie_categories = {
            'essential': {
                'name': 'Essential Cookies',
                'description': 'Required for basic site functionality',
                'required': True,
                'cookies': ['session_id', 'csrf_token', 'language_preference']
            },
            'analytics': {
                'name': 'Analytics Cookies', 
                'description': 'Help us understand how visitors use our site',
                'required': False,
                'cookies': ['google_analytics', 'page_views', 'user_journey']
            },
            'marketing': {
                'name': 'Marketing Cookies',
                'description': 'Used to show personalized ads and content',
                'required': False,
                'cookies': ['ad_targeting', 'social_media_pixels', 'remarketing']
            }
        }
        
        self.consent_records = []
    
    def generate_consent_banner(self):
        """Generate HTML for consent banner."""
        banner_html = """
        <div id="cookie-consent-banner" class="cookie-banner">
            <div class="cookie-content">
                <h3>Cookie Preferences</h3>
                <p>We use cookies to enhance your browsing experience and analyze site traffic. 
                   You can choose which categories of cookies to accept.</p>
                
                <div class="cookie-categories">
        """
        
        for category_id, category in self.cookie_categories.items():
            required_attr = 'disabled checked' if category['required'] else ''
            banner_html += f"""
                    <div class="cookie-category">
                        <label>
                            <input type="checkbox" 
                                   name="cookie-{category_id}" 
                                   value="{category_id}"
                                   {required_attr}>
                            <strong>{category['name']}</strong>
                            {' (Required)' if category['required'] else ''}
                        </label>
                        <p class="cookie-description">{category['description']}</p>
                        <details>
                            <summary>Cookies in this category</summary>
                            <ul>
            """
            
            for cookie in category['cookies']:
                banner_html += f"<li>{cookie}</li>"
            
            banner_html += """
                            </ul>
                        </details>
                    </div>
            """
        
        banner_html += """
                </div>
                
                <div class="cookie-actions">
                    <button onclick="acceptSelected()">Accept Selected</button>
                    <button onclick="acceptAll()">Accept All</button>
                    <button onclick="rejectAll()">Reject All</button>
                    <a href="/privacy-policy">Privacy Policy</a>
                </div>
            </div>
        </div>
        """
        
        return banner_html
    
    def process_consent(self, user_id: str, consent_choices: Dict[str, bool], 
                       ip_address: str = None):
        """Process and record user consent choices."""
        timestamp = datetime.datetime.now()
        
        # Ensure essential cookies are always enabled
        consent_choices['essential'] = True
        
        consent_record = {
            'user_id': user_id,
            'timestamp': timestamp.isoformat(),
            'ip_address': ip_address,
            'consent_choices': consent_choices,
            'consent_string': self._generate_consent_string(consent_choices),
            'browser_info': 'User-Agent would be captured here',
            'method': 'banner_interaction'
        }
        
        self.consent_records.append(consent_record)
        return consent_record
    
    def _generate_consent_string(self, choices: Dict[str, bool]) -> str:
        """Generate IAB-style consent string."""
        # Simplified version - real implementation would follow IAB TCF
        consent_bits = []
        for category in ['essential', 'analytics', 'marketing']:
            consent_bits.append('1' if choices.get(category, False) else '0')
        
        return f"v1.{'.'.join(consent_bits)}.{datetime.date.today().isoformat()}"
    
    def withdraw_consent(self, user_id: str, categories: List[str]):
        """Allow users to withdraw consent for specific categories."""
        # Find latest consent record
        user_records = [r for r in self.consent_records if r['user_id'] == user_id]
        if not user_records:
            return None
        
        latest_consent = max(user_records, key=lambda x: x['timestamp'])
        new_choices = latest_consent['consent_choices'].copy()
        
        # Withdraw consent for specified categories (except essential)
        for category in categories:
            if category != 'essential':
                new_choices[category] = False
        
        return self.process_consent(user_id, new_choices, method='withdrawal')
    
    def generate_privacy_dashboard(self, user_id: str):
        """Generate user privacy control dashboard."""
        user_records = [r for r in self.consent_records if r['user_id'] == user_id]
        if not user_records:
            return "No consent records found."
        
        latest_consent = max(user_records, key=lambda x: x['timestamp'])
        
        dashboard_html = f"""
        <div class="privacy-dashboard">
            <h2>Your Privacy Settings</h2>
            
            <div class="current-settings">
                <h3>Current Cookie Preferences</h3>
                <p>Last updated: {latest_consent['timestamp']}</p>
                
                <form id="privacy-form">
        """
        
        for category_id, category in self.cookie_categories.items():
            current_consent = latest_consent['consent_choices'].get(category_id, False)
            checked = 'checked' if current_consent else ''
            disabled = 'disabled' if category['required'] else ''
            
            dashboard_html += f"""
                    <div class="setting-group">
                        <label>
                            <input type="checkbox" 
                                   name="{category_id}" 
                                   {checked} {disabled}>
                            {category['name']}
                        </label>
                        <p>{category['description']}</p>
                    </div>
            """
        
        dashboard_html += """
                    <button type="submit">Update Preferences</button>
                </form>
            </div>
            
            <div class="data-controls">
                <h3>Data Management</h3>
                <button onclick="downloadData()">Download My Data</button>
                <button onclick="deleteAccount()" class="danger">Delete Account</button>
            </div>
            
            <div class="consent-history">
                <h3>Consent History</h3>
                <table>
                    <tr><th>Date</th><th>Action</th><th>Consent String</th></tr>
        """
        
        for record in sorted(user_records, key=lambda x: x['timestamp'], reverse=True):
            dashboard_html += f"""
                    <tr>
                        <td>{record['timestamp'][:10]}</td>
                        <td>{record.get('method', 'consent')}</td>
                        <td><code>{record['consent_string']}</code></td>
                    </tr>
            """
        
        dashboard_html += """
                </table>
            </div>
        </div>
        """
        
        return dashboard_html
    
    def export_consent_data(self, user_id: str):
        """Export user's consent data for GDPR compliance."""
        user_records = [r for r in self.consent_records if r['user_id'] == user_id]
        
        export_data = {
            'user_id': user_id,
            'export_date': datetime.datetime.now().isoformat(),
            'consent_records': user_records,
            'data_categories': list(self.cookie_categories.keys()),
            'current_cookies': self._get_active_cookies(user_id)
        }
        
        return json.dumps(export_data, indent=2)
    
    def _get_active_cookies(self, user_id: str):
        """Get list of cookies currently active for user."""
        user_records = [r for r in self.consent_records if r['user_id'] == user_id]
        if not user_records:
            return []
        
        latest_consent = max(user_records, key=lambda x: x['timestamp'])
        active_cookies = []
        
        for category_id, consented in latest_consent['consent_choices'].items():
            if consented:
                active_cookies.extend(self.cookie_categories[category_id]['cookies'])
        
        return active_cookies

# Example usage
consent_manager = CookieConsentManager()

# Simulate user consent
user_choices = {
    'essential': True,
    'analytics': True, 
    'marketing': False
}

consent_record = consent_manager.process_consent(
    user_id='user123',
    consent_choices=user_choices,
    ip_address='192.168.1.1'
)

print("Consent recorded:")
print(f"User: {consent_record['user_id']}")
print(f"Choices: {consent_record['consent_choices']}")
print(f"Consent String: {consent_record['consent_string']}")

# Generate dashboard
dashboard = consent_manager.generate_privacy_dashboard('user123')
print("\nPrivacy dashboard generated successfully")

# Export data
export_data = consent_manager.export_consent_data('user123')
print("\nData export available in JSON format")

```text

///
///

## Recap

The W3C plays a crucial role in creating web standards that ensure the internet works for everyone:

**W3C's Mission:**

- Develops open standards for long-term web growth

- Brings together organizations, developers, and users

- Ensures web accessibility, security, and interoperability

**Key Standards Areas:**

- **Web Accessibility Initiative (WAI)**: WCAG guidelines make web content accessible to people with disabilities

- **Internationalisation (i18n) and Localisation (l10n)**: Support for multiple languages, cultures, and regions

- **Web Security**: Standards and patterns for protecting applications and user data

- **Privacy-by-Design**: Building privacy protection into applications from the start

- **Machine-Readable Data**: ARIA, microdata, and JSON-LD help machines understand web content

**Practical Benefits:**

- Consistent cross-browser behavior

- Better search engine optimization  

- Improved accessibility for all users

- Enhanced security and privacy protection

- Future-proof web applications

Following W3C standards ensures your web applications work reliably, serve diverse global audiences, and protect user privacy and security.
