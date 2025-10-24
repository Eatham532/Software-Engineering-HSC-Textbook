---
title: "25.3 Algorithms, documentation, and resources"
---

# 25.3 Algorithms, documentation, and resources

## Why it matters

Professional software development requires maintaining comprehensive documentation, properly citing external resources, and understanding how back-end systems contribute to overall application success. Good documentation ensures knowledge transfer, facilitates maintenance, and supports team collaboration. Understanding back-end engineering helps developers build scalable, secure, and maintainable systems that can handle real-world demands.

## Concepts

### Maintaining development artefacts

Development artefacts are the documents, diagrams, and resources created throughout the software development lifecycle. Maintaining these artefacts ensures project knowledge is preserved and accessible to current and future team members.

Key types of development artefacts:

- **Requirements documentation**: User stories, acceptance criteria, functional specifications

- **Design documents**: System architecture, database schemas, API specifications

- **Code documentation**: Comments, README files, API documentation

- **Testing artefacts**: Test plans, test cases, bug reports, test results

/// tab | Documentation Strategy
**Artefact Maintenance Principles**:

1. **Living documentation**: Keep documents current with code changes

2. **Version control**: Track changes and maintain document history

3. **Accessibility**: Ensure team members can find and understand documents

4. **Standardisation**: Use consistent formats and templates

5. **Automation**: Generate documentation from code where possible

**Documentation Lifecycle**:

- **Creation**: Initial documentation during planning and design

- **Updates**: Regular updates as requirements and implementation evolve

- **Review**: Periodic review for accuracy and completeness

- **Archive**: Preserve historical versions for reference
///

/// tab | Python Documentation Tools

```py
from datetime import date
from enum import Enum
import json

class ArtefactType(Enum):
    REQUIREMENTS = "requirements"
    DESIGN = "design"
    CODE_DOCS = "code_documentation"
    TESTING = "testing"
    API_SPEC = "api_specification"

class ArtefactStatus(Enum):
    DRAFT = "draft"
    UNDER_REVIEW = "under_review"
    APPROVED = "approved"
    OUTDATED = "outdated"

class DevelopmentArtefact:
    def __init__(self, title, artefact_type, author, file_path):
        self.title = title
        self.artefact_type = artefact_type
        self.author = author
        self.file_path = file_path
        self.created_date = date.today()
        self.last_updated = date.today()
        self.status = ArtefactStatus.DRAFT
        self.version = "1.0"
        self.reviewers = []
        self.dependencies = []
        self.tags = []
    
    def update_artefact(self, updater, changes_summary):
        """Update artefact with new information"""
        self.last_updated = date.today()
        
        ## Increment version number

        major, minor = map(int, self.version.split('.'))
        self.version = f"{major}.{minor + 1}"
        
        update_log = {
            "date": self.last_updated.isoformat(),
            "updater": updater,
            "changes": changes_summary,
            "version": self.version
        }
        
        return update_log
    
    def add_reviewer(self, reviewer_name):
        self.reviewers.append(reviewer_name)
    
    def mark_approved(self):
        self.status = ArtefactStatus.APPROVED
    
    def check_freshness(self, max_age_days=30):
        """Check if artefact might be outdated"""
        days_since_update = (date.today() - self.last_updated).days
        if days_since_update > max_age_days:
            self.status = ArtefactStatus.OUTDATED
            return False
        return True
    
    def get_summary(self):
        return {
            "title": self.title,
            "type": self.artefact_type.value,
            "author": self.author,
            "version": self.version,
            "status": self.status.value,
            "last_updated": self.last_updated.isoformat(),
            "days_since_update": (date.today() - self.last_updated).days
        }

class ArtefactManager:
    def __init__(self):
        self.artefacts = []
        self.artefact_index = {}
    
    def add_artefact(self, artefact):
        self.artefacts.append(artefact)
        self.artefact_index[artefact.title] = artefact
    
    def find_artefacts_by_type(self, artefact_type):
        return [a for a in self.artefacts if a.artefact_type == artefact_type]
    
    def find_outdated_artefacts(self, max_age_days=30):
        outdated = []
        for artefact in self.artefacts:
            if not artefact.check_freshness(max_age_days):
                outdated.append(artefact)
        return outdated
    
    def generate_documentation_report(self):
        total_artefacts = len(self.artefacts)
        by_type = {}
        by_status = {}
        
        for artefact in self.artefacts:

            ## Count by type

            artefact_type = artefact.artefact_type.value
            by_type[artefact_type] = by_type.get(artefact_type, 0) + 1
            
            ## Count by status

            status = artefact.status.value
            by_status[status] = by_status.get(status, 0) + 1
        
        outdated_count = len(self.find_outdated_artefacts())
        
        report = {
            "total_artefacts": total_artefacts,
            "by_type": by_type,
            "by_status": by_status,
            "outdated_artefacts": outdated_count,
            "documentation_health": "Good" if outdated_count < total_artefacts * 0.2 else "Needs Attention"
        }
        
        return report

## Example artefact management

manager = ArtefactManager()

## Create sample artefacts

requirements_doc = DevelopmentArtefact(
    "User Authentication Requirements",
    ArtefactType.REQUIREMENTS,
    "Sarah Johnson",
    "/docs/requirements/authentication.md"
)

api_spec = DevelopmentArtefact(
    "Student Portal API Specification",
    ArtefactType.API_SPEC,
    "Mike Chen",
    "/docs/api/student-portal-api.yaml"
)

## Add to manager

manager.add_artefact(requirements_doc)
manager.add_artefact(api_spec)

## Update an artefact

update_log = requirements_doc.update_artefact(
    "Sarah Johnson", 
    "Added multi-factor authentication requirements"
)

## Generate report

report = manager.generate_documentation_report()
print(f"Documentation Report: {report}")

```

