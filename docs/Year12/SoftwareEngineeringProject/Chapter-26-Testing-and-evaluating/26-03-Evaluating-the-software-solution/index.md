# 26.3 Evaluating the software solution

**Outcomes**: SE-12-06

## Learning objectives

By the end of this section, you will be able to:

- Develop comprehensive evaluation criteria for judging software solution effectiveness

- Synthesize feedback and evidence from multiple stakeholders into coherent evaluation reports

- Create and execute test plans that inform solution evaluation through systematic testing

- Analyze discrepancies between expected and actual outputs to identify improvement areas

- Reflect on maintainability, deployment readiness, and lessons learned throughout development

- Use evaluation results to make informed decisions about solution refinement and future development

---

## Developing evaluation criteria and evidence synthesis

Effective software solution evaluation requires clear criteria, systematic evidence collection, and structured analysis that considers multiple perspectives and stakeholder needs. The evaluation process transforms subjective feedback and objective test results into actionable insights for solution improvement.

### Evaluation criteria framework

**Evaluation criteria** define the standards by which software solution success will be measured. These criteria should be specific, measurable, and aligned with project requirements and stakeholder expectations.

**Key categories for evaluation criteria:**

- **Functional criteria**: Does the solution perform required functions correctly?

- **Non-functional criteria**: Does the solution meet performance, usability, and quality requirements?

- **Stakeholder satisfaction**: Do stakeholders find the solution valuable and usable?

- **Technical quality**: Is the solution well-designed, maintainable, and scalable?

- **Business impact**: Does the solution achieve intended business outcomes?

```kroki-plantuml
@startuml
!theme plain
skinparam monochrome true
skinparam shadowing false

package "Software Solution Evaluation Process" {
    rectangle "Criteria Development" as criteria
    note right of criteria : Functional requirements\nNon-functional requirements\nStakeholder expectations\nBusiness objectives
    
    rectangle "Evidence Collection" as evidence
    note right of evidence : Test results\nUser feedback\nPerformance metrics\nStakeholder interviews
    
    rectangle "Analysis & Synthesis" as analysis
    note right of analysis : Gap analysis\nTrend identification\nRoot cause analysis\nImpact assessment
    
    rectangle "Reporting & Recommendations" as reporting
    note right of reporting : Executive summary\nDetailed findings\nRecommendations\nNext steps
    
    rectangle "Reflection & Learning" as reflection
    note right of reflection : Lessons learned\nProcess improvements\nBest practices\nFuture considerations
    
    criteria --> evidence
    evidence --> analysis
    analysis --> reporting
    reporting --> reflection
    
    reflection --> criteria : Iterate for continuous improvement
}

note bottom : Evaluation is an iterative process that informs\ncontinuous solution improvement
@enduml

```

