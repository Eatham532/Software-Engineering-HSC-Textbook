# 19.1 Security in Development Teams

!!! abstract "Learning Objectives"
    By the end of this section, you will be able to:

    - Implement security-focused code review processes and pair programming practices
    - Integrate security requirements effectively into agile development workflows
    - Conduct collaborative threat modeling sessions with development teams
    - Create and maintain security documentation and knowledge sharing systems
    - Balance security requirements with development velocity and team productivity

## Introduction

**Security in development teams** isn't just about implementing secure code—it's about creating a culture where security thinking is embedded in every aspect of the development process. When security becomes a shared responsibility across the entire team, rather than an afterthought or someone else's job, software becomes fundamentally more secure.

Modern development teams face the challenge of delivering features quickly while maintaining high security standards. This requires integrating security practices seamlessly into existing workflows, making security decisions collaborative, and ensuring that security knowledge is shared across the entire team.

Think of security in development teams like safety protocols in a medical team—everyone has a role to play, everyone shares responsibility, and the protocols are designed to prevent errors rather than blame individuals when things go wrong.

## Security Code Reviews and Pair Programming

### Understanding Security-Focused Code Reviews

**Security code reviews** go beyond checking for bugs and style issues—they specifically look for security vulnerabilities, design flaws, and opportunities to strengthen the system's security posture.

```python
# Example: Security-focused code review checklist implementation
class SecurityCodeReviewChecklist:
    """Automated security review checklist for development teams"""
    
    def __init__(self):
        self.security_checks = {
            'input_validation': {
                'description': 'All user inputs properly validated and sanitized',
                'patterns': ['request.form', 'request.args', 'input()', 'raw_input()'],
                'required_practices': ['validation', 'sanitization', 'type_checking']
            },
            'authentication': {
                'description': 'Authentication and authorization properly implemented',
                'patterns': ['login', 'authenticate', 'authorize', '@login_required'],
                'required_practices': ['secure_session', 'password_hashing', 'access_control']
            },
            'data_exposure': {
                'description': 'No sensitive data exposed in logs or error messages',
                'patterns': ['print(', 'logging.', 'console.log', 'raise Exception'],
                'required_practices': ['safe_logging', 'error_handling', 'data_sanitization']
            },
            'cryptography': {
                'description': 'Cryptographic operations use secure implementations',
                'patterns': ['encrypt', 'decrypt', 'hash', 'random', 'secret'],
                'required_practices': ['secure_random', 'proper_hashing', 'key_management']
            }
        }
    
    def analyze_code_diff(self, diff_content):
        """Analyze code changes for security implications"""
        findings = []
        
        for category, config in self.security_checks.items():
            category_findings = self._check_category(diff_content, category, config)
            findings.extend(category_findings)
        
        return self._generate_review_report(findings)
    
    def _check_category(self, code, category, config):
        """Check specific security category"""
        findings = []
        lines = code.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            # Check for patterns that require security review
            for pattern in config['patterns']:
                if pattern in line:
                    finding = {
                        'category': category,
                        'line_number': line_num,
                        'line_content': line.strip(),
                        'description': config['description'],
                        'severity': self._assess_severity(line, pattern),
                        'recommendations': self._get_recommendations(category, pattern)
                    }
                    findings.append(finding)
        
        return findings
    
    def _assess_severity(self, line, pattern):
        """Assess severity of potential security issue"""
        # High-risk patterns
        high_risk = ['eval(', 'exec(', 'sql', 'password', 'secret']
        if any(risk in line.lower() for risk in high_risk):
            return 'HIGH'
        
        # Medium-risk patterns
        medium_risk = ['input(', 'request.', 'file_upload']
        if any(risk in line.lower() for risk in medium_risk):
            return 'MEDIUM'
        
        return 'LOW'
    
    def _get_recommendations(self, category, pattern):
        """Get specific recommendations for security improvements"""
        recommendations_map = {
            'input_validation': [
                'Validate all input against expected format and range',
                'Use parameterized queries for database operations',
                'Implement proper error handling without exposing system details'
            ],
            'authentication': [
                'Use established authentication libraries',
                'Implement proper session management',
                'Add rate limiting to prevent brute force attacks'
            ],
            'data_exposure': [
                'Sanitize sensitive data before logging',
                'Use structured logging with appropriate log levels',
                'Implement proper error handling that doesn\'t leak information'
            ],
            'cryptography': [
                'Use cryptographically secure random number generators',
                'Implement proper key management and rotation',
                'Use established cryptographic libraries'
            ]
        }
        
        return recommendations_map.get(category, ['Review for security best practices'])
    
    def _generate_review_report(self, findings):
        """Generate comprehensive security review report"""
        if not findings:
            return {
                'status': 'PASS',
                'message': 'No security concerns identified',
                'findings': []
            }
        
        # Group findings by severity
        high_severity = [f for f in findings if f['severity'] == 'HIGH']
        medium_severity = [f for f in findings if f['severity'] == 'MEDIUM']
        low_severity = [f for f in findings if f['severity'] == 'LOW']
        
        status = 'BLOCK' if high_severity else 'REVIEW' if medium_severity else 'APPROVE'
        
        return {
            'status': status,
            'summary': {
                'high_issues': len(high_severity),
                'medium_issues': len(medium_severity),
                'low_issues': len(low_severity)
            },
            'findings': findings,
            'recommendations': self._get_overall_recommendations(findings)
        }
    
    def _get_overall_recommendations(self, findings):
        """Generate overall recommendations for the team"""
        recommendations = []
        
        categories_with_issues = set(f['category'] for f in findings)
        
        if 'input_validation' in categories_with_issues:
            recommendations.append('Consider implementing input validation middleware')
        
        if 'authentication' in categories_with_issues:
            recommendations.append('Review authentication and authorization patterns')
        
        if len(findings) > 5:
            recommendations.append('Consider security training for development team')
        
        return recommendations

# Example: Integration with version control system
class GitSecurityHooks:
    """Git hooks for automated security checks"""
    
    def __init__(self):
        self.review_checklist = SecurityCodeReviewChecklist()
        self.blocked_patterns = [
            r'password\s*=\s*["\'][^"\']+["\']',  # Hardcoded passwords
            r'api_key\s*=\s*["\'][^"\']+["\']',   # Hardcoded API keys
            r'secret\s*=\s*["\'][^"\']+["\']',    # Hardcoded secrets
        ]
    
    def pre_commit_security_check(self, staged_files):
        """Run security checks before commit"""
        security_issues = []
        
        for file_path in staged_files:
            if file_path.endswith(('.py', '.js', '.java', '.php')):
                with open(file_path, 'r') as f:
                    content = f.read()
                
                # Check for blocked patterns
                pattern_issues = self._check_blocked_patterns(content, file_path)
                security_issues.extend(pattern_issues)
                
                # Run comprehensive security review
                review_result = self.review_checklist.analyze_code_diff(content)
                if review_result['status'] == 'BLOCK':
                    security_issues.extend(review_result['findings'])
        
        return self._format_pre_commit_report(security_issues)
    
    def _check_blocked_patterns(self, content, file_path):
        """Check for patterns that should block commits"""
        import re
        issues = []
        
        for pattern in self.blocked_patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                issues.append({
                    'file': file_path,
                    'pattern': pattern,
                    'match': match.group(),
                    'severity': 'CRITICAL',
                    'message': 'Potential hardcoded secret detected'
                })
        
        return issues
    
    def _format_pre_commit_report(self, issues):
        """Format security issues for pre-commit hook"""
        if not issues:
            return {'allowed': True, 'message': 'Security check passed'}
        
        critical_issues = [i for i in issues if i['severity'] == 'CRITICAL']
        
        if critical_issues:
            return {
                'allowed': False,
                'message': 'Commit blocked due to security issues',
                'issues': critical_issues
            }
        
        return {
            'allowed': True,
            'message': 'Security review recommended',
            'issues': issues
        }

```text

