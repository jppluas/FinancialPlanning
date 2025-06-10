import { useState } from 'react'
import { Calculator, TrendingUp, Shield, PiggyBank, FileText, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import BusinessInfoForm from './components/BusinessInfoForm.jsx'
import FinancialInfoForm from './components/FinancialInfoForm.jsx'
import Dashboard from './components/Dashboard.jsx'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState('business')
  const [businessData, setBusinessData] = useState({})
  const [financialData, setFinancialData] = useState({})
  const [recommendations, setRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleBusinessDataSubmit = (data) => {
    setBusinessData(data)
    setCurrentStep('financial')
  }

  const handleFinancialDataSubmit = async (data) => {
    setFinancialData(data)
    setLoading(true)
    
    try {
      const combinedData = { ...businessData, ...data }
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/calculate-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      })
      
      const result = await response.json()
      if (result.success) {
        setRecommendations(result.data)
        setCurrentStep('dashboard')
      } else {
        console.error('Error:', result.error)
        alert('Error calculating recommendations: ' + result.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error connecting to server. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentStep('business')
    setBusinessData({})
    setFinancialData({})
    setRecommendations(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Calculating Recommendations</h3>
            <p className="text-gray-600">Please wait while we analyze your business data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Financial Planning Platform</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">Multi-Currency Support</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'business' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                 Business Financial Planning
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get personalized financial recommendations tailored to your industry, location, and business size. 
                Plan for emergency funds, growth investments, tax optimization, and retirement.
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <CardTitle>Emergency Fund Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Calculate optimal emergency fund size based on your industry risk and monthly expenses.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <CardTitle>Growth Investment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Get recommendations for reinvestment in marketing, hiring, and business expansion.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <PiggyBank className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                    <CardTitle>Retirement Planning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Explore retirement plan options for business owners and employees with tax benefits.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>

            <BusinessInfoForm onSubmit={handleBusinessDataSubmit} />
          </div>
        )}

        {currentStep === 'financial' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Financial Information</h2>
              <p className="text-lg text-gray-600">
                Provide your current financial situation to get personalized recommendations.
              </p>
            </div>
            <FinancialInfoForm 
              onSubmit={handleFinancialDataSubmit} 
              onBack={() => setCurrentStep('business')}
            />
          </div>
        )}

        {currentStep === 'dashboard' && recommendations && (
          <Dashboard 
            businessData={businessData}
            financialData={financialData}
            recommendations={recommendations}
            onReset={resetForm}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2025 Financial Planning Platform. All rights reserved.</p>
            <p className="text-sm">
              This platform provides general financial guidance. Please consult with a qualified financial advisor for personalized advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

