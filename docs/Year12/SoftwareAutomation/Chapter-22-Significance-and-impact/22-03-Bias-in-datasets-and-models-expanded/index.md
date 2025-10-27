---
title: "Section 22.3: Bias in Datasets and Models (Expanded)"
---

# Section 22.3: Bias in Datasets and Models (Expanded)

**Learning Outcome**: SE-12-05 - Investigate the effect of human and dataset source bias in the development of ML and AI solutions

## Overview

Bias in machine learning systems represents one of the most critical challenges in AI development. This section provides comprehensive frameworks for identifying, analyzing, and mitigating various forms of bias that can infiltrate ML systems through data collection, model design, and deployment decisions. Understanding bias is essential for creating fair, reliable, and trustworthy AI systems.

## Part 1: Sources of Bias Analysis

### 1.1 Understanding Bias Types

Bias in ML systems manifests through multiple pathways, each requiring specific identification and mitigation strategies.

```python
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass
from collections import Counter
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix
import seaborn as sns

@dataclass
class BiasAssessment:
    """Assessment result for a specific type of bias"""
    bias_type: str
    severity_score: float  # 0.0 to 1.0
    affected_groups: List[str]
    impact_description: str
    mitigation_suggestions: List[str]

class BiasSourceAnalyzer:
    """Comprehensive framework for analyzing various sources of bias in ML systems"""
    
    def __init__(self):
        self.bias_types = {
            'sampling': 'Systematic exclusion or over-representation of certain groups',
            'historical': 'Past societal inequities embedded in training data',
            'labeler': 'Human annotator biases affecting ground truth labels',
            'population_drift': 'Changes in population characteristics over time'
        }
        self.assessments = []
    
    def analyze_sampling_bias(self, dataset: pd.DataFrame, protected_attr: str, 
                            expected_distribution: Dict[str, float]) -> BiasAssessment:
        """
        Analyze sampling bias by comparing actual vs expected group distributions
        
        Args:
            dataset: The dataset to analyze
            protected_attr: Column name for protected attribute (e.g., 'gender', 'race')
            expected_distribution: Expected proportions for each group
        """
        actual_distribution = dataset[protected_attr].value_counts(normalize=True).to_dict()
        
        # Calculate divergence from expected distribution
        divergences = {}
        for group, expected_prop in expected_distribution.items():
            actual_prop = actual_distribution.get(group, 0.0)
            divergences[group] = abs(actual_prop - expected_prop)
        
        severity = max(divergences.values())
        affected_groups = [group for group, div in divergences.items() if div > 0.05]
        
        impact_desc = f"Sampling bias detected with max divergence of {severity:.3f}"
        if affected_groups:
            impact_desc += f" affecting groups: {', '.join(affected_groups)}"
        
        mitigation = [
            "Implement stratified sampling to match expected distribution",
            "Use weighted sampling during training",
            "Collect additional data for underrepresented groups",
            "Apply data augmentation techniques for minority groups"
        ]
        
        assessment = BiasAssessment(
            bias_type="sampling",
            severity_score=min(severity * 2, 1.0),  # Scale to 0-1
            affected_groups=affected_groups,
            impact_description=impact_desc,
            mitigation_suggestions=mitigation
        )
        
        self.assessments.append(assessment)
        return assessment
    
    def analyze_historical_bias(self, dataset: pd.DataFrame, protected_attr: str, 
                               outcome_col: str) -> BiasAssessment:
        """
        Analyze historical bias through disparate impact analysis
        
        Args:
            dataset: The dataset to analyze
            protected_attr: Protected attribute column
            outcome_col: Target outcome column
        """
        # Calculate positive outcome rates by group
        group_outcomes = dataset.groupby(protected_attr)[outcome_col].agg(['mean', 'count'])
        
        # Find reference group (typically majority group)
        reference_group = group_outcomes['count'].idxmax()
        reference_rate = group_outcomes.loc[reference_group, 'mean']
        
        # Calculate disparate impact ratios
        disparate_impacts = {}
        for group in group_outcomes.index:
            group_rate = group_outcomes.loc[group, 'mean']
            if reference_rate > 0:
                disparate_impacts[group] = group_rate / reference_rate
            else:
                disparate_impacts[group] = 1.0
        
        # Identify groups with significant disparate impact (< 0.8 or > 1.25)
        affected_groups = [
            group for group, ratio in disparate_impacts.items()
            if ratio < 0.8 or ratio > 1.25
        ]
        
        max_disparity = max(abs(1 - ratio) for ratio in disparate_impacts.values())
        severity = min(max_disparity, 1.0)
        
        impact_desc = f"Historical bias analysis reveals disparate impact ratios: {disparate_impacts}"
        
        mitigation = [
            "Collect contemporary data to reduce historical bias",
            "Apply bias-aware preprocessing techniques",
            "Use fairness constraints during model training",
            "Implement post-processing calibration",
            "Consider synthetic data generation for balanced representation"
        ]
        
        assessment = BiasAssessment(
            bias_type="historical",
            severity_score=severity,
            affected_groups=affected_groups,
            impact_description=impact_desc,
            mitigation_suggestions=mitigation
        )
        
        self.assessments.append(assessment)
        return assessment
    
    def analyze_labeler_bias(self, labels_df: pd.DataFrame, text_data: pd.DataFrame = None) -> BiasAssessment:
        """
        Analyze potential labeler bias through inter-annotator agreement and pattern analysis
        
        Args:
            labels_df: DataFrame with columns for different annotators' labels
            text_data: Optional text data for content-based bias analysis
        """
        annotators = labels_df.columns
        n_annotators = len(annotators)
        
        if n_annotators < 2:
            raise ValueError("Need at least 2 annotators to assess labeler bias")
        
        # Calculate inter-annotator agreement
        agreements = []
        disagreement_patterns = {}
        
        for i in range(len(labels_df)):
            row_labels = labels_df.iloc[i].values
            unique_labels = len(set(row_labels))
            agreement_rate = (row_labels == row_labels[0]).sum() / len(row_labels)
            agreements.append(agreement_rate)
            
            if unique_labels > 1:
                # Track disagreement patterns
                pattern = tuple(sorted(row_labels))
                disagreement_patterns[pattern] = disagreement_patterns.get(pattern, 0) + 1
        
        avg_agreement = np.mean(agreements)
        severity = 1.0 - avg_agreement  # Higher disagreement = higher bias risk
        
        # Identify potential systematic biases
        affected_groups = []
        if text_data is not None:
            # Analyze if disagreements correlate with text characteristics
            # This is a simplified example - real implementation would be more sophisticated
            high_disagreement_indices = [i for i, agree in enumerate(agreements) if agree < 0.7]
            if len(high_disagreement_indices) > len(agreements) * 0.1:
                affected_groups.append("high_disagreement_content")
        
        impact_desc = f"Labeler bias analysis: {avg_agreement:.3f} average agreement, "
        impact_desc += f"{len(disagreement_patterns)} disagreement patterns detected"
        
        mitigation = [
            "Provide comprehensive annotation guidelines",
            "Implement regular inter-annotator agreement checks",
            "Use multiple annotators with majority voting",
            "Apply bias-aware label aggregation methods",
            "Provide annotator training on potential biases"
        ]
        
        assessment = BiasAssessment(
            bias_type="labeler",
            severity_score=severity,
            affected_groups=affected_groups,
            impact_description=impact_desc,
            mitigation_suggestions=mitigation
        )
        
        self.assessments.append(assessment)
        return assessment
    
    def analyze_population_drift(self, train_data: pd.DataFrame, test_data: pd.DataFrame,
                               demographic_cols: List[str]) -> BiasAssessment:
        """
        Analyze population drift between training and deployment populations
        
        Args:
            train_data: Training dataset
            test_data: Test/deployment dataset
            demographic_cols: List of demographic columns to analyze
        """
        drift_scores = {}
        affected_groups = []
        
        for col in demographic_cols:
            if col in train_data.columns and col in test_data.columns:
                # Calculate distribution differences
                train_dist = train_data[col].value_counts(normalize=True)
                test_dist = test_data[col].value_counts(normalize=True)
                
                # Align distributions for comparison
                all_categories = set(train_dist.index) | set(test_dist.index)
                train_aligned = pd.Series(index=all_categories, dtype=float).fillna(0)
                test_aligned = pd.Series(index=all_categories, dtype=float).fillna(0)
                
                for cat in all_categories:
                    train_aligned[cat] = train_dist.get(cat, 0)
                    test_aligned[cat] = test_dist.get(cat, 0)
                
                # Calculate KL divergence or similar metric
                drift_score = np.sum(np.abs(train_aligned - test_aligned)) / 2  # Total variation distance
                drift_scores[col] = drift_score
                
                if drift_score > 0.1:  # Threshold for significant drift
                    affected_groups.append(col)
        
        max_drift = max(drift_scores.values()) if drift_scores else 0.0
        severity = min(max_drift * 2, 1.0)
        
        impact_desc = f"Population drift detected with scores: {drift_scores}"
        
        mitigation = [
            "Implement continuous monitoring of population characteristics",
            "Regular model retraining with current data",
            "Use domain adaptation techniques",
            "Apply online learning methods",
            "Implement drift detection alerts"
        ]
        
        assessment = BiasAssessment(
            bias_type="population_drift",
            severity_score=severity,
            affected_groups=affected_groups,
            impact_description=impact_desc,
            mitigation_suggestions=mitigation
        )
        
        self.assessments.append(assessment)
        return assessment
    
    def generate_bias_report(self) -> Dict[str, Any]:
        """Generate comprehensive bias assessment report"""
        if not self.assessments:
            return {"status": "No bias assessments performed"}
        
        report = {
            "total_assessments": len(self.assessments),
            "bias_types_analyzed": [a.bias_type for a in self.assessments],
            "overall_severity": max(a.severity_score for a in self.assessments),
            "critical_biases": [a for a in self.assessments if a.severity_score > 0.7],
            "all_affected_groups": list(set(
                group for a in self.assessments for group in a.affected_groups
            )),
            "comprehensive_mitigations": list(set(
                suggestion for a in self.assessments for suggestion in a.mitigation_suggestions
            )),
            "detailed_assessments": self.assessments
        }
        
        return report

# Demonstration function
def demonstrate_bias_analysis():
    """Demonstrate bias source analysis with synthetic data"""
    print("=== Bias Source Analysis Demonstration ===\n")
    
    # Create synthetic biased dataset
    np.random.seed(42)
    n_samples = 1000
    
    # Simulate sampling bias (gender imbalance)
    gender = np.random.choice(['M', 'F'], n_samples, p=[0.8, 0.2])  # 80% male, 20% female
    
    # Simulate historical bias (salary gaps)
    base_salary = np.random.normal(50000, 15000, n_samples)
    # Historical bias: lower salaries for females
    salary = np.where(gender == 'F', base_salary * 0.85, base_salary)
    
    # Create dataset
    dataset = pd.DataFrame({
        'gender': gender,
        'salary': salary,
        'promotion': np.random.binomial(1, np.where(gender == 'M', 0.3, 0.2), n_samples)
    })
    
    analyzer = BiasSourceAnalyzer()
    
    # Analyze sampling bias
    expected_gender_dist = {'M': 0.5, 'F': 0.5}  # Expected 50-50 split
    sampling_assessment = analyzer.analyze_sampling_bias(
        dataset, 'gender', expected_gender_dist
    )
    print(f"Sampling Bias Assessment:")
    print(f"  Severity: {sampling_assessment.severity_score:.3f}")
    print(f"  Impact: {sampling_assessment.impact_description}")
    print()
    
    # Analyze historical bias
    historical_assessment = analyzer.analyze_historical_bias(
        dataset, 'gender', 'promotion'
    )
    print(f"Historical Bias Assessment:")
    print(f"  Severity: {historical_assessment.severity_score:.3f}")
    print(f"  Impact: {historical_assessment.impact_description}")
    print()
    
    # Generate comprehensive report
    report = analyzer.generate_bias_report()
    print(f"Overall Bias Report:")
    print(f"  Total assessments: {report['total_assessments']}")
    print(f"  Overall severity: {report['overall_severity']:.3f}")
    print(f"  Critical biases: {len(report['critical_biases'])}")
    print(f"  Affected groups: {report['all_affected_groups']}")

if __name__ == "__main__":
    demonstrate_bias_analysis()

```