### Pair Programming for Security

**Security-focused pair programming** involves two developers working together with one specifically focused on security considerations while the other focuses on functionality.

```python
# Example: Pair programming security guidelines
class SecurityPairProgramming:
    """Guidelines and tools for security-focused pair programming"""
    
    def __init__(self):
        self.security_roles = {
            'security_navigator': {
                'responsibilities': [
                    'Watch for security anti-patterns',
                    'Suggest secure alternatives',
                    'Ask security-focused questions',
                    'Review for OWASP Top 10 issues'
                ],
                'questions_to_ask': [
                    'How do we validate this input?',
                    'What happens if this fails?',
                    'Who should have access to this?',
                    'How do we log this securely?',
                    'What are the attack vectors here?'
                ]
            },
            'functional_driver': {
                'responsibilities': [
                    'Implement primary functionality',
                    'Focus on business requirements',
                    'Ensure code quality and maintainability',
                    'Implement security suggestions'
                ],
                'considerations': [
                    'Integrate security without breaking functionality',
                    'Maintain code readability',
                    'Consider performance implications',
                    'Document security decisions'
                ]
            }
        }
    
    def create_session_checklist(self, feature_type):
        """Create security checklist for pair programming session"""
        base_checklist = [
            'Input validation implemented',
            'Error handling doesn\'t leak information',
            'Authentication/authorization checked',
            'Sensitive data properly handled',
            'Logging implemented securely'
        ]
        
        feature_specific = {
            'authentication': [
                'Password hashing implemented correctly',
                'Session management secure',
                'Rate limiting in place',
                'Account lockout mechanisms'
            ],
            'data_processing': [
                'SQL injection prevention',
                'XSS prevention measures',
                'File upload security',
                'Data validation comprehensive'
            ],
            'api_endpoint': [
                'Authorization checks implemented',
                'Rate limiting configured',
                'Input validation on all parameters',
                'CORS configured properly'
            ]
        }
        
        checklist = base_checklist + feature_specific.get(feature_type, [])
        return self._format_checklist(checklist)
    
    def _format_checklist(self, items):
        """Format checklist for pair programming session"""
        return {
            'session_id': f"security_pair_{hash(tuple(items)) % 10000}",
            'checklist': [{'item': item, 'completed': False} for item in items],
            'notes': [],
            'security_decisions': []
        }
    
    def record_security_decision(self, session, decision, rationale):
        """Record security decisions made during pair programming"""
        session['security_decisions'].append({
            'decision': decision,
            'rationale': rationale,
            'timestamp': '2025-09-18T10:30:00Z',  # Would use datetime.now()
            'participants': ['navigator', 'driver']
        })
        
        return session

# Example: Security code review templates
class SecurityReviewTemplates:
    """Templates for structured security code reviews"""
    
    def __init__(self):
        self.review_templates = {
            'authentication_feature': {
                'checklist': [
                    'Password requirements enforced',
                    'Passwords properly hashed and salted',
                    'Session management implemented securely',
                    'Account lockout prevents brute force',
                    'Two-factor authentication considered',
                    'Password reset process secure'
                ],
                'questions': [
                    'How are passwords stored?',
                    'What happens after multiple failed login attempts?',
                    'How long do sessions last?',
                    'How is password reset implemented?'
                ]
            },
            'data_input_feature': {
                'checklist': [
                    'All inputs validated',
                    'SQL injection prevention implemented',
                    'XSS prevention measures in place',
                    'File upload restrictions enforced',
                    'Error messages don\'t leak information',
                    'Rate limiting implemented'
                ],
                'questions': [
                    'What validation is performed on each input?',
                    'How are database queries constructed?',
                    'What happens with invalid input?',
                    'How are uploaded files handled?'
                ]
            }
        }
    
    def get_review_template(self, feature_type):
        """Get appropriate review template for feature type"""
        return self.review_templates.get(feature_type, {
            'checklist': ['General security review completed'],
            'questions': ['Are there any security concerns?']
        })
    
    def generate_review_report(self, template, findings):
        """Generate structured review report"""
        return {
            'template_used': template,
            'checklist_completion': self._calculate_completion(findings),
            'security_findings': findings,
            'approval_status': self._determine_approval(findings),
            'follow_up_actions': self._generate_follow_up(findings)
        }
    
    def _calculate_completion(self, findings):
        """Calculate how many checklist items were addressed"""
        # Simplified calculation
        return len([f for f in findings if f.get('status') == 'checked'])
    
    def _determine_approval(self, findings):
        """Determine if code should be approved based on findings"""
        critical_issues = [f for f in findings if f.get('severity') == 'critical']
        return 'blocked' if critical_issues else 'approved'
    
    def _generate_follow_up(self, findings):
        """Generate follow-up actions based on findings"""
        actions = []
        
        high_priority = [f for f in findings if f.get('severity') in ['critical', 'high']]
        if high_priority:
            actions.append('Address high-priority security issues before merge')
        
        if len(findings) > 10:
            actions.append('Consider security training for team')
        
        return actions

```text