///

### Citing sources and libraries

Proper attribution of external resources, libraries, and references is essential for legal compliance, knowledge sharing, and maintaining project integrity.

Citation best practices:

- **Library dependencies**: Document all external libraries with versions and licenses

- **Code attribution**: Credit original authors when adapting existing code

- **Reference sources**: Cite technical articles, documentation, and research used

- **License compliance**: Ensure all dependencies meet project license requirements

/// tab | Dependency Management
**Library Documentation Format**:

For each external library, document:

- Library name and version

- Purpose and functionality used

- License type and restrictions

- Installation and configuration notes

- Security considerations and update schedule

**Sample dependency documentation**:

```
React v18.2.0
Purpose: Frontend user interface framework
License: MIT License
Security: Regular updates for security patches
Used for: Component-based UI development
Installation: npm install react@18.2.0

```

///

/// tab | Python Dependency Tracker

```py

from datetime import date
from enum import Enum
import json

class LicenseType(Enum):
    MIT = "MIT"
    GPL = "GPL"
    APACHE = "Apache-2.0"
    BSD = "BSD"
    PROPRIETARY = "Proprietary"
    UNKNOWN = "Unknown"

class SecurityRisk(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class Dependency:
    def __init__(self, name, version, license_type, purpose):
        self.name = name
        self.version = version
        self.license_type = license_type
        self.purpose = purpose
        self.installation_date = date.today()
        self.last_updated = date.today()
        self.security_risk = SecurityRisk.LOW
        self.update_available = False
        self.vulnerabilities = []
        self.attribution_text = ""
    
    def set_attribution(self, attribution_text):
        self.attribution_text = attribution_text
    
    def add_vulnerability(self, vulnerability_id, severity, description):
        vulnerability = {
            "id": vulnerability_id,
            "severity": severity,
            "description": description,
            "discovered_date": date.today(),
            "resolved": False
        }
        self.vulnerabilities.append(vulnerability)
        
        ## Update security risk based on severity

        if severity == "critical":
            self.security_risk = SecurityRisk.CRITICAL
        elif severity == "high" and self.security_risk != SecurityRisk.CRITICAL:
            self.security_risk = SecurityRisk.HIGH
    
    def mark_update_available(self, new_version):
        self.update_available = True
        self.new_version = new_version
    
    def update_dependency(self, new_version):
        self.version = new_version
        self.last_updated = date.today()
        self.update_available = False

        ## Reset vulnerabilities after update

        self.vulnerabilities = []
        self.security_risk = SecurityRisk.LOW
    
    def get_license_compatibility(self, project_license):
        """Check if dependency license is compatible with project license"""
        compatible_combinations = {
            LicenseType.MIT: [LicenseType.MIT, LicenseType.BSD, LicenseType.APACHE],
            LicenseType.GPL: [LicenseType.GPL],
            LicenseType.APACHE: [LicenseType.MIT, LicenseType.BSD, LicenseType.APACHE],
            LicenseType.BSD: [LicenseType.MIT, LicenseType.BSD, LicenseType.APACHE],
            LicenseType.PROPRIETARY: []  # Requires individual review
        }
        
        if project_license in compatible_combinations:
            return self.license_type in compatible_combinations[project_license]
        return False

class DependencyManager:
    def __init__(self, project_license):
        self.project_license = project_license
        self.dependencies = []
        self.dependency_index = {}
    
    def add_dependency(self, dependency):
        self.dependencies.append(dependency)
        self.dependency_index[dependency.name] = dependency
        
        ## Check license compatibility

        if not dependency.get_license_compatibility(self.project_license):
            print(f"Warning: {dependency.name} license may not be compatible with project")
    
    def find_security_risks(self):
        """Find dependencies with security vulnerabilities"""
        risky_dependencies = []
        for dep in self.dependencies:
            if dep.security_risk in [SecurityRisk.HIGH, SecurityRisk.CRITICAL]:
                risky_dependencies.append(dep)
        return risky_dependencies
    
    def find_outdated_dependencies(self):
        """Find dependencies with available updates"""
        return [dep for dep in self.dependencies if dep.update_available]
    
    def generate_attribution_text(self):
        """Generate attribution text for all dependencies"""
        attribution = "Third-party libraries and attributions:\\n\\n"
        
        for dep in sorted(self.dependencies, key=lambda x: x.name):
            attribution += f"{dep.name} v{dep.version}\\n"
            attribution += f"License: {dep.license_type.value}\\n"
            attribution += f"Purpose: {dep.purpose}\\n"
            if dep.attribution_text:
                attribution += f"Attribution: {dep.attribution_text}\\n"
            attribution += "\\n"
        
        return attribution
    
    def generate_dependency_report(self):
        total_deps = len(self.dependencies)
        security_risks = len(self.find_security_risks())
        outdated = len(self.find_outdated_dependencies())
        
        license_breakdown = {}
        for dep in self.dependencies:
            license_type = dep.license_type.value
            license_breakdown[license_type] = license_breakdown.get(license_type, 0) + 1
        
        return {
            "total_dependencies": total_deps,
            "security_risks": security_risks,
            "outdated_dependencies": outdated,
            "license_breakdown": license_breakdown,
            "project_license": self.project_license.value
        }

## Example dependency management

dep_manager = DependencyManager(LicenseType.MIT)

## Add dependencies

react_dep = Dependency("React", "18.2.0", LicenseType.MIT, "Frontend UI framework")
express_dep = Dependency("Express", "4.18.0", LicenseType.MIT, "Backend web server")
mysql_dep = Dependency("MySQL", "8.0.33", LicenseType.GPL, "Database system")

dep_manager.add_dependency(react_dep)
dep_manager.add_dependency(express_dep)
dep_manager.add_dependency(mysql_dep)

## Add vulnerability to a dependency

express_dep.add_vulnerability(
    "CVE-2023-1234",
    "medium",
    "Potential denial of service in request parsing"
)

## Generate reports

report = dep_manager.generate_dependency_report()
print(f"Dependency Report: {report}")

attribution = dep_manager.generate_attribution_text()
print("Generated attribution text:")
print(attribution[:200] + "...")  # Show first 200 characters

```