### 1.2 Bias Detection Workflow

```python-template
def create_bias_detection_pipeline():
    """Create a systematic pipeline for bias detection in ML workflows"""
    
    class BiasDetectionPipeline:
        def __init__(self):
            self.detection_stages = [
                "data_collection_review",
                "dataset_composition_analysis", 
                "labeling_process_audit",
                "model_performance_evaluation",
                "deployment_monitoring"
            ]
            self.bias_checkpoints = {}
        
        def stage_1_data_collection_review(self, collection_metadata: Dict) -> Dict:
            """Review data collection methodology for potential bias sources"""
            review_results = {
                "collection_method": collection_metadata.get("method", "unknown"),
                "sampling_strategy": collection_metadata.get("sampling", "unknown"),
                "time_period": collection_metadata.get("timeframe", "unknown"),
                "geographic_coverage": collection_metadata.get("geography", "unknown"),
                "potential_biases": []
            }
            
            # Check for common collection biases
            if review_results["sampling_strategy"] == "convenience":
                review_results["potential_biases"].append("convenience_sampling_bias")
            
            if review_results["geographic_coverage"] == "limited":
                review_results["potential_biases"].append("geographic_bias")
            
            return review_results
        
        def stage_2_dataset_composition_analysis(self, dataset: pd.DataFrame, 
                                               protected_attributes: List[str]) -> Dict:
            """Analyze dataset composition for representational biases"""
            composition_analysis = {
                "total_samples": len(dataset),
                "attribute_distributions": {},
                "missing_data_patterns": {},
                "correlation_analysis": {}
            }
            
            for attr in protected_attributes:
                if attr in dataset.columns:
                    # Distribution analysis
                    dist = dataset[attr].value_counts(normalize=True, dropna=False)
                    composition_analysis["attribute_distributions"][attr] = dist.to_dict()
                    
                    # Missing data analysis
                    missing_rate = dataset[attr].isna().mean()
                    composition_analysis["missing_data_patterns"][attr] = missing_rate
            
            return composition_analysis
        
        def run_full_pipeline(self, dataset: pd.DataFrame, metadata: Dict, 
                            protected_attrs: List[str]) -> Dict:
            """Run complete bias detection pipeline"""
            pipeline_results = {}
            
            # Stage 1: Data collection review
            pipeline_results["collection_review"] = self.stage_1_data_collection_review(metadata)
            
            # Stage 2: Dataset composition analysis  
            pipeline_results["composition_analysis"] = self.stage_2_dataset_composition_analysis(
                dataset, protected_attrs
            )
            
            # Aggregate findings
            all_biases = pipeline_results["collection_review"]["potential_biases"]
            
            pipeline_results["summary"] = {
                "total_bias_indicators": len(all_biases),
                "bias_types_found": all_biases,
                "severity_assessment": "high" if len(all_biases) > 3 else "moderate" if len(all_biases) > 1 else "low",
                "recommendations": self._generate_recommendations(all_biases)
            }
            
            return pipeline_results
        
        def _generate_recommendations(self, bias_indicators: List[str]) -> List[str]:
            """Generate recommendations based on detected bias indicators"""
            recommendations = []
            
            if "convenience_sampling_bias" in bias_indicators:
                recommendations.append("Implement stratified random sampling")
                recommendations.append("Ensure diverse recruitment channels")
            
            if "geographic_bias" in bias_indicators:
                recommendations.append("Expand data collection to multiple regions")
                recommendations.append("Weight samples by population demographics")
            
            if not recommendations:
                recommendations.append("Continue monitoring for emerging biases")
            
            return recommendations
    
    return BiasDetectionPipeline()

# Example usage
def demonstrate_bias_detection_pipeline():
    """Demonstrate the bias detection pipeline"""
    print("=== Bias Detection Pipeline Demonstration ===\n")
    
    # Create sample dataset and metadata
    sample_data = pd.DataFrame({
        'age': np.random.normal(35, 10, 500),
        'gender': np.random.choice(['M', 'F'], 500, p=[0.7, 0.3]),
        'location': np.random.choice(['urban', 'rural'], 500, p=[0.9, 0.1]),
        'outcome': np.random.binomial(1, 0.3, 500)
    })
    
    metadata = {
        "method": "online_survey",
        "sampling": "convenience", 
        "timeframe": "2023-Q1",
        "geography": "limited"
    }
    
    pipeline = create_bias_detection_pipeline()
    results = pipeline.run_full_pipeline(
        sample_data, metadata, ['gender', 'location']
    )
    
    print("Pipeline Results:")
    print(f"  Bias indicators found: {results['summary']['total_bias_indicators']}")
    print(f"  Severity: {results['summary']['severity_assessment']}")
    print(f"  Bias types: {results['summary']['bias_types_found']}")
    print(f"  Recommendations: {results['summary']['recommendations']}")

if __name__ == "__main__":
    demonstrate_bias_detection_pipeline()

```

## Part 2: Practical Bias Investigation Tools

Now I'll implement comprehensive tools for investigating bias through dataset provenance, missing groups detection, and measurement bias assessment.