## Security Requirements in Agile Development

### Integrating Security into Agile Workflows

**Agile security integration** means weaving security considerations into every aspect of the agile development process, from sprint planning to retrospectives.

```python
# Example: Agile security integration tools
class AgileSecurityIntegration:
    """Tools for integrating security into agile development workflows"""
    
    def __init__(self):
        self.security_user_stories = {
            'authentication': [
                'As a user, I want my password to be securely stored so my account cannot be compromised',
                'As a system, I want to detect brute force attacks so I can protect user accounts',
                'As an admin, I want to see failed login attempts so I can monitor security threats'
            ],
            'data_protection': [
                'As a user, I want my personal data to be encrypted so it stays private',
                'As a system, I want to validate all input so malicious data cannot harm the application',
                'As a compliance officer, I want data retention policies enforced automatically'
            ],
            'access_control': [
                'As a user, I want to only access data I\'m authorized to see',
                'As an admin, I want to easily manage user permissions',
                'As a system, I want to log all access attempts for audit purposes'
            ]
        }
    
    def generate_security_user_stories(self, epic_type, business_requirements):
        """Generate security user stories for a given epic"""
        base_stories = self.security_user_stories.get(epic_type, [])
        
        # Add specific security stories based on business requirements
        custom_stories = self._generate_custom_stories(business_requirements)
        
        return {
            'epic_type': epic_type,
            'base_security_stories': base_stories,
            'custom_security_stories': custom_stories,
            'acceptance_criteria': self._generate_security_acceptance_criteria(epic_type)
        }
    
    def _generate_custom_stories(self, requirements):
        """Generate custom security stories based on specific requirements"""
        stories = []
        
        if 'payment' in requirements.lower():
            stories.extend([
                'As a user, I want my payment information encrypted in transit and at rest',
                'As a system, I want to comply with PCI DSS requirements for payment processing'
            ])
        
        if 'file_upload' in requirements.lower():
            stories.extend([
                'As a system, I want to scan uploaded files for malware',
                'As a user, I want file size and type restrictions to be clearly communicated'
            ])
        
        if 'api' in requirements.lower():
            stories.extend([
                'As an API consumer, I want rate limiting to prevent abuse',
                'As a system, I want to authenticate all API requests'
            ])
        
        return stories
    
    def _generate_security_acceptance_criteria(self, epic_type):
        """Generate security-focused acceptance criteria"""
        criteria_map = {
            'authentication': [
                'Password must meet complexity requirements',
                'Account locks after 5 failed attempts',
                'Session expires after 30 minutes of inactivity',
                'All authentication events are logged'
            ],
            'data_protection': [
                'All PII is encrypted at rest',
                'Data transmission uses TLS 1.3 or higher',
                'Input validation prevents injection attacks',
                'Error messages don\'t expose sensitive information'
            ],
            'access_control': [
                'Users can only access authorized resources',
                'Permission changes are logged and audited',
                'Default access level is most restrictive',
                'Administrative actions require additional verification'
            ]
        }
        
        return criteria_map.get(epic_type, ['Security review completed by team'])

class SprintSecurityPlanning:
    """Tools for incorporating security into sprint planning"""
    
    def __init__(self):
        self.security_story_points = {
            'input_validation': 3,
            'authentication': 5,
            'authorization': 3,
            'encryption': 5,
            'security_testing': 2,
            'security_documentation': 1
        }
    
    def estimate_security_work(self, sprint_stories):
        """Estimate security work required for sprint stories"""
        security_estimate = 0
        security_tasks = []
        
        for story in sprint_stories:
            story_security = self._analyze_story_security_needs(story)
            security_estimate += story_security['effort']
            security_tasks.extend(story_security['tasks'])
        
        return {
            'total_security_points': security_estimate,
            'security_tasks': security_tasks,
            'recommendations': self._generate_sprint_recommendations(security_estimate)
        }
    
    def _analyze_story_security_needs(self, story):
        """Analyze security work required for a user story"""
        security_needs = {
            'effort': 0,
            'tasks': []
        }
        
        story_text = story.get('description', '').lower()
        
        # Analyze story for security implications
        if any(word in story_text for word in ['login', 'password', 'authenticate']):
            security_needs['effort'] += self.security_story_points['authentication']
            security_needs['tasks'].append('Implement secure authentication')
        
        if any(word in story_text for word in ['data', 'information', 'store']):
            security_needs['effort'] += self.security_story_points['encryption']
            security_needs['tasks'].append('Implement data protection')
        
        if any(word in story_text for word in ['input', 'form', 'submit']):
            security_needs['effort'] += self.security_story_points['input_validation']
            security_needs['tasks'].append('Implement input validation')
        
        if any(word in story_text for word in ['access', 'permission', 'role']):
            security_needs['effort'] += self.security_story_points['authorization']
            security_needs['tasks'].append('Implement access control')
        
        # Always add testing and documentation
        security_needs['effort'] += self.security_story_points['security_testing']
        security_needs['effort'] += self.security_story_points['security_documentation']
        security_needs['tasks'].extend(['Security testing', 'Security documentation'])
        
        return security_needs
    
    def _generate_sprint_recommendations(self, security_points):
        """Generate recommendations for sprint security work"""
        recommendations = []
        
        if security_points > 15:
            recommendations.append('Consider dedicating team member to security tasks')
        
        if security_points > 10:
            recommendations.append('Plan security review session mid-sprint')
        
        recommendations.append('Include security specialist in daily standups')
        recommendations.append('Plan security testing for end of sprint')
        
        return recommendations

class SecurityDefinitionOfDone:
    """Security criteria for Definition of Done"""
    
    def __init__(self):
        self.security_criteria = {
            'code_quality': [
                'Security code review completed',
                'No high-severity security issues in static analysis',
                'Security unit tests written and passing'
            ],
            'testing': [
                'Security test cases executed',
                'Penetration testing completed for security-critical features',
                'No known security vulnerabilities in dependencies'
            ],
            'documentation': [
                'Security decisions documented',
                'Threat model updated if applicable',
                'Security runbook updated'
            ],
            'deployment': [
                'Security configuration reviewed',
                'Environment security validated',
                'Security monitoring configured'
            ]
        }
    
    def get_security_dod_checklist(self, story_type):
        """Get security Definition of Done checklist for story type"""
        base_criteria = []
        for category, criteria in self.security_criteria.items():
            base_criteria.extend(criteria)
        
        # Add story-specific security criteria
        if story_type == 'authentication':
            base_criteria.extend([
                'Password policy enforced',
                'Rate limiting implemented',
                'Session management reviewed'
            ])
        elif story_type == 'data_handling':
            base_criteria.extend([
                'Data encryption verified',
                'Input validation comprehensive',
                'Error handling secure'
            ])
        
        return {
            'story_type': story_type,
            'security_checklist': base_criteria,
            'completion_required': '100%'
        }
    
    def validate_security_dod(self, story, completed_items):
        """Validate that security Definition of Done is met"""
        required_checklist = self.get_security_dod_checklist(story.get('type', 'general'))
        total_items = len(required_checklist['security_checklist'])
        completed_count = len(completed_items)
        
        completion_rate = (completed_count / total_items) * 100
        
        return {
            'story_id': story.get('id'),
            'completion_rate': completion_rate,
            'is_complete': completion_rate >= 100,
            'missing_items': [
                item for item in required_checklist['security_checklist']
                if item not in completed_items
            ],
            'recommendation': self._get_completion_recommendation(completion_rate)
        }
    
    def _get_completion_recommendation(self, completion_rate):
        """Get recommendation based on completion rate"""
        if completion_rate < 80:
            return 'Story not ready for deployment - complete security requirements'
        elif completion_rate < 100:
            return 'Address remaining security items before marking complete'
        else:
            return 'Security Definition of Done satisfied'

```text