///

### Back-end engineering contributions

Back-end engineering provides the foundation that enables front-end applications to function effectively. Understanding back-end contributions helps developers appreciate the full software stack and make informed architectural decisions.

Key back-end contributions to software success:

- **Data management**: Efficient storage, retrieval, and processing of application data

- **Business logic**: Core functionality and rules that drive application behaviour

- **Security**: Authentication, authorisation, and data protection mechanisms

- **Performance**: Optimisation for scalability, speed, and reliability

- **Integration**: APIs and services that connect different system components

```kroki-plantuml

@startuml
skinparam monochrome true
skinparam shadowing false

package "Front-end" {
  [User Interface]
  [Client Logic]
}

package "Back-end" {
  [API Gateway]
  [Authentication Service]
  [Business Logic]
  [Data Access Layer]
}

package "Infrastructure" {
  [Database]
  [File Storage]
  [Cache]
  [Message Queue]
}

[User Interface] --> [API Gateway] : HTTP Requests
[API Gateway] --> [Authentication Service] : Verify User
[API Gateway] --> [Business Logic] : Process Requests
[Business Logic] --> [Data Access Layer] : Query Data
[Data Access Layer] --> [Database] : SQL/NoSQL
[Business Logic] --> [File Storage] : Store Files
[Business Logic] --> [Cache] : Fast Retrieval
[Business Logic] --> [Message Queue] : Async Tasks

@enduml

```

