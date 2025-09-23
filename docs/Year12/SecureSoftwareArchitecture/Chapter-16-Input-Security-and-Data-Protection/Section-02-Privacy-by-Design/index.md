# Section 16.2: Privacy by Design

## Learning Objectives

By the end of this section, you will be able to:

- **Apply data minimization principles** to collect only necessary personal information

- **Implement consent management systems** that respect user choices and legal requirements

- **Design purpose limitation and data retention** policies that protect user privacy

- **Conduct privacy impact assessments** to identify and mitigate privacy risks

- **Understand GDPR and privacy law fundamentals** and their implications for software design

## Why Privacy by Design Matters

Privacy by Design is a framework that embeds privacy considerations into the design and operation of systems from the ground up. It's not just about compliance with regulations like GDPR—it's about building trust with users and creating sustainable, ethical software systems.

**Without Privacy by Design:**

- User data is collected unnecessarily, creating privacy risks and compliance burdens

- Data breaches expose more personal information than required for business operations

- Users lose trust when they discover unexpected data collection or usage

- Organizations face significant penalties under privacy regulations

- Technical debt accumulates as privacy requirements are retrofitted

## Core Privacy Principles

### 1. Data Minimization

**Data minimization** means collecting, processing, and storing only the personal data that is necessary for the specific purpose.

```python
from typing import Dict, List, Optional, Set
from datetime import datetime, timedelta
from enum import Enum
import json

class DataCategory(Enum):
    ESSENTIAL = "essential"  # Required for core functionality
    FUNCTIONAL = "functional"  # Enhances user experience
    ANALYTICS = "analytics"  # For improving services
    MARKETING = "marketing"  # For promotional purposes

class PurposeLimitation(Enum):
    ACCOUNT_MANAGEMENT = "account_management"
    SERVICE_DELIVERY = "service_delivery"
    SECURITY = "security"
    ANALYTICS = "analytics"
    MARKETING = "marketing"
    LEGAL_COMPLIANCE = "legal_compliance"

class DataMinimizationManager:
    def __init__(self):
        # Define what data is necessary for each purpose
        self.purpose_data_mapping = {
            PurposeLimitation.ACCOUNT_MANAGEMENT: {
                'required': ['username', 'email', 'password_hash'],
                'optional': ['display_name', 'timezone']
            },
            PurposeLimitation.SERVICE_DELIVERY: {
                'required': ['user_id', 'service_preferences'],
                'optional': ['usage_history', 'personalization_settings']
            },
            PurposeLimitation.SECURITY: {
                'required': ['login_attempts', 'ip_address', 'session_data'],
                'optional': ['device_fingerprint', 'security_questions']
            },
            PurposeLimitation.ANALYTICS: {
                'required': [],
                'optional': ['page_views', 'feature_usage', 'performance_metrics']
            },
            PurposeLimitation.MARKETING: {
                'required': [],
                'optional': ['communication_preferences', 'interest_categories']
            }
        }
        
        # Define data retention periods
        self.retention_periods = {
            DataCategory.ESSENTIAL: timedelta(days=2555),  # 7 years (legal requirement)
            DataCategory.FUNCTIONAL: timedelta(days=365),  # 1 year
            DataCategory.ANALYTICS: timedelta(days=90),    # 3 months
            DataCategory.MARKETING: timedelta(days=730)    # 2 years
        }
    
    def validate_data_collection(self, requested_data: Dict[str, any], 
                                purpose: PurposeLimitation) -> Dict[str, any]:
        """Validate that data collection adheres to minimization principles"""
        
        if purpose not in self.purpose_data_mapping:
            return {
                'is_valid': False,
                'error': f"Unknown purpose: {purpose}",
                'allowed_data': {},
                'rejected_data': requested_data
            }
        
        allowed_fields = self.purpose_data_mapping[purpose]
        required_fields = set(allowed_fields['required'])
        optional_fields = set(allowed_fields['optional'])
        all_allowed = required_fields.union(optional_fields)
        
        # Separate allowed and rejected data
        allowed_data = {}
        rejected_data = {}
        missing_required = []
        
        for field, value in requested_data.items():
            if field in all_allowed:
                allowed_data[field] = value
            else:
                rejected_data[field] = value
        
        # Check for missing required fields
        for required_field in required_fields:
            if required_field not in requested_data:
                missing_required.append(required_field)
        
        is_valid = len(rejected_data) == 0 and len(missing_required) == 0
        
        return {
            'is_valid': is_valid,
            'allowed_data': allowed_data,
            'rejected_data': rejected_data,
            'missing_required': missing_required,
            'purpose': purpose.value,
            'minimization_applied': len(rejected_data) > 0
        }
    
    def create_privacy_compliant_user_profile(self, user_data: Dict[str, any], 
                                            purposes: List[PurposeLimitation]) -> Dict[str, any]:
        """Create user profile that only includes data needed for specified purposes"""
        
        all_allowed_data = {}
        collection_log = []
        
        for purpose in purposes:
            validation_result = self.validate_data_collection(user_data, purpose)
            
            # Merge allowed data
            all_allowed_data.update(validation_result['allowed_data'])
            
            # Log collection rationale
            collection_log.append({
                'purpose': purpose.value,
                'fields_collected': list(validation_result['allowed_data'].keys()),
                'fields_rejected': list(validation_result['rejected_data'].keys()),
                'timestamp': datetime.now().isoformat()
            })
        
        return {
            'user_profile': all_allowed_data,
            'collection_rationale': collection_log,
            'data_categories': self._categorize_collected_data(all_allowed_data),
            'retention_schedule': self._calculate_retention_schedule(all_allowed_data)
        }
    
    def _categorize_collected_data(self, collected_data: Dict[str, any]) -> Dict[str, List[str]]:
        """Categorize collected data by privacy impact"""
        
        # Define data categories based on privacy sensitivity
        categorization = {
            DataCategory.ESSENTIAL.value: [],
            DataCategory.FUNCTIONAL.value: [],
            DataCategory.ANALYTICS.value: [],
            DataCategory.MARKETING.value: []
        }
        
        essential_fields = ['username', 'email', 'password_hash', 'user_id']
        functional_fields = ['display_name', 'timezone', 'service_preferences', 'personalization_settings']
        analytics_fields = ['page_views', 'feature_usage', 'performance_metrics', 'usage_history']
        marketing_fields = ['communication_preferences', 'interest_categories']
        
        for field in collected_data.keys():
            if field in essential_fields:
                categorization[DataCategory.ESSENTIAL.value].append(field)
            elif field in functional_fields:
                categorization[DataCategory.FUNCTIONAL.value].append(field)
            elif field in analytics_fields:
                categorization[DataCategory.ANALYTICS.value].append(field)
            elif field in marketing_fields:
                categorization[DataCategory.MARKETING.value].append(field)
            else:
                # Default to functional if not categorized
                categorization[DataCategory.FUNCTIONAL.value].append(field)
        
        return categorization
    
    def _calculate_retention_schedule(self, collected_data: Dict[str, any]) -> Dict[str, str]:
        """Calculate when each piece of data should be deleted"""
        
        categorized_data = self._categorize_collected_data(collected_data)
        retention_schedule = {}
        
        for category, fields in categorized_data.items():
            if fields:  # Only process non-empty categories
                category_enum = DataCategory(category)
                retention_period = self.retention_periods[category_enum]
                deletion_date = (datetime.now() + retention_period).isoformat()
                
                for field in fields:
                    retention_schedule[field] = deletion_date
        
        return retention_schedule

# Demonstration of data minimization
def demonstrate_data_minimization():
    """Demonstrate data minimization in practice"""
    
    print("=== Data Minimization Demo ===")
    
    minimizer = DataMinimizationManager()
    
    # Simulate user registration form with excessive data collection
    excessive_user_data = {
        'username': 'student123',
        'email': 'student@school.edu',
        'password_hash': 'hashed_password',
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'phone_number': '+1234567890',
        'address': '123 Main St, City, State',
        'date_of_birth': '2005-01-15',
        'social_security_number': '123-45-6789',  # Excessive!
        'emergency_contact': 'Parent Name',
        'medical_conditions': 'None',  # Excessive!
        'favorite_color': 'Blue',  # Excessive!
        'display_name': 'Alice J',
        'timezone': 'UTC-5'
    }
    
    print("Original registration data fields:", len(excessive_user_data))
    print("Fields:", list(excessive_user_data.keys()))
    
    # Apply data minimization for account management only
    purposes = [PurposeLimitation.ACCOUNT_MANAGEMENT]
    
    privacy_compliant_profile = minimizer.create_privacy_compliant_user_profile(
        excessive_user_data, purposes
    )
    
    print(f"\nAfter data minimization for {[p.value for p in purposes]}:")
    print("Collected fields:", len(privacy_compliant_profile['user_profile']))
    print("Fields:", list(privacy_compliant_profile['user_profile'].keys()))
    
    print("\nCollection rationale:")
    for log_entry in privacy_compliant_profile['collection_rationale']:
        print(f"  Purpose: {log_entry['purpose']}")
        print(f"  Collected: {log_entry['fields_collected']}")
        print(f"  Rejected: {log_entry['fields_rejected']}")
        print()
    
    print("Data categories:")
    for category, fields in privacy_compliant_profile['data_categories'].items():
        if fields:
            print(f"  {category}: {fields}")
    
    # Demonstrate adding more purposes
    print("\n=== Adding Service Delivery Purpose ===")
    
    extended_purposes = [
        PurposeLimitation.ACCOUNT_MANAGEMENT,
        PurposeLimitation.SERVICE_DELIVERY
    ]
    
    extended_profile = minimizer.create_privacy_compliant_user_profile(
        excessive_user_data, extended_purposes
    )
    
    print("Extended collection fields:", list(extended_profile['user_profile'].keys()))
    print("Still rejected excessive fields like SSN, medical conditions, favorite color")

```