## Threat Modeling in Team Settings

### Collaborative Threat Modeling Process

**Team-based threat modeling** brings together diverse perspectives to identify security threats and design appropriate countermeasures.

```python
# Example: Collaborative threat modeling tools
class TeamThreatModeling:
    """Tools for conducting threat modeling with development teams"""
    
    def __init__(self):
        self.threat_categories = {
            'STRIDE': {
                'Spoofing': 'Impersonating users or systems',
                'Tampering': 'Modifying data or code',
                'Repudiation': 'Denying actions performed',
                'Information_Disclosure': 'Exposing confidential information',
                'Denial_of_Service': 'Preventing system availability',
                'Elevation_of_Privilege': 'Gaining unauthorized access'
            }
        }
        
        self.threat_modeling_roles = {
            'facilitator': 'Guides discussion, keeps focused on security',
            'domain_expert': 'Provides business context and requirements',
            'architect': 'Explains system design and data flows',
            'developer': 'Identifies implementation vulnerabilities',
            'tester': 'Suggests attack scenarios and test cases',
            'security_specialist': 'Provides security expertise and guidance'
        }
    
    def create_threat_modeling_session(self, system_component):
        """Create structured threat modeling session"""
        session = {
            'component': system_component,
            'participants': [],
            'data_flows': [],
            'trust_boundaries': [],
            'threats': [],
            'mitigations': [],
            'action_items': []
        }
        
        return self._initialize_session_structure(session)
    
    def _initialize_session_structure(self, session):
        """Initialize threat modeling session structure"""
        session['methodology'] = 'STRIDE'
        session['session_guidelines'] = [
            'Focus on realistic attack scenarios',
            'Consider both technical and non-technical threats',
            'Prioritize threats based on likelihood and impact',
            'Identify concrete mitigation strategies',
            'Assign ownership for action items'
        ]
        
        return session
    
    def facilitate_threat_identification(self, session, system_design):
        """Guide team through threat identification process"""
        identified_threats = []
        
        # Analyze each STRIDE category
        for category, description in self.threat_categories['STRIDE'].items():
            category_threats = self._brainstorm_category_threats(
                category, system_design, session['participants']
            )
            identified_threats.extend(category_threats)
        
        # Prioritize threats
        prioritized_threats = self._prioritize_threats(identified_threats)
        
        session['threats'] = prioritized_threats
        return session
    
    def _brainstorm_category_threats(self, category, system_design, participants):
        """Brainstorm threats for specific STRIDE category"""
        threats = []
        
        # Example threat templates for each category
        threat_templates = {
            'Spoofing': [
                'Attacker impersonates legitimate user',
                'System accepts forged authentication tokens',
                'API calls made with stolen credentials'
            ],
            'Tampering': [
                'Database records modified without authorization',
                'Application code modified during deployment',
                'Configuration files altered by attacker'
            ],
            'Information_Disclosure': [
                'Sensitive data exposed in logs',
                'Database contents accessible without authentication',
                'Error messages reveal system information'
            ]
        }
        
        for template in threat_templates.get(category, []):
            threat = {
                'category': category,
                'description': template,
                'likelihood': 'TBD',
                'impact': 'TBD',
                'risk_score': 0,
                'affected_components': [],
                'potential_mitigations': []
            }
            threats.append(threat)
        
        return threats
    
    def _prioritize_threats(self, threats):
        """Prioritize threats based on risk assessment"""
        for threat in threats:
            # Simplified risk scoring (would involve team discussion)
            likelihood_score = self._assess_likelihood(threat)
            impact_score = self._assess_impact(threat)
            threat['risk_score'] = likelihood_score * impact_score
            threat['priority'] = self._calculate_priority(threat['risk_score'])
        
        # Sort by risk score (highest first)
        return sorted(threats, key=lambda t: t['risk_score'], reverse=True)
    
    def _assess_likelihood(self, threat):
        """Assess likelihood of threat occurring (1-5 scale)"""
        # Simplified assessment - in practice, involves team discussion
        high_likelihood_indicators = ['authentication', 'input', 'network']
        
        if any(indicator in threat['description'].lower() 
               for indicator in high_likelihood_indicators):
            return 4
        
        return 2  # Default medium likelihood
    
    def _assess_impact(self, threat):
        """Assess impact of threat if realized (1-5 scale)"""
        # Simplified assessment - in practice, involves team discussion
        high_impact_indicators = ['data', 'system', 'user', 'financial']
        
        if any(indicator in threat['description'].lower() 
               for indicator in high_impact_indicators):
            return 4
        
        return 2  # Default medium impact
    
    def _calculate_priority(self, risk_score):
        """Calculate priority level based on risk score"""
        if risk_score >= 16:
            return 'CRITICAL'
        elif risk_score >= 9:
            return 'HIGH'
        elif risk_score >= 4:
            return 'MEDIUM'
        else:
            return 'LOW'
    
    def develop_mitigations(self, session):
        """Guide team through mitigation planning"""
        for threat in session['threats']:
            mitigations = self._brainstorm_mitigations(threat)
            threat['potential_mitigations'] = mitigations
            
            # Select and assign mitigations
            selected_mitigations = self._select_mitigations(mitigations)
            threat['selected_mitigations'] = selected_mitigations
        
        return session
    
    def _brainstorm_mitigations(self, threat):
        """Brainstorm potential mitigations for threat"""
        mitigation_templates = {
            'Spoofing': [
                'Implement multi-factor authentication',
                'Use strong session management',
                'Add API key validation',
                'Implement certificate-based authentication'
            ],
            'Tampering': [
                'Implement data integrity checks',
                'Use digital signatures',
                'Add audit logging',
                'Implement access controls'
            ],
            'Information_Disclosure': [
                'Encrypt sensitive data',
                'Implement proper error handling',
                'Add access controls',
                'Sanitize log outputs'
            ]
        }
        
        category_mitigations = mitigation_templates.get(threat['category'], [])
        
        # Add effort and effectiveness estimates
        mitigations = []
        for mitigation in category_mitigations:
            mitigations.append({
                'description': mitigation,
                'effort': self._estimate_effort(mitigation),
                'effectiveness': self._estimate_effectiveness(mitigation, threat),
                'cost': self._estimate_cost(mitigation)
            })
        
        return mitigations
    
    def _estimate_effort(self, mitigation):
        """Estimate implementation effort (1-5 scale)"""
        high_effort_keywords = ['multi-factor', 'encryption', 'infrastructure']
        
        if any(keyword in mitigation.lower() for keyword in high_effort_keywords):
            return 4
        
        return 2  # Default medium effort
    
    def _estimate_effectiveness(self, mitigation, threat):
        """Estimate mitigation effectiveness (1-5 scale)"""
        # Simplified - would involve team expertise
        return 4  # Assume most mitigations are effective
    
    def _estimate_cost(self, mitigation):
        """Estimate implementation cost (1-5 scale)"""
        high_cost_keywords = ['infrastructure', 'third-party', 'encryption']
        
        if any(keyword in mitigation.lower() for keyword in high_cost_keywords):
            return 4
        
        return 2  # Default medium cost
    
    def _select_mitigations(self, mitigations):
        """Select optimal mitigations based on cost-benefit analysis"""
        # Sort by effectiveness-to-effort ratio
        scored_mitigations = []
        for mitigation in mitigations:
            if mitigation['effort'] > 0:
                score = mitigation['effectiveness'] / mitigation['effort']
                mitigation['score'] = score
                scored_mitigations.append(mitigation)
        
        # Select top mitigations
        scored_mitigations.sort(key=lambda m: m['score'], reverse=True)
        return scored_mitigations[:3]  # Top 3 mitigations

class ThreatModelingWorkshop:
    """Framework for conducting threat modeling workshops"""
    
    def __init__(self):
        self.workshop_agenda = {
            'introduction': {
                'duration': 15,
                'activities': [
                    'Explain threat modeling objectives',
                    'Review system architecture',
                    'Assign participant roles'
                ]
            },
            'system_analysis': {
                'duration': 30,
                'activities': [
                    'Map data flows',
                    'Identify trust boundaries',
                    'Document assumptions'
                ]
            },
            'threat_identification': {
                'duration': 45,
                'activities': [
                    'STRIDE analysis',
                    'Brainstorm attack scenarios',
                    'Document potential threats'
                ]
            },
            'risk_assessment': {
                'duration': 30,
                'activities': [
                    'Assess threat likelihood',
                    'Evaluate potential impact',
                    'Prioritize threats'
                ]
            },
            'mitigation_planning': {
                'duration': 45,
                'activities': [
                    'Brainstorm mitigations',
                    'Evaluate mitigation options',
                    'Create action plan'
                ]
            },
            'wrap_up': {
                'duration': 15,
                'activities': [
                    'Review action items',
                    'Assign ownership',
                    'Schedule follow-up'
                ]
            }
        }
    
    def plan_workshop(self, system_scope, participants):
        """Plan threat modeling workshop"""
        workshop_plan = {
            'system_scope': system_scope,
            'participants': participants,
            'agenda': self.workshop_agenda,
            'total_duration': sum(phase['duration'] for phase in self.workshop_agenda.values()),
            'preparation_checklist': self._create_preparation_checklist(),
            'required_materials': self._get_required_materials()
        }
        
        return workshop_plan
    
    def _create_preparation_checklist(self):
        """Create pre-workshop preparation checklist"""
        return [
            'System architecture diagrams prepared',
            'Data flow diagrams available',
            'Participant roles assigned',
            'Meeting room with whiteboard booked',
            'Threat modeling templates printed',
            'Previous threat models reviewed'
        ]
    
    def _get_required_materials(self):
        """Get list of required workshop materials"""
        return [
            'Whiteboard and markers',
            'Sticky notes and pens',
            'System architecture diagrams',
            'STRIDE threat categories reference',
            'Threat modeling worksheets',
            'Risk assessment matrix',
            'Action item tracking template'
        ]

```text