/// tab | Technology Stack
**Web Servers**:

- **Purpose**: Handle HTTP requests and serve responses

- **Examples**: Apache, Nginx, Express.js, Django

- **Considerations**: Performance, security, scalability

**Databases**:

- **Relational**: MySQL, PostgreSQL, SQL Server

- **NoSQL**: MongoDB, Redis, Cassandra

- **Selection factors**: Data structure, scalability needs, consistency requirements

**API Frameworks**:

- **REST APIs**: Express.js, Django REST Framework, Spring Boot

- **GraphQL**: Apollo Server, GraphQL Yoga

- **Real-time**: Socket.io, WebSocket APIs

**CI/CD Infrastructure**:

- **Version control**: Git, GitHub, GitLab

- **Build automation**: Jenkins, GitHub Actions, GitLab CI

- **Deployment**: Docker, Kubernetes, cloud platforms
///

/// tab | Python Back-end Simulator

```py

from datetime import datetime, timedelta
from enum import Enum
import hashlib
import json
import uuid

class ServerStatus(Enum):
    RUNNING = "running"
    STOPPED = "stopped"
    ERROR = "error"
    MAINTENANCE = "maintenance"

class DatabaseType(Enum):
    MYSQL = "mysql"
    POSTGRESQL = "postgresql"
    MONGODB = "mongodb"
    REDIS = "redis"

class BackendService:
    def __init__(self, name, service_type, port):
        self.name = name
        self.service_type = service_type
        self.port = port
        self.status = ServerStatus.STOPPED
        self.start_time = None
        self.requests_handled = 0
        self.error_count = 0
        self.health_checks = []
    
    def start_service(self):
        self.status = ServerStatus.RUNNING
        self.start_time = datetime.now()
        self.log_event(f"{self.name} service started on port {self.port}")
    
    def stop_service(self):
        self.status = ServerStatus.STOPPED
        self.start_time = None
        self.log_event(f"{self.name} service stopped")
    
    def handle_request(self, request_type, endpoint):
        if self.status != ServerStatus.RUNNING:
            self.error_count += 1
            return {"status": "error", "message": "Service not running"}
        
        self.requests_handled += 1
        response = {
            "status": "success",
            "service": self.name,
            "endpoint": endpoint,
            "timestamp": datetime.now().isoformat(),
            "request_id": str(uuid.uuid4())[:8]
        }
        
        self.log_event(f"Handled {request_type} request to {endpoint}")
        return response
    
    def perform_health_check(self):
        if self.status == ServerStatus.RUNNING:
            uptime = datetime.now() - self.start_time if self.start_time else timedelta(0)
            health_data = {
                "timestamp": datetime.now().isoformat(),
                "status": "healthy",
                "uptime_seconds": uptime.total_seconds(),
                "requests_handled": self.requests_handled,
                "error_rate": self.error_count / max(self.requests_handled, 1)
            }
        else:
            health_data = {
                "timestamp": datetime.now().isoformat(),
                "status": "unhealthy",
                "reason": f"Service is {self.status.value}"
            }
        
        self.health_checks.append(health_data)
        return health_data
    
    def log_event(self, message):
        timestamp = datetime.now().isoformat()
        print(f"[{timestamp}] {self.name}: {message}")

class Database:
    def __init__(self, name, db_type, connection_string):
        self.name = name
        self.db_type = db_type
        self.connection_string = connection_string
        self.status = ServerStatus.STOPPED
        self.connections = 0
        self.max_connections = 100
        self.query_count = 0
        self.data_size_mb = 0
    
    def connect(self):
        if self.connections < self.max_connections:
            self.connections += 1
            return {"status": "connected", "connection_id": str(uuid.uuid4())[:8]}
        return {"status": "error", "message": "Max connections reached"}
    
    def execute_query(self, query_type, table_name):
        if self.status != ServerStatus.RUNNING:
            return {"status": "error", "message": "Database not running"}
        
        self.query_count += 1
        execution_time = 0.1 if query_type == "SELECT" else 0.3  # Simulated times
        
        return {
            "status": "success",
            "query_type": query_type,
            "table": table_name,
            "execution_time_ms": execution_time * 1000,
            "query_id": str(uuid.uuid4())[:8]
        }
    
    def backup_database(self):
        backup_id = str(uuid.uuid4())[:8]
        backup_size = self.data_size_mb * 0.7  # Compressed backup
        
        return {
            "backup_id": backup_id,
            "size_mb": backup_size,
            "timestamp": datetime.now().isoformat(),
            "status": "completed"
        }

class APIGateway:
    def __init__(self):
        self.services = {}
        self.rate_limits = {}
        self.request_log = []
    
    def register_service(self, service):
        self.services[service.name] = service
        service.start_service()
    
    def route_request(self, client_ip, endpoint, method="GET"):

        ## Check rate limiting

        if not self.check_rate_limit(client_ip):
            return {"status": "error", "message": "Rate limit exceeded"}
        
        ## Route to appropriate service

        service_name = endpoint.split('/')[1] if '/' in endpoint else "default"
        
        if service_name in self.services:
            service = self.services[service_name]
            response = service.handle_request(method, endpoint)
        else:
            response = {"status": "error", "message": "Service not found"}
        
        ## Log request

        self.request_log.append({
            "timestamp": datetime.now().isoformat(),
            "client_ip": client_ip,
            "endpoint": endpoint,
            "method": method,
            "response_status": response["status"]
        })
        
        return response
    
    def check_rate_limit(self, client_ip, max_requests=100, window_minutes=60):
        current_time = datetime.now()
        window_start = current_time - timedelta(minutes=window_minutes)
        
        ## Count recent requests from this IP

        recent_requests = [
            req for req in self.request_log 
            if req["client_ip"] == client_ip and 
            datetime.fromisoformat(req["timestamp"]) > window_start
        ]
        
        return len(recent_requests) < max_requests
    
    def generate_api_metrics(self):
        total_requests = len(self.request_log)
        successful_requests = len([req for req in self.request_log if req["response_status"] == "success"])
        
        service_stats = {}
        for service_name, service in self.services.items():
            service_stats[service_name] = {
                "requests_handled": service.requests_handled,
                "error_count": service.error_count,
                "status": service.status.value
            }
        
        return {
            "total_requests": total_requests,
            "success_rate": successful_requests / max(total_requests, 1),
            "service_stats": service_stats,
            "active_services": len([s for s in self.services.values() if s.status == ServerStatus.RUNNING])
        }

## Example back-end system simulation

gateway = APIGateway()

## Create services

auth_service = BackendService("auth", "authentication", 3001)
user_service = BackendService("users", "user_management", 3002)
api_service = BackendService("api", "main_api", 3000)

## Create database

user_db = Database("user_database", DatabaseType.POSTGRESQL, "postgresql://localhost:5432/users")
user_db.status = ServerStatus.RUNNING
user_db.data_size_mb = 150

## Register services

gateway.register_service(auth_service)
gateway.register_service(user_service)
gateway.register_service(api_service)

## Simulate API requests

responses = []
responses.append(gateway.route_request("192.168.1.10", "/auth/login", "POST"))
responses.append(gateway.route_request("192.168.1.10", "/users/profile", "GET"))
responses.append(gateway.route_request("192.168.1.11", "/api/data", "GET"))

## Generate metrics

metrics = gateway.generate_api_metrics()
print(f"API Gateway Metrics: {metrics}")

## Database operations

db_connection = user_db.connect()
query_result = user_db.execute_query("SELECT", "users")
backup_result = user_db.backup_database()

print(f"Database Query Result: {query_result}")
print(f"Backup Result: {backup_result}")

```