### 2. Consent Management

**Consent management** ensures users have control over how their personal data is collected and used.

```python
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid

class ConsentType(Enum):
    NECESSARY = "necessary"  # Required for service
    FUNCTIONAL = "functional"  # Enhances experience
    ANALYTICS = "analytics"  # Service improvement
    MARKETING = "marketing"  # Promotional communications
    PERSONALIZATION = "personalization"  # Customized content

class ConsentStatus(Enum):
    GRANTED = "granted"
    DENIED = "denied"
    WITHDRAWN = "withdrawn"
    EXPIRED = "expired"

class ConsentRecord:
    def __init__(self, consent_type: ConsentType, status: ConsentStatus, 
                 user_id: str, ip_address: str = "unknown", user_agent: str = "unknown"):
        self.consent_id = str(uuid.uuid4())
        self.consent_type = consent_type
        self.status = status
        self.user_id = user_id
        self.timestamp = datetime.now()
        self.ip_address = ip_address
        self.user_agent = user_agent
        self.expiry_date = self._calculate_expiry()
        self.withdrawal_date = None
    
    def _calculate_expiry(self) -> datetime:
        """Calculate when consent expires (typically 12 months)"""
        return self.timestamp + timedelta(days=365)
    
    def is_valid(self) -> bool:
        """Check if consent is currently valid"""
        if self.status in [ConsentStatus.DENIED, ConsentStatus.WITHDRAWN]:
            return False
        
        if datetime.now() > self.expiry_date:
            self.status = ConsentStatus.EXPIRED
            return False
        
        return True
    
    def withdraw(self) -> bool:
        """Withdraw consent"""
        if self.status == ConsentStatus.GRANTED:
            self.status = ConsentStatus.WITHDRAWN
            self.withdrawal_date = datetime.now()
            return True
        return False

class ConsentManager:
    def __init__(self):
        self.consent_records: Dict[str, List[ConsentRecord]] = {}
        
        # Define what each consent type enables
        self.consent_capabilities = {
            ConsentType.NECESSARY: {
                'description': 'Essential for basic service functionality',
                'can_opt_out': False,
                'data_types': ['account_data', 'security_logs', 'essential_preferences'],
                'processing_activities': ['authentication', 'service_delivery', 'security']
            },
            ConsentType.FUNCTIONAL: {
                'description': 'Enhances your experience with additional features',
                'can_opt_out': True,
                'data_types': ['usage_preferences', 'ui_customizations', 'feature_settings'],
                'processing_activities': ['personalization', 'feature_enhancement']
            },
            ConsentType.ANALYTICS: {
                'description': 'Helps us improve our services through usage analysis',
                'can_opt_out': True,
                'data_types': ['page_views', 'feature_usage', 'performance_data'],
                'processing_activities': ['service_improvement', 'bug_detection', 'optimization']
            },
            ConsentType.MARKETING: {
                'description': 'Allows us to send you promotional communications',
                'can_opt_out': True,
                'data_types': ['communication_preferences', 'interest_data'],
                'processing_activities': ['email_marketing', 'targeted_communications']
            },
            ConsentType.PERSONALIZATION: {
                'description': 'Enables customized content and recommendations',
                'can_opt_out': True,
                'data_types': ['behavior_patterns', 'preferences', 'interaction_history'],
                'processing_activities': ['content_customization', 'recommendations']
            }
        }
    
    def request_consent(self, user_id: str, consent_types: List[ConsentType], 
                       ip_address: str = "unknown", user_agent: str = "unknown") -> Dict[str, any]:
        """Request consent from user with clear information"""
        
        consent_request = {
            'request_id': str(uuid.uuid4()),
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'consent_options': []
        }
        
        for consent_type in consent_types:
            if consent_type in self.consent_capabilities:
                capability = self.consent_capabilities[consent_type]
                
                consent_option = {
                    'consent_type': consent_type.value,
                    'description': capability['description'],
                    'can_opt_out': capability['can_opt_out'],
                    'data_types': capability['data_types'],
                    'processing_activities': capability['processing_activities'],
                    'is_required': not capability['can_opt_out']
                }
                
                consent_request['consent_options'].append(consent_option)
        
        return consent_request
    
    def record_consent_decision(self, user_id: str, consent_decisions: Dict[ConsentType, bool],
                              ip_address: str = "unknown", user_agent: str = "unknown") -> Dict[str, any]:
        """Record user's consent decisions"""
        
        if user_id not in self.consent_records:
            self.consent_records[user_id] = []
        
        recorded_consents = []
        validation_errors = []
        
        for consent_type, granted in consent_decisions.items():
            # Check if this is a required consent that was denied
            if not granted and not self.consent_capabilities[consent_type]['can_opt_out']:
                validation_errors.append(f"Cannot deny required consent: {consent_type.value}")
                continue
            
            # Create consent record
            status = ConsentStatus.GRANTED if granted else ConsentStatus.DENIED
            consent_record = ConsentRecord(consent_type, status, user_id, ip_address, user_agent)
            
            # Withdraw any previous consent for this type
            self._withdraw_previous_consent(user_id, consent_type)
            
            # Store new consent
            self.consent_records[user_id].append(consent_record)
            recorded_consents.append({
                'consent_id': consent_record.consent_id,
                'consent_type': consent_type.value,
                'status': status.value,
                'expiry_date': consent_record.expiry_date.isoformat()
            })
        
        return {
            'success': len(validation_errors) == 0,
            'recorded_consents': recorded_consents,
            'validation_errors': validation_errors,
            'processing_lawful_basis': self._determine_lawful_basis(user_id)
        }
    
    def check_consent(self, user_id: str, consent_type: ConsentType) -> Dict[str, any]:
        """Check if user has given valid consent for specific processing"""
        
        if user_id not in self.consent_records:
            return {
                'has_consent': False,
                'reason': 'No consent records found',
                'can_process': False
            }
        
        # Find most recent consent for this type
        user_consents = self.consent_records[user_id]
        relevant_consents = [c for c in user_consents if c.consent_type == consent_type]
        
        if not relevant_consents:
            # Check if this is necessary processing
            if consent_type == ConsentType.NECESSARY:
                return {
                    'has_consent': True,
                    'reason': 'Necessary for service delivery',
                    'can_process': True,
                    'lawful_basis': 'legitimate_interest'
                }
            return {
                'has_consent': False,
                'reason': 'No consent given for this type',
                'can_process': False
            }
        
        # Get most recent consent
        latest_consent = max(relevant_consents, key=lambda c: c.timestamp)
        
        if latest_consent.is_valid():
            return {
                'has_consent': True,
                'consent_id': latest_consent.consent_id,
                'granted_date': latest_consent.timestamp.isoformat(),
                'expiry_date': latest_consent.expiry_date.isoformat(),
                'can_process': True,
                'lawful_basis': 'consent'
            }
        else:
            return {
                'has_consent': False,
                'reason': f'Consent {latest_consent.status.value}',
                'can_process': consent_type == ConsentType.NECESSARY,
                'lawful_basis': 'legitimate_interest' if consent_type == ConsentType.NECESSARY else None
            }
    
    def withdraw_consent(self, user_id: str, consent_type: ConsentType) -> Dict[str, any]:
        """Allow user to withdraw consent"""
        
        if consent_type == ConsentType.NECESSARY:
            return {
                'success': False,
                'error': 'Cannot withdraw consent for necessary processing',
                'alternative': 'You can delete your account if you wish to stop all processing'
            }
        
        withdrawal_result = self._withdraw_previous_consent(user_id, consent_type)
        
        if withdrawal_result:
            return {
                'success': True,
                'message': f'Consent withdrawn for {consent_type.value}',
                'data_processing_stopped': True,
                'data_deletion_scheduled': True
            }
        else:
            return {
                'success': False,
                'error': 'No active consent found to withdraw'
            }
    
    def get_consent_dashboard(self, user_id: str) -> Dict[str, any]:
        """Provide user with overview of their consent status"""
        
        if user_id not in self.consent_records:
            return {
                'user_id': user_id,
                'consent_status': {},
                'data_processing_activities': [],
                'withdrawal_options': []
            }
        
        consent_status = {}
        processing_activities = []
        withdrawal_options = []
        
        for consent_type in ConsentType:
            check_result = self.check_consent(user_id, consent_type)
            consent_status[consent_type.value] = {
                'has_consent': check_result['has_consent'],
                'can_process': check_result['can_process'],
                'reason': check_result.get('reason', ''),
                'expiry_date': check_result.get('expiry_date', '')
            }
            
            if check_result['can_process']:
                capability = self.consent_capabilities[consent_type]
                processing_activities.extend(capability['processing_activities'])
            
            if consent_type != ConsentType.NECESSARY and check_result['has_consent']:
                withdrawal_options.append({
                    'consent_type': consent_type.value,
                    'description': self.consent_capabilities[consent_type]['description']
                })
        
        return {
            'user_id': user_id,
            'consent_status': consent_status,
            'data_processing_activities': list(set(processing_activities)),
            'withdrawal_options': withdrawal_options,
            'last_updated': datetime.now().isoformat()
        }
    
    def _withdraw_previous_consent(self, user_id: str, consent_type: ConsentType) -> bool:
        """Withdraw any existing consent for the specified type"""
        
        if user_id not in self.consent_records:
            return False
        
        user_consents = self.consent_records[user_id]
        relevant_consents = [c for c in user_consents if c.consent_type == consent_type]
        
        withdrawal_count = 0
        for consent in relevant_consents:
            if consent.status == ConsentStatus.GRANTED:
                consent.withdraw()
                withdrawal_count += 1
        
        return withdrawal_count > 0
    
    def _determine_lawful_basis(self, user_id: str) -> Dict[ConsentType, str]:
        """Determine lawful basis for processing under GDPR"""
        
        lawful_basis = {}
        
        for consent_type in ConsentType:
            check_result = self.check_consent(user_id, consent_type)
            
            if consent_type == ConsentType.NECESSARY:
                lawful_basis[consent_type] = "legitimate_interest"
            elif check_result['has_consent']:
                lawful_basis[consent_type] = "consent"
            else:
                lawful_basis[consent_type] = "none"
        
        return lawful_basis

# Demonstration of consent management
def demonstrate_consent_management():
    """Demonstrate comprehensive consent management"""
    
    print("=== Consent Management Demo ===")
    
    consent_manager = ConsentManager()
    user_id = "student_12345"
    
    # Step 1: Request consent from user
    print("1. Requesting consent from user...")
    
    consent_request = consent_manager.request_consent(
        user_id,
        [ConsentType.NECESSARY, ConsentType.FUNCTIONAL, ConsentType.ANALYTICS, ConsentType.MARKETING],
        "192.168.1.100",
        "Mozilla/5.0 Student Browser"
    )
    
    print(f"Consent request ID: {consent_request['request_id']}")
    print("Available consent options:")
    for option in consent_request['consent_options']:
        required = " (REQUIRED)" if option['is_required'] else " (OPTIONAL)"
        print(f"  {option['consent_type']}{required}: {option['description']}")
    
    # Step 2: User makes consent decisions
    print("\n2. User consent decisions...")
    
    user_decisions = {
        ConsentType.NECESSARY: True,    # Required
        ConsentType.FUNCTIONAL: True,   # User chooses yes
        ConsentType.ANALYTICS: True,    # User chooses yes
        ConsentType.MARKETING: False    # User chooses no
    }
    
    decision_result = consent_manager.record_consent_decision(
        user_id, user_decisions, "192.168.1.100", "Mozilla/5.0 Student Browser"
    )
    
    print(f"Consent recording successful: {decision_result['success']}")
    print("Recorded consents:")
    for consent in decision_result['recorded_consents']:
        print(f"  {consent['consent_type']}: {consent['status']}")
    
    # Step 3: Check consent before processing
    print("\n3. Checking consent before data processing...")
    
    processing_scenarios = [
        (ConsentType.NECESSARY, "User authentication"),
        (ConsentType.FUNCTIONAL, "UI customization"),
        (ConsentType.ANALYTICS, "Usage tracking"),
        (ConsentType.MARKETING, "Promotional emails")
    ]
    
    for consent_type, activity in processing_scenarios:
        check_result = consent_manager.check_consent(user_id, consent_type)
        status = "✅ ALLOWED" if check_result['can_process'] else "❌ BLOCKED"
        print(f"  {activity}: {status}")
        if not check_result['can_process']:
            print(f"    Reason: {check_result['reason']}")
    
    # Step 4: User consent dashboard
    print("\n4. User consent dashboard...")
    
    dashboard = consent_manager.get_consent_dashboard(user_id)
    
    print("Current consent status:")
    for consent_type, status in dashboard['consent_status'].items():
        indicator = "✅" if status['has_consent'] else "❌"
        print(f"  {indicator} {consent_type}: {status['reason']}")
    
    print(f"\nActive processing activities: {dashboard['data_processing_activities']}")
    
    # Step 5: Withdraw consent
    print("\n5. Withdrawing marketing consent...")
    
    # Note: User already denied marketing, but let's try withdrawing analytics
    withdrawal_result = consent_manager.withdraw_consent(user_id, ConsentType.ANALYTICS)
    print(f"Withdrawal successful: {withdrawal_result['success']}")
    
    if withdrawal_result['success']:
        print(f"Message: {withdrawal_result['message']}")
        
        # Check processing after withdrawal
        updated_check = consent_manager.check_consent(user_id, ConsentType.ANALYTICS)
        print(f"Analytics processing now allowed: {updated_check['can_process']}")

```