## Security Documentation and Knowledge Sharing

### Creating Effective Security Documentation

**Security documentation** ensures that security knowledge is preserved, shared, and accessible to all team members. Good security documentation serves as both a reference and a training tool.

```python
# Example: Security documentation management system
class SecurityDocumentationManager:
    """System for managing team security documentation"""
    
    def __init__(self):
        self.document_types = {
            'security_runbooks': {
                'description': 'Step-by-step procedures for security incidents',
                'template': 'incident_response_template',
                'update_frequency': 'quarterly',
                'owners': ['security_team', 'dev_leads']
            },
            'threat_models': {
                'description': 'Documentation of identified threats and mitigations',
                'template': 'threat_model_template',
                'update_frequency': 'per_release',
                'owners': ['architects', 'security_specialists']
            },
            'security_guidelines': {
                'description': 'Coding standards and security best practices',
                'template': 'guidelines_template',
                'update_frequency': 'as_needed',
                'owners': ['senior_developers', 'security_team']
            },
            'security_decisions': {
                'description': 'Record of security architecture decisions',
                'template': 'decision_record_template',
                'update_frequency': 'per_decision',
                'owners': ['architects', 'team_leads']
            }
        }
    
    def create_security_runbook(self, incident_type, team_info):
        """Create security incident runbook"""
        runbook = {
            'incident_type': incident_type,
            'team_responsible': team_info,
            'created_date': '2025-09-18',
            'last_updated': '2025-09-18',
            'version': '1.0',
            'sections': self._generate_runbook_sections(incident_type)
        }
        
        return self._populate_runbook_template(runbook)
    
    def _generate_runbook_sections(self, incident_type):
        """Generate appropriate sections for incident runbook"""
        base_sections = [
            'incident_identification',
            'immediate_response',
            'investigation_steps',
            'containment_procedures',
            'communication_plan',
            'recovery_procedures',
            'post_incident_review'
        ]
        
        # Add incident-specific sections
        specific_sections = {
            'data_breach': [
                'data_classification_review',
                'regulatory_notification',
                'customer_communication',
                'legal_consultation'
            ],
            'authentication_compromise': [
                'user_account_review',
                'session_invalidation',
                'credential_reset',
                'mfa_enforcement'
            ],
            'ddos_attack': [
                'traffic_analysis',
                'rate_limiting_activation',
                'cdn_configuration',
                'upstream_coordination'
            ]
        }
        
        return base_sections + specific_sections.get(incident_type, [])
    
    def _populate_runbook_template(self, runbook):
        """Populate runbook with detailed procedures"""
        populated_sections = {}
        
        for section in runbook['sections']:
            populated_sections[section] = self._get_section_template(section)
        
        runbook['detailed_procedures'] = populated_sections
        return runbook
    
    def _get_section_template(self, section):
        """Get template for specific runbook section"""
        templates = {
            'incident_identification': {
                'steps': [
                    'Verify incident is occurring',
                    'Classify incident severity',
                    'Document initial observations',
                    'Notify response team'
                ],
                'tools': ['monitoring_dashboard', 'log_analysis_tools'],
                'timeframe': '15 minutes'
            },
            'immediate_response': {
                'steps': [
                    'Activate incident response team',
                    'Establish communication channels',
                    'Begin containment procedures',
                    'Start incident timeline'
                ],
                'tools': ['communication_platform', 'incident_tracker'],
                'timeframe': '30 minutes'
            },
            'data_classification_review': {
                'steps': [
                    'Identify affected data types',
                    'Determine data sensitivity levels',
                    'Assess regulatory implications',
                    'Calculate potential impact'
                ],
                'tools': ['data_catalog', 'classification_matrix'],
                'timeframe': '60 minutes'
            }
        }
        
        return templates.get(section, {
            'steps': ['To be documented'],
            'tools': ['To be identified'],
            'timeframe': 'To be determined'
        })
    
    def create_security_decision_record(self, decision_info):
        """Create architectural decision record for security choices"""
        adr = {
            'id': f"ADR-SEC-{hash(decision_info['title']) % 1000:03d}",
            'title': decision_info['title'],
            'status': 'proposed',
            'date': '2025-09-18',
            'deciders': decision_info.get('deciders', []),
            'context': decision_info.get('context', ''),
            'decision': decision_info.get('decision', ''),
            'consequences': decision_info.get('consequences', {}),
            'alternatives_considered': decision_info.get('alternatives', [])
        }
        
        return self._format_decision_record(adr)
    
    def _format_decision_record(self, adr):
        """Format architectural decision record"""
        formatted_record = f"""
# {adr['title']}

**Status**: {adr['status']}
**Date**: {adr['date']}
**Deciders**: {', '.join(adr['deciders'])}

## Context

{adr['context']}

## Decision

{adr['decision']}

## Consequences

### Positive
{self._format_consequences(adr['consequences'].get('positive', []))}

### Negative
{self._format_consequences(adr['consequences'].get('negative', []))}

### Neutral
{self._format_consequences(adr['consequences'].get('neutral', []))}

## Alternatives Considered

{self._format_alternatives(adr['alternatives_considered'])}
"""
        
        adr['formatted_content'] = formatted_record
        return adr
    
    def _format_consequences(self, consequences):
        """Format consequences list"""
        if not consequences:
            return "- None identified"
        
        return '\n'.join(f"- {consequence}" for consequence in consequences)
    
    def _format_alternatives(self, alternatives):
        """Format alternatives list"""
        if not alternatives:
            return "- None documented"
        
        formatted = []
        for alt in alternatives:
            formatted.append(f"### {alt.get('name', 'Alternative')}")
            formatted.append(f"**Description**: {alt.get('description', 'Not provided')}")
            formatted.append(f"**Pros**: {', '.join(alt.get('pros', []))}")
            formatted.append(f"**Cons**: {', '.join(alt.get('cons', []))}")
            formatted.append("")
        
        return '\n'.join(formatted)

class SecurityKnowledgeSharing:
    """System for sharing security knowledge across development teams"""
    
    def __init__(self):
        self.knowledge_formats = {
            'lunch_and_learns': {
                'duration': 60,
                'frequency': 'monthly',
                'format': 'presentation_and_discussion',
                'topics': ['threat_modeling', 'secure_coding', 'incident_response']
            },
            'security_champions': {
                'role': 'security_advocate_per_team',
                'responsibilities': ['share_security_updates', 'conduct_mini_reviews', 'escalate_concerns'],
                'training': ['monthly_security_briefings', 'annual_security_training']
            },
            'code_review_learning': {
                'approach': 'teaching_through_reviews',
                'methods': ['explain_security_issues', 'suggest_improvements', 'share_resources'],
                'documentation': ['review_comments', 'wiki_articles', 'best_practices']
            }
        }
    
    def plan_security_training_session(self, topic, audience_level):
        """Plan security training session for development team"""
        session_plan = {
            'topic': topic,
            'audience_level': audience_level,
            'duration': self._estimate_session_duration(topic, audience_level),
            'format': self._determine_session_format(topic),
            'materials': self._gather_training_materials(topic),
            'learning_objectives': self._define_learning_objectives(topic),
            'hands_on_activities': self._design_activities(topic, audience_level)
        }
        
        return self._create_detailed_agenda(session_plan)
    
    def _estimate_session_duration(self, topic, audience_level):
        """Estimate appropriate session duration"""
        base_duration = {
            'beginner': 90,
            'intermediate': 60,
            'advanced': 45
        }
        
        complex_topics = ['threat_modeling', 'cryptography', 'incident_response']
        if topic in complex_topics:
            return base_duration[audience_level] + 30
        
        return base_duration[audience_level]
    
    def _determine_session_format(self, topic):
        """Determine optimal session format"""
        interactive_topics = ['threat_modeling', 'code_review', 'incident_response']
        
        if topic in interactive_topics:
            return 'workshop_with_exercises'
        else:
            return 'presentation_with_qa'
    
    def _gather_training_materials(self, topic):
        """Gather training materials for specific topic"""
        materials_map = {
            'secure_coding': [
                'OWASP Top 10 guide',
                'Secure coding checklist',
                'Code examples (vulnerable and fixed)',
                'Static analysis tool demo'
            ],
            'threat_modeling': [
                'STRIDE methodology guide',
                'Sample threat model',
                'Threat modeling worksheet',
                'System architecture diagram'
            ],
            'incident_response': [
                'Incident response playbook',
                'Communication templates',
                'Escalation procedures',
                'Post-incident review template'
            ]
        }
        
        return materials_map.get(topic, ['Topic-specific materials to be prepared'])
    
    def _define_learning_objectives(self, topic):
        """Define specific learning objectives"""
        objectives_map = {
            'secure_coding': [
                'Identify common security vulnerabilities in code',
                'Apply secure coding practices in daily development',
                'Use static analysis tools effectively',
                'Conduct security-focused code reviews'
            ],
            'threat_modeling': [
                'Understand STRIDE threat categories',
                'Conduct collaborative threat modeling sessions',
                'Prioritize security threats based on risk',
                'Develop appropriate security mitigations'
            ],
            'incident_response': [
                'Recognize security incident indicators',
                'Follow established response procedures',
                'Communicate effectively during incidents',
                'Contribute to post-incident improvements'
            ]
        }
        
        return objectives_map.get(topic, ['Understand key concepts', 'Apply learning to daily work'])
    
    def _design_activities(self, topic, audience_level):
        """Design hands-on activities for training session"""
        activities = []
        
        if topic == 'secure_coding':
            activities.extend([
                'Code review exercise: Find the vulnerabilities',
                'Pair programming: Fix security issues',
                'Tool demonstration: Static analysis setup'
            ])
        
        elif topic == 'threat_modeling':
            activities.extend([
                'Mini threat modeling session',
                'STRIDE brainstorming exercise',
                'Risk prioritization activity'
            ])
        
        elif topic == 'incident_response':
            activities.extend([
                'Incident simulation exercise',
                'Communication role-play',
                'Playbook walkthrough'
            ])
        
        # Adjust complexity based on audience level
        if audience_level == 'beginner':
            activities = [f"Guided {activity}" for activity in activities]
        elif audience_level == 'advanced':
            activities.append('Lead mini-training session for others')
        
        return activities
    
    def _create_detailed_agenda(self, session_plan):
        """Create detailed session agenda"""
        agenda = {
            'session_info': {
                'topic': session_plan['topic'],
                'duration': session_plan['duration'],
                'format': session_plan['format']
            },
            'schedule': self._build_schedule(session_plan),
            'materials_checklist': session_plan['materials'],
            'preparation_notes': self._create_preparation_notes(session_plan),
            'follow_up_actions': self._plan_follow_up(session_plan)
        }
        
        return agenda
    
    def _build_schedule(self, session_plan):
        """Build detailed session schedule"""
        duration = session_plan['duration']
        
        if session_plan['format'] == 'workshop_with_exercises':
            return {
                'introduction': f"0-{duration//6} min: Welcome and objectives",
                'content_overview': f"{duration//6}-{duration//3} min: Key concepts",
                'hands_on_activity': f"{duration//3}-{2*duration//3} min: Practical exercise",
                'discussion': f"{2*duration//3}-{5*duration//6} min: Share learnings",
                'wrap_up': f"{5*duration//6}-{duration} min: Summary and next steps"
            }
        else:
            return {
                'introduction': f"0-{duration//8} min: Welcome and agenda",
                'presentation': f"{duration//8}-{3*duration//4} min: Main content",
                'qa_session': f"{3*duration//4}-{7*duration//8} min: Questions and discussion",
                'wrap_up': f"{7*duration//8}-{duration} min: Summary and resources"
            }
    
    def _create_preparation_notes(self, session_plan):
        """Create preparation notes for facilitator"""
        return [
            f"Review {session_plan['topic']} materials 24 hours before session",
            "Test any tools or demos in advance",
            "Prepare backup activities in case of timing issues",
            "Have contact information for subject matter experts",
            "Set up room with appropriate A/V equipment"
        ]
    
    def _plan_follow_up(self, session_plan):
        """Plan follow-up actions after training"""
        return [
            "Send session materials to all participants",
            "Create shared workspace for ongoing discussion",
            "Schedule follow-up check-in meeting in 2 weeks",
            "Gather feedback via survey",
            "Update training materials based on feedback"
        ]

```text