```python-template
class DatasetProvenanceAnalyzer:
    """Tools for analyzing dataset provenance and potential bias introduction points"""
    
    def __init__(self):
        self.provenance_metadata = {}
        self.bias_risk_factors = {
            'data_source': {
                'web_scraping': 0.7,  # High risk due to selection bias
                'surveys': 0.5,        # Moderate risk due to response bias
                'administrative': 0.3,  # Lower risk but historical bias possible
                'sensors': 0.2          # Low risk for bias but can have measurement bias
            },
            'collection_method': {
                'convenience': 0.8,
                'voluntary': 0.7,
                'random': 0.2,
                'stratified': 0.1
            }
        }
    
    def analyze_data_lineage(self, dataset_metadata: Dict) -> Dict:
        """
        Analyze data lineage to identify potential bias introduction points
        
        Args:
            dataset_metadata: Metadata about dataset creation and processing
        """
        lineage_analysis = {
            'source_analysis': {},
            'transformation_risks': [],
            'bias_risk_score': 0.0,
            'recommendations': []
        }
        
        # Analyze data sources
        sources = dataset_metadata.get('sources', [])
        total_source_risk = 0.0
        
        for source in sources:
            source_type = source.get('type', 'unknown')
            collection_method = source.get('collection_method', 'unknown')
            
            source_risk = self.bias_risk_factors['data_source'].get(source_type, 0.5)
            method_risk = self.bias_risk_factors['collection_method'].get(collection_method, 0.5)
            
            combined_risk = (source_risk + method_risk) / 2
            total_source_risk += combined_risk
            
            lineage_analysis['source_analysis'][source.get('name', 'unnamed')] = {
                'type': source_type,
                'method': collection_method,
                'risk_score': combined_risk,
                'bias_indicators': self._identify_source_bias_indicators(source)
            }
        
        # Analyze data transformations
        transformations = dataset_metadata.get('transformations', [])
        for transform in transformations:
            risk = self._assess_transformation_bias_risk(transform)
            if risk['risk_level'] > 0.3:
                lineage_analysis['transformation_risks'].append(risk)
        
        # Calculate overall bias risk
        lineage_analysis['bias_risk_score'] = min(total_source_risk / max(len(sources), 1), 1.0)
        
        # Generate recommendations
        lineage_analysis['recommendations'] = self._generate_provenance_recommendations(
            lineage_analysis
        )
        
        return lineage_analysis
    
    def _identify_source_bias_indicators(self, source: Dict) -> List[str]:
        """Identify potential bias indicators in a data source"""
        indicators = []
        
        if source.get('geographic_scope') == 'limited':
            indicators.append('geographic_bias')
        
        if source.get('time_period_days', 365) < 30:
            indicators.append('temporal_bias')
        
        if source.get('response_rate', 1.0) < 0.5:
            indicators.append('non_response_bias')
        
        if source.get('access_requirements') == 'internet_required':
            indicators.append('digital_divide_bias')
        
        return indicators
    
    def _assess_transformation_bias_risk(self, transformation: Dict) -> Dict:
        """Assess bias risk introduced by data transformations"""
        transform_type = transformation.get('type', 'unknown')
        
        risk_levels = {
            'filtering': 0.6,      # Can remove important subgroups
            'sampling': 0.5,       # May introduce sampling bias
            'feature_selection': 0.4,  # Could remove bias-relevant features
            'normalization': 0.2,   # Generally lower risk
            'encoding': 0.1        # Low risk for bias
        }
        
        risk_level = risk_levels.get(transform_type, 0.3)
        
        return {
            'transformation': transform_type,
            'parameters': transformation.get('parameters', {}),
            'risk_level': risk_level,
            'description': transformation.get('description', '')
        }
    
    def _generate_provenance_recommendations(self, analysis: Dict) -> List[str]:
        """Generate recommendations based on provenance analysis"""
        recommendations = []
        
        if analysis['bias_risk_score'] > 0.7:
            recommendations.append("High bias risk detected - consider alternative data sources")
            recommendations.append("Implement bias testing before model deployment")
        
        if len(analysis['transformation_risks']) > 2:
            recommendations.append("Multiple transformation risks identified - review processing pipeline")
        
        recommendations.append("Document all data transformations for reproducibility")
        recommendations.append("Implement version control for dataset lineage tracking")
        
        return recommendations

class MissingGroupsDetector:
    """Tools for detecting underrepresented or missing demographic groups"""
    
    def __init__(self):
        self.demographic_benchmarks = {}
        self.minimum_representation_threshold = 0.05  # 5% minimum representation
    
    def set_population_benchmarks(self, benchmarks: Dict[str, Dict[str, float]]):
        """
        Set population benchmarks for comparison
        
        Args:
            benchmarks: Dict mapping demographic attributes to expected distributions
        """
        self.demographic_benchmarks = benchmarks
    
    def detect_missing_groups(self, dataset: pd.DataFrame, 
                            demographic_columns: List[str]) -> Dict:
        """
        Detect missing or underrepresented demographic groups
        
        Args:
            dataset: Dataset to analyze
            demographic_columns: List of demographic attribute columns
        """
        detection_results = {
            'missing_groups': {},
            'underrepresented_groups': {},
            'representation_analysis': {},
            'severity_scores': {}
        }
        
        for column in demographic_columns:
            if column not in dataset.columns:
                detection_results['missing_groups'][column] = "Column not present in dataset"
                continue
            
            # Calculate actual distribution
            actual_dist = dataset[column].value_counts(normalize=True, dropna=False)
            
            # Compare with benchmarks if available
            if column in self.demographic_benchmarks:
                benchmark = self.demographic_benchmarks[column]
                missing_groups = []
                underrepresented_groups = []
                
                for group, expected_prop in benchmark.items():
                    actual_prop = actual_dist.get(group, 0.0)
                    
                    if actual_prop == 0.0:
                        missing_groups.append(group)
                    elif actual_prop < self.minimum_representation_threshold:
                        underrepresented_groups.append({
                            'group': group,
                            'actual_proportion': actual_prop,
                            'expected_proportion': expected_prop,
                            'representation_ratio': actual_prop / expected_prop if expected_prop > 0 else 0
                        })
                
                detection_results['missing_groups'][column] = missing_groups
                detection_results['underrepresented_groups'][column] = underrepresented_groups
                
                # Calculate severity score
                missing_severity = len(missing_groups) / len(benchmark)
                underrep_severity = sum(
                    max(0, 1 - group['representation_ratio']) 
                    for group in underrepresented_groups
                ) / len(benchmark)
                
                detection_results['severity_scores'][column] = missing_severity + underrep_severity
            
            detection_results['representation_analysis'][column] = actual_dist.to_dict()
        
        return detection_results
    
    def generate_sampling_strategy(self, detection_results: Dict) -> Dict:
        """Generate targeted sampling strategy to address missing groups"""
        sampling_strategy = {
            'priority_groups': [],
            'collection_targets': {},
            'methods': []
        }
        
        for column, missing_groups in detection_results['missing_groups'].items():
            if isinstance(missing_groups, list) and missing_groups:
                sampling_strategy['priority_groups'].extend(
                    [(column, group) for group in missing_groups]
                )
        
        for column, underrep_groups in detection_results['underrepresented_groups'].items():
            if isinstance(underrep_groups, list):
                for group_info in underrep_groups:
                    group = group_info['group']
                    current_prop = group_info['actual_proportion']
                    target_prop = group_info['expected_proportion']
                    
                    # Calculate how many additional samples needed
                    additional_samples_needed = int(
                        (target_prop - current_prop) * 1000  # Assuming target of 1000 total samples
                    )
                    
                    sampling_strategy['collection_targets'][(column, group)] = additional_samples_needed
        
        # Suggest collection methods
        if sampling_strategy['priority_groups'] or sampling_strategy['collection_targets']:
            sampling_strategy['methods'] = [
                "Targeted outreach to underrepresented communities",
                "Partner with organizations serving missing demographic groups",
                "Implement quota sampling to ensure representation",
                "Use online platforms with diverse user bases",
                "Conduct follow-up studies focused on missing groups"
            ]
        
        return sampling_strategy

class MeasurementBiasAnalyzer:
    """Tools for detecting and analyzing measurement bias in datasets"""
    
    def __init__(self):
        self.bias_indicators = {}
    
    def analyze_measurement_consistency(self, dataset: pd.DataFrame, 
                                      measurement_columns: List[str],
                                      grouping_variable: str) -> Dict:
        """
        Analyze measurement consistency across different groups
        
        Args:
            dataset: Dataset to analyze
            measurement_columns: Columns containing measurements to analyze
            grouping_variable: Variable to group by (e.g., demographic group)
        """
        consistency_analysis = {
            'group_statistics': {},
            'variance_analysis': {},
            'bias_indicators': {},
            'recommendations': []
        }
        
        for measure_col in measurement_columns:
            if measure_col not in dataset.columns:
                continue
            
            group_stats = dataset.groupby(grouping_variable)[measure_col].agg([
                'mean', 'std', 'min', 'max', 'count'
            ])
            
            consistency_analysis['group_statistics'][measure_col] = group_stats.to_dict()
            
            # Analyze variance differences (potential measurement bias indicator)
            std_values = group_stats['std'].values
            std_ratio = np.max(std_values) / np.min(std_values) if np.min(std_values) > 0 else np.inf
            
            consistency_analysis['variance_analysis'][measure_col] = {
                'std_ratio': std_ratio,
                'variance_heterogeneity': std_ratio > 2.0,  # Flag if ratio > 2
                'group_count_balance': group_stats['count'].std() / group_stats['count'].mean()
            }
            
            # Identify bias indicators
            bias_indicators = []
            if std_ratio > 3.0:
                bias_indicators.append('high_variance_heterogeneity')
            
            if group_stats['count'].min() < 30:
                bias_indicators.append('insufficient_group_sample_size')
            
            # Check for systematic differences in means
            mean_values = group_stats['mean'].values
            if (np.max(mean_values) - np.min(mean_values)) > np.std(mean_values) * 2:
                bias_indicators.append('systematic_group_differences')
            
            consistency_analysis['bias_indicators'][measure_col] = bias_indicators
        
        # Generate recommendations
        all_indicators = [
            indicator for indicators in consistency_analysis['bias_indicators'].values()
            for indicator in indicators
        ]
        
        if 'high_variance_heterogeneity' in all_indicators:
            consistency_analysis['recommendations'].append(
                "Investigate measurement procedures across groups for consistency"
            )
        
        if 'insufficient_group_sample_size' in all_indicators:
            consistency_analysis['recommendations'].append(
                "Increase sample sizes for underrepresented groups"
            )
        
        if 'systematic_group_differences' in all_indicators:
            consistency_analysis['recommendations'].append(
                "Examine whether group differences reflect true differences or measurement bias"
            )
        
        return consistency_analysis
    
    def detect_instrument_bias(self, dataset: pd.DataFrame, 
                             instrument_variable: str,
                             outcome_variables: List[str]) -> Dict:
        """
        Detect potential instrument bias (different measurement tools/methods)
        
        Args:
            dataset: Dataset to analyze
            instrument_variable: Variable indicating measurement instrument/method
            outcome_variables: Variables measured by different instruments
        """
        instrument_analysis = {
            'instrument_effects': {},
            'bias_assessment': {},
            'calibration_needs': []
        }
        
        for outcome in outcome_variables:
            if outcome not in dataset.columns:
                continue
            
            # Analyze outcome distributions by instrument
            instrument_stats = dataset.groupby(instrument_variable)[outcome].agg([
                'mean', 'std', 'count'
            ])
            
            # Calculate effect sizes between instruments
            instruments = instrument_stats.index.tolist()
            effect_sizes = {}
            
            for i in range(len(instruments)):
                for j in range(i + 1, len(instruments)):
                    inst1, inst2 = instruments[i], instruments[j]
                    mean1 = instrument_stats.loc[inst1, 'mean']
                    mean2 = instrument_stats.loc[inst2, 'mean']
                    std1 = instrument_stats.loc[inst1, 'std']
                    std2 = instrument_stats.loc[inst2, 'std']
                    
                    # Cohen's d
                    pooled_std = np.sqrt((std1**2 + std2**2) / 2)
                    cohens_d = (mean1 - mean2) / pooled_std if pooled_std > 0 else 0
                    
                    effect_sizes[f"{inst1}_vs_{inst2}"] = cohens_d
            
            instrument_analysis['instrument_effects'][outcome] = {
                'statistics': instrument_stats.to_dict(),
                'effect_sizes': effect_sizes
            }
            
            # Assess bias severity
            max_effect_size = max(abs(es) for es in effect_sizes.values()) if effect_sizes else 0
            bias_severity = "low" if max_effect_size < 0.2 else "moderate" if max_effect_size < 0.5 else "high"
            
            instrument_analysis['bias_assessment'][outcome] = {
                'max_effect_size': max_effect_size,
                'severity': bias_severity,
                'requires_calibration': max_effect_size > 0.3
            }
            
            if max_effect_size > 0.3:
                instrument_analysis['calibration_needs'].append(outcome)
        
        return instrument_analysis

# Demonstration function
def demonstrate_practical_investigation_tools():
    """Demonstrate practical bias investigation tools"""
    print("=== Practical Bias Investigation Tools Demonstration ===\n")
    
    # Create sample dataset with bias issues
    np.random.seed(42)
    n_samples = 1000
    
    # Simulate missing groups and measurement bias
    age_groups = np.random.choice(['18-25', '26-40', '41-60'], n_samples, p=[0.6, 0.3, 0.1])  # Missing 60+
    regions = np.random.choice(['urban', 'suburban'], n_samples, p=[0.9, 0.1])  # Missing rural
    
    # Simulate measurement bias - different instruments give different readings
    instrument = np.random.choice(['A', 'B'], n_samples, p=[0.7, 0.3])
    base_score = np.random.normal(100, 15, n_samples)
    # Instrument A systematically reads higher
    score = np.where(instrument == 'A', base_score * 1.1, base_score)
    
    dataset = pd.DataFrame({
        'age_group': age_groups,
        'region': regions,
        'instrument': instrument,
        'test_score': score,
        'income': np.random.normal(50000, 20000, n_samples)
    })
    
    # 1. Dataset Provenance Analysis
    print("1. Dataset Provenance Analysis:")
    provenance_analyzer = DatasetProvenanceAnalyzer()
    
    metadata = {
        'sources': [{
            'name': 'online_survey',
            'type': 'surveys',
            'collection_method': 'convenience',
            'geographic_scope': 'limited',
            'response_rate': 0.3,
            'access_requirements': 'internet_required'
        }],
        'transformations': [{
            'type': 'filtering',
            'description': 'Removed incomplete responses',
            'parameters': {'min_completion': 0.8}
        }]
    }
    
    lineage_analysis = provenance_analyzer.analyze_data_lineage(metadata)
    print(f"  Bias risk score: {lineage_analysis['bias_risk_score']:.3f}")
    print(f"  Transformation risks: {len(lineage_analysis['transformation_risks'])}")
    print()
    
    # 2. Missing Groups Detection
    print("2. Missing Groups Detection:")
    missing_detector = MissingGroupsDetector()
    
    # Set population benchmarks
    benchmarks = {
        'age_group': {'18-25': 0.3, '26-40': 0.3, '41-60': 0.3, '60+': 0.1},
        'region': {'urban': 0.5, 'suburban': 0.3, 'rural': 0.2}
    }
    missing_detector.set_population_benchmarks(benchmarks)
    
    missing_analysis = missing_detector.detect_missing_groups(dataset, ['age_group', 'region'])
    print(f"  Missing groups: {missing_analysis['missing_groups']}")
    print(f"  Severity scores: {missing_analysis['severity_scores']}")
    print()
    
    # 3. Measurement Bias Analysis
    print("3. Measurement Bias Analysis:")
    measurement_analyzer = MeasurementBiasAnalyzer()
    
    consistency_analysis = measurement_analyzer.analyze_measurement_consistency(
        dataset, ['test_score', 'income'], 'age_group'
    )
    print(f"  Bias indicators: {consistency_analysis['bias_indicators']}")
    
    instrument_analysis = measurement_analyzer.detect_instrument_bias(
        dataset, 'instrument', ['test_score']
    )
    print(f"  Instrument bias assessment: {instrument_analysis['bias_assessment']}")
    print(f"  Calibration needed for: {instrument_analysis['calibration_needs']}")

if __name__ == "__main__":
    demonstrate_practical_investigation_tools()

```