```python
class SolutionEvaluator:
    """
    Framework for systematically evaluating software solution effectiveness.
    Supports criteria development, evidence synthesis, and comprehensive reporting.
    """
    
    def __init__(self, solution_name, evaluation_scope):
        self.solution_name = solution_name
        self.evaluation_scope = evaluation_scope
        self.evaluation_criteria = {}
        self.evidence_sources = {}
        self.test_results = {}
        self.stakeholder_feedback = {}
        self.evaluation_findings = {}
        self.recommendations = []
        
    def define_evaluation_criteria(self, functional_criteria, non_functional_criteria, 
                                 stakeholder_criteria, technical_criteria, business_criteria):
        """
        Define comprehensive criteria for evaluating solution effectiveness.
        
        Args:
            functional_criteria: Criteria for functional requirement compliance
            non_functional_criteria: Performance, usability, security criteria
            stakeholder_criteria: User satisfaction and adoption criteria
            technical_criteria: Code quality, maintainability, architecture criteria
            business_criteria: ROI, efficiency, strategic alignment criteria
        """
        self.evaluation_criteria = {
            'functional': self._structure_criteria(functional_criteria, 'functional'),
            'non_functional': self._structure_criteria(non_functional_criteria, 'non_functional'),
            'stakeholder': self._structure_criteria(stakeholder_criteria, 'stakeholder'),
            'technical': self._structure_criteria(technical_criteria, 'technical'),
            'business': self._structure_criteria(business_criteria, 'business')
        }
        
        # Generate measurement approaches for each criterion
        for category, criteria_list in self.evaluation_criteria.items():
            for criterion in criteria_list:
                criterion['measurement_approach'] = self._determine_measurement_approach(
                    criterion['description'], category
                )
    
    def _structure_criteria(self, criteria_list, category):
        """Structure criteria with measurement specifications."""
        structured_criteria = []
        
        for i, criterion_desc in enumerate(criteria_list):
            criterion = {
                'id': f"{category}_{i+1:02d}",
                'description': criterion_desc,
                'category': category,
                'weight': self._determine_criterion_weight(criterion_desc, category),
                'target_value': self._determine_target_value(criterion_desc),
                'measurement_method': 'TBD',
                'actual_value': None,
                'evaluation_status': 'pending'
            }
            structured_criteria.append(criterion)
        
        return structured_criteria
    
    def _determine_criterion_weight(self, criterion_desc, category):
        """Determine relative importance weight for criterion."""
        # High-priority keywords that increase weight
        high_priority_keywords = ['security', 'performance', 'reliability', 'usability', 'critical']
        
        base_weights = {
            'functional': 0.25,
            'non_functional': 0.20,
            'stakeholder': 0.20,
            'technical': 0.15,
            'business': 0.20
        }
        
        base_weight = base_weights.get(category, 0.15)
        
        # Increase weight if criterion contains high-priority keywords
        if any(keyword in criterion_desc.lower() for keyword in high_priority_keywords):
            return min(base_weight * 1.5, 1.0)
        
        return base_weight
    
    def _determine_target_value(self, criterion_desc):
        """Determine target value based on criterion description."""
        # Extract numeric targets from criterion descriptions
        import re
        
        # Look for percentage targets
        percentage_match = re.search(r'(\d+)%', criterion_desc)
        if percentage_match:
            return f"{percentage_match.group(1)}%"
        
        # Look for time-based targets
        time_match = re.search(r'(\d+)\s*(second|minute|hour)', criterion_desc)
        if time_match:
            return f"{time_match.group(1)} {time_match.group(2)}(s)"
        
        # Look for error rate targets
        if 'error' in criterion_desc.lower():
            return "< 5% error rate"
        
        # Default qualitative target
        return "Meets expectations"
    
    def _determine_measurement_approach(self, criterion_desc, category):
        """Determine how to measure each criterion."""
        measurement_approaches = {
            'functional': 'Test case execution and requirement verification',
            'non_functional': 'Performance testing and metric collection',
            'stakeholder': 'Surveys, interviews, and usage analytics',
            'technical': 'Code analysis, architecture review, and quality metrics',
            'business': 'KPI tracking, ROI analysis, and business metric measurement'
        }
        
        base_approach = measurement_approaches.get(category, 'Manual evaluation')
        
        # Customize based on criterion content
        if 'performance' in criterion_desc.lower():
            return 'Automated performance testing with load simulation'
        elif 'usability' in criterion_desc.lower():
            return 'User testing sessions and usability metrics'
        elif 'security' in criterion_desc.lower():
            return 'Security testing and vulnerability assessment'
        elif 'accuracy' in criterion_desc.lower():
            return 'Test data validation and output verification'
        
        return base_approach
    
    def collect_evidence_from_testing(self, test_plan_results, test_coverage_data, 
                                    performance_metrics, defect_tracking_data):
        """
        Collect and organize evidence from systematic testing activities.
        
        Args:
            test_plan_results: Results from executed test plans
            test_coverage_data: Code/requirement coverage information
            performance_metrics: Performance testing measurements
            defect_tracking_data: Bug reports and resolution information
        """
        testing_evidence = {
            'test_execution': {
                'total_tests': test_plan_results.get('total_tests', 0),
                'passed_tests': test_plan_results.get('passed_tests', 0),
                'failed_tests': test_plan_results.get('failed_tests', 0),
                'test_coverage': test_coverage_data.get('percentage', 0),
                'execution_summary': self._analyze_test_execution(test_plan_results)
            },
            'performance_analysis': {
                'response_times': performance_metrics.get('response_times', {}),
                'throughput': performance_metrics.get('throughput', {}),
                'resource_usage': performance_metrics.get('resource_usage', {}),
                'scalability_results': performance_metrics.get('scalability', {}),
                'performance_summary': self._analyze_performance_metrics(performance_metrics)
            },
            'quality_metrics': {
                'defect_density': defect_tracking_data.get('defects_per_kloc', 0),
                'defect_resolution_time': defect_tracking_data.get('avg_resolution_time', 0),
                'critical_defects': defect_tracking_data.get('critical_count', 0),
                'defect_trend': self._analyze_defect_trends(defect_tracking_data)
            }
        }
        
        self.evidence_sources['testing'] = testing_evidence
        
        # Map testing evidence to evaluation criteria
        self._map_evidence_to_criteria('testing', testing_evidence)
    
    def collect_stakeholder_feedback(self, user_surveys, stakeholder_interviews, 
                                   usage_analytics, support_tickets):
        """
        Collect and organize feedback from various stakeholder sources.
        
        Args:
            user_surveys: Survey responses from end users
            stakeholder_interviews: Structured feedback from key stakeholders
            usage_analytics: System usage patterns and metrics
            support_tickets: User-reported issues and requests
        """
        stakeholder_evidence = {
            'user_satisfaction': {
                'survey_responses': len(user_surveys),
                'average_satisfaction': self._calculate_average_satisfaction(user_surveys),
                'satisfaction_distribution': self._analyze_satisfaction_distribution(user_surveys),
                'key_feedback_themes': self._extract_feedback_themes(user_surveys)
            },
            'stakeholder_alignment': {
                'interview_count': len(stakeholder_interviews),
                'alignment_score': self._assess_stakeholder_alignment(stakeholder_interviews),
                'priority_concerns': self._identify_stakeholder_concerns(stakeholder_interviews),
                'feature_satisfaction': self._analyze_feature_satisfaction(stakeholder_interviews)
            },
            'usage_patterns': {
                'active_users': usage_analytics.get('active_users', 0),
                'feature_adoption': usage_analytics.get('feature_usage', {}),
                'user_retention': usage_analytics.get('retention_rate', 0),
                'usage_trends': self._analyze_usage_trends(usage_analytics)
            },
            'support_analysis': {
                'ticket_volume': len(support_tickets),
                'issue_categories': self._categorize_support_issues(support_tickets),
                'resolution_satisfaction': self._analyze_support_satisfaction(support_tickets),
                'recurring_issues': self._identify_recurring_issues(support_tickets)
            }
        }
        
        self.evidence_sources['stakeholder'] = stakeholder_evidence
        self.stakeholder_feedback = stakeholder_evidence
        
        # Map stakeholder evidence to evaluation criteria
        self._map_evidence_to_criteria('stakeholder', stakeholder_evidence)
    
    def _analyze_test_execution(self, test_results):
        """Analyze test execution results for patterns and insights."""
        if not test_results:
            return "No test execution data available"
        
        total = test_results.get('total_tests', 1)
        passed = test_results.get('passed_tests', 0)
        failed = test_results.get('failed_tests', 0)
        
        pass_rate = (passed / total) * 100 if total > 0 else 0
        
        summary = f"Test pass rate: {pass_rate:.1f}% ({passed}/{total} tests passed)"
        
        if pass_rate >= 95:
            summary += " - Excellent test performance"
        elif pass_rate >= 85:
            summary += " - Good test performance with minor issues"
        elif pass_rate >= 70:
            summary += " - Moderate test performance requiring attention"
        else:
            summary += " - Poor test performance requiring significant work"
        
        return summary
    
    def _analyze_performance_metrics(self, metrics):
        """Analyze performance testing metrics for evaluation insights."""
        if not metrics:
            return "No performance data available"
        
        response_times = metrics.get('response_times', {})
        avg_response = response_times.get('average', 0)
        
        if avg_response < 1:
            performance_rating = "Excellent"
        elif avg_response < 3:
            performance_rating = "Good"
        elif avg_response < 5:
            performance_rating = "Acceptable"
        else:
            performance_rating = "Poor"
        
        return f"Average response time: {avg_response:.2f}s - {performance_rating} performance"
    
    def _analyze_defect_trends(self, defect_data):
        """Analyze defect tracking data for quality insights."""
        if not defect_data:
            return "No defect data available"
        
        defect_density = defect_data.get('defects_per_kloc', 0)
        critical_defects = defect_data.get('critical_count', 0)
        
        if defect_density < 1 and critical_defects == 0:
            return "Excellent code quality with minimal defects"
        elif defect_density < 3 and critical_defects <= 1:
            return "Good code quality with acceptable defect levels"
        elif defect_density < 5 and critical_defects <= 3:
            return "Moderate code quality requiring improvement"
        else:
            return "Poor code quality requiring significant attention"
    
    def _calculate_average_satisfaction(self, surveys):
        """Calculate average satisfaction score from survey responses."""
        if not surveys:
            return 0
        
        total_score = sum(survey.get('satisfaction_rating', 3) for survey in surveys)
        return total_score / len(surveys)
    
    def _analyze_satisfaction_distribution(self, surveys):
        """Analyze distribution of satisfaction ratings."""
        if not surveys:
            return {}
        
        distribution = {'very_satisfied': 0, 'satisfied': 0, 'neutral': 0, 'dissatisfied': 0, 'very_dissatisfied': 0}
        
        for survey in surveys:
            rating = survey.get('satisfaction_rating', 3)
            if rating >= 4.5:
                distribution['very_satisfied'] += 1
            elif rating >= 3.5:
                distribution['satisfied'] += 1
            elif rating >= 2.5:
                distribution['neutral'] += 1
            elif rating >= 1.5:
                distribution['dissatisfied'] += 1
            else:
                distribution['very_dissatisfied'] += 1
        
        return distribution
    
    def _extract_feedback_themes(self, surveys):
        """Extract common themes from survey feedback."""
        if not surveys:
            return []
        
        # Simplified theme extraction - in practice would use NLP
        common_themes = []
        feedback_text = ' '.join([survey.get('comments', '') for survey in surveys]).lower()
        
        theme_keywords = {
            'usability': ['easy', 'difficult', 'intuitive', 'confusing', 'user-friendly'],
            'performance': ['fast', 'slow', 'responsive', 'loading', 'speed'],
            'reliability': ['reliable', 'crashes', 'bugs', 'stable', 'errors'],
            'features': ['features', 'functionality', 'missing', 'useful', 'unnecessary']
        }
        
        for theme, keywords in theme_keywords.items():
            if any(keyword in feedback_text for keyword in keywords):
                common_themes.append(theme)
        
        return common_themes[:5]  # Return top 5 themes
    
    def _map_evidence_to_criteria(self, evidence_type, evidence_data):
        """Map collected evidence to evaluation criteria."""
        # This would map specific evidence to criteria based on relationships
        # Simplified implementation for demonstration
        pass
    
    def compare_expected_vs_actual_outputs(self, test_scenarios, expected_outputs, actual_outputs):
        """
        Compare expected vs actual outputs to identify discrepancies and issues.
        
        Args:
            test_scenarios: Test scenarios that were executed
            expected_outputs: Expected results for each scenario
            actual_outputs: Actual results produced by the system
        """
        output_analysis = {
            'total_scenarios': len(test_scenarios),
            'exact_matches': 0,
            'partial_matches': 0,
            'discrepancies': [],
            'error_patterns': [],
            'recommendations': []
        }
        
        for i, scenario in enumerate(test_scenarios):
            scenario_id = scenario.get('id', f"scenario_{i+1}")
            expected = expected_outputs.get(scenario_id, '')
            actual = actual_outputs.get(scenario_id, '')
            
            comparison_result = self._compare_outputs(scenario_id, expected, actual, scenario)
            
            if comparison_result['match_type'] == 'exact':
                output_analysis['exact_matches'] += 1
            elif comparison_result['match_type'] == 'partial':
                output_analysis['partial_matches'] += 1
            else:
                output_analysis['discrepancies'].append(comparison_result)
        
        # Analyze patterns in discrepancies
        output_analysis['error_patterns'] = self._identify_error_patterns(
            output_analysis['discrepancies']
        )
        
        # Generate recommendations based on analysis
        output_analysis['recommendations'] = self._generate_output_recommendations(
            output_analysis
        )
        
        self.test_results['output_analysis'] = output_analysis
        return output_analysis
    
    def _compare_outputs(self, scenario_id, expected, actual, scenario_context):
        """Compare expected and actual outputs for a single scenario."""
        comparison = {
            'scenario_id': scenario_id,
            'scenario_description': scenario_context.get('description', ''),
            'expected': expected,
            'actual': actual,
            'match_type': 'none',
            'discrepancy_details': [],
            'severity': 'low',
            'root_cause_hypothesis': ''
        }
        
        # Exact match check
        if str(expected).strip() == str(actual).strip():
            comparison['match_type'] = 'exact'
            return comparison
        
        # Partial match analysis
        expected_str = str(expected).lower().strip()
        actual_str = str(actual).lower().strip()
        
        # Check for partial content match
        if expected_str in actual_str or actual_str in expected_str:
            comparison['match_type'] = 'partial'
            comparison['discrepancy_details'].append('Partial content match detected')
        
        # Identify specific discrepancy types
        if expected_str and not actual_str:
            comparison['discrepancy_details'].append('No output produced when output expected')
            comparison['severity'] = 'high'
        elif not expected_str and actual_str:
            comparison['discrepancy_details'].append('Unexpected output produced')
            comparison['severity'] = 'medium'
        elif expected_str != actual_str:
            comparison['discrepancy_details'].append('Output content differs from expected')
            comparison['severity'] = 'medium'
        
        # Generate root cause hypothesis
        comparison['root_cause_hypothesis'] = self._hypothesize_root_cause(
            expected, actual, scenario_context
        )
        
        return comparison
    
    def _hypothesize_root_cause(self, expected, actual, scenario_context):
        """Generate hypothesis about root cause of output discrepancy."""
        expected_str = str(expected).lower()
        actual_str = str(actual).lower()
        
        # Data processing issues
        if 'error' in actual_str or 'exception' in actual_str:
            return "System error or exception during processing"
        
        # Formatting issues
        if expected_str.replace(' ', '') == actual_str.replace(' ', ''):
            return "Output formatting or whitespace differences"
        
        # Calculation issues
        if any(char.isdigit() for char in expected_str) and any(char.isdigit() for char in actual_str):
            return "Possible calculation or numeric processing error"
        
        # Logic issues
        if scenario_context.get('type') == 'business_logic':
            return "Business logic implementation may not match requirements"
        
        return "Root cause requires further investigation"
    
    def _identify_error_patterns(self, discrepancies):
        """Identify common patterns across output discrepancies."""
        if not discrepancies:
            return []
        
        patterns = []
        
        # Group by severity
        high_severity_count = sum(1 for d in discrepancies if d['severity'] == 'high')
        if high_severity_count > len(discrepancies) * 0.3:
            patterns.append("High proportion of severe output discrepancies")
        
        # Group by root cause
        root_causes = [d['root_cause_hypothesis'] for d in discrepancies]
        common_causes = {}
        for cause in root_causes:
            common_causes[cause] = common_causes.get(cause, 0) + 1
        
        for cause, count in common_causes.items():
            if count >= 2:
                patterns.append(f"Multiple instances of: {cause}")
        
        return patterns
    
    def _generate_output_recommendations(self, analysis):
        """Generate recommendations based on output analysis."""
        recommendations = []
        
        total_scenarios = analysis['total_scenarios']
        exact_matches = analysis['exact_matches']
        
        if total_scenarios > 0:
            success_rate = (exact_matches / total_scenarios) * 100
            
            if success_rate < 70:
                recommendations.append("Critical: Low output accuracy requires immediate attention")
                recommendations.append("Review and strengthen testing procedures")
                recommendations.append("Conduct thorough requirement analysis and implementation review")
            elif success_rate < 90:
                recommendations.append("Moderate: Some output discrepancies need resolution")
                recommendations.append("Focus on specific failing scenarios and root causes")
            else:
                recommendations.append("Good: Minor output discrepancies can be addressed incrementally")
        
        # Pattern-specific recommendations
        for pattern in analysis['error_patterns']:
            if 'calculation' in pattern.lower():
                recommendations.append("Review mathematical calculations and numeric processing logic")
            elif 'formatting' in pattern.lower():
                recommendations.append("Standardize output formatting and data presentation")
            elif 'business logic' in pattern.lower():
                recommendations.append("Validate business logic implementation against requirements")
        
        return recommendations
    
    def generate_evaluation_report(self, include_executive_summary=True, 
                                 include_detailed_findings=True, include_recommendations=True):
        """
        Generate comprehensive evaluation report synthesizing all evidence and analysis.
        
        Args:
            include_executive_summary: Include high-level summary for executives
            include_detailed_findings: Include detailed analysis and evidence
            include_recommendations: Include actionable recommendations
        """
        report = f"""
SOFTWARE SOLUTION EVALUATION REPORT
Solution: {self.solution_name}
Evaluation Scope: {self.evaluation_scope}
Report Date: 2025-09-20
"""
        
        if include_executive_summary:
            report += self._generate_executive_summary()
        
        if include_detailed_findings:
            report += self._generate_detailed_findings()
        
        if include_recommendations:
            report += self._generate_recommendations_section()
        
        # Add reflection section
        report += self._generate_reflection_section()
        
        return report
    
    def _generate_executive_summary(self):
        """Generate executive summary of evaluation findings."""
        summary = "\n\nEXECUTIVE SUMMARY\n" + "="*50 + "\n"
        
        # Overall assessment
        overall_score = self._calculate_overall_evaluation_score()
        summary += f"\nOverall Evaluation Score: {overall_score:.1%}\n"
        
        if overall_score >= 0.85:
            summary += "Assessment: Excellent - Solution exceeds expectations\n"
        elif overall_score >= 0.75:
            summary += "Assessment: Good - Solution meets most requirements with minor improvements needed\n"
        elif overall_score >= 0.60:
            summary += "Assessment: Satisfactory - Solution meets basic requirements but needs significant improvements\n"
        else:
            summary += "Assessment: Unsatisfactory - Solution requires major revisions before deployment\n"
        
        # Key highlights
        summary += "\nKey Findings:\n"
        
        # Testing results
        if 'testing' in self.evidence_sources:
            testing_data = self.evidence_sources['testing']
            test_summary = testing_data.get('test_execution', {}).get('execution_summary', '')
            summary += f"• Testing: {test_summary}\n"
        
        # Stakeholder satisfaction
        if 'stakeholder' in self.evidence_sources:
            stakeholder_data = self.evidence_sources['stakeholder']
            avg_satisfaction = stakeholder_data.get('user_satisfaction', {}).get('average_satisfaction', 0)
            summary += f"• User Satisfaction: {avg_satisfaction:.1f}/5.0\n"
        
        # Critical issues
        if self.test_results.get('output_analysis'):
            output_analysis = self.test_results['output_analysis']
            total_scenarios = output_analysis.get('total_scenarios', 0)
            exact_matches = output_analysis.get('exact_matches', 0)
            if total_scenarios > 0:
                accuracy = (exact_matches / total_scenarios) * 100
                summary += f"• Output Accuracy: {accuracy:.1f}%\n"
        
        return summary
    
    def _generate_detailed_findings(self):
        """Generate detailed findings section of evaluation report."""
        findings = "\n\nDETAILED FINDINGS\n" + "="*50 + "\n"
        
        # Criteria evaluation results
        findings += "\nEvaluation Criteria Results:\n"
        findings += "-" * 30 + "\n"
        
        for category, criteria_list in self.evaluation_criteria.items():
            findings += f"\n{category.replace('_', ' ').title()} Criteria:\n"
            
            for criterion in criteria_list:
                status = criterion.get('evaluation_status', 'pending')
                target = criterion.get('target_value', 'TBD')
                actual = criterion.get('actual_value', 'Not measured')
                
                findings += f"• {criterion['description']}\n"
                findings += f"  Target: {target} | Actual: {actual} | Status: {status}\n"
        
        # Evidence summary
        if self.evidence_sources:
            findings += "\nEvidence Summary:\n"
            findings += "-" * 30 + "\n"
            
            for source_type, evidence in self.evidence_sources.items():
                findings += f"\n{source_type.title()} Evidence:\n"
                findings += self._summarize_evidence(evidence)
        
        # Output analysis
        if self.test_results.get('output_analysis'):
            findings += "\nOutput Analysis:\n"
            findings += "-" * 30 + "\n"
            output_analysis = self.test_results['output_analysis']
            
            findings += f"Total Test Scenarios: {output_analysis.get('total_scenarios', 0)}\n"
            findings += f"Exact Matches: {output_analysis.get('exact_matches', 0)}\n"
            findings += f"Partial Matches: {output_analysis.get('partial_matches', 0)}\n"
            findings += f"Discrepancies: {len(output_analysis.get('discrepancies', []))}\n"
            
            if output_analysis.get('error_patterns'):
                findings += "\nIdentified Error Patterns:\n"
                for pattern in output_analysis['error_patterns']:
                    findings += f"• {pattern}\n"
        
        return findings
    
    def _generate_recommendations_section(self):
        """Generate recommendations section of evaluation report."""
        recommendations = "\n\nRECOMMENDATIONS\n" + "="*50 + "\n"
        
        # Collect recommendations from various sources
        all_recommendations = []
        
        # Output analysis recommendations
        if self.test_results.get('output_analysis', {}).get('recommendations'):
            all_recommendations.extend(self.test_results['output_analysis']['recommendations'])
        
        # Add general recommendations based on evaluation
        if self.recommendations:
            all_recommendations.extend(self.recommendations)
        
        # Prioritize recommendations
        prioritized_recommendations = self._prioritize_recommendations(all_recommendations)
        
        recommendations += "\nHigh Priority:\n"
        for rec in prioritized_recommendations.get('high', []):
            recommendations += f"• {rec}\n"
        
        recommendations += "\nMedium Priority:\n"
        for rec in prioritized_recommendations.get('medium', []):
            recommendations += f"• {rec}\n"
        
        recommendations += "\nLow Priority:\n"
        for rec in prioritized_recommendations.get('low', []):
            recommendations += f"• {rec}\n"
        
        return recommendations
    
    def _generate_reflection_section(self):
        """Generate reflection section covering maintainability, deployment, and lessons learned."""
        reflection = "\n\nREFLECTION AND LESSONS LEARNED\n" + "="*50 + "\n"
        
        reflection += "\nMaintainability Assessment:\n"
        reflection += self._assess_maintainability()
        
        reflection += "\nDeployment Readiness:\n"
        reflection += self._assess_deployment_readiness()
        
        reflection += "\nLessons Learned:\n"
        reflection += self._document_lessons_learned()
        
        reflection += "\nFuture Considerations:\n"
        reflection += self._identify_future_considerations()
        
        return reflection
    
    def _calculate_overall_evaluation_score(self):
        """Calculate weighted overall evaluation score."""
        if not self.evaluation_criteria:
            return 0.5  # Default neutral score
        
        total_weight = 0
        weighted_score = 0
        
        for category, criteria_list in self.evaluation_criteria.items():
            for criterion in criteria_list:
                weight = criterion.get('weight', 0.2)
                
                # Mock scoring based on status - in practice would use actual measurements
                status = criterion.get('evaluation_status', 'pending')
                if status == 'passed' or status == 'excellent':
                    score = 1.0
                elif status == 'good' or status == 'acceptable':
                    score = 0.8
                elif status == 'fair' or status == 'needs_improvement':
                    score = 0.6
                elif status == 'poor' or status == 'failed':
                    score = 0.3
                else:
                    score = 0.5  # Pending/unknown
                
                weighted_score += score * weight
                total_weight += weight
        
        return weighted_score / total_weight if total_weight > 0 else 0.5
    
    def _summarize_evidence(self, evidence):
        """Generate summary of evidence for reporting."""
        summary = ""
        
        if isinstance(evidence, dict):
            for key, value in evidence.items():
                if isinstance(value, dict):
                    summary += f"  {key.replace('_', ' ').title()}: Multiple metrics collected\n"
                elif isinstance(value, (int, float)):
                    summary += f"  {key.replace('_', ' ').title()}: {value}\n"
                elif isinstance(value, str):
                    summary += f"  {key.replace('_', ' ').title()}: {value}\n"
        
        return summary
    
    def _prioritize_recommendations(self, recommendations):
        """Prioritize recommendations by urgency and impact."""
        prioritized = {'high': [], 'medium': [], 'low': []}
        
        high_priority_keywords = ['critical', 'immediate', 'security', 'data loss', 'major']
        medium_priority_keywords = ['moderate', 'improve', 'enhance', 'optimize']
        
        for rec in recommendations:
            rec_lower = rec.lower()
            
            if any(keyword in rec_lower for keyword in high_priority_keywords):
                prioritized['high'].append(rec)
            elif any(keyword in rec_lower for keyword in medium_priority_keywords):
                prioritized['medium'].append(rec)
            else:
                prioritized['low'].append(rec)
        
        return prioritized
    
    def _assess_maintainability(self):
        """Assess solution maintainability for reflection."""
        assessment = ""
        
        # Code quality factors
        assessment += "• Code Structure: "
        if 'technical' in self.evidence_sources:
            assessment += "Well-organized with clear separation of concerns\n"
        else:
            assessment += "Assessment pending - code review needed\n"
        
        assessment += "• Documentation: "
        assessment += "Comprehensive documentation supports maintenance activities\n"
        
        assessment += "• Testing Coverage: "
        if 'testing' in self.evidence_sources:
            testing_data = self.evidence_sources['testing']
            coverage = testing_data.get('test_execution', {}).get('test_coverage', 0)
            assessment += f"{coverage}% test coverage provides good maintainability support\n"
        else:
            assessment += "Test coverage assessment needed\n"
        
        return assessment
    
    def _assess_deployment_readiness(self):
        """Assess deployment readiness for reflection."""
        readiness = ""
        
        # Technical readiness
        readiness += "• Technical Infrastructure: "
        readiness += "Production environment configured and tested\n"
        
        # User readiness
        readiness += "• User Preparation: "
        if 'stakeholder' in self.evidence_sources:
            readiness += "User training completed and feedback incorporated\n"
        else:
            readiness += "User preparation assessment needed\n"
        
        # Process readiness
        readiness += "• Operational Procedures: "
        readiness += "Deployment and rollback procedures documented and tested\n"
        
        return readiness
    
    def _document_lessons_learned(self):
        """Document key lessons learned during development and evaluation."""
        lessons = ""
        
        lessons += "• Requirements Management: "
        lessons += "Early stakeholder engagement critical for requirement clarity\n"
        
        lessons += "• Testing Strategy: "
        lessons += "Comprehensive testing prevents deployment issues and reduces rework\n"
        
        lessons += "• User Feedback: "
        lessons += "Regular user feedback throughout development improves final solution quality\n"
        
        lessons += "• Technical Decisions: "
        lessons += "Architecture decisions impact long-term maintainability and scalability\n"
        
        return lessons
    
    def _identify_future_considerations(self):
        """Identify considerations for future development and improvements."""
        considerations = ""
        
        considerations += "• Scalability: "
        considerations += "Monitor performance as user base grows and plan capacity expansion\n"
        
        considerations += "• Feature Evolution: "
        considerations += "Establish process for evaluating and implementing new feature requests\n"
        
        considerations += "• Technology Updates: "
        considerations += "Plan for regular updates to underlying technologies and dependencies\n"
        
        considerations += "• User Support: "
        considerations += "Maintain robust user support processes and knowledge base\n"
        
        return considerations

def demonstrate_solution_evaluation():
    """
    Practical example of evaluating a school management system solution.
    """
    print("SOLUTION EVALUATION EXAMPLE")
    print("=" * 29)
    
    # Create solution evaluator
    evaluator = SolutionEvaluator(
        "School Management System",
        "Complete system evaluation including functionality, performance, and user satisfaction"
    )
    
    # Define evaluation criteria
    evaluator.define_evaluation_criteria(
        functional_criteria=[
            "Student enrollment and registration processes work correctly",
            "Grade recording and calculation accuracy is 100%",
            "Parent portal displays real-time student information",
            "Teacher interface supports all required grading workflows",
            "Administrative reporting generates required compliance reports"
        ],
        non_functional_criteria=[
            "System response time under 3 seconds for 95% of operations",
            "System supports 500 concurrent users without performance degradation",
            "System availability of 99.5% during school hours",
            "Data backup and recovery procedures work within 4 hours",
            "User interface meets WCAG 2.1 AA accessibility standards"
        ],
        stakeholder_criteria=[
            "Teacher satisfaction score above 4.0/5.0",
            "Parent satisfaction with information access above 4.2/5.0",
            "Administrative staff report 30% reduction in manual tasks",
            "Student users find interface intuitive and helpful",
            "IT support tickets reduced by 50% compared to previous system"
        ],
        technical_criteria=[
            "Code coverage above 80% with comprehensive test suite",
            "Security vulnerability scan shows zero critical issues",
            "Database performance optimized with query response under 100ms",
            "System architecture supports horizontal scaling",
            "Integration with existing school systems functions correctly"
        ],
        business_criteria=[
            "Implementation completed within budget and timeline",
            "ROI achieved within 18 months of deployment",
            "Compliance with education sector regulations maintained",
            "Staff training costs remain under 10% of total project cost",
            "System reduces overall administrative costs by 25%"
        ]
    )
    
    # Collect testing evidence
    evaluator.collect_evidence_from_testing(
        test_plan_results={
            'total_tests': 245,
            'passed_tests': 231,
            'failed_tests': 14,
            'test_categories': {
                'functional': {'passed': 98, 'failed': 2},
                'integration': {'passed': 67, 'failed': 8},
                'performance': {'passed': 44, 'failed': 1},
                'security': {'passed': 22, 'failed': 3}
            }
        },
        test_coverage_data={
            'percentage': 82,
            'lines_covered': 12543,
            'total_lines': 15298,
            'uncovered_areas': ['Error handling', 'Legacy data migration']
        },
        performance_metrics={
            'response_times': {
                'average': 1.8,
                'median': 1.2,
                'p95': 2.9,
                'p99': 4.1
            },
            'throughput': {
                'requests_per_second': 150,
                'concurrent_users_tested': 300
            },
            'resource_usage': {
                'cpu_utilization': 65,
                'memory_usage': 78,
                'database_connections': 85
            }
        },
        defect_tracking_data={
            'defects_per_kloc': 2.3,
            'avg_resolution_time': 3.2,
            'critical_count': 2,
            'total_defects': 28,
            'resolved_defects': 24
        }
    )
    
    # Collect stakeholder feedback
    evaluator.collect_stakeholder_feedback(
        user_surveys=[
            {'user_type': 'teacher', 'satisfaction_rating': 4.2, 'comments': 'Much easier than old system'},
            {'user_type': 'teacher', 'satisfaction_rating': 3.8, 'comments': 'Some features still confusing'},
            {'user_type': 'parent', 'satisfaction_rating': 4.5, 'comments': 'Love real-time grade access'},
            {'user_type': 'parent', 'satisfaction_rating': 4.1, 'comments': 'Mobile app works great'},
            {'user_type': 'admin', 'satisfaction_rating': 4.3, 'comments': 'Reports are much faster now'}
        ],
        stakeholder_interviews=[
            {'stakeholder': 'Principal', 'feedback': 'Significant improvement in efficiency'},
            {'stakeholder': 'IT Manager', 'feedback': 'Integration went smoothly overall'},
            {'stakeholder': 'Department Head', 'feedback': 'Teachers adapting well to new workflows'}
        ],
        usage_analytics={
            'active_users': 1247,
            'daily_logins': 892,
            'feature_usage': {
                'gradebook': 95,
                'attendance': 87,
                'messaging': 72,
                'reports': 68
            },
            'retention_rate': 94
        },
        support_tickets=[
            {'category': 'login_issues', 'count': 23, 'avg_resolution': 2.1},
            {'category': 'grade_entry', 'count': 15, 'avg_resolution': 1.8},
            {'category': 'report_generation', 'count': 12, 'avg_resolution': 3.2},
            {'category': 'mobile_app', 'count': 8, 'avg_resolution': 2.5}
        ]
    )
    
    # Compare expected vs actual outputs for key scenarios
    test_scenarios = [
        {'id': 'grade_calculation', 'description': 'Calculate semester GPA for student'},
        {'id': 'attendance_report', 'description': 'Generate monthly attendance report'},
        {'id': 'parent_notification', 'description': 'Send grade update notification to parent'},
        {'id': 'schedule_conflict', 'description': 'Detect and report scheduling conflicts'}
    ]
    
    expected_outputs = {
        'grade_calculation': '3.75 GPA (A- average)',
        'attendance_report': 'Student A: 95% attendance (19/20 days)',
        'parent_notification': 'Email sent: Math quiz grade posted (B+)',
        'schedule_conflict': 'Conflict detected: Room 101 double-booked at 2:00 PM'
    }
    
    actual_outputs = {
        'grade_calculation': '3.75 GPA (A- average)',
        'attendance_report': 'Student A: 95% attendance (19 of 20 days)',
        'parent_notification': 'Email sent: Math quiz grade posted (B+)',
        'schedule_conflict': 'No conflicts detected'
    }
    
    output_analysis = evaluator.compare_expected_vs_actual_outputs(
        test_scenarios, expected_outputs, actual_outputs
    )
    
    # Generate comprehensive evaluation report
    evaluation_report = evaluator.generate_evaluation_report()
    print(evaluation_report)
    
    print(f"\nOUTPUT ANALYSIS SUMMARY:")
    print(f"Total Scenarios: {output_analysis['total_scenarios']}")
    print(f"Exact Matches: {output_analysis['exact_matches']}")
    print(f"Discrepancies: {len(output_analysis['discrepancies'])}")
    
    if output_analysis['discrepancies']:
        print("\nKey Discrepancies:")
        for discrepancy in output_analysis['discrepancies'][:3]:
            print(f"• {discrepancy['scenario_description']}: {discrepancy['root_cause_hypothesis']}")
    
    return evaluator

# Run demonstration
if __name__ == "__main__":
    evaluation_demo = demonstrate_solution_evaluation()

```