## Balancing Security with Development Velocity

### Strategies for Maintaining Development Speed

**Security-velocity balance** requires integrating security practices that enhance rather than hinder development productivity. The goal is to make security enablers, not blockers.

```python
# Example: DevSecOps integration for velocity
class DevSecOpsVelocityOptimizer:
    """Tools for optimizing security integration without slowing development"""
    
    def __init__(self):
        self.automation_opportunities = {
            'security_testing': {
                'sast_integration': 'Automated static analysis in CI/CD',
                'dependency_scanning': 'Automated vulnerability scanning of dependencies',
                'container_scanning': 'Automated container image security scanning',
                'infrastructure_scanning': 'Automated infrastructure security validation'
            },
            'compliance_automation': {
                'policy_as_code': 'Security policies enforced through code',
                'compliance_reporting': 'Automated generation of compliance reports',
                'audit_preparation': 'Automated collection of audit evidence',
                'risk_assessment': 'Automated risk scoring and prioritization'
            },
            'security_workflows': {
                'incident_response': 'Automated incident detection and initial response',
                'security_notifications': 'Automated security alert routing and escalation',
                'remediation_tracking': 'Automated tracking of security fix implementation',
                'security_metrics': 'Automated collection and reporting of security metrics'
            }
        }

```text

## Key Takeaways

### Security in Development Teams: Essential Principles

1. **Shared Responsibility**: Security is everyone's responsibility, not just the security team's

2. **Integration over Inspection**: Build security into processes rather than adding it as an afterthought

3. **Automation Enables Velocity**: Automated security practices can actually increase development speed

4. **Culture Trumps Tools**: A security-conscious culture is more valuable than any security tool

5. **Continuous Learning**: Security knowledge must be continuously shared and updated across the team

### Best Practices Summary

- **Code Reviews**: Include security-focused reviewers and use structured checklists

- **Agile Integration**: Embed security user stories and acceptance criteria in every sprint

- **Threat Modeling**: Make threat modeling a collaborative team activity

- **Documentation**: Maintain living security documentation that supports daily decisions

- **Velocity Balance**: Use automation and good processes to make security an enabler, not a blocker