## Part 3: Bias Mitigation Strategies

This section implements comprehensive frameworks for mitigating bias through diverse data collection, reweighting techniques, and fairness-aware metrics.

```python
from sklearn.utils.class_weight import compute_class_weight
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
import warnings
warnings.filterwarnings('ignore')

class DiverseDataCollectionFramework:
    """Framework for implementing diverse and representative data collection strategies"""
    
    def __init__(self):
        self.collection_strategies = {
            'stratified_sampling': 'Ensure proportional representation across groups',
            'quota_sampling': 'Set minimum representation targets for each group',
            'snowball_sampling': 'Use existing participants to reach underrepresented groups',
            'adaptive_sampling': 'Adjust collection based on ongoing representativeness analysis'
        }
        self.diversity_metrics = {}
    
    def design_stratified_collection(self, target_population: Dict[str, Dict[str, float]], 
                                   total_sample_size: int) -> Dict:
        """
        Design stratified sampling strategy to ensure representative collection
        
        Args:
            target_population: Target distributions for each demographic attribute
            total_sample_size: Total number of samples to collect
        """
        collection_plan = {
            'strategy': 'stratified_sampling',
            'total_size': total_sample_size,
            'strata_targets': {},
            'collection_priorities': [],
            'quality_checks': []
        }
        
        # Calculate sample sizes for each stratum
        for attribute, distribution in target_population.items():
            strata_sizes = {}
            for group, proportion in distribution.items():
                target_size = int(total_sample_size * proportion)
                strata_sizes[group] = max(target_size, 30)  # Minimum 30 per group
            
            collection_plan['strata_targets'][attribute] = strata_sizes
        
        # Identify collection priorities (hardest to reach groups)
        collection_plan['collection_priorities'] = [
            'rural_populations',
            'elderly_demographics',
            'low_income_groups',
            'minority_communities',
            'disability_communities'
        ]
        
        # Define quality checks
        collection_plan['quality_checks'] = [
            'weekly_representativeness_analysis',
            'response_quality_assessment',
            'completion_rate_monitoring',
            'demographic_balance_tracking'
        ]
        
        return collection_plan
    
    def implement_quota_sampling(self, current_sample: pd.DataFrame, 
                                target_quotas: Dict[str, Dict[str, int]],
                                demographic_cols: List[str]) -> Dict:
        """
        Implement quota sampling to meet representation targets
        
        Args:
            current_sample: Existing collected data
            target_quotas: Target sample sizes for each group
            demographic_cols: Demographic columns to consider
        """
        quota_analysis = {
            'current_status': {},
            'remaining_quotas': {},
            'collection_adjustments': {},
            'completion_rate': 0.0
        }
        
        total_collected = 0
        total_target = 0
        
        for col in demographic_cols:
            if col not in current_sample.columns or col not in target_quotas:
                continue
            
            current_counts = current_sample[col].value_counts().to_dict()
            target_counts = target_quotas[col]
            
            quota_analysis['current_status'][col] = current_counts
            quota_analysis['remaining_quotas'][col] = {}
            
            for group, target in target_counts.items():
                current = current_counts.get(group, 0)
                remaining = max(0, target - current)
                quota_analysis['remaining_quotas'][col][group] = remaining
                
                total_collected += current
                total_target += target
        
        quota_analysis['completion_rate'] = total_collected / total_target if total_target > 0 else 0
        
        # Generate collection adjustments
        quota_analysis['collection_adjustments'] = self._generate_collection_adjustments(
            quota_analysis['remaining_quotas']
        )
        
        return quota_analysis
    
    def _generate_collection_adjustments(self, remaining_quotas: Dict) -> List[str]:
        """Generate specific collection adjustment recommendations"""
        adjustments = []
        
        for col, quotas in remaining_quotas.items():
            high_need_groups = [group for group, need in quotas.items() if need > 50]
            if high_need_groups:
                adjustments.append(f"Priority collection needed for {col}: {high_need_groups}")
                adjustments.append(f"Consider targeted outreach campaigns for underrepresented {col} groups")
        
        return adjustments
    
    def calculate_diversity_score(self, dataset: pd.DataFrame, 
                                demographic_cols: List[str],
                                target_distributions: Dict[str, Dict[str, float]]) -> float:
        """
        Calculate overall diversity score for the dataset
        
        Args:
            dataset: Dataset to evaluate
            demographic_cols: Demographic columns to consider  
            target_distributions: Target distributions for comparison
        """
        diversity_scores = []
        
        for col in demographic_cols:
            if col not in dataset.columns or col not in target_distributions:
                continue
            
            actual_dist = dataset[col].value_counts(normalize=True).to_dict()
            target_dist = target_distributions[col]
            
            # Calculate Jensen-Shannon divergence as diversity metric
            all_groups = set(actual_dist.keys()) | set(target_dist.keys())
            
            actual_probs = np.array([actual_dist.get(group, 0) for group in all_groups])
            target_probs = np.array([target_dist.get(group, 0) for group in all_groups])
            
            # Normalize probabilities
            actual_probs = actual_probs / actual_probs.sum() if actual_probs.sum() > 0 else actual_probs
            target_probs = target_probs / target_probs.sum() if target_probs.sum() > 0 else target_probs
            
            # Calculate JS divergence (simplified)
            avg_probs = (actual_probs + target_probs) / 2
            
            def kl_divergence(p, q):
                return np.sum(p * np.log((p + 1e-10) / (q + 1e-10)))
            
            js_div = 0.5 * kl_divergence(actual_probs, avg_probs) + 0.5 * kl_divergence(target_probs, avg_probs)
            diversity_score = 1 - min(js_div, 1.0)  # Convert to similarity score
            
            diversity_scores.append(diversity_score)
        
        return np.mean(diversity_scores) if diversity_scores else 0.0

class BiasReweightingFramework:
    """Framework for implementing various bias mitigation through reweighting techniques"""
    
    def __init__(self):
        self.reweighting_methods = {
            'inverse_propensity': 'Weight samples inversely proportional to group representation',
            'fairness_constraints': 'Apply constraints to ensure group-wise fairness',
            'adversarial_debiasing': 'Use adversarial training to remove demographic dependencies'
        }
    
    def calculate_inverse_propensity_weights(self, dataset: pd.DataFrame,
                                           protected_attribute: str,
                                           target_distribution: Dict[str, float] = None) -> np.ndarray:
        """
        Calculate inverse propensity weights to balance group representation
        
        Args:
            dataset: Dataset to reweight
            protected_attribute: Protected attribute column
            target_distribution: Target distribution (uniform if None)
        """
        group_counts = dataset[protected_attribute].value_counts()
        total_samples = len(dataset)
        
        if target_distribution is None:
            # Uniform distribution
            n_groups = len(group_counts)
            target_distribution = {group: 1.0 / n_groups for group in group_counts.index}
        
        # Calculate weights
        weights = np.ones(len(dataset))
        
        for group in group_counts.index:
            group_mask = dataset[protected_attribute] == group
            current_prop = group_counts[group] / total_samples
            target_prop = target_distribution.get(group, current_prop)
            
            if current_prop > 0:
                weight = target_prop / current_prop
                weights[group_mask] = weight
        
        # Normalize weights to sum to original dataset size
        weights = weights * (len(dataset) / weights.sum())
        
        return weights
    
    def apply_fairness_constraints_reweighting(self, X: np.ndarray, y: np.ndarray,
                                             protected_attr: np.ndarray,
                                             fairness_metric: str = 'demographic_parity') -> np.ndarray:
        """
        Apply reweighting to satisfy fairness constraints
        
        Args:
            X: Feature matrix
            y: Target labels
            protected_attr: Protected attribute values
            fairness_metric: Type of fairness to optimize for
        """
        unique_groups = np.unique(protected_attr)
        unique_labels = np.unique(y)
        
        weights = np.ones(len(X))
        
        if fairness_metric == 'demographic_parity':
            # Balance positive prediction rates across groups
            overall_positive_rate = np.mean(y)
            
            for group in unique_groups:
                group_mask = protected_attr == group
                group_positive_rate = np.mean(y[group_mask])
                
                if group_positive_rate > 0:
                    # Adjust weights to match overall positive rate
                    positive_mask = (protected_attr == group) & (y == 1)
                    negative_mask = (protected_attr == group) & (y == 0)
                    
                    if np.sum(positive_mask) > 0:
                        weights[positive_mask] *= (overall_positive_rate / group_positive_rate)
                    if np.sum(negative_mask) > 0:
                        weights[negative_mask] *= ((1 - overall_positive_rate) / (1 - group_positive_rate))
        
        elif fairness_metric == 'equalized_odds':
            # Balance true positive and false positive rates across groups
            for label in unique_labels:
                label_mask = y == label
                if np.sum(label_mask) == 0:
                    continue
                
                overall_rate = np.sum(label_mask) / len(y)
                
                for group in unique_groups:
                    group_label_mask = (protected_attr == group) & label_mask
                    group_mask = protected_attr == group
                    
                    if np.sum(group_mask) > 0:
                        group_rate = np.sum(group_label_mask) / np.sum(group_mask)
                        if group_rate > 0:
                            adjustment = overall_rate / group_rate
                            weights[group_label_mask] *= adjustment
        
        # Normalize weights
        weights = weights * (len(X) / weights.sum())
        
        return weights
    
    def implement_adversarial_debiasing_weights(self, X: np.ndarray, 
                                              protected_attr: np.ndarray,
                                              learning_rate: float = 0.01) -> np.ndarray:
        """
        Implement adversarial debiasing through sample reweighting
        
        Args:
            X: Feature matrix
            protected_attr: Protected attribute values
            learning_rate: Learning rate for weight updates
        """
        # Simplified adversarial reweighting
        # In practice, this would involve training adversarial networks
        
        n_samples = len(X)
        weights = np.ones(n_samples)
        
        # Calculate feature importance for predicting protected attribute
        # Use correlation as a simple proxy
        feature_correlations = []
        for feature_idx in range(X.shape[1]):
            if np.std(X[:, feature_idx]) > 0:
                corr = np.corrcoef(X[:, feature_idx], protected_attr)[0, 1]
                feature_correlations.append(abs(corr))
            else:
                feature_correlations.append(0)
        
        feature_correlations = np.array(feature_correlations)
        
        # Reweight samples based on how predictive their features are of protected attribute
        for i in range(n_samples):
            sample_predictiveness = np.mean(feature_correlations * np.abs(X[i, :]))
            # Lower weight for samples that make protected attribute easy to predict
            weights[i] = 1.0 / (1.0 + sample_predictiveness)
        
        # Normalize weights
        weights = weights * (n_samples / weights.sum())
        
        return weights

class FairnessAwareMetrics:
    """Framework for implementing and calculating fairness-aware evaluation metrics"""
    
    def __init__(self):
        self.fairness_metrics = {
            'demographic_parity': 'Equal positive prediction rates across groups',
            'equalized_odds': 'Equal TPR and FPR across groups',
            'equal_opportunity': 'Equal TPR across groups',
            'calibration': 'Equal precision across groups for same confidence levels'
        }
    
    def calculate_demographic_parity(self, y_pred: np.ndarray, 
                                   protected_attr: np.ndarray) -> Dict:
        """Calculate demographic parity metrics"""
        groups = np.unique(protected_attr)
        group_rates = {}
        
        for group in groups:
            group_mask = protected_attr == group
            if np.sum(group_mask) > 0:
                positive_rate = np.mean(y_pred[group_mask])
                group_rates[group] = positive_rate
        
        # Calculate parity measures
        rates = list(group_rates.values())
        parity_difference = max(rates) - min(rates) if rates else 0
        parity_ratio = min(rates) / max(rates) if rates and max(rates) > 0 else 1
        
        return {
            'group_rates': group_rates,
            'parity_difference': parity_difference,
            'parity_ratio': parity_ratio,
            'is_fair': parity_difference < 0.1  # Common threshold
        }
    
    def calculate_equalized_odds(self, y_true: np.ndarray, y_pred: np.ndarray,
                               protected_attr: np.ndarray) -> Dict:
        """Calculate equalized odds metrics"""
        groups = np.unique(protected_attr)
        group_metrics = {}
        
        for group in groups:
            group_mask = protected_attr == group
            if np.sum(group_mask) > 0:
                y_true_group = y_true[group_mask]
                y_pred_group = y_pred[group_mask]
                
                # True Positive Rate
                tpr = np.mean(y_pred_group[y_true_group == 1]) if np.sum(y_true_group == 1) > 0 else 0
                
                # False Positive Rate  
                fpr = np.mean(y_pred_group[y_true_group == 0]) if np.sum(y_true_group == 0) > 0 else 0
                
                group_metrics[group] = {'tpr': tpr, 'fpr': fpr}
        
        # Calculate equalized odds violations
        tprs = [metrics['tpr'] for metrics in group_metrics.values()]
        fprs = [metrics['fpr'] for metrics in group_metrics.values()]
        
        tpr_difference = max(tprs) - min(tprs) if tprs else 0
        fpr_difference = max(fprs) - min(fprs) if fprs else 0
        
        return {
            'group_metrics': group_metrics,
            'tpr_difference': tpr_difference,
            'fpr_difference': fpr_difference,
            'max_violation': max(tpr_difference, fpr_difference),
            'is_fair': max(tpr_difference, fpr_difference) < 0.1
        }
    
    def calculate_calibration_metrics(self, y_true: np.ndarray, y_prob: np.ndarray,
                                    protected_attr: np.ndarray, 
                                    n_bins: int = 10) -> Dict:
        """Calculate calibration fairness metrics"""
        groups = np.unique(protected_attr)
        calibration_metrics = {}
        
        for group in groups:
            group_mask = protected_attr == group
            if np.sum(group_mask) == 0:
                continue
            
            y_true_group = y_true[group_mask]
            y_prob_group = y_prob[group_mask]
            
            # Calculate calibration curve
            bin_boundaries = np.linspace(0, 1, n_bins + 1)
            bin_centers = (bin_boundaries[:-1] + bin_boundaries[1:]) / 2
            
            calibration_error = 0
            bin_accuracies = []
            bin_confidences = []
            
            for i in range(n_bins):
                bin_mask = (y_prob_group >= bin_boundaries[i]) & (y_prob_group < bin_boundaries[i + 1])
                if np.sum(bin_mask) > 0:
                    bin_accuracy = np.mean(y_true_group[bin_mask])
                    bin_confidence = np.mean(y_prob_group[bin_mask])
                    bin_weight = np.sum(bin_mask) / len(y_prob_group)
                    
                    calibration_error += bin_weight * abs(bin_accuracy - bin_confidence)
                    bin_accuracies.append(bin_accuracy)
                    bin_confidences.append(bin_confidence)
            
            calibration_metrics[group] = {
                'calibration_error': calibration_error,
                'bin_accuracies': bin_accuracies,
                'bin_confidences': bin_confidences
            }
        
        # Calculate calibration fairness
        calibration_errors = [metrics['calibration_error'] for metrics in calibration_metrics.values()]
        calibration_difference = max(calibration_errors) - min(calibration_errors) if calibration_errors else 0
        
        return {
            'group_calibration': calibration_metrics,
            'calibration_difference': calibration_difference,
            'is_fair': calibration_difference < 0.05
        }
    
    def comprehensive_fairness_evaluation(self, y_true: np.ndarray, y_pred: np.ndarray,
                                        y_prob: np.ndarray, protected_attr: np.ndarray) -> Dict:
        """Perform comprehensive fairness evaluation across multiple metrics"""
        evaluation = {
            'demographic_parity': self.calculate_demographic_parity(y_pred, protected_attr),
            'equalized_odds': self.calculate_equalized_odds(y_true, y_pred, protected_attr),
            'calibration': self.calculate_calibration_metrics(y_true, y_prob, protected_attr)
        }
        
        # Overall fairness assessment
        fairness_scores = [
            evaluation['demographic_parity']['is_fair'],
            evaluation['equalized_odds']['is_fair'],
            evaluation['calibration']['is_fair']
        ]
        
        evaluation['overall_assessment'] = {
            'fair_metrics_count': sum(fairness_scores),
            'total_metrics': len(fairness_scores),
            'overall_fair': all(fairness_scores),
            'fairness_percentage': sum(fairness_scores) / len(fairness_scores) * 100
        }
        
        return evaluation

# Demonstration function for mitigation strategies
def demonstrate_bias_mitigation_strategies():
    """Demonstrate comprehensive bias mitigation strategies"""
    print("=== Bias Mitigation Strategies Demonstration ===\n")
    
    # Create biased synthetic dataset
    np.random.seed(42)
    n_samples = 1000
    
    # Biased gender distribution (70% male, 30% female)
    gender = np.random.choice(['M', 'F'], n_samples, p=[0.7, 0.3])
    
    # Biased outcomes (males more likely to get positive outcomes)
    base_prob = 0.3
    prob_adjustment = np.where(gender == 'M', 0.1, -0.1)
    outcomes = np.random.binomial(1, base_prob + prob_adjustment, n_samples)
    
    # Features
    features = np.random.normal(0, 1, (n_samples, 5))
    
    dataset = pd.DataFrame({
        'gender': gender,
        'outcome': outcomes,
        'feature1': features[:, 0],
        'feature2': features[:, 1],
        'feature3': features[:, 2]
    })
    
    # 1. Diverse Data Collection Framework
    print("1. Diverse Data Collection Analysis:")
    collection_framework = DiverseDataCollectionFramework()
    
    target_distribution = {'gender': {'M': 0.5, 'F': 0.5}}
    diversity_score = collection_framework.calculate_diversity_score(
        dataset, ['gender'], target_distribution
    )
    print(f"  Current diversity score: {diversity_score:.3f}")
    
    collection_plan = collection_framework.design_stratified_collection(
        target_distribution, 1000
    )
    print(f"  Collection strategy: {collection_plan['strategy']}")
    print(f"  Target strata: {collection_plan['strata_targets']}")
    print()
    
    # 2. Bias Reweighting Framework
    print("2. Bias Reweighting:")
    reweighting_framework = BiasReweightingFramework()
    
    # Calculate inverse propensity weights
    ipw_weights = reweighting_framework.calculate_inverse_propensity_weights(
        dataset, 'gender'
    )
    print(f"  Inverse propensity weights - Mean: {np.mean(ipw_weights):.3f}, Std: {np.std(ipw_weights):.3f}")
    
    # Calculate fairness constraint weights
    protected_attr_numeric = (dataset['gender'] == 'M').astype(int)
    fairness_weights = reweighting_framework.apply_fairness_constraints_reweighting(
        features, outcomes, protected_attr_numeric, 'demographic_parity'
    )
    print(f"  Fairness constraint weights - Mean: {np.mean(fairness_weights):.3f}, Std: {np.std(fairness_weights):.3f}")
    print()
    
    # 3. Fairness-Aware Metrics
    print("3. Fairness-Aware Metrics:")
    fairness_metrics = FairnessAwareMetrics()
    
    # Train simple model for evaluation
    from sklearn.linear_model import LogisticRegression
    model = LogisticRegression(random_state=42)
    model.fit(features, outcomes)
    y_pred = model.predict(features)
    y_prob = model.predict_proba(features)[:, 1]
    
    # Evaluate fairness
    fairness_eval = fairness_metrics.comprehensive_fairness_evaluation(
        outcomes, y_pred, y_prob, protected_attr_numeric
    )
    
    print(f"  Demographic Parity - Fair: {fairness_eval['demographic_parity']['is_fair']}")
    print(f"  Parity Difference: {fairness_eval['demographic_parity']['parity_difference']:.3f}")
    print(f"  Equalized Odds - Fair: {fairness_eval['equalized_odds']['is_fair']}")
    print(f"  Overall Fairness: {fairness_eval['overall_assessment']['fairness_percentage']:.1f}%")

if __name__ == "__main__":
    demonstrate_bias_mitigation_strategies()

```

