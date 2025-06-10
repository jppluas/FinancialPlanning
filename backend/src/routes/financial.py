from flask import Blueprint, request, jsonify, send_file
from src.services.financial_calculator import FinancialCalculator
from src.services.report_generator import ReportGenerator
import json
import os

# Create blueprint
financial_bp = Blueprint('financial', __name__)

# Initialize services
calculator = FinancialCalculator()
report_generator = ReportGenerator()

@financial_bp.route('/calculate-recommendations', methods=['POST'])
def calculate_recommendations():
    """Calculate  financial recommendations"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['industry', 'employeeCount', 'monthlyRevenue']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate recommendations
        recommendations = calculator.generate__recommendations(data)
        
        return jsonify({
            'success': True,
            'data': recommendations
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/tax-rates/<country>', methods=['GET'])
def get_tax_rates(country):
    """Get tax rates for a specific country"""
    try:
        tax_data = calculator.tax_rates['countries'].get(country.upper())
        
        if not tax_data:
            return jsonify({'error': 'Country not found'}), 404
        
        return jsonify({
            'success': True,
            'data': tax_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/industry-benchmarks/<industry>', methods=['GET'])
def get_industry_benchmarks(industry):
    """Get benchmarks for a specific industry"""
    try:
        industry_data = calculator.industry_benchmarks['industries'].get(industry.lower())
        
        if not industry_data:
            return jsonify({'error': 'Industry not found'}), 404
        
        return jsonify({
            'success': True,
            'data': industry_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/exchange-rates/<base_currency>', methods=['GET'])
def get_exchange_rates(base_currency):
    """Get exchange rates for a base currency"""
    try:
        currency_data = calculator.currencies['currencies'].get(base_currency.upper())
        
        if not currency_data:
            return jsonify({'error': 'Currency not found'}), 404
        
        return jsonify({
            'success': True,
            'data': currency_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/countries', methods=['GET'])
def get_countries():
    """Get list of supported countries"""
    try:
        countries = []
        for code, data in calculator.tax_rates['countries'].items():
            countries.append({
                'code': code,
                'name': data['name'],
                'currency': data['currency']
            })
        
        return jsonify({
            'success': True,
            'data': countries
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/industries', methods=['GET'])
def get_industries():
    """Get list of supported industries"""
    try:
        industries = []
        for code, data in calculator.industry_benchmarks['industries'].items():
            industries.append({
                'code': code,
                'name': data['name'],
                'riskLevel': data['riskLevel']
            })
        
        return jsonify({
            'success': True,
            'data': industries
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/currencies', methods=['GET'])
def get_currencies():
    """Get list of supported currencies"""
    try:
        currencies = []
        for code, data in calculator.currencies['currencies'].items():
            currencies.append({
                'code': code,
                'name': data['name'],
                'symbol': data['symbol']
            })
        
        return jsonify({
            'success': True,
            'data': currencies
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/generate-report', methods=['POST'])
def generate_report():
    """Generate downloadable report (PDF or Excel)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        business_data = data.get('businessData', {})
        recommendations = data.get('recommendations', {})
        report_format = data.get('format', 'pdf').lower()
        
        if not business_data or not recommendations:
            return jsonify({'error': 'Missing business data or recommendations'}), 400
        
        if report_format == 'pdf':
            buffer = report_generator.generate_pdf_report(business_data, recommendations)
            return send_file(
                buffer,
                as_attachment=True,
                download_name='financial_planning_report.pdf',
                mimetype='application/pdf'
            )
        elif report_format == 'excel':
            buffer = report_generator.generate_excel_report(business_data, recommendations)
            return send_file(
                buffer,
                as_attachment=True,
                download_name='financial_planning_report.xlsx',
                mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        else:
            return jsonify({'error': 'Unsupported format. Use "pdf" or "excel"'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@financial_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Financial Planning API is running',
        'version': '1.0.0'
    })

# Error handlers
@financial_bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@financial_bp.errorhandler(405)
def method_not_allowed(error):
    return jsonify({'error': 'Method not allowed'}), 405

@financial_bp.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

