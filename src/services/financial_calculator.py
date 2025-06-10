import json
import os
from typing import Dict, Any, List

class FinancialCalculator:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        self.tax_rates = self._load_json('tax_rates.json')
        self.industry_benchmarks = self._load_json('industry_benchmarks.json')
        self.currencies = self._load_json('currencies.json')
    
    def _load_json(self, filename: str) -> Dict:
        """Load JSON data from file"""
        file_path = os.path.join(self.data_dir, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    
    def calculate_emergency_fund(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate emergency fund recommendations"""
        monthly_expenses = self._calculate_monthly_expenses(business_data)
        industry = business_data.get('industry', 'technology')
        
        # Get industry-specific multiplier
        industry_data = self.industry_benchmarks['industries'].get(industry, {})
        multiplier = industry_data.get('emergencyFundMultiplier', 4)
        
        recommended_amount = monthly_expenses * multiplier
        current_savings = business_data.get('currentSavings', 0)
        gap = max(0, recommended_amount - current_savings)
        
        # Calculate monthly contribution needed (assuming 12 months to reach goal)
        monthly_contribution = gap / 12 if gap > 0 else 0
        time_to_goal = gap / monthly_contribution if monthly_contribution > 0 else 0
        
        return {
            'recommendedAmount': round(recommended_amount, 2),
            'currentGap': round(gap, 2),
            'monthlyContribution': round(monthly_contribution, 2),
            'timeToGoal': round(time_to_goal, 1),
            'monthlyExpenses': round(monthly_expenses, 2),
            'multiplier': multiplier
        }
    
    def calculate_growth_fund(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate growth fund recommendations"""
        monthly_revenue = business_data.get('monthlyRevenue', 0)
        industry = business_data.get('industry', 'technology')
        
        industry_data = self.industry_benchmarks['industries'].get(industry, {})
        growth_percentage = industry_data.get('growthInvestmentPercentage', 0.15)
        
        total_growth_budget = monthly_revenue * growth_percentage
        
        # Distribute growth budget across categories
        marketing_budget = total_growth_budget * 0.4
        hiring_budget = total_growth_budget * 0.3
        equipment_upgrade = total_growth_budget * 0.2
        research_development = total_growth_budget * 0.1
        
        return {
            'totalBudget': round(total_growth_budget, 2),
            'marketingBudget': round(marketing_budget, 2),
            'hiringBudget': round(hiring_budget, 2),
            'equipmentUpgrade': round(equipment_upgrade, 2),
            'researchDevelopment': round(research_development, 2),
            'growthPercentage': growth_percentage
        }
    
    def calculate_employee_benefits_fund(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate employee benefits fund recommendations"""
        employee_count = business_data.get('employeeCount', 0)
        monthly_revenue = business_data.get('monthlyRevenue', 0)
        industry = business_data.get('industry', 'technology')
        
        industry_data = self.industry_benchmarks['industries'].get(industry, {})
        benefits_percentage = industry_data.get('employeeBenefitsPercentage', 0.12)
        avg_employee_cost = industry_data.get('averageEmployeeCost', 50000)
        
        # Calculate based on revenue percentage
        revenue_based_budget = monthly_revenue * benefits_percentage
        
        # Calculate based on employee count
        employee_based_budget = (avg_employee_cost * employee_count * benefits_percentage) / 12
        
        # Use the higher of the two calculations
        total_benefits_budget = max(revenue_based_budget, employee_based_budget)
        
        # Distribute benefits budget
        health_benefits = total_benefits_budget * 0.6
        retirement_contribution = total_benefits_budget * 0.25
        bonus_pool = total_benefits_budget * 0.15
        
        return {
            'totalBudget': round(total_benefits_budget, 2),
            'healthBenefits': round(health_benefits, 2),
            'retirementContribution': round(retirement_contribution, 2),
            'bonusPool': round(bonus_pool, 2),
            'benefitsPercentage': benefits_percentage,
            'perEmployeeMonthly': round(total_benefits_budget / max(employee_count, 1), 2)
        }
    
    def calculate_tax_planning(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate tax planning recommendations"""
        country = business_data.get('location', {}).get('country', 'US')
        monthly_revenue = business_data.get('monthlyRevenue', 0)
        monthly_expenses = self._calculate_monthly_expenses(business_data)
        
        annual_revenue = monthly_revenue * 12
        annual_expenses = monthly_expenses * 12
        annual_profit = annual_revenue - annual_expenses
        
        tax_data = self.tax_rates['countries'].get(country, {})
        corporate_tax_rate = tax_data.get('corporateTaxRate', 0.21)
        payroll_tax_rate = tax_data.get('payrollTaxRate', 0.15)
        
        # Calculate estimated tax liability
        corporate_tax = annual_profit * corporate_tax_rate if annual_profit > 0 else 0
        payroll_tax = (business_data.get('employeeCount', 0) * 50000) * payroll_tax_rate
        total_tax_liability = corporate_tax + payroll_tax
        
        # Get available deductions
        deductions = tax_data.get('deductions', [])
        
        # Tax saving strategies
        strategies = [
            "Maximize business expense deductions",
            "Consider equipment purchases for depreciation benefits",
            "Implement employee benefit programs for tax advantages",
            "Plan major expenses at year-end for tax optimization"
        ]
        
        return {
            'estimatedTaxLiability': round(total_tax_liability, 2),
            'corporateTax': round(corporate_tax, 2),
            'payrollTax': round(payroll_tax, 2),
            'corporateTaxRate': corporate_tax_rate,
            'recommendedDeductions': deductions,
            'taxSavingStrategies': strategies,
            'annualProfit': round(annual_profit, 2)
        }
    
    def calculate_debt_management(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate debt management recommendations"""
        debt_obligations = business_data.get('debtObligations', [])
        
        if not debt_obligations:
            return {
                'totalDebt': 0,
                'monthlyPayments': 0,
                'consolidationOpportunities': [],
                'payoffStrategy': 'No debt to manage',
                'potentialSavings': 0
            }
        
        total_debt = sum(debt.get('amount', 0) for debt in debt_obligations)
        total_monthly_payments = sum(debt.get('monthlyPayment', 0) for debt in debt_obligations)
        
        # Sort debts by interest rate (highest first) for avalanche method
        sorted_debts = sorted(debt_obligations, key=lambda x: x.get('interestRate', 0), reverse=True)
        
        # Identify consolidation opportunities (debts with high interest rates)
        high_interest_debts = [debt for debt in debt_obligations if debt.get('interestRate', 0) > 0.08]
        
        consolidation_opportunities = []
        if len(high_interest_debts) > 1:
            total_high_interest = sum(debt.get('amount', 0) for debt in high_interest_debts)
            avg_interest_rate = sum(debt.get('interestRate', 0) for debt in high_interest_debts) / len(high_interest_debts)
            
            consolidation_opportunities.append({
                'type': 'High Interest Debt Consolidation',
                'totalAmount': round(total_high_interest, 2),
                'currentAvgRate': round(avg_interest_rate, 4),
                'potentialNewRate': round(avg_interest_rate * 0.8, 4),  # Assume 20% reduction
                'monthlySavings': round(total_high_interest * (avg_interest_rate - avg_interest_rate * 0.8) / 12, 2)
            })
        
        # Calculate potential savings from consolidation
        potential_savings = sum(opp.get('monthlySavings', 0) for opp in consolidation_opportunities) * 12
        
        # Determine payoff strategy
        if len(debt_obligations) > 1:
            payoff_strategy = "Debt Avalanche: Pay minimums on all debts, then focus extra payments on highest interest rate debt"
        elif len(debt_obligations) == 1:
            payoff_strategy = "Focus on consistent payments and consider refinancing if better rates are available"
        else:
            payoff_strategy = "No debt to manage"
        
        return {
            'totalDebt': round(total_debt, 2),
            'monthlyPayments': round(total_monthly_payments, 2),
            'consolidationOpportunities': consolidation_opportunities,
            'payoffStrategy': payoff_strategy,
            'potentialSavings': round(potential_savings, 2),
            'debtToRevenueRatio': round(total_debt / (business_data.get('monthlyRevenue', 1) * 12), 2)
        }
    
    def calculate_retirement_planning(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate retirement planning recommendations"""
        employee_count = business_data.get('employeeCount', 0)
        monthly_revenue = business_data.get('monthlyRevenue', 0)
        country = business_data.get('location', {}).get('country', 'US')
        
        # Determine recommended plan based on business size and country
        if employee_count <= 1:
            if country == 'US':
                recommended_plan = "Solo 401(k)"
                max_contribution = 58000  # 2023 limit
                tax_benefits = "Tax-deferred growth and deductible contributions"
            else:
                recommended_plan = "Individual Retirement Account"
                max_contribution = 6000
                tax_benefits = "Tax advantages vary by country"
        elif employee_count <= 25:
            if country == 'US':
                recommended_plan = "SEP IRA"
                max_contribution = min(58000, monthly_revenue * 12 * 0.25)
                tax_benefits = "Employer contributions are tax-deductible"
            else:
                recommended_plan = "Small Business Pension Plan"
                max_contribution = monthly_revenue * 12 * 0.15
                tax_benefits = "Tax advantages vary by country"
        else:
            if country == 'US':
                recommended_plan = "401(k) Plan"
                max_contribution = 22500  # Employee contribution limit
                tax_benefits = "Employer matching and tax-deferred growth"
            else:
                recommended_plan = "Corporate Pension Plan"
                max_contribution = monthly_revenue * 12 * 0.20
                tax_benefits = "Tax advantages vary by country"
        
        # Calculate recommended contribution (10-15% of revenue)
        recommended_contribution = min(max_contribution, monthly_revenue * 12 * 0.12)
        
        return {
            'recommendedPlan': recommended_plan,
            'maxContribution': round(max_contribution, 2),
            'recommendedContribution': round(recommended_contribution, 2),
            'taxBenefits': tax_benefits,
            'employeeCount': employee_count,
            'contributionPercentage': 0.12
        }
    
    def calculate_cash_flow_forecast(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate 12-month cash flow forecast"""
        monthly_revenue = business_data.get('monthlyRevenue', 0)
        monthly_expenses = self._calculate_monthly_expenses(business_data)
        industry = business_data.get('industry', 'technology')
        
        industry_data = self.industry_benchmarks['industries'].get(industry, {})
        seasonality_factor = industry_data.get('seasonalityFactor', 1.0)
        
        # Generate 12-month forecast with seasonality
        forecast = []
        for month in range(1, 13):
            # Apply seasonality (peak in Q4 for most businesses)
            if month in [11, 12]:  # November, December
                seasonal_multiplier = seasonality_factor
            elif month in [1, 2]:  # January, February
                seasonal_multiplier = 1 / seasonality_factor
            else:
                seasonal_multiplier = 1.0
            
            month_revenue = monthly_revenue * seasonal_multiplier
            month_expenses = monthly_expenses
            net_cash_flow = month_revenue - month_expenses
            
            forecast.append({
                'month': month,
                'revenue': round(month_revenue, 2),
                'expenses': round(month_expenses, 2),
                'netCashFlow': round(net_cash_flow, 2),
                'seasonalMultiplier': round(seasonal_multiplier, 2)
            })
        
        # Calculate summary statistics
        total_revenue = sum(month['revenue'] for month in forecast)
        total_expenses = sum(month['expenses'] for month in forecast)
        total_net_cash_flow = total_revenue - total_expenses
        
        return {
            'monthlyForecast': forecast,
            'annualSummary': {
                'totalRevenue': round(total_revenue, 2),
                'totalExpenses': round(total_expenses, 2),
                'totalNetCashFlow': round(total_net_cash_flow, 2),
                'averageMonthlyRevenue': round(total_revenue / 12, 2),
                'averageMonthlyExpenses': round(total_expenses / 12, 2)
            },
            'seasonalityFactor': seasonality_factor
        }
    
    def _calculate_monthly_expenses(self, business_data: Dict[str, Any]) -> float:
        """Calculate total monthly expenses"""
        operating_expenses = business_data.get('operatingExpenses', {})
        employee_count = business_data.get('employeeCount', 0)
        industry = business_data.get('industry', 'technology')
        
        # Sum all operating expenses
        total_operating = sum(operating_expenses.values())
        
        # Add estimated payroll costs
        industry_data = self.industry_benchmarks['industries'].get(industry, {})
        avg_employee_cost = industry_data.get('averageEmployeeCost', 50000)
        monthly_payroll = (avg_employee_cost * employee_count) / 12
        
        return total_operating + monthly_payroll
    
    def generate__recommendations(self, business_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate all financial recommendations"""
        return {
            'emergencyFund': self.calculate_emergency_fund(business_data),
            'employeeBenefitsFund': self.calculate_employee_benefits_fund(business_data),
            'growthFund': self.calculate_growth_fund(business_data),
            'taxPlanning': self.calculate_tax_planning(business_data),
            'debtManagement': self.calculate_debt_management(business_data),
            'retirementPlanning': self.calculate_retirement_planning(business_data),
            'cashFlowForecast': self.calculate_cash_flow_forecast(business_data)
        }