## Part 4: Transparency and Accountability Tools

This section implements comprehensive frameworks for documentation, model cards, and reproducibility checks to ensure transparency in bias mitigation efforts.

```python
import json
from datetime import datetime
from typing import Optional
import hashlib
import pickle

class ModelCardGenerator:
    """Framework for generating comprehensive model cards for bias transparency"""
    
    def __init__(self):
        self.card_template = {
            'model_details': {},
            'intended_use': {},
            'factors': {},
            'metrics': {},
            'evaluation_data': {},
            'training_data': {},
            'quantitative_analyses': {},
            'ethical_considerations': {},
            'caveats_and_recommendations': {}
        }
    
    def create_model_card(self, model_info: Dict, training_data_info: Dict,
                         evaluation_results: Dict, bias_analysis: Dict) -> Dict:
        """
        Create comprehensive model card including bias analysis
        
        Args:
            model_info: Basic model information
            training_data_info: Training data characteristics
            evaluation_results: Model evaluation metrics
            bias_analysis: Bias assessment results
        """
        model_card = self.card_template.copy()
        
        # Model Details
        model_card['model_details'] = {
            'name': model_info.get('name', 'Unnamed Model'),
            'version': model_info.get('version', '1.0'),
            'date': datetime.now().isoformat(),
            'type': model_info.get('type', 'Classification'),
            'architecture': model_info.get('architecture', 'Not specified'),
            'paper_or_resources': model_info.get('references', []),
            'license': model_info.get('license', 'Not specified'),
            'feedback': model_info.get('contact', 'Not provided')
        }
        
        # Intended Use
        model_card['intended_use'] = {
            'primary_intended_uses': model_info.get('intended_uses', []),
            'primary_intended_users': model_info.get('intended_users', []),
            'out_of_scope_use_cases': model_info.get('out_of_scope', [])
        }
        
        # Factors (bias-relevant demographics and other factors)
        model_card['factors'] = {
            'relevant_factors': training_data_info.get('demographic_factors', []),
            'evaluation_factors': bias_analysis.get('analyzed_factors', [])
        }
        
        # Metrics
        model_card['metrics'] = {
            'model_performance_measures': evaluation_results.get('performance_metrics', {}),
            'decision_thresholds': evaluation_results.get('thresholds', {}),
            'variation_approaches': evaluation_results.get('variation_analysis', {})
        }
        
        # Training Data
        model_card['training_data'] = {
            'dataset_name': training_data_info.get('name', 'Not specified'),
            'data_collection_method': training_data_info.get('collection_method', 'Not specified'),
            'data_preprocessing': training_data_info.get('preprocessing_steps', []),
            'demographic_distribution': training_data_info.get('demographic_distribution', {}),
            'bias_mitigation_applied': training_data_info.get('bias_mitigation', [])
        }
        
        # Quantitative Analyses (bias-focused)
        model_card['quantitative_analyses'] = {
            'unitary_results': self._format_bias_results(bias_analysis.get('overall_metrics', {})),
            'intersectional_results': self._format_intersectional_analysis(
                bias_analysis.get('intersectional_analysis', {})
            )
        }
        
        # Ethical Considerations
        model_card['ethical_considerations'] = {
            'sensitive_data': self._identify_sensitive_data_usage(training_data_info),
            'human_life_impact': model_info.get('human_impact_assessment', 'Not assessed'),
            'mitigations': bias_analysis.get('mitigation_strategies', []),
            'risks_and_harms': self._assess_potential_harms(bias_analysis),
            'use_cases_to_avoid': model_info.get('prohibited_uses', [])
        }
        
        # Caveats and Recommendations
        model_card['caveats_and_recommendations'] = {
            'caveats': self._generate_bias_caveats(bias_analysis),
            'recommendations': self._generate_usage_recommendations(bias_analysis)
        }
        
        return model_card
    
    def _format_bias_results(self, bias_metrics: Dict) -> Dict:
        """Format bias analysis results for model card"""
        formatted_results = {}
        
        for metric_name, result in bias_metrics.items():
            if isinstance(result, dict):
                formatted_results[metric_name] = {
                    'value': result.get('value', 'Not calculated'),
                    'threshold': result.get('threshold', 'Not specified'),
                    'interpretation': result.get('interpretation', 'See documentation')
                }
            else:
                formatted_results[metric_name] = {'value': result}
        
        return formatted_results
    
    def _format_intersectional_analysis(self, intersectional_data: Dict) -> Dict:
        """Format intersectional bias analysis for model card"""
        if not intersectional_data:
            return {'status': 'Not performed'}
        
        return {
            'combinations_analyzed': intersectional_data.get('combinations', []),
            'significant_disparities': intersectional_data.get('disparities', []),
            'recommendations': intersectional_data.get('recommendations', [])
        }
    
    def _identify_sensitive_data_usage(self, training_data_info: Dict) -> List[str]:
        """Identify sensitive data elements used in training"""
        sensitive_indicators = []
        
        demographic_factors = training_data_info.get('demographic_factors', [])
        sensitive_attributes = ['race', 'gender', 'age', 'religion', 'sexual_orientation', 'disability']
        
        for attr in sensitive_attributes:
            if any(attr.lower() in factor.lower() for factor in demographic_factors):
                sensitive_indicators.append(attr)
        
        return sensitive_indicators
    
    def _assess_potential_harms(self, bias_analysis: Dict) -> List[str]:
        """Assess potential harms based on bias analysis"""
        potential_harms = []
        
        severity = bias_analysis.get('overall_severity', 0)
        if severity > 0.7:
            potential_harms.append('High risk of discriminatory outcomes')
            potential_harms.append('May perpetuate or amplify existing social inequalities')
        elif severity > 0.4:
            potential_harms.append('Moderate risk of biased decisions')
            potential_harms.append('Potential for unfair treatment of certain groups')
        
        affected_groups = bias_analysis.get('affected_groups', [])
        if affected_groups:
            potential_harms.append(f'Particularly affects: {", ".join(affected_groups)}')
        
        return potential_harms
    
    def _generate_bias_caveats(self, bias_analysis: Dict) -> List[str]:
        """Generate caveats based on bias analysis"""
        caveats = []
        
        if bias_analysis.get('data_limitations', []):
            caveats.append('Model trained on data with known representational limitations')
        
        if bias_analysis.get('temporal_considerations', {}):
            caveats.append('Model performance may degrade over time due to population drift')
        
        if bias_analysis.get('geographic_limitations', []):
            caveats.append('Model may not generalize to different geographic regions')
        
        return caveats
    
    def _generate_usage_recommendations(self, bias_analysis: Dict) -> List[str]:
        """Generate usage recommendations based on bias analysis"""
        recommendations = []
        
        if bias_analysis.get('monitoring_needs', []):
            recommendations.extend(bias_analysis['monitoring_needs'])
        
        recommendations.extend([
            'Regular bias assessment in deployment environment',
            'Human oversight for high-stakes decisions',
            'Periodic retraining with updated, representative data'
        ])
        
        return recommendations
    
    def export_model_card(self, model_card: Dict, format_type: str = 'json',
                         filepath: Optional[str] = None) -> str:
        """Export model card in specified format"""
        if format_type == 'json':
            card_str = json.dumps(model_card, indent=2, default=str)
        elif format_type == 'markdown':
            card_str = self._convert_to_markdown(model_card)
        else:
            raise ValueError(f"Unsupported format: {format_type}")
        
        if filepath:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(card_str)
        
        return card_str
    
    def _convert_to_markdown(self, model_card: Dict) -> str:
        """Convert model card to markdown format"""
        markdown_sections = ["# Model Card\n"]
        
        for section_name, section_content in model_card.items():
            section_title = section_name.replace('_', ' ').title()
            markdown_sections.append(f"\n## {section_title}\n")
            
            if isinstance(section_content, dict):
                for key, value in section_content.items():
                    item_title = key.replace('_', ' ').title()
                    markdown_sections.append(f"\n### {item_title}\n")
                    
                    if isinstance(value, list):
                        for item in value:
                            markdown_sections.append(f"- {item}\n")
                    elif isinstance(value, dict):
                        for subkey, subvalue in value.items():
                            markdown_sections.append(f"**{subkey}**: {subvalue}\n")
                    else:
                        markdown_sections.append(f"{value}\n")
        
        return ''.join(markdown_sections)

class BiasDocumentationFramework:
    """Framework for comprehensive bias documentation and audit trails"""
    
    def __init__(self):
        self.documentation_log = []
        self.audit_trail = []
    
    def document_bias_assessment(self, assessment_id: str, assessment_type: str,
                                methodology: Dict, results: Dict, 
                                decisions_made: List[str]) -> Dict:
        """
        Document a bias assessment with full methodology and results
        
        Args:
            assessment_id: Unique identifier for the assessment
            assessment_type: Type of bias assessment performed
            methodology: Detailed methodology used
            results: Assessment results
            decisions_made: Decisions made based on results
        """
        documentation = {
            'assessment_id': assessment_id,
            'timestamp': datetime.now().isoformat(),
            'assessment_type': assessment_type,
            'methodology': {
                'approach': methodology.get('approach', 'Not specified'),
                'tools_used': methodology.get('tools', []),
                'data_sources': methodology.get('data_sources', []),
                'evaluation_criteria': methodology.get('criteria', []),
                'assumptions': methodology.get('assumptions', [])
            },
            'results': {
                'summary': results.get('summary', 'Not provided'),
                'detailed_findings': results.get('detailed_findings', {}),
                'severity_assessment': results.get('severity', 'Not assessed'),
                'affected_groups': results.get('affected_groups', []),
                'confidence_level': results.get('confidence', 'Not specified')
            },
            'decisions_and_actions': {
                'immediate_decisions': decisions_made,
                'mitigation_actions': results.get('mitigation_actions', []),
                'follow_up_required': results.get('follow_up', []),
                'approval_status': 'Pending Review'
            },
            'review_and_validation': {
                'peer_reviewed': False,
                'stakeholder_consulted': False,
                'external_audit': False,
                'review_comments': []
            }
        }
        
        self.documentation_log.append(documentation)
        self._update_audit_trail('bias_assessment_documented', assessment_id)
        
        return documentation
    
    def document_mitigation_implementation(self, mitigation_id: str,
                                         mitigation_strategy: Dict,
                                         implementation_details: Dict,
                                         effectiveness_metrics: Dict) -> Dict:
        """
        Document bias mitigation implementation and effectiveness
        
        Args:
            mitigation_id: Unique identifier for mitigation effort
            mitigation_strategy: Strategy being implemented
            implementation_details: How the strategy was implemented
            effectiveness_metrics: Metrics showing effectiveness
        """
        mitigation_doc = {
            'mitigation_id': mitigation_id,
            'timestamp': datetime.now().isoformat(),
            'strategy': {
                'name': mitigation_strategy.get('name', 'Unnamed Strategy'),
                'type': mitigation_strategy.get('type', 'Not specified'),
                'target_bias': mitigation_strategy.get('target_bias', []),
                'expected_outcomes': mitigation_strategy.get('expected_outcomes', [])
            },
            'implementation': {
                'start_date': implementation_details.get('start_date', 'Not specified'),
                'completion_date': implementation_details.get('completion_date', 'Ongoing'),
                'implementation_steps': implementation_details.get('steps', []),
                'resources_used': implementation_details.get('resources', []),
                'challenges_encountered': implementation_details.get('challenges', [])
            },
            'effectiveness_evaluation': {
                'metrics_used': list(effectiveness_metrics.keys()),
                'baseline_values': effectiveness_metrics.get('baseline', {}),
                'post_mitigation_values': effectiveness_metrics.get('post_mitigation', {}),
                'improvement_achieved': effectiveness_metrics.get('improvement', {}),
                'success_criteria_met': effectiveness_metrics.get('success_criteria_met', False)
            },
            'lessons_learned': implementation_details.get('lessons_learned', []),
            'recommendations': implementation_details.get('recommendations', [])
        }
        
        self.documentation_log.append(mitigation_doc)
        self._update_audit_trail('mitigation_implemented', mitigation_id)
        
        return mitigation_doc
    
    def _update_audit_trail(self, action: str, entity_id: str, details: str = ""):
        """Update audit trail with action"""
        audit_entry = {
            'timestamp': datetime.now().isoformat(),
            'action': action,
            'entity_id': entity_id,
            'details': details,
            'user': 'system'  # In practice, would capture actual user
        }
        self.audit_trail.append(audit_entry)
    
    def generate_compliance_report(self, compliance_framework: str = 'general') -> Dict:
        """Generate compliance report for bias management"""
        assessments_count = len([doc for doc in self.documentation_log 
                               if 'assessment_type' in doc])
        mitigations_count = len([doc for doc in self.documentation_log 
                               if 'strategy' in doc])
        
        compliance_report = {
            'report_date': datetime.now().isoformat(),
            'compliance_framework': compliance_framework,
            'summary_statistics': {
                'total_bias_assessments': assessments_count,
                'total_mitigation_efforts': mitigations_count,
                'documentation_completeness': self._assess_documentation_completeness(),
                'audit_trail_entries': len(self.audit_trail)
            },
            'compliance_checklist': self._generate_compliance_checklist(),
            'recommendations': self._generate_compliance_recommendations(),
            'next_review_date': self._calculate_next_review_date()
        }
        
        return compliance_report
    
    def _assess_documentation_completeness(self) -> float:
        """Assess completeness of bias documentation"""
        if not self.documentation_log:
            return 0.0
        
        required_fields = ['methodology', 'results', 'decisions_and_actions']
        complete_docs = 0
        
        for doc in self.documentation_log:
            if all(field in doc and doc[field] for field in required_fields):
                complete_docs += 1
        
        return complete_docs / len(self.documentation_log)
    
    def _generate_compliance_checklist(self) -> Dict[str, bool]:
        """Generate compliance checklist"""
        return {
            'bias_assessment_conducted': len([doc for doc in self.documentation_log if 'assessment_type' in doc]) > 0,
            'mitigation_strategies_documented': len([doc for doc in self.documentation_log if 'strategy' in doc]) > 0,
            'effectiveness_measured': any('effectiveness_evaluation' in doc for doc in self.documentation_log),
            'audit_trail_maintained': len(self.audit_trail) > 0,
            'regular_reviews_scheduled': True,  # Would check actual schedule
            'stakeholder_involvement_documented': any(
                doc.get('review_and_validation', {}).get('stakeholder_consulted', False)
                for doc in self.documentation_log
            )
        }
    
    def _generate_compliance_recommendations(self) -> List[str]:
        """Generate recommendations for compliance improvement"""
        recommendations = []
        
        if self._assess_documentation_completeness() < 0.8:
            recommendations.append("Improve documentation completeness")
        
        if not any('external_audit' in str(doc) for doc in self.documentation_log):
            recommendations.append("Consider external bias audit")
        
        recommendations.append("Establish regular bias assessment schedule")
        recommendations.append("Implement continuous monitoring system")
        
        return recommendations
    
    def _calculate_next_review_date(self) -> str:
        """Calculate next recommended review date"""
        from datetime import timedelta
        next_review = datetime.now() + timedelta(days=90)  # Quarterly reviews
        return next_review.isoformat()

class ReproducibilityChecker:
    """Framework for ensuring reproducibility of bias assessments and mitigations"""
    
    def __init__(self):
        self.reproducibility_log = []
        self.version_registry = {}
    
    def create_reproducibility_package(self, experiment_id: str,
                                     code_files: List[str],
                                     data_description: Dict,
                                     environment_info: Dict,
                                     results: Dict) -> Dict:
        """
        Create reproducibility package for bias assessment/mitigation
        
        Args:
            experiment_id: Unique identifier for the experiment
            code_files: List of code files used
            data_description: Description of data used
            environment_info: Environment and dependency information
            results: Results to be reproduced
        """
        package = {
            'experiment_id': experiment_id,
            'creation_date': datetime.now().isoformat(),
            'code_artifacts': {
                'files': code_files,
                'main_script': code_files[0] if code_files else None,
                'code_hash': self._calculate_code_hash(code_files),
                'version_control_info': environment_info.get('git_commit', 'Not tracked')
            },
            'data_artifacts': {
                'description': data_description.get('description', 'Not provided'),
                'source': data_description.get('source', 'Not specified'),
                'version': data_description.get('version', 'Not versioned'),
                'preprocessing_steps': data_description.get('preprocessing', []),
                'data_hash': data_description.get('hash', 'Not calculated')
            },
            'environment': {
                'python_version': environment_info.get('python_version', 'Not specified'),
                'packages': environment_info.get('packages', {}),
                'hardware': environment_info.get('hardware', 'Not specified'),
                'random_seeds': environment_info.get('random_seeds', {})
            },
            'expected_results': {
                'primary_metrics': results.get('primary_metrics', {}),
                'secondary_metrics': results.get('secondary_metrics', {}),
                'result_format': results.get('format', 'Not specified'),
                'tolerance_levels': results.get('tolerance', {})
            },
            'reproduction_instructions': self._generate_reproduction_instructions(
                code_files, data_description, environment_info
            )
        }
        
        self.reproducibility_log.append(package)
        self._register_version(experiment_id, package)
        
        return package
    
    def verify_reproducibility(self, experiment_id: str, 
                             reproduction_results: Dict) -> Dict:
        """
        Verify reproducibility by comparing reproduction results with original
        
        Args:
            experiment_id: ID of experiment to verify
            reproduction_results: Results from reproduction attempt
        """
        original_package = None
        for package in self.reproducibility_log:
            if package['experiment_id'] == experiment_id:
                original_package = package
                break
        
        if not original_package:
            return {'status': 'error', 'message': 'Original experiment not found'}
        
        verification_result = {
            'experiment_id': experiment_id,
            'verification_date': datetime.now().isoformat(),
            'original_results': original_package['expected_results'],
            'reproduction_results': reproduction_results,
            'comparison': {},
            'overall_status': 'unknown'
        }
        
        # Compare primary metrics
        primary_comparison = self._compare_metrics(
            original_package['expected_results']['primary_metrics'],
            reproduction_results.get('primary_metrics', {}),
            original_package['expected_results'].get('tolerance_levels', {})
        )
        
        verification_result['comparison']['primary_metrics'] = primary_comparison
        
        # Determine overall status
        if primary_comparison['all_within_tolerance']:
            verification_result['overall_status'] = 'reproducible'
        elif primary_comparison['some_within_tolerance']:
            verification_result['overall_status'] = 'partially_reproducible'
        else:
            verification_result['overall_status'] = 'not_reproducible'
        
        # Add recommendations
        verification_result['recommendations'] = self._generate_reproducibility_recommendations(
            verification_result
        )
        
        return verification_result
    
    def _calculate_code_hash(self, code_files: List[str]) -> str:
        """Calculate hash of code files for version tracking"""
        combined_content = ""
        
        for file_path in code_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    combined_content += f.read()
            except FileNotFoundError:
                combined_content += f"FILE_NOT_FOUND: {file_path}"
        
        return hashlib.md5(combined_content.encode()).hexdigest()
    
    def _generate_reproduction_instructions(self, code_files: List[str],
                                          data_description: Dict,
                                          environment_info: Dict) -> List[str]:
        """Generate step-by-step reproduction instructions"""
        instructions = [
            "# Reproduction Instructions",
            "",
            "## Environment Setup",
            f"1. Install Python version: {environment_info.get('python_version', 'See requirements')}",
            "2. Install required packages:"
        ]
        
        packages = environment_info.get('packages', {})
        for package, version in packages.items():
            instructions.append(f"   - {package}=={version}")
        
        instructions.extend([
            "",
            "## Data Preparation",
            f"1. Obtain data from: {data_description.get('source', 'See documentation')}",
            f"2. Data version: {data_description.get('version', 'Latest')}",
            "3. Apply preprocessing steps:"
        ])
        
        for step in data_description.get('preprocessing', []):
            instructions.append(f"   - {step}")
        
        instructions.extend([
            "",
            "## Code Execution",
            "1. Download code files:"
        ])
        
        for file_path in code_files:
            instructions.append(f"   - {file_path}")
        
        instructions.extend([
            f"2. Run main script: {code_files[0] if code_files else 'main.py'}",
            "3. Set random seeds as specified in environment_info",
            "",
            "## Expected Results",
            "Compare your results with the expected_results section in this package."
        ])
        
        return instructions
    
    def _compare_metrics(self, original: Dict, reproduction: Dict, 
                        tolerances: Dict) -> Dict:
        """Compare original and reproduction metrics"""
        comparison = {
            'metric_comparisons': {},
            'all_within_tolerance': True,
            'some_within_tolerance': False
        }
        
        for metric_name, original_value in original.items():
            if metric_name not in reproduction:
                comparison['metric_comparisons'][metric_name] = {
                    'status': 'missing_in_reproduction',
                    'within_tolerance': False
                }
                comparison['all_within_tolerance'] = False
                continue
            
            reproduction_value = reproduction[metric_name]
            tolerance = tolerances.get(metric_name, 0.01)  # Default 1% tolerance
            
            if isinstance(original_value, (int, float)) and isinstance(reproduction_value, (int, float)):
                relative_diff = abs(original_value - reproduction_value) / abs(original_value) if original_value != 0 else abs(reproduction_value)
                within_tolerance = relative_diff <= tolerance
            else:
                within_tolerance = original_value == reproduction_value
            
            comparison['metric_comparisons'][metric_name] = {
                'original_value': original_value,
                'reproduction_value': reproduction_value,
                'within_tolerance': within_tolerance,
                'tolerance_used': tolerance
            }
            
            if within_tolerance:
                comparison['some_within_tolerance'] = True
            else:
                comparison['all_within_tolerance'] = False
        
        return comparison
    
    def _generate_reproducibility_recommendations(self, verification_result: Dict) -> List[str]:
        """Generate recommendations based on reproducibility verification"""
        recommendations = []
        
        status = verification_result['overall_status']
        
        if status == 'not_reproducible':
            recommendations.extend([
                "Critical: Results not reproducible - investigate methodology",
                "Check environment setup and dependencies",
                "Verify data preprocessing steps",
                "Review random seed settings"
            ])
        elif status == 'partially_reproducible':
            recommendations.extend([
                "Some metrics not reproducible - investigate specific differences",
                "Consider adjusting tolerance levels if differences are minor",
                "Document known sources of variation"
            ])
        else:
            recommendations.append("Results successfully reproduced")
        
        recommendations.append("Archive this reproduction package for future reference")
        
        return recommendations
    
    def _register_version(self, experiment_id: str, package: Dict):
        """Register experiment version in registry"""
        if experiment_id not in self.version_registry:
            self.version_registry[experiment_id] = []
        
        version_info = {
            'version': len(self.version_registry[experiment_id]) + 1,
            'date': package['creation_date'],
            'code_hash': package['code_artifacts']['code_hash'],
            'data_hash': package['data_artifacts']['data_hash']
        }
        
        self.version_registry[experiment_id].append(version_info)

# Comprehensive demonstration function
def demonstrate_transparency_accountability_tools():
    """Demonstrate transparency and accountability tools"""
    print("=== Transparency and Accountability Tools Demonstration ===\n")
    
    # 1. Model Card Generation
    print("1. Model Card Generation:")
    model_card_gen = ModelCardGenerator()
    
    # Sample model information
    model_info = {
        'name': 'Hiring Decision Classifier',
        'version': '2.1',
        'type': 'Binary Classification',
        'architecture': 'Logistic Regression',
        'intended_uses': ['Resume screening', 'Initial candidate assessment'],
        'intended_users': ['HR departments', 'Recruitment agencies'],
        'out_of_scope': ['Final hiring decisions', 'Salary determination']
    }
    
    training_data_info = {
        'name': 'Historical Hiring Data 2020-2023',
        'collection_method': 'Administrative records',
        'demographic_factors': ['gender', 'age_group', 'education_level'],
        'demographic_distribution': {'gender': {'M': 0.6, 'F': 0.4}},
        'bias_mitigation': ['Reweighting', 'Fairness constraints']
    }
    
    evaluation_results = {
        'performance_metrics': {'accuracy': 0.85, 'precision': 0.82, 'recall': 0.78}
    }
    
    bias_analysis = {
        'overall_severity': 0.3,
        'affected_groups': ['female_candidates'],
        'mitigation_strategies': ['Applied demographic parity constraints'],
        'analyzed_factors': ['gender', 'age_group']
    }
    
    model_card = model_card_gen.create_model_card(
        model_info, training_data_info, evaluation_results, bias_analysis
    )
    
    print(f"  Model card created for: {model_card['model_details']['name']}")
    print(f"  Ethical considerations: {len(model_card['ethical_considerations'])} items")
    print(f"  Bias mitigation documented: {len(training_data_info['bias_mitigation'])} strategies")
    print()
    
    # 2. Bias Documentation Framework
    print("2. Bias Documentation Framework:")
    doc_framework = BiasDocumentationFramework()
    
    # Document bias assessment
    assessment_doc = doc_framework.document_bias_assessment(
        'BIAS_ASSESS_001',
        'demographic_parity_analysis',
        {
            'approach': 'Statistical parity testing',
            'tools': ['fairness_metrics_library'],
            'criteria': ['demographic_parity', 'equalized_odds']
        },
        {
            'summary': 'Moderate bias detected in gender predictions',
            'severity': 'moderate',
            'affected_groups': ['female_candidates']
        },
        ['Apply reweighting', 'Implement fairness constraints']
    )
    
    print(f"  Assessment documented: {assessment_doc['assessment_id']}")
    print(f"  Severity: {assessment_doc['results']['severity_assessment']}")
    print(f"  Actions planned: {len(assessment_doc['decisions_and_actions']['immediate_decisions'])}")
    
    # Generate compliance report
    compliance_report = doc_framework.generate_compliance_report()
    print(f"  Compliance report generated - {compliance_report['summary_statistics']['total_bias_assessments']} assessments documented")
    print()
    
    # 3. Reproducibility Checker
    print("3. Reproducibility Checker:")
    repro_checker = ReproducibilityChecker()
    
    # Create reproducibility package
    repro_package = repro_checker.create_reproducibility_package(
        'BIAS_EXPERIMENT_001',
        ['bias_analysis.py', 'fairness_metrics.py'],
        {
            'description': 'Hiring dataset with demographic information',
            'source': 'company_hr_database',
            'version': '2023_Q4',
            'preprocessing': ['Remove PII', 'Normalize scores', 'Handle missing values']
        },
        {
            'python_version': '3.9.7',
            'packages': {'scikit-learn': '1.0.2', 'pandas': '1.3.3', 'numpy': '1.21.2'},
            'random_seeds': {'numpy': 42, 'sklearn': 123}
        },
        {
            'primary_metrics': {'demographic_parity_difference': 0.12, 'accuracy': 0.85},
            'tolerance': {'demographic_parity_difference': 0.02, 'accuracy': 0.01}
        }
    )
    
    print(f"  Reproducibility package created: {repro_package['experiment_id']}")
    print(f"  Code hash: {repro_package['code_artifacts']['code_hash'][:8]}...")
    print(f"  Instructions generated: {len(repro_package['reproduction_instructions'])} steps")
    
    # Simulate verification
    reproduction_results = {
        'primary_metrics': {'demographic_parity_difference': 0.11, 'accuracy': 0.84}
    }
    
    verification = repro_checker.verify_reproducibility('BIAS_EXPERIMENT_001', reproduction_results)
    print(f"  Verification status: {verification['overall_status']}")
    print(f"  Recommendations: {len(verification['recommendations'])} items")

if __name__ == "__main__":
    demonstrate_transparency_accountability_tools()

```