### 3. Purpose Limitation and Data Retention

**Purpose limitation** ensures data is only used for the purposes it was collected for, and **data retention** policies ensure data is not kept longer than necessary.

```python
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from enum import Enum
import json

class RetentionPolicy:
    def __init__(self, policy_id: str, data_category: str, 
                 retention_period: timedelta, legal_basis: str):
        self.policy_id = policy_id
        self.data_category = data_category
        self.retention_period = retention_period
        self.legal_basis = legal_basis
        self.created_date = datetime.now()
    
    def calculate_deletion_date(self, collection_date: datetime) -> datetime:
        """Calculate when data should be deleted"""
        return collection_date + self.retention_period
    
    def is_deletion_due(self, collection_date: datetime) -> bool:
        """Check if data should be deleted now"""
        deletion_date = self.calculate_deletion_date(collection_date)
        return datetime.now() >= deletion_date

class DataRetentionManager:
    def __init__(self):
        # Define retention policies for different data types
        self.retention_policies = {
            'account_data': RetentionPolicy(
                'account_001',
                'account_data',
                timedelta(days=2555),  # 7 years (legal requirement)
                'Legal obligation - financial records retention'
            ),
            'usage_analytics': RetentionPolicy(
                'analytics_001',
                'usage_analytics',
                timedelta(days=90),  # 3 months
                'Legitimate interest - service improvement'
            ),
            'marketing_data': RetentionPolicy(
                'marketing_001',
                'marketing_data',
                timedelta(days=730),  # 2 years
                'Consent - promotional communications'
            ),
            'security_logs': RetentionPolicy(
                'security_001',
                'security_logs',
                timedelta(days=180),  # 6 months
                'Legitimate interest - security monitoring'
            ),
            'session_data': RetentionPolicy(
                'session_001',
                'session_data',
                timedelta(hours=24),  # 24 hours
                'Legitimate interest - service delivery'
            ),
            'support_tickets': RetentionPolicy(
                'support_001',
                'support_tickets',
                timedelta(days=1095),  # 3 years
                'Legitimate interest - customer service'
            )
        }
        
        # Track data collection and purposes
        self.data_inventory = {}
    
    def record_data_collection(self, user_id: str, data_type: str, 
                             purpose: PurposeLimitation, data_content: Dict[str, any]) -> str:
        """Record when data is collected and for what purpose"""
        
        record_id = f"{user_id}_{data_type}_{datetime.now().timestamp()}"
        
        if user_id not in self.data_inventory:
            self.data_inventory[user_id] = []
        
        collection_record = {
            'record_id': record_id,
            'user_id': user_id,
            'data_type': data_type,
            'purpose': purpose.value,
            'collection_date': datetime.now(),
            'data_fields': list(data_content.keys()),
            'retention_policy': self.retention_policies.get(data_type),
            'deletion_scheduled': False,
            'deleted': False
        }
        
        self.data_inventory[user_id].append(collection_record)
        
        return record_id
    
    def check_purpose_compliance(self, user_id: str, data_type: str, 
                               requested_purpose: PurposeLimitation) -> Dict[str, any]:
        """Check if data can be used for the requested purpose"""
        
        if user_id not in self.data_inventory:
            return {
                'compliant': False,
                'reason': 'No data records found for user'
            }
        
        user_records = self.data_inventory[user_id]
        relevant_records = [r for r in user_records if r['data_type'] == data_type and not r['deleted']]
        
        if not relevant_records:
            return {
                'compliant': False,
                'reason': f'No active {data_type} records found'
            }
        
        # Check if any record allows this purpose
        allowed_purposes = []
        for record in relevant_records:
            original_purpose = PurposeLimitation(record['purpose'])
            allowed_purposes.append(original_purpose)
            
            # Define compatible purposes
            compatible_purposes = self._get_compatible_purposes(original_purpose)
            
            if requested_purpose in compatible_purposes:
                return {
                    'compliant': True,
                    'original_purpose': original_purpose.value,
                    'requested_purpose': requested_purpose.value,
                    'record_id': record['record_id']
                }
        
        return {
            'compliant': False,
            'reason': f'Purpose {requested_purpose.value} not compatible with collection purposes: {[p.value for p in allowed_purposes]}'
        }
    
    def schedule_data_deletion(self, user_id: str = None) -> Dict[str, any]:
        """Schedule data for deletion based on retention policies"""
        
        deletion_schedule = []
        
        users_to_check = [user_id] if user_id else self.data_inventory.keys()
        
        for uid in users_to_check:
            if uid not in self.data_inventory:
                continue
            
            user_records = self.data_inventory[uid]
            
            for record in user_records:
                if record['deleted'] or record['deletion_scheduled']:
                    continue
                
                retention_policy = record['retention_policy']
                if retention_policy and retention_policy.is_deletion_due(record['collection_date']):
                    record['deletion_scheduled'] = True
                    
                    deletion_schedule.append({
                        'user_id': uid,
                        'record_id': record['record_id'],
                        'data_type': record['data_type'],
                        'collection_date': record['collection_date'].isoformat(),
                        'deletion_due_date': retention_policy.calculate_deletion_date(record['collection_date']).isoformat(),
                        'legal_basis': retention_policy.legal_basis
                    })
        
        return {
            'deletion_scheduled_count': len(deletion_schedule),
            'deletion_schedule': deletion_schedule
        }
    
    def execute_data_deletion(self, record_ids: List[str]) -> Dict[str, any]:
        """Execute scheduled data deletions"""
        
        deleted_records = []
        not_found_records = []
        
        for record_id in record_ids:
            found = False
            
            for user_id, user_records in self.data_inventory.items():
                for record in user_records:
                    if record['record_id'] == record_id and record['deletion_scheduled']:
                        record['deleted'] = True
                        record['deletion_date'] = datetime.now()
                        
                        deleted_records.append({
                            'record_id': record_id,
                            'user_id': user_id,
                            'data_type': record['data_type'],
                            'deletion_date': record['deletion_date'].isoformat()
                        })
                        
                        found = True
                        break
                
                if found:
                    break
            
            if not found:
                not_found_records.append(record_id)
        
        return {
            'deleted_count': len(deleted_records),
            'deleted_records': deleted_records,
            'not_found_records': not_found_records
        }
    
    def get_data_inventory_report(self, user_id: str) -> Dict[str, any]:
        """Generate data inventory report for user"""
        
        if user_id not in self.data_inventory:
            return {
                'user_id': user_id,
                'total_records': 0,
                'active_records': [],
                'scheduled_deletions': [],
                'deleted_records': []
            }
        
        user_records = self.data_inventory[user_id]
        
        active_records = []
        scheduled_deletions = []
        deleted_records = []
        
        for record in user_records:
            record_summary = {
                'record_id': record['record_id'],
                'data_type': record['data_type'],
                'purpose': record['purpose'],
                'collection_date': record['collection_date'].isoformat(),
                'data_fields': record['data_fields']
            }
            
            if record['deleted']:
                record_summary['deletion_date'] = record.get('deletion_date', '').isoformat() if record.get('deletion_date') else ''
                deleted_records.append(record_summary)
            elif record['deletion_scheduled']:
                retention_policy = record['retention_policy']
                if retention_policy:
                    record_summary['scheduled_deletion_date'] = retention_policy.calculate_deletion_date(record['collection_date']).isoformat()
                scheduled_deletions.append(record_summary)
            else:
                retention_policy = record['retention_policy']
                if retention_policy:
                    record_summary['retention_until'] = retention_policy.calculate_deletion_date(record['collection_date']).isoformat()
                    record_summary['retention_policy'] = retention_policy.legal_basis
                active_records.append(record_summary)
        
        return {
            'user_id': user_id,
            'total_records': len(user_records),
            'active_records': active_records,
            'scheduled_deletions': scheduled_deletions,
            'deleted_records': deleted_records,
            'report_generated': datetime.now().isoformat()
        }
    
    def _get_compatible_purposes(self, original_purpose: PurposeLimitation) -> List[PurposeLimitation]:
        """Define which purposes are compatible with each other"""
        
        # Define purpose compatibility matrix
        compatibility_matrix = {
            PurposeLimitation.ACCOUNT_MANAGEMENT: [
                PurposeLimitation.ACCOUNT_MANAGEMENT,
                PurposeLimitation.SECURITY
            ],
            PurposeLimitation.SERVICE_DELIVERY: [
                PurposeLimitation.SERVICE_DELIVERY,
                PurposeLimitation.SECURITY
            ],
            PurposeLimitation.SECURITY: [
                PurposeLimitation.SECURITY,
                PurposeLimitation.LEGAL_COMPLIANCE
            ],
            PurposeLimitation.ANALYTICS: [
                PurposeLimitation.ANALYTICS
            ],
            PurposeLimitation.MARKETING: [
                PurposeLimitation.MARKETING
            ],
            PurposeLimitation.LEGAL_COMPLIANCE: [
                PurposeLimitation.LEGAL_COMPLIANCE,
                PurposeLimitation.SECURITY
            ]
        }
        
        return compatibility_matrix.get(original_purpose, [original_purpose])

# Demonstration of purpose limitation and retention
def demonstrate_purpose_limitation_and_retention():
    """Demonstrate purpose limitation and data retention management"""
    
    print("=== Purpose Limitation and Data Retention Demo ===")
    
    retention_manager = DataRetentionManager()
    user_id = "student_67890"
    
    # Step 1: Record data collection for different purposes
    print("1. Recording data collection for different purposes...")
    
    # Collect account data
    account_record_id = retention_manager.record_data_collection(
        user_id,
        'account_data',
        PurposeLimitation.ACCOUNT_MANAGEMENT,
        {'username': 'student67890', 'email': 'student@school.edu', 'password_hash': 'hashed'}
    )
    
    # Collect analytics data
    analytics_record_id = retention_manager.record_data_collection(
        user_id,
        'usage_analytics',
        PurposeLimitation.ANALYTICS,
        {'page_views': 150, 'feature_usage': {'login': 45, 'homework': 30}}
    )
    
    # Collect marketing data
    marketing_record_id = retention_manager.record_data_collection(
        user_id,
        'marketing_data',
        PurposeLimitation.MARKETING,
        {'email_preferences': 'weekly', 'interests': ['math', 'science']}
    )
    
    print(f"Recorded account data: {account_record_id}")
    print(f"Recorded analytics data: {analytics_record_id}")
    print(f"Recorded marketing data: {marketing_record_id}")
    
    # Step 2: Test purpose limitation compliance
    print("\n2. Testing purpose limitation compliance...")
    
    test_scenarios = [
        ('account_data', PurposeLimitation.ACCOUNT_MANAGEMENT, "User profile display"),
        ('account_data', PurposeLimitation.SECURITY, "Security audit"),
        ('account_data', PurposeLimitation.MARKETING, "Email promotion"),
        ('usage_analytics', PurposeLimitation.ANALYTICS, "Service improvement"),
        ('usage_analytics', PurposeLimitation.MARKETING, "Behavioral targeting")
    ]
    
    for data_type, purpose, description in test_scenarios:
        compliance_check = retention_manager.check_purpose_compliance(user_id, data_type, purpose)
        status = "✅ COMPLIANT" if compliance_check['compliant'] else "❌ NON-COMPLIANT"
        print(f"  {description}: {status}")
        if not compliance_check['compliant']:
            print(f"    Reason: {compliance_check['reason']}")
    
    # Step 3: Generate data inventory report
    print("\n3. Data inventory report...")
    
    inventory_report = retention_manager.get_data_inventory_report(user_id)
    
    print(f"Total records: {inventory_report['total_records']}")
    print("Active records:")
    for record in inventory_report['active_records']:
        print(f"  {record['data_type']} (Purpose: {record['purpose']})")
        print(f"    Collected: {record['collection_date'][:10]}")
        print(f"    Retention until: {record.get('retention_until', 'N/A')[:10]}")
        print(f"    Legal basis: {record.get('retention_policy', 'Not specified')}")
    
    # Step 4: Simulate passage of time and check deletions
    print("\n4. Simulating data retention and deletion...")
    
    # For demo purposes, let's manually trigger deletion check
    deletion_schedule = retention_manager.schedule_data_deletion(user_id)
    
    print(f"Records scheduled for deletion: {deletion_schedule['deletion_scheduled_count']}")
    
    if deletion_schedule['deletion_schedule']:
        print("Deletion schedule:")
        for item in deletion_schedule['deletion_schedule']:
            print(f"  {item['data_type']}: Due {item['deletion_due_date'][:10]}")
            print(f"    Legal basis: {item['legal_basis']}")

```