///

## Practice

/// details | Exercise 1: Documentation Audit
    type: question
    open: false

**Scenario**: You're joining a team that has been developing a student information system for 6 months. The system includes a React frontend, Node.js backend, and MySQL database.

**Task**: Create an audit plan to assess the current state of project documentation and identify gaps.

/// details | Sample Solution
    type: success
    open: false

**Documentation Audit Plan**:

1. **Inventory existing documentation**:

   - Requirements and specifications

   - API documentation

   - Database schema documentation

   - Setup and deployment guides

   - User manuals

2. **Assess documentation quality**:

   - Currency (how up-to-date)

   - Completeness (covers all features)

   - Accuracy (matches current implementation)

   - Accessibility (easy to find and understand)

3. **Identify critical gaps**:

   - Missing API endpoints

   - Undocumented configuration options

   - Absent troubleshooting guides

   - Unclear setup instructions

4. **Create improvement plan**:

   - Prioritise most critical documentation needs

   - Assign responsibility for updates

   - Establish documentation standards

   - Set up regular review process

**Tools for audit**:

```py

audit_manager = ArtefactManager()

## Add existing documentation

## Generate report to identify gaps

report = audit_manager.generate_documentation_report()

```

///
///

/// details | Exercise 2: Dependency Security Review
    type: question
    open: false