## Practice Tasks

### Task 1: Bias Source Analysis

Using the `BiasSourceAnalyzer` class, analyze a dataset of your choice for potential sampling, historical, labeler, and population drift biases. Create a comprehensive bias assessment report.

### Task 2: Missing Groups Investigation

Implement the missing groups detection framework on a real-world dataset. Set appropriate population benchmarks and develop a targeted sampling strategy to address identified gaps.

### Task 3: Fairness-Aware Model Development

Train two versions of a classification model: one standard version and one using bias mitigation techniques from the framework. Compare their fairness metrics and overall performance.

### Task 4: Model Card Creation

Create a comprehensive model card for an ML system you've developed, including all bias analysis results, mitigation strategies, and ethical considerations.

### Task 5: Reproducibility Package

Develop a complete reproducibility package for a bias assessment experiment, including all code, data descriptions, environment specifications, and verification procedures.

## Key Takeaways

1. **Systematic Bias Detection**: Bias in ML systems requires systematic detection across multiple dimensions including sampling, historical patterns, labeling processes, and population changes.

2. **Multi-faceted Mitigation**: Effective bias mitigation requires combining diverse data collection, reweighting techniques, fairness-aware metrics, and continuous monitoring.

3. **Transparency is Essential**: Model cards, comprehensive documentation, and reproducibility packages are crucial for accountability and trust in ML systems.

4. **Continuous Monitoring**: Bias assessment is not a one-time activity but requires ongoing monitoring and adjustment as data and populations evolve.

5. **Stakeholder Involvement**: Effective bias mitigation requires involvement from diverse stakeholders including affected communities, domain experts, and ethicists.

## Summary

This section provided comprehensive frameworks for investigating and mitigating bias in ML and AI systems. We covered:

- **Sources of Bias Analysis**: Systematic detection of sampling bias, historical bias, labeler bias, and population drift

- **Practical Investigation Tools**: Dataset provenance analysis, missing groups detection, and measurement bias assessment  

- **Mitigation Strategies**: Diverse data collection, reweighting techniques, and fairness-aware metrics

- **Transparency and Accountability**: Model cards, documentation frameworks, and reproducibility checks

The frameworks and tools presented enable practitioners to systematically identify, analyze, and address bias throughout the ML development lifecycle, ensuring more fair and reliable AI systems.