### 4. Privacy Impact Assessments

**Privacy Impact Assessments (PIAs)** systematically evaluate how personal data processing activities affect individual privacy.

```python
from typing import Dict, List, Optional, Set
from datetime import datetime
from enum import Enum
import json

class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class DataSensitivity(Enum):
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    RESTRICTED = "restricted"

class PrivacyRisk:
    def __init__(self, risk_id: str, description: str, likelihood: RiskLevel, 
                 impact: RiskLevel, data_types_affected: List[str]):
        self.risk_id = risk_id
        self.description = description
        self.likelihood = likelihood
        self.impact = impact
        self.data_types_affected = data_types_affected
        self.overall_risk = self._calculate_overall_risk()
        self.mitigation_measures = []
        self.residual_risk = self.overall_risk
    
    def _calculate_overall_risk(self) -> RiskLevel:
        """Calculate overall risk based on likelihood and impact"""
        risk_matrix = {
            (RiskLevel.LOW, RiskLevel.LOW): RiskLevel.LOW,
            (RiskLevel.LOW, RiskLevel.MEDIUM): RiskLevel.LOW,
            (RiskLevel.LOW, RiskLevel.HIGH): RiskLevel.MEDIUM,
            (RiskLevel.LOW, RiskLevel.CRITICAL): RiskLevel.MEDIUM,
            (RiskLevel.MEDIUM, RiskLevel.LOW): RiskLevel.LOW,
            (RiskLevel.MEDIUM, RiskLevel.MEDIUM): RiskLevel.MEDIUM,
            (RiskLevel.MEDIUM, RiskLevel.HIGH): RiskLevel.HIGH,
            (RiskLevel.MEDIUM, RiskLevel.CRITICAL): RiskLevel.HIGH,
            (RiskLevel.HIGH, RiskLevel.LOW): RiskLevel.MEDIUM,
            (RiskLevel.HIGH, RiskLevel.MEDIUM): RiskLevel.HIGH,
            (RiskLevel.HIGH, RiskLevel.HIGH): RiskLevel.HIGH,
            (RiskLevel.HIGH, RiskLevel.CRITICAL): RiskLevel.CRITICAL,
            (RiskLevel.CRITICAL, RiskLevel.LOW): RiskLevel.MEDIUM,
            (RiskLevel.CRITICAL, RiskLevel.MEDIUM): RiskLevel.HIGH,
            (RiskLevel.CRITICAL, RiskLevel.HIGH): RiskLevel.CRITICAL,
            (RiskLevel.CRITICAL, RiskLevel.CRITICAL): RiskLevel.CRITICAL,
        }
        
        return risk_matrix.get((self.likelihood, self.impact), RiskLevel.HIGH)
    
    def add_mitigation_measure(self, measure: str, risk_reduction: RiskLevel):
        """Add mitigation measure and update residual risk"""
        self.mitigation_measures.append({
            'measure': measure,
            'risk_reduction': risk_reduction,
            'implemented': False
        })
        
        # Simplified residual risk calculation
        if risk_reduction == RiskLevel.HIGH and self.residual_risk in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
            if self.residual_risk == RiskLevel.CRITICAL:
                self.residual_risk = RiskLevel.HIGH
            else:
                self.residual_risk = RiskLevel.MEDIUM

class PrivacyImpactAssessment:
    def __init__(self, project_name: str, assessor: str):
        self.assessment_id = f"PIA_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.project_name = project_name
        self.assessor = assessor
        self.assessment_date = datetime.now()
        self.data_processing_activities = []
        self.identified_risks = []
        self.stakeholders = []
        self.legal_basis_analysis = {}
        self.consultation_required = False
    
    def add_data_processing_activity(self, activity_name: str, purpose: str,
                                   data_types: List[str], data_subjects: List[str],
                                   data_sources: List[str], data_recipients: List[str],
                                   retention_period: str, data_sensitivity: DataSensitivity):
        """Add data processing activity to assessment"""
        
        activity = {
            'activity_id': f"DPA_{len(self.data_processing_activities) + 1:03d}",
            'activity_name': activity_name,
            'purpose': purpose,
            'data_types': data_types,
            'data_subjects': data_subjects,
            'data_sources': data_sources,
            'data_recipients': data_recipients,
            'retention_period': retention_period,
            'data_sensitivity': data_sensitivity.value,
            'cross_border_transfers': False,
            'automated_decision_making': False
        }
        
        self.data_processing_activities.append(activity)
        
        # Automatically assess basic risks
        self._assess_activity_risks(activity)
        
        return activity['activity_id']
    
    def _assess_activity_risks(self, activity: Dict[str, any]):
        """Automatically assess privacy risks for processing activity"""
        
        # Risk 1: Data breach exposure
        if activity['data_sensitivity'] in ['confidential', 'restricted']:
            breach_risk = PrivacyRisk(
                f"BREACH_{activity['activity_id']}",
                f"Risk of data breach exposing {activity['data_sensitivity']} data in {activity['activity_name']}",
                RiskLevel.MEDIUM,
                RiskLevel.HIGH if activity['data_sensitivity'] == 'restricted' else RiskLevel.MEDIUM,
                activity['data_types']
            )
            self.identified_risks.append(breach_risk)
        
        # Risk 2: Unauthorized access
        if len(activity['data_recipients']) > 2:
            access_risk = PrivacyRisk(
                f"ACCESS_{activity['activity_id']}",
                f"Risk of unauthorized access due to multiple data recipients in {activity['activity_name']}",
                RiskLevel.MEDIUM,
                RiskLevel.MEDIUM,
                activity['data_types']
            )
            self.identified_risks.append(access_risk)
        
        # Risk 3: Data retention
        if 'indefinite' in activity['retention_period'].lower():
            retention_risk = PrivacyRisk(
                f"RETENTION_{activity['activity_id']}",
                f"Risk of excessive data retention in {activity['activity_name']}",
                RiskLevel.HIGH,
                RiskLevel.MEDIUM,
                activity['data_types']
            )
            self.identified_risks.append(retention_risk)
        
        # Risk 4: Purpose creep
        if 'marketing' in activity['purpose'].lower() and any('personal' in dt.lower() for dt in activity['data_types']):
            purpose_risk = PrivacyRisk(
                f"PURPOSE_{activity['activity_id']}",
                f"Risk of purpose creep in marketing activities for {activity['activity_name']}",
                RiskLevel.MEDIUM,
                RiskLevel.MEDIUM,
                activity['data_types']
            )
            self.identified_risks.append(purpose_risk)
    
    def assess_legal_basis(self, activity_id: str, proposed_legal_basis: str,
                          justification: str) -> Dict[str, any]:
        """Assess legal basis for processing activity"""
        
        valid_legal_bases = [
            'consent',
            'contract',
            'legal_obligation',
            'vital_interests',
            'public_task',
            'legitimate_interests'
        ]
        
        if proposed_legal_basis not in valid_legal_bases:
            return {
                'valid': False,
                'error': f"Invalid legal basis. Must be one of: {valid_legal_bases}"
            }
        
        # Find the activity
        activity = next((a for a in self.data_processing_activities if a['activity_id'] == activity_id), None)
        if not activity:
            return {
                'valid': False,
                'error': f"Activity {activity_id} not found"
            }
        
        # Assess appropriateness of legal basis
        assessment = self._evaluate_legal_basis_appropriateness(activity, proposed_legal_basis)
        
        self.legal_basis_analysis[activity_id] = {
            'proposed_legal_basis': proposed_legal_basis,
            'justification': justification,
            'assessment': assessment,
            'assessed_date': datetime.now().isoformat()
        }
        
        return {
            'valid': True,
            'assessment': assessment
        }
    
    def _evaluate_legal_basis_appropriateness(self, activity: Dict[str, any], 
                                            legal_basis: str) -> Dict[str, any]:
        """Evaluate if proposed legal basis is appropriate"""
        
        appropriateness = {
            'appropriate': True,
            'concerns': [],
            'recommendations': []
        }
        
        # Check for high-risk scenarios
        if activity['data_sensitivity'] == 'restricted':
            if legal_basis == 'legitimate_interests':
                appropriateness['concerns'].append(
                    "Legitimate interests may not be sufficient for restricted data"
                )
                appropriateness['recommendations'].append(
                    "Consider explicit consent or legal obligation"
                )
        
        # Check marketing activities
        if 'marketing' in activity['purpose'].lower():
            if legal_basis != 'consent':
                appropriateness['concerns'].append(
                    "Marketing activities typically require explicit consent"
                )
                appropriateness['recommendations'].append(
                    "Use consent as legal basis for marketing"
                )
        
        # Check sensitive data types
        sensitive_indicators = ['health', 'medical', 'financial', 'biometric', 'religious', 'political']
        has_sensitive_data = any(indicator in ' '.join(activity['data_types']).lower() 
                               for indicator in sensitive_indicators)
        
        if has_sensitive_data and legal_basis not in ['consent', 'legal_obligation', 'vital_interests']:
            appropriateness['concerns'].append(
                "Sensitive personal data typically requires explicit consent or legal obligation"
            )
            appropriateness['recommendations'].append(
                "Review legal basis for sensitive data processing"
            )
        
        appropriateness['appropriate'] = len(appropriateness['concerns']) == 0
        
        return appropriateness
    
    def add_mitigation_measures(self):
        """Add standard mitigation measures for identified risks"""
        
        for risk in self.identified_risks:
            if 'BREACH' in risk.risk_id:
                risk.add_mitigation_measure("Implement end-to-end encryption", RiskLevel.HIGH)
                risk.add_mitigation_measure("Regular security audits", RiskLevel.MEDIUM)
                risk.add_mitigation_measure("Access controls and authentication", RiskLevel.MEDIUM)
            
            elif 'ACCESS' in risk.risk_id:
                risk.add_mitigation_measure("Role-based access controls", RiskLevel.HIGH)
                risk.add_mitigation_measure("Audit logging of data access", RiskLevel.MEDIUM)
                risk.add_mitigation_measure("Regular access reviews", RiskLevel.MEDIUM)
            
            elif 'RETENTION' in risk.risk_id:
                risk.add_mitigation_measure("Implement automated data deletion", RiskLevel.HIGH)
                risk.add_mitigation_measure("Regular data retention reviews", RiskLevel.MEDIUM)
                risk.add_mitigation_measure("Data minimization policies", RiskLevel.MEDIUM)
            
            elif 'PURPOSE' in risk.risk_id:
                risk.add_mitigation_measure("Clear purpose documentation", RiskLevel.MEDIUM)
                risk.add_mitigation_measure("Staff training on purpose limitation", RiskLevel.MEDIUM)
                risk.add_mitigation_measure("Technical controls to prevent purpose creep", RiskLevel.HIGH)
    
    def determine_consultation_requirement(self) -> Dict[str, any]:
        """Determine if consultation with privacy authority is required"""
        
        high_risk_indicators = []
        
        # Check for high/critical risks
        critical_risks = [r for r in self.identified_risks if r.residual_risk == RiskLevel.CRITICAL]
        high_risks = [r for r in self.identified_risks if r.residual_risk == RiskLevel.HIGH]
        
        if critical_risks:
            high_risk_indicators.append(f"{len(critical_risks)} critical privacy risks identified")
        
        if len(high_risks) >= 3:
            high_risk_indicators.append(f"{len(high_risks)} high privacy risks identified")
        
        # Check for sensitive data processing
        sensitive_activities = []
        for activity in self.data_processing_activities:
            if activity['data_sensitivity'] == 'restricted':
                sensitive_activities.append(activity['activity_name'])
        
        if sensitive_activities:
            high_risk_indicators.append(f"Processing restricted data: {', '.join(sensitive_activities)}")
        
        # Check for automated decision making
        automated_activities = [a for a in self.data_processing_activities if a.get('automated_decision_making', False)]
        if automated_activities:
            high_risk_indicators.append("Automated decision making identified")
        
        self.consultation_required = len(high_risk_indicators) > 0
        
        return {
            'consultation_required': self.consultation_required,
            'risk_indicators': high_risk_indicators,
            'recommendation': 'Consult privacy authority before proceeding' if self.consultation_required else 'No consultation required'
        }
    
    def generate_assessment_report(self) -> Dict[str, any]:
        """Generate comprehensive PIA report"""
        
        # Calculate risk summary
        risk_summary = {
            'total_risks': len(self.identified_risks),
            'critical_risks': len([r for r in self.identified_risks if r.residual_risk == RiskLevel.CRITICAL]),
            'high_risks': len([r for r in self.identified_risks if r.residual_risk == RiskLevel.HIGH]),
            'medium_risks': len([r for r in self.identified_risks if r.residual_risk == RiskLevel.MEDIUM]),
            'low_risks': len([r for r in self.identified_risks if r.residual_risk == RiskLevel.LOW])
        }
        
        # Generate recommendations
        recommendations = []
        
        if risk_summary['critical_risks'] > 0:
            recommendations.append("Address critical privacy risks before project implementation")
        
        if risk_summary['high_risks'] > 2:
            recommendations.append("Implement comprehensive risk mitigation program")
        
        if self.consultation_required:
            recommendations.append("Consult with privacy authority before proceeding")
        
        # Check legal basis coverage
        activities_without_legal_basis = [
            a for a in self.data_processing_activities 
            if a['activity_id'] not in self.legal_basis_analysis
        ]
        
        if activities_without_legal_basis:
            recommendations.append("Complete legal basis analysis for all processing activities")
        
        return {
            'assessment_summary': {
                'assessment_id': self.assessment_id,
                'project_name': self.project_name,
                'assessor': self.assessor,
                'assessment_date': self.assessment_date.isoformat(),
                'activities_assessed': len(self.data_processing_activities),
                'consultation_required': self.consultation_required
            },
            'risk_summary': risk_summary,
            'processing_activities': self.data_processing_activities,
            'identified_risks': [
                {
                    'risk_id': r.risk_id,
                    'description': r.description,
                    'likelihood': r.likelihood.value,
                    'impact': r.impact.value,
                    'overall_risk': r.overall_risk.value,
                    'residual_risk': r.residual_risk.value,
                    'data_types_affected': r.data_types_affected,
                    'mitigation_measures': r.mitigation_measures
                }
                for r in self.identified_risks
            ],
            'legal_basis_analysis': self.legal_basis_analysis,
            'recommendations': recommendations,
            'next_steps': self._generate_next_steps()
        }
    
    def _generate_next_steps(self) -> List[str]:
        """Generate recommended next steps"""
        
        next_steps = []
        
        # Risk mitigation
        high_priority_risks = [r for r in self.identified_risks if r.residual_risk in [RiskLevel.HIGH, RiskLevel.CRITICAL]]
        if high_priority_risks:
            next_steps.append("Implement mitigation measures for high-priority privacy risks")
        
        # Legal basis
        if len(self.legal_basis_analysis) < len(self.data_processing_activities):
            next_steps.append("Complete legal basis assessment for all processing activities")
        
        # Consultation
        if self.consultation_required:
            next_steps.append("Schedule consultation with privacy authority")
        
        # Implementation
        next_steps.append("Update project design based on PIA findings")
        next_steps.append("Establish privacy monitoring and review procedures")
        
        return next_steps

# Demonstration of Privacy Impact Assessment
def demonstrate_privacy_impact_assessment():
    """Demonstrate comprehensive Privacy Impact Assessment"""
    
    print("=== Privacy Impact Assessment Demo ===")
    
    # Create PIA for student information system
    pia = PrivacyImpactAssessment("Student Information System v2.0", "Privacy Officer")
    
    print(f"Assessment ID: {pia.assessment_id}")
    print(f"Project: {pia.project_name}")
    
    # Add data processing activities
    print("\n1. Adding data processing activities...")
    
    # Activity 1: Student registration
    activity1_id = pia.add_data_processing_activity(
        "Student Registration",
        "Create and manage student accounts for educational services",
        ["name", "email", "date_of_birth", "student_id", "emergency_contact"],
        ["students", "parents", "guardians"],
        ["online_registration_form", "school_records"],
        ["teachers", "administrators", "IT_support"],
        "7 years after graduation",
        DataSensitivity.CONFIDENTIAL
    )
    
    # Activity 2: Learning analytics
    activity2_id = pia.add_data_processing_activity(
        "Learning Analytics",
        "Analyze student performance and engagement for educational improvement",
        ["assignment_scores", "time_spent", "interaction_patterns", "learning_preferences"],
        ["students"],
        ["learning_management_system", "assessment_tools"],
        ["teachers", "education_researchers", "analytics_team"],
        "3 years",
        DataSensitivity.INTERNAL
    )
    
    # Activity 3: Marketing communications
    activity3_id = pia.add_data_processing_activity(
        "Alumni Communications",
        "Send promotional materials and fundraising communications to alumni",
        ["name", "email", "graduation_year", "donation_history", "contact_preferences"],
        ["alumni"],
        ["student_records", "alumni_surveys"],
        ["marketing_team", "external_fundraising_consultants"],
        "indefinite (until consent withdrawn)",
        DataSensitivity.INTERNAL
    )
    
    print(f"Added activities: {activity1_id}, {activity2_id}, {activity3_id}")
    
    # Assess legal basis
    print("\n2. Assessing legal basis...")
    
    legal_assessments = [
        (activity1_id, "contract", "Necessary for providing educational services under enrollment contract"),
        (activity2_id, "legitimate_interests", "Legitimate interest in improving educational outcomes"),
        (activity3_id, "consent", "Marketing communications require explicit consent")
    ]
    
    for activity_id, legal_basis, justification in legal_assessments:
        assessment = pia.assess_legal_basis(activity_id, legal_basis, justification)
        if assessment['valid']:
            status = "✅ APPROPRIATE" if assessment['assessment']['appropriate'] else "⚠️ CONCERNS"
            print(f"  {activity_id}: {legal_basis} - {status}")
            if not assessment['assessment']['appropriate']:
                for concern in assessment['assessment']['concerns']:
                    print(f"    Concern: {concern}")
        else:
            print(f"  {activity_id}: ❌ INVALID - {assessment['error']}")
    
    # Add mitigation measures
    print("\n3. Adding mitigation measures...")
    pia.add_mitigation_measures()
    
    mitigation_count = sum(len(risk.mitigation_measures) for risk in pia.identified_risks)
    print(f"Added {mitigation_count} mitigation measures across {len(pia.identified_risks)} identified risks")
    
    # Check consultation requirement
    print("\n4. Checking consultation requirements...")
    consultation_result = pia.determine_consultation_requirement()
    
    print(f"Consultation required: {consultation_result['consultation_required']}")
    if consultation_result['risk_indicators']:
        print("Risk indicators:")
        for indicator in consultation_result['risk_indicators']:
            print(f"  - {indicator}")
    print(f"Recommendation: {consultation_result['recommendation']}")
    
    # Generate assessment report
    print("\n5. Generating assessment report...")
    
    report = pia.generate_assessment_report()
    
    print("Assessment Summary:")
    summary = report['assessment_summary']
    print(f"  Project: {summary['project_name']}")
    print(f"  Activities assessed: {summary['activities_assessed']}")
    print(f"  Consultation required: {summary['consultation_required']}")
    
    print("\nRisk Summary:")
    risk_summary = report['risk_summary']
    print(f"  Total risks: {risk_summary['total_risks']}")
    print(f"  Critical: {risk_summary['critical_risks']}, High: {risk_summary['high_risks']}")
    print(f"  Medium: {risk_summary['medium_risks']}, Low: {risk_summary['low_risks']}")
    
    print("\nKey Recommendations:")
    for i, rec in enumerate(report['recommendations'][:3], 1):
        print(f"  {i}. {rec}")
    
    print("\nNext Steps:")
    for i, step in enumerate(report['next_steps'][:3], 1):
        print(f"  {i}. {step}")

```