---

## Test plan development and testing outcomes

Effective evaluation requires systematic testing that produces reliable evidence about solution performance. Test plans serve as blueprints for gathering objective data that informs evaluation decisions and identifies areas for improvement.

### Test plan integration with evaluation

**Test plans for evaluation** differ from development testing by focusing on evidence collection for decision-making rather than defect detection. Evaluation testing assesses whether the solution meets defined criteria and stakeholder expectations.

**Key components of evaluation-focused test plans:**

- **Requirement traceability**: Link test cases directly to evaluation criteria

- **Evidence collection**: Design tests to produce measurable evidence

- **Stakeholder scenarios**: Include real-world usage patterns from different user types

- **Boundary and edge cases**: Test limits and exceptional conditions

- **Performance baselines**: Establish metrics for non-functional requirements

```python
class EvaluationTestPlanner:
    """
    Framework for developing test plans specifically focused on solution evaluation.
    Links testing activities directly to evaluation criteria and evidence collection.
    """
    
    def __init__(self, solution_name, evaluation_objectives):
        self.solution_name = solution_name
        self.evaluation_objectives = evaluation_objectives
        self.test_plan = {}
        self.test_cases = {}
        self.evaluation_evidence = {}
        self.testing_outcomes = {}
        
    def create_evaluation_test_plan(self, functional_requirements, non_functional_requirements,
                                  stakeholder_scenarios, evaluation_criteria):
        """
        Create comprehensive test plan aligned with evaluation objectives.
        
        Args:
            functional_requirements: Functional behaviors to validate
            non_functional_requirements: Performance, usability, security requirements
            stakeholder_scenarios: Real-world usage scenarios from different user types
            evaluation_criteria: Specific criteria that testing will provide evidence for
        """
        self.test_plan = {
            'plan_overview': {
                'solution': self.solution_name,
                'objectives': self.evaluation_objectives,
                'evaluation_focus': 'Evidence collection for solution effectiveness assessment',
                'testing_approach': 'Mixed: automated functional testing, manual scenario testing, performance testing'
            },
            'functional_test_suite': self._plan_functional_testing(functional_requirements, evaluation_criteria),
            'non_functional_test_suite': self._plan_non_functional_testing(non_functional_requirements, evaluation_criteria),
            'scenario_test_suite': self._plan_scenario_testing(stakeholder_scenarios, evaluation_criteria),
            'boundary_test_suite': self._plan_boundary_testing(functional_requirements),
            'integration_test_suite': self._plan_integration_testing(),
            'evidence_collection_plan': self._plan_evidence_collection(evaluation_criteria)
        }
        
        return self.test_plan
    
    def _plan_functional_testing(self, requirements, criteria):
        """Plan functional testing to validate requirement compliance."""
        functional_suite = {
            'suite_purpose': 'Validate functional requirement compliance for evaluation',
            'test_categories': [],
            'requirement_coverage': {},
            'evidence_targets': []
        }
        
        for req in requirements:
            req_id = req.get('id', f"req_{len(functional_suite['test_categories']) + 1}")
            
            test_category = {
                'requirement_id': req_id,
                'requirement_description': req['description'],
                'test_cases': self._generate_functional_test_cases(req),
                'evaluation_criteria_mapping': self._map_requirement_to_criteria(req, criteria),
                'evidence_collection': {
                    'success_metrics': ['Pass/fail rate', 'Requirement coverage', 'Defect density'],
                    'data_points': ['Test execution results', 'Error logs', 'Performance during execution'],
                    'evaluation_impact': 'Validates functional criterion compliance'
                }
            }
            
            functional_suite['test_categories'].append(test_category)
            functional_suite['requirement_coverage'][req_id] = len(test_category['test_cases'])
        
        return functional_suite
    
    def _plan_non_functional_testing(self, nf_requirements, criteria):
        """Plan non-functional testing for performance, usability, security evaluation."""
        nf_suite = {
            'suite_purpose': 'Evaluate non-functional characteristics for solution assessment',
            'performance_testing': self._plan_performance_tests(nf_requirements),
            'usability_testing': self._plan_usability_tests(nf_requirements),
            'security_testing': self._plan_security_tests(nf_requirements),
            'reliability_testing': self._plan_reliability_tests(nf_requirements),
            'evidence_targets': ['Performance baselines', 'User experience metrics', 'Security compliance']
        }
        
        return nf_suite
    
    def _plan_scenario_testing(self, scenarios, criteria):
        """Plan realistic scenario testing with different stakeholder perspectives."""
        scenario_suite = {
            'suite_purpose': 'Validate solution effectiveness in real-world usage scenarios',
            'stakeholder_scenarios': [],
            'cross_functional_scenarios': [],
            'edge_case_scenarios': []
        }
        
        for scenario in scenarios:
            stakeholder_type = scenario.get('stakeholder_type', 'generic_user')
            
            scenario_test = {
                'scenario_name': scenario['name'],
                'stakeholder_type': stakeholder_type,
                'business_context': scenario['context'],
                'workflow_steps': scenario['steps'],
                'success_criteria': scenario['success_criteria'],
                'test_data_requirements': self._determine_scenario_test_data(scenario),
                'evaluation_evidence': {
                    'workflow_completion_rate': 'Percentage of successful scenario completions',
                    'user_satisfaction_score': 'Stakeholder feedback on scenario experience',
                    'efficiency_metrics': 'Time and effort required to complete scenario',
                    'error_handling': 'How well solution handles scenario variations'
                }
            }
            
            scenario_suite['stakeholder_scenarios'].append(scenario_test)
        
        return scenario_suite
    
    def _plan_boundary_testing(self, requirements):
        """Plan boundary and edge case testing for robustness evaluation."""
        boundary_suite = {
            'suite_purpose': 'Test solution behavior at operational limits and edge cases',
            'data_boundary_tests': [],
            'load_boundary_tests': [],
            'input_validation_tests': [],
            'error_handling_tests': []
        }
        
        # Generate boundary tests based on requirements
        for req in requirements:
            req_description = req.get('description', '').lower()
            
            # Data boundary tests
            if 'number' in req_description or 'amount' in req_description or 'quantity' in req_description:
                boundary_suite['data_boundary_tests'].append({
                    'test_type': 'Numeric boundary',
                    'requirement': req['description'],
                    'test_cases': ['Minimum valid value', 'Maximum valid value', 'Just below minimum', 'Just above maximum'],
                    'evidence_target': 'Data validation robustness'
                })
            
            # Input validation tests
            if 'input' in req_description or 'enter' in req_description or 'form' in req_description:
                boundary_suite['input_validation_tests'].append({
                    'test_type': 'Input validation',
                    'requirement': req['description'],
                    'test_cases': ['Empty input', 'Maximum length input', 'Special characters', 'Invalid formats'],
                    'evidence_target': 'Input handling robustness'
                })
        
        return boundary_suite
    
    def _plan_integration_testing(self):
        """Plan integration testing for system-level evaluation."""
        integration_suite = {
            'suite_purpose': 'Validate solution integration and system-level behavior',
            'internal_integration': 'Testing between solution components',
            'external_integration': 'Testing with external systems and services',
            'data_flow_testing': 'Validating data consistency across integrations',
            'end_to_end_testing': 'Complete workflow testing across all integrations'
        }
        
        return integration_suite
    
    def _plan_evidence_collection(self, criteria):
        """Plan systematic evidence collection aligned with evaluation criteria."""
        evidence_plan = {
            'automated_evidence': {
                'test_execution_logs': 'Automated collection of test results and metrics',
                'performance_monitoring': 'Real-time performance data during testing',
                'error_tracking': 'Automated capture of errors and exceptions',
                'coverage_analysis': 'Code and requirement coverage measurements'
            },
            'manual_evidence': {
                'stakeholder_feedback': 'Structured collection of user experience feedback',
                'expert_evaluation': 'Technical expert assessment of solution quality',
                'compliance_verification': 'Manual verification of regulatory compliance',
                'usability_observations': 'Observed user behavior during scenario testing'
            },
            'evidence_mapping': self._map_evidence_to_criteria(criteria),
            'quality_assurance': {
                'evidence_validation': 'Verification of evidence accuracy and completeness',
                'bias_mitigation': 'Procedures to reduce evaluation bias',
                'documentation_standards': 'Consistent evidence documentation formats'
            }
        }
        
        return evidence_plan
    
    def _generate_functional_test_cases(self, requirement):
        """Generate specific test cases for a functional requirement."""
        test_cases = []
        
        req_description = requirement.get('description', '').lower()
        
        # Basic positive test case
        test_cases.append({
            'case_id': f"{requirement.get('id', 'req')}_positive",
            'description': f"Verify {requirement['description']} works correctly with valid inputs",
            'test_type': 'positive',
            'expected_outcome': 'Requirement satisfied successfully'
        })
        
        # Negative test case
        test_cases.append({
            'case_id': f"{requirement.get('id', 'req')}_negative",
            'description': f"Verify {requirement['description']} handles invalid inputs appropriately",
            'test_type': 'negative',
            'expected_outcome': 'Appropriate error handling or validation'
        })
        
        # Edge case if applicable
        if 'calculate' in req_description or 'process' in req_description:
            test_cases.append({
                'case_id': f"{requirement.get('id', 'req')}_edge",
                'description': f"Verify {requirement['description']} handles edge cases correctly",
                'test_type': 'edge_case',
                'expected_outcome': 'Correct behavior at operational boundaries'
            })
        
        return test_cases
    
    def _plan_performance_tests(self, nf_requirements):
        """Plan performance testing for non-functional evaluation."""
        performance_tests = []
        
        for req in nf_requirements:
            if 'performance' in req.get('description', '').lower() or 'response' in req.get('description', '').lower():
                performance_tests.append({
                    'test_name': f"Performance validation for {req['description']}",
                    'test_type': 'load_testing',
                    'metrics': ['Response time', 'Throughput', 'Resource utilization'],
                    'success_criteria': req.get('target_value', 'Under 3 seconds response time')
                })
        
        return performance_tests
    
    def _plan_usability_tests(self, nf_requirements):
        """Plan usability testing for user experience evaluation."""
        usability_tests = []
        
        for req in nf_requirements:
            if 'usability' in req.get('description', '').lower() or 'user' in req.get('description', '').lower():
                usability_tests.append({
                    'test_name': f"Usability validation for {req['description']}",
                    'test_type': 'user_testing',
                    'metrics': ['Task completion rate', 'User satisfaction', 'Error rate'],
                    'participants': 'Representative stakeholder groups'
                })
        
        return usability_tests
    
    def _plan_security_tests(self, nf_requirements):
        """Plan security testing for security requirement evaluation."""
        security_tests = []
        
        for req in nf_requirements:
            if 'security' in req.get('description', '').lower() or 'access' in req.get('description', '').lower():
                security_tests.append({
                    'test_name': f"Security validation for {req['description']}",
                    'test_type': 'security_testing',
                    'areas': ['Authentication', 'Authorization', 'Data protection', 'Input validation'],
                    'compliance_check': 'Verify against security standards'
                })
        
        return security_tests
    
    def _plan_reliability_tests(self, nf_requirements):
        """Plan reliability testing for system stability evaluation."""
        reliability_tests = []
        
        for req in nf_requirements:
            if 'reliability' in req.get('description', '').lower() or 'availability' in req.get('description', '').lower():
                reliability_tests.append({
                    'test_name': f"Reliability validation for {req['description']}",
                    'test_type': 'reliability_testing',
                    'duration': 'Extended testing period',
                    'metrics': ['Uptime', 'Error recovery', 'Data consistency']
                })
        
        return reliability_tests
    
    def _determine_scenario_test_data(self, scenario):
        """Determine test data requirements for scenario testing."""
        test_data = {
            'data_volume': 'Realistic data volumes matching production usage',
            'data_variety': 'Representative data covering different scenario variations',
            'data_quality': 'High-quality data that enables realistic testing',
            'data_privacy': 'Anonymized or synthetic data protecting real user information'
        }
        
        # Customize based on scenario type
        scenario_context = scenario.get('context', '').lower()
        if 'student' in scenario_context:
            test_data['specific_requirements'] = 'Student records, grades, enrollment data'
        elif 'financial' in scenario_context:
            test_data['specific_requirements'] = 'Transaction records, account data, payment information'
        elif 'inventory' in scenario_context:
            test_data['specific_requirements'] = 'Product data, stock levels, supplier information'
        
        return test_data
    
    def _map_requirement_to_criteria(self, requirement, criteria):
        """Map functional requirements to evaluation criteria."""
        mapping = []
        
        req_desc = requirement.get('description', '').lower()
        
        for criterion in criteria:
            criterion_desc = criterion.get('description', '').lower()
            
            # Simple keyword matching - in practice would be more sophisticated
            if any(word in criterion_desc for word in req_desc.split() if len(word) > 3):
                mapping.append({
                    'criterion_id': criterion.get('id'),
                    'criterion_description': criterion.get('description'),
                    'evidence_contribution': 'Functional validation supports criterion assessment'
                })
        
        return mapping
    
    def _map_evidence_to_criteria(self, criteria):
        """Map evidence collection to specific evaluation criteria."""
        mapping = {}
        
        for criterion in criteria:
            criterion_id = criterion.get('id', 'unknown')
            criterion_desc = criterion.get('description', '').lower()
            
            if 'performance' in criterion_desc:
                mapping[criterion_id] = ['Performance test results', 'Response time measurements', 'Load test outcomes']
            elif 'usability' in criterion_desc:
                mapping[criterion_id] = ['User testing feedback', 'Task completion rates', 'Satisfaction surveys']
            elif 'security' in criterion_desc:
                mapping[criterion_id] = ['Security test results', 'Vulnerability assessments', 'Compliance verification']
            elif 'functional' in criterion_desc:
                mapping[criterion_id] = ['Test case execution results', 'Requirement coverage', 'Defect analysis']
            else:
                mapping[criterion_id] = ['General test results', 'Stakeholder feedback', 'Expert evaluation']
        
        return mapping
    
    def execute_test_plan_for_evaluation(self, test_execution_data, stakeholder_feedback_data, 
                                       performance_metrics_data):
        """
        Execute test plan and collect evaluation evidence.
        
        Args:
            test_execution_data: Results from automated and manual test execution
            stakeholder_feedback_data: Feedback collected during scenario testing
            performance_metrics_data: Performance measurements from testing
        """
        execution_results = {
            'execution_summary': {
                'total_test_cases': test_execution_data.get('total_cases', 0),
                'executed_cases': test_execution_data.get('executed_cases', 0),
                'passed_cases': test_execution_data.get('passed_cases', 0),
                'failed_cases': test_execution_data.get('failed_cases', 0),
                'blocked_cases': test_execution_data.get('blocked_cases', 0),
                'execution_coverage': self._calculate_execution_coverage(test_execution_data)
            },
            'functional_results': self._analyze_functional_test_results(test_execution_data),
            'non_functional_results': self._analyze_non_functional_results(performance_metrics_data),
            'scenario_results': self._analyze_scenario_test_results(stakeholder_feedback_data),
            'evaluation_evidence': self._extract_evaluation_evidence(
                test_execution_data, stakeholder_feedback_data, performance_metrics_data
            )
        }
        
        self.testing_outcomes = execution_results
        return execution_results
    
    def _calculate_execution_coverage(self, execution_data):
        """Calculate test execution coverage for evaluation purposes."""
        total_cases = execution_data.get('total_cases', 1)
        executed_cases = execution_data.get('executed_cases', 0)
        
        coverage = (executed_cases / total_cases) * 100 if total_cases > 0 else 0
        
        return {
            'percentage': coverage,
            'assessment': 'Excellent' if coverage >= 95 else 'Good' if coverage >= 85 else 'Needs Improvement'
        }
    
    def _analyze_functional_test_results(self, execution_data):
        """Analyze functional test results for evaluation evidence."""
        functional_results = {
            'requirement_coverage': {},
            'defect_analysis': {},
            'compliance_assessment': {}
        }
        
        # Analyze by test category
        for category in execution_data.get('categories', []):
            category_name = category.get('name', 'unknown')
            category_results = category.get('results', {})
            
            functional_results['requirement_coverage'][category_name] = {
                'tests_executed': category_results.get('executed', 0),
                'tests_passed': category_results.get('passed', 0),
                'compliance_percentage': (category_results.get('passed', 0) / max(category_results.get('executed', 1), 1)) * 100
            }
        
        return functional_results
    
    def _analyze_non_functional_results(self, performance_data):
        """Analyze non-functional test results for evaluation evidence."""
        nf_results = {
            'performance_assessment': {},
            'scalability_results': {},
            'reliability_metrics': {}
        }
        
        if performance_data:
            nf_results['performance_assessment'] = {
                'average_response_time': performance_data.get('avg_response_time', 0),
                'throughput': performance_data.get('throughput', 0),
                'resource_utilization': performance_data.get('resource_usage', {}),
                'performance_rating': self._rate_performance(performance_data)
            }
        
        return nf_results
    
    def _analyze_scenario_test_results(self, feedback_data):
        """Analyze scenario testing results for stakeholder evaluation evidence."""
        scenario_results = {
            'workflow_success_rates': {},
            'stakeholder_satisfaction': {},
            'usability_metrics': {}
        }
        
        if feedback_data:
            scenario_results['stakeholder_satisfaction'] = {
                'average_rating': self._calculate_average_rating(feedback_data),
                'satisfaction_distribution': self._analyze_rating_distribution(feedback_data),
                'key_feedback_themes': self._extract_feedback_themes(feedback_data)
            }
        
        return scenario_results
    
    def _extract_evaluation_evidence(self, execution_data, feedback_data, performance_data):
        """Extract specific evidence for evaluation criteria assessment."""
        evidence = {
            'functional_evidence': {
                'requirement_compliance_rate': self._calculate_compliance_rate(execution_data),
                'defect_density': self._calculate_defect_density(execution_data),
                'feature_completeness': self._assess_feature_completeness(execution_data)
            },
            'quality_evidence': {
                'test_coverage_achieved': self._calculate_test_coverage(execution_data),
                'performance_benchmarks': self._extract_performance_benchmarks(performance_data),
                'user_acceptance_level': self._assess_user_acceptance(feedback_data)
            },
            'stakeholder_evidence': {
                'satisfaction_scores': self._extract_satisfaction_scores(feedback_data),
                'workflow_efficiency': self._measure_workflow_efficiency(feedback_data),
                'adoption_indicators': self._assess_adoption_potential(feedback_data)
            }
        }
        
        return evidence
    
    def _rate_performance(self, performance_data):
        """Rate overall performance based on test results."""
        avg_response = performance_data.get('avg_response_time', 5)
        
        if avg_response < 1:
            return 'Excellent'
        elif avg_response < 3:
            return 'Good'
        elif avg_response < 5:
            return 'Acceptable'
        else:
            return 'Needs Improvement'
    
    def _calculate_average_rating(self, feedback_data):
        """Calculate average satisfaction rating from feedback."""
        if not feedback_data:
            return 0
        
        ratings = [item.get('satisfaction_rating', 3) for item in feedback_data if 'satisfaction_rating' in item]
        return sum(ratings) / len(ratings) if ratings else 0
    
    def _analyze_rating_distribution(self, feedback_data):
        """Analyze distribution of satisfaction ratings."""
        distribution = {'5': 0, '4': 0, '3': 0, '2': 0, '1': 0}
        
        for item in feedback_data:
            rating = str(int(item.get('satisfaction_rating', 3)))
            if rating in distribution:
                distribution[rating] += 1
        
        return distribution
    
    def _extract_feedback_themes(self, feedback_data):
        """Extract common themes from qualitative feedback."""
        # Simplified theme extraction
        themes = []
        all_feedback = ' '.join([item.get('comments', '') for item in feedback_data]).lower()
        
        theme_keywords = {
            'ease_of_use': ['easy', 'simple', 'intuitive'],
            'performance': ['fast', 'slow', 'responsive'],
            'functionality': ['features', 'works', 'useful'],
            'issues': ['problem', 'difficult', 'confusing']
        }
        
        for theme, keywords in theme_keywords.items():
            if any(keyword in all_feedback for keyword in keywords):
                themes.append(theme)
        
        return themes
    
    def generate_testing_evaluation_report(self):
        """Generate comprehensive report linking testing outcomes to evaluation."""
        if not self.testing_outcomes:
            return "No testing outcomes available for evaluation reporting."
        
        report = f"""
TESTING-BASED EVALUATION REPORT
Solution: {self.solution_name}
Evaluation Objectives: {', '.join(self.evaluation_objectives)}
Report Date: 2025-09-20

TEST EXECUTION SUMMARY:
{'-' * 30}
"""
        
        execution_summary = self.testing_outcomes.get('execution_summary', {})
        report += f"Total Test Cases: {execution_summary.get('total_test_cases', 0)}\n"
        report += f"Executed: {execution_summary.get('executed_cases', 0)}\n"
        report += f"Passed: {execution_summary.get('passed_cases', 0)}\n"
        report += f"Failed: {execution_summary.get('failed_cases', 0)}\n"
        
        coverage = execution_summary.get('execution_coverage', {})
        report += f"Execution Coverage: {coverage.get('percentage', 0):.1f}% ({coverage.get('assessment', 'Unknown')})\n"
        
        # Evaluation evidence summary
        evidence = self.testing_outcomes.get('evaluation_evidence', {})
        
        report += f"\nEVALUATION EVIDENCE FROM TESTING:\n"
        report += f"{'-' * 40}\n"
        
        functional_evidence = evidence.get('functional_evidence', {})
        report += f"Functional Compliance: {functional_evidence.get('requirement_compliance_rate', 0):.1f}%\n"
        report += f"Defect Density: {functional_evidence.get('defect_density', 0):.2f} defects/KLOC\n"
        
        quality_evidence = evidence.get('quality_evidence', {})
        report += f"Test Coverage: {quality_evidence.get('test_coverage_achieved', 0):.1f}%\n"
        report += f"User Acceptance: {quality_evidence.get('user_acceptance_level', 'Not assessed')}\n"
        
        stakeholder_evidence = evidence.get('stakeholder_evidence', {})
        satisfaction_scores = stakeholder_evidence.get('satisfaction_scores', {})
        report += f"Average Satisfaction: {satisfaction_scores.get('overall_average', 0):.1f}/5.0\n"
        
        return report

def demonstrate_evaluation_test_planning():
    """
    Practical example of creating evaluation-focused test plans for a library system.
    """
    print("EVALUATION TEST PLANNING EXAMPLE")
    print("=" * 34)
    
    # Create evaluation test planner
    planner = EvaluationTestPlanner(
        "Digital Library Management System",
        ["Assess functional completeness", "Evaluate user satisfaction", "Validate performance requirements"]
    )
    
    # Define requirements for testing
    functional_requirements = [
        {'id': 'F001', 'description': 'System allows users to search for books by title, author, or ISBN'},
        {'id': 'F002', 'description': 'System enables users to place holds on available books'},
        {'id': 'F003', 'description': 'System processes book checkouts and returns accurately'},
        {'id': 'F004', 'description': 'System generates overdue notices automatically'},
        {'id': 'F005', 'description': 'System maintains accurate inventory tracking'}
    ]
    
    non_functional_requirements = [
        {'id': 'NF001', 'description': 'System responds to search queries within 2 seconds'},
        {'id': 'NF002', 'description': 'System supports 200 concurrent users without performance degradation'},
        {'id': 'NF003', 'description': 'System interface is usable by people with visual impairments'},
        {'id': 'NF004', 'description': 'System maintains 99% uptime during library operating hours'},
        {'id': 'NF005', 'description': 'System protects patron privacy and data security'}
    ]
    
    stakeholder_scenarios = [
        {
            'name': 'Student Research Workflow',
            'stakeholder_type': 'student',
            'context': 'Student researching for academic paper',
            'steps': ['Search for academic sources', 'Place holds on relevant books', 'Check availability', 'Access digital resources'],
            'success_criteria': 'Complete research material gathering within 15 minutes'
        },
        {
            'name': 'Librarian Daily Operations',
            'stakeholder_type': 'librarian',
            'context': 'Librarian managing daily circulation tasks',
            'steps': ['Process returns', 'Handle hold requests', 'Assist patron searches', 'Generate reports'],
            'success_criteria': 'Complete routine tasks 30% faster than previous system'
        },
        {
            'name': 'Community Member Casual Use',
            'stakeholder_type': 'community_member',
            'context': 'Community member looking for recreational reading',
            'steps': ['Browse new arrivals', 'Search by genre', 'Check out books', 'Renew online'],
            'success_criteria': 'Intuitive experience requiring no staff assistance'
        }
    ]
    
    evaluation_criteria = [
        {'id': 'EC001', 'description': 'Functional requirements compliance above 95%'},
        {'id': 'EC002', 'description': 'User satisfaction scores above 4.0/5.0'},
        {'id': 'EC003', 'description': 'Performance benchmarks met consistently'},
        {'id': 'EC004', 'description': 'Accessibility standards compliance verified'},
        {'id': 'EC005', 'description': 'System reliability demonstrated through testing'}
    ]
    
    # Create comprehensive test plan
    test_plan = planner.create_evaluation_test_plan(
        functional_requirements, 
        non_functional_requirements,
        stakeholder_scenarios,
        evaluation_criteria
    )
    
    # Execute test plan (simulated results)
    test_execution_data = {
        'total_cases': 87,
        'executed_cases': 85,
        'passed_cases': 78,
        'failed_cases': 7,
        'blocked_cases': 2,
        'categories': [
            {'name': 'Search Functionality', 'results': {'executed': 25, 'passed': 23, 'failed': 2}},
            {'name': 'Hold Management', 'results': {'executed': 18, 'passed': 17, 'failed': 1}},
            {'name': 'Checkout Process', 'results': {'executed': 20, 'passed': 19, 'failed': 1}},
            {'name': 'Reporting', 'results': {'executed': 15, 'passed': 13, 'failed': 2}},
            {'name': 'Integration', 'results': {'executed': 7, 'passed': 6, 'failed': 1}}
        ]
    }
    
    stakeholder_feedback_data = [
        {'stakeholder_type': 'student', 'satisfaction_rating': 4.2, 'comments': 'Much easier to find academic sources'},
        {'stakeholder_type': 'student', 'satisfaction_rating': 3.8, 'comments': 'Search could be more intuitive'},
        {'stakeholder_type': 'librarian', 'satisfaction_rating': 4.5, 'comments': 'Significant improvement in efficiency'},
        {'stakeholder_type': 'librarian', 'satisfaction_rating': 4.1, 'comments': 'Reports are much more useful now'},
        {'stakeholder_type': 'community_member', 'satisfaction_rating': 4.3, 'comments': 'Love the new interface'},
        {'stakeholder_type': 'community_member', 'satisfaction_rating': 3.9, 'comments': 'Online renewals work great'}
    ]
    
    performance_metrics_data = {
        'avg_response_time': 1.3,
        'throughput': 180,
        'resource_usage': {'cpu': 45, 'memory': 62, 'database': 38},
        'concurrent_users_tested': 250,
        'uptime_percentage': 99.2
    }
    
    # Execute test plan and analyze results
    testing_outcomes = planner.execute_test_plan_for_evaluation(
        test_execution_data, stakeholder_feedback_data, performance_metrics_data
    )
    
    # Generate evaluation report
    evaluation_report = planner.generate_testing_evaluation_report()
    print(evaluation_report)
    
    print(f"\nTEST PLAN SUMMARY:")
    print(f"Functional Test Categories: {len(test_plan['functional_test_suite']['test_categories'])}")
    print(f"Stakeholder Scenarios: {len(test_plan['scenario_test_suite']['stakeholder_scenarios'])}")
    print(f"Evidence Collection Methods: {len(test_plan['evidence_collection_plan']['automated_evidence'])}")
    
    print(f"\nEVALUATION INSIGHTS:")
    execution_summary = testing_outcomes['execution_summary']
    print(f"Test Pass Rate: {(execution_summary['passed_cases']/execution_summary['executed_cases']*100):.1f}%")
    
    evidence = testing_outcomes['evaluation_evidence']
    functional_evidence = evidence.get('functional_evidence', {})
    print(f"Functional Compliance: {functional_evidence.get('requirement_compliance_rate', 'Not calculated')}")
    
    return planner

# Run demonstration
if __name__ == "__main__":
    test_planning_demo = demonstrate_evaluation_test_planning()

```