**Scenario**: Your team is preparing for a security audit and needs to review all third-party dependencies for potential vulnerabilities and license conflicts.

**Task**: Design a process to systematically review and document all project dependencies.

/// details | Sample Solution
    type: success
    open: false

**Dependency Security Review Process**:

1. **Inventory all dependencies**:

   - Direct dependencies (listed in package.json, requirements.txt)

   - Transitive dependencies (dependencies of dependencies)

   - Development vs. production dependencies

2. **Security vulnerability scanning**:

   - Use automated tools (npm audit, safety, snyk)

   - Check CVE databases for known vulnerabilities

   - Assess severity and impact of vulnerabilities

3. **License compatibility review**:

   - Document license for each dependency

   - Check compatibility with project license

   - Identify potential legal issues

4. **Create action plan**:

   - Update vulnerable dependencies

   - Replace incompatible licenses

   - Document exceptions and risks

**Implementation example**:

```py

dep_manager = DependencyManager(LicenseType.MIT)

## Add all project dependencies

security_risks = dep_manager.find_security_risks()
outdated_deps = dep_manager.find_outdated_dependencies()

```

///
///

## Recap

Understanding algorithms, documentation, and back-end resources is essential for professional software development. Key takeaways include:

- **Documentation maintenance**: Keep development artefacts current and accessible to support team collaboration and knowledge transfer

- **Source attribution**: Properly cite external libraries and resources to ensure legal compliance and give appropriate credit

- **Back-end awareness**: Understand how server infrastructure, databases, and APIs contribute to overall application success

- **Security considerations**: Regularly review dependencies for vulnerabilities and maintain secure coding practices

These practices ensure your software projects are maintainable, legally compliant, and built on solid technical foundations that can scale with growing requirements.