## GDPR and Privacy Law Fundamentals

The General Data Protection Regulation (GDPR) provides a comprehensive framework for data protection that influences privacy design worldwide.

```python
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from enum import Enum

class GDPRRights(Enum):
    ACCESS = "access"  # Right to access personal data
    RECTIFICATION = "rectification"  # Right to correct inaccurate data
    ERASURE = "erasure"  # Right to be forgotten
    RESTRICT_PROCESSING = "restrict_processing"  # Right to restrict processing
    DATA_PORTABILITY = "data_portability"  # Right to data portability
    OBJECT = "object"  # Right to object to processing
    WITHDRAW_CONSENT = "withdraw_consent"  # Right to withdraw consent

class RequestStatus(Enum):
    RECEIVED = "received"
    UNDER_REVIEW = "under_review"
    COMPLETED = "completed"
    REJECTED = "rejected"
    PARTIALLY_COMPLETED = "partially_completed"

class GDPRComplianceManager:
    def __init__(self):
        self.data_subject_requests = {}
        self.processing_records = {}
        self.consent_records = {}
        
        # Define response timeframes (GDPR requirements)
        self.response_timeframes = {
            GDPRRights.ACCESS: timedelta(days=30),
            GDPRRights.RECTIFICATION: timedelta(days=30),
            GDPRRights.ERASURE: timedelta(days=30),
            GDPRRights.RESTRICT_PROCESSING: timedelta(days=30),
            GDPRRights.DATA_PORTABILITY: timedelta(days=30),
            GDPRRights.OBJECT: timedelta(days=30),
            GDPRRights.WITHDRAW_CONSENT: timedelta(days=0)  # Immediate
        }
    
    def handle_data_subject_request(self, user_id: str, request_type: GDPRRights,
                                  details: str = "", identity_verified: bool = False) -> Dict[str, any]:
        """Handle data subject rights requests under GDPR"""
        
        request_id = f"DSR_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{user_id}"
        
        if not identity_verified:
            return {
                'success': False,
                'error': 'Identity verification required for data subject requests',
                'next_steps': 'Please provide identity verification documents'
            }
        
        # Calculate response deadline
        response_deadline = datetime.now() + self.response_timeframes[request_type]
        
        request_record = {
            'request_id': request_id,
            'user_id': user_id,
            'request_type': request_type.value,
            'details': details,
            'received_date': datetime.now(),
            'response_deadline': response_deadline,
            'status': RequestStatus.RECEIVED,
            'identity_verified': identity_verified,
            'processing_log': []
        }
        
        self.data_subject_requests[request_id] = request_record
        
        # Process the request based on type
        if request_type == GDPRRights.ACCESS:
            return self._process_access_request(request_record)
        elif request_type == GDPRRights.RECTIFICATION:
            return self._process_rectification_request(request_record)
        elif request_type == GDPRRights.ERASURE:
            return self._process_erasure_request(request_record)
        elif request_type == GDPRRights.DATA_PORTABILITY:
            return self._process_portability_request(request_record)
        elif request_type == GDPRRights.WITHDRAW_CONSENT:
            return self._process_consent_withdrawal(request_record)
        else:
            return self._process_generic_request(request_record)
    
    def _process_access_request(self, request_record: Dict[str, any]) -> Dict[str, any]:
        """Process subject access request (Article 15)"""
        
        user_id = request_record['user_id']
        
        # Simulate gathering user data from various systems
        collected_data = {
            'account_information': {
                'user_id': user_id,
                'registration_date': '2023-09-01',
                'last_login': '2024-09-17',
                'account_status': 'active'
            },
            'processing_purposes': [
                'Account management',
                'Service delivery',
                'Security monitoring'
            ],
            'data_categories': [
                'Identity data (name, email)',
                'Usage data (login history, preferences)',
                'Security data (IP addresses, device info)'
            ],
            'data_recipients': [
                'Internal staff (teachers, administrators)',
                'IT service providers',
                'Security monitoring services'
            ],
            'retention_periods': {
                'account_data': '7 years after account closure',
                'usage_data': '1 year',
                'security_logs': '6 months'
            },
            'data_sources': [
                'Direct collection (registration form)',
                'Automated collection (system logs)',
                'Third-party integration (single sign-on)'
            ]
        }
        
        # Update request status
        request_record['status'] = RequestStatus.COMPLETED
        request_record['completion_date'] = datetime.now()
        request_record['response_data'] = collected_data
        
        # Log processing
        request_record['processing_log'].append({
            'timestamp': datetime.now().isoformat(),
            'action': 'Data compiled for access request',
            'details': f"Collected data from {len(collected_data)} data categories"
        })
        
        return {
            'success': True,
            'request_id': request_record['request_id'],
            'status': 'completed',
            'response_data': collected_data,
            'completion_date': request_record['completion_date'].isoformat(),
            'delivery_method': 'secure_download_link'
        }
    
    def _process_erasure_request(self, request_record: Dict[str, any]) -> Dict[str, any]:
        """Process right to be forgotten request (Article 17)"""
        
        user_id = request_record['user_id']
        
        # Check if erasure is possible
        erasure_assessment = self._assess_erasure_eligibility(user_id)
        
        if not erasure_assessment['eligible']:
            request_record['status'] = RequestStatus.REJECTED
            request_record['rejection_reason'] = erasure_assessment['reason']
            
            return {
                'success': False,
                'request_id': request_record['request_id'],
                'status': 'rejected',
                'reason': erasure_assessment['reason'],
                'explanation': erasure_assessment['explanation']
            }
        
        # Perform erasure
        erasure_results = {
            'account_data': 'deleted',
            'usage_history': 'deleted',
            'comments_posts': 'anonymized',  # May need to retain for others
            'legal_records': 'retained',     # Legal obligation
            'security_logs': 'anonymized'    # Security purposes
        }
        
        request_record['status'] = RequestStatus.PARTIALLY_COMPLETED
        request_record['completion_date'] = datetime.now()
        request_record['erasure_results'] = erasure_results
        
        return {
            'success': True,
            'request_id': request_record['request_id'],
            'status': 'partially_completed',
            'erasure_results': erasure_results,
            'explanation': 'Some data retained due to legal obligations or legitimate interests'
        }
    
    def _process_portability_request(self, request_record: Dict[str, any]) -> Dict[str, any]:
        """Process data portability request (Article 20)"""
        
        user_id = request_record['user_id']
        
        # Extract portable data (data provided by user or generated through use)
        portable_data = {
            'personal_information': {
                'name': 'Student Name',
                'email': 'student@example.com',
                'preferences': {
                    'language': 'en',
                    'timezone': 'UTC',
                    'notifications': True
                }
            },
            'user_generated_content': {
                'assignments': [
                    {'title': 'Math Assignment 1', 'submitted_date': '2024-01-15', 'score': 85},
                    {'title': 'Science Project', 'submitted_date': '2024-02-20', 'score': 92}
                ],
                'forum_posts': [
                    {'date': '2024-03-01', 'content': 'Great lesson on quantum physics!'}
                ]
            },
            'usage_data': {
                'course_completions': ['Mathematics 101', 'Physics 201'],
                'login_history': ['2024-09-01', '2024-09-15', '2024-09-17'],
                'feature_usage': {
                    'assignments': 45,
                    'forums': 12,
                    'grades': 38
                }
            }
        }
        
        # Generate portable format (JSON)
        import json
        portable_json = json.dumps(portable_data, indent=2, default=str)
        
        request_record['status'] = RequestStatus.COMPLETED
        request_record['completion_date'] = datetime.now()
        request_record['portable_data'] = portable_data
        
        return {
            'success': True,
            'request_id': request_record['request_id'],
            'status': 'completed',
            'format': 'JSON',
            'size_bytes': len(portable_json.encode('utf-8')),
            'download_instructions': 'Data package will be available via secure link for 30 days'
        }
    
    def _process_consent_withdrawal(self, request_record: Dict[str, any]) -> Dict[str, any]:
        """Process consent withdrawal (Article 7)"""
        
        user_id = request_record['user_id']
        
        # Find all consent-based processing
        consent_processing = {
            'marketing_emails': {'status': 'withdrawn', 'processing_stopped': True},
            'analytics_tracking': {'status': 'withdrawn', 'processing_stopped': True},
            'personalization': {'status': 'withdrawn', 'processing_stopped': True}
        }
        
        # Immediate processing (no delay allowed)
        request_record['status'] = RequestStatus.COMPLETED
        request_record['completion_date'] = datetime.now()
        request_record['processing_stopped'] = consent_processing
        
        return {
            'success': True,
            'request_id': request_record['request_id'],
            'status': 'completed',
            'processing_stopped': list(consent_processing.keys()),
            'effective_immediately': True,
            'data_retention': 'Consent-based data will be deleted within 30 days'
        }
    
    def _assess_erasure_eligibility(self, user_id: str) -> Dict[str, any]:
        """Assess whether data can be erased under GDPR Article 17"""
        
        # Check grounds for retaining data
        retention_grounds = []
        
        # Check for legal obligations
        legal_obligations = self._check_legal_obligations(user_id)
        if legal_obligations:
            retention_grounds.extend(legal_obligations)
        
        # Check for legitimate interests
        legitimate_interests = self._check_legitimate_interests(user_id)
        if legitimate_interests:
            retention_grounds.extend(legitimate_interests)
        
        # Check for public interest
        public_interest = self._check_public_interest(user_id)
        if public_interest:
            retention_grounds.extend(public_interest)
        
        if retention_grounds:
            return {
                'eligible': False,
                'reason': 'Data retention required',
                'explanation': f"Data must be retained due to: {', '.join(retention_grounds)}",
                'grounds': retention_grounds
            }
        
        return {
            'eligible': True,
            'reason': 'No grounds for retention',
            'explanation': 'Data can be erased as requested'
        }
    
    def _check_legal_obligations(self, user_id: str) -> List[str]:
        """Check for legal obligations to retain data"""
        obligations = []
        
        # Example: Educational records retention
        obligations.append("Educational records retention (7 years)")
        
        # Example: Financial records
        obligations.append("Financial transaction records (tax law)")
        
        return obligations
    
    def _check_legitimate_interests(self, user_id: str) -> List[str]:
        """Check for legitimate interests in retaining data"""
        interests = []
        
        # Example: Fraud prevention
        interests.append("Fraud prevention and security")
        
        # Example: Academic integrity
        interests.append("Academic integrity enforcement")
        
        return interests
    
    def _check_public_interest(self, user_id: str) -> List[str]:
        """Check for public interest in retaining data"""
        # For educational institutions, limited public interest grounds
        return []
    
    def _process_generic_request(self, request_record: Dict[str, any]) -> Dict[str, any]:
        """Process other types of requests"""
        
        request_record['status'] = RequestStatus.UNDER_REVIEW
        request_record['processing_log'].append({
            'timestamp': datetime.now().isoformat(),
            'action': 'Request under review',
            'details': 'Manual review required for this request type'
        })
        
        return {
            'success': True,
            'request_id': request_record['request_id'],
            'status': 'under_review',
            'estimated_completion': (datetime.now() + timedelta(days=15)).isoformat(),
            'next_steps': 'Request is being reviewed by privacy team'
        }
    
    def generate_gdpr_compliance_report(self) -> Dict[str, any]:
        """Generate GDPR compliance status report"""
        
        total_requests = len(self.data_subject_requests)
        completed_requests = len([r for r in self.data_subject_requests.values() if r['status'] == RequestStatus.COMPLETED])
        
        # Calculate response times
        response_times = []
        for request in self.data_subject_requests.values():
            if request['status'] == RequestStatus.COMPLETED:
                response_time = (request['completion_date'] - request['received_date']).days
                response_times.append(response_time)
        
        avg_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        # Check for overdue requests
        overdue_requests = []
        for request in self.data_subject_requests.values():
            if (request['status'] not in [RequestStatus.COMPLETED, RequestStatus.REJECTED] and 
                datetime.now() > request['response_deadline']):
                overdue_requests.append(request['request_id'])
        
        return {
            'report_date': datetime.now().isoformat(),
            'request_statistics': {
                'total_requests': total_requests,
                'completed_requests': completed_requests,
                'completion_rate': (completed_requests / total_requests * 100) if total_requests > 0 else 0,
                'average_response_days': round(avg_response_time, 1),
                'overdue_requests': len(overdue_requests)
            },
            'request_types': {
                request_type.value: len([r for r in self.data_subject_requests.values() 
                                       if r['request_type'] == request_type.value])
                for request_type in GDPRRights
            },
            'compliance_status': {
                'gdpr_compliant': len(overdue_requests) == 0,
                'areas_of_concern': overdue_requests,
                'recommendations': self._generate_compliance_recommendations(overdue_requests, avg_response_time)
            }
        }
    
    def _generate_compliance_recommendations(self, overdue_requests: List[str], 
                                           avg_response_time: float) -> List[str]:
        """Generate recommendations for improving GDPR compliance"""
        
        recommendations = []
        
        if overdue_requests:
            recommendations.append("Address overdue data subject requests immediately")
        
        if avg_response_time > 25:  # Close to 30-day limit
            recommendations.append("Improve response time for data subject requests")
        
        recommendations.append("Regular staff training on GDPR procedures")
        recommendations.append("Automated monitoring of request deadlines")
        recommendations.append("Regular privacy impact assessments for new projects")
        
        return recommendations

# Demonstration of GDPR compliance
def demonstrate_gdpr_compliance():
    """Demonstrate GDPR compliance management"""
    
    print("=== GDPR Compliance Demo ===")
    
    gdpr_manager = GDPRComplianceManager()
    
    # Simulate various data subject requests
    print("1. Processing data subject requests...")
    
    test_requests = [
        ("user_001", GDPRRights.ACCESS, "Request copy of all my personal data"),
        ("user_002", GDPRRights.ERASURE, "Please delete my account and all associated data"),
        ("user_003", GDPRRights.DATA_PORTABILITY, "Export my data to transfer to another service"),
        ("user_004", GDPRRights.WITHDRAW_CONSENT, "Withdraw consent for marketing emails")
    ]
    
    for user_id, request_type, details in test_requests:
        result = gdpr_manager.handle_data_subject_request(
            user_id, request_type, details, identity_verified=True
        )
        
        status_icon = "✅" if result['success'] else "❌"
        print(f"  {status_icon} {request_type.value} for {user_id}: {result.get('status', 'failed')}")
        
        if not result['success']:
            print(f"    Error: {result.get('error', 'Unknown error')}")
    
    # Generate compliance report
    print("\n2. GDPR compliance report...")
    
    compliance_report = gdpr_manager.generate_gdpr_compliance_report()
    
    print("Request Statistics:")
    stats = compliance_report['request_statistics']
    print(f"  Total requests: {stats['total_requests']}")
    print(f"  Completion rate: {stats['completion_rate']:.1f}%")
    print(f"  Average response time: {stats['average_response_days']} days")
    print(f"  Overdue requests: {stats['overdue_requests']}")
    
    print("\nRequest Types:")
    for request_type, count in compliance_report['request_types'].items():
        if count > 0:
            print(f"  {request_type}: {count}")
    
    compliance_status = compliance_report['compliance_status']
    compliance_icon = "✅" if compliance_status['gdpr_compliant'] else "⚠️"
    print(f"\nGDPR Compliant: {compliance_icon} {compliance_status['gdpr_compliant']}")
    
    if compliance_status['recommendations']:
        print("\nRecommendations:")
        for i, rec in enumerate(compliance_status['recommendations'][:3], 1):
            print(f"  {i}. {rec}")

## Summary

**Privacy by Design creates sustainable, trustworthy systems through proactive privacy protection:**

**Data Minimization:**

- **Collect only necessary data** for specified purposes
- **Reject excessive data collection** during system design
- **Categorize data by sensitivity** and apply appropriate protections
- **Document collection rationale** for transparency and compliance

**Consent Management:**

- **Obtain explicit consent** for non-essential processing
- **Provide clear information** about data use and rights
- **Enable easy consent withdrawal** without service penalties
- **Maintain detailed consent records** for accountability

**Purpose Limitation and Retention:**

- **Use data only for declared purposes** to prevent scope creep
- **Implement automated deletion** based on retention policies
- **Regular review and cleanup** of unnecessary data
- **Legal basis assessment** for all processing activities

**Privacy Impact Assessments:**

- **Systematic privacy risk evaluation** for new projects
- **Early identification and mitigation** of privacy risks
- **Documentation of design decisions** and their privacy implications
- **Stakeholder consultation** when high risks are identified

**GDPR Compliance:**

- **Robust data subject rights procedures** with defined response times
- **Clear legal basis** for all processing activities
- **Comprehensive documentation** of processing activities
- **Regular compliance monitoring** and improvement

**Implementation best practices:**

- **Privacy by default**: Most privacy-friendly settings as standard
- **Technical and organizational measures**: Both code and procedures matter
- **Regular training**: Keep staff updated on privacy requirements
- **Continuous improvement**: Regular review and enhancement of privacy protections

Understanding and implementing Privacy by Design principles creates software systems that respect user privacy, comply with legal requirements, and build lasting trust with users while maintaining functional excellence.

!!! tip "Cross-reference"
    These privacy principles build on the input validation techniques from Section 16.1 and prepare you for implementing secure system architectures in Chapter 17.

!!! tip "Next Section"
    In Chapter 17, we'll explore secure API design and system architecture, applying both security and privacy principles to build comprehensive, trustworthy systems.
