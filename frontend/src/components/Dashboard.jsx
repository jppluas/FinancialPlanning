import { useState } from 'react'
import { 
  Shield, 
  TrendingUp, 
  PiggyBank, 
  FileText, 
  Download, 
  RefreshCw,
  DollarSign,
  Calendar,
  Target,
  CreditCard,
  Building
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const Dashboard = ({ businessData, financialData, recommendations, onReset }) => {
  const [reportFormat, setReportFormat] = useState('pdf')
  const [downloadingReport, setDownloadingReport] = useState(false)

  const downloadReport = async () => {
    setDownloadingReport(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_URL}/api/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessData,
          recommendations,
          format: reportFormat
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `financial_planning_report.${reportFormat === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Error generating report')
      }
    } catch (error) {
      console.error('Error downloading report:', error)
      alert('Error downloading report')
    } finally {
      setDownloadingReport(false)
    }
  }

  // Prepare chart data
  const cashFlowData = recommendations.cashFlowForecast?.monthlyForecast?.map(month => ({
    month: `M${month.month}`,
    revenue: month.revenue,
    expenses: month.expenses,
    netCashFlow: month.netCashFlow
  })) || []

  const expenseBreakdown = [
    { name: 'Rent', value: businessData.operatingExpenses?.rent || 0, color: '#8884d8' },
    { name: 'Utilities', value: businessData.operatingExpenses?.utilities || 0, color: '#82ca9d' },
    { name: 'Materials', value: businessData.operatingExpenses?.materials || 0, color: '#ffc658' },
    { name: 'Marketing', value: businessData.operatingExpenses?.marketing || 0, color: '#ff7300' },
    { name: 'Insurance', value: businessData.operatingExpenses?.insurance || 0, color: '#00ff00' },
    { name: 'Other', value: businessData.operatingExpenses?.other || 0, color: '#ff0000' }
  ].filter(item => item.value > 0)

  const growthAllocation = [
    { name: 'Marketing', value: recommendations.growthFund?.marketingBudget || 0, color: '#8884d8' },
    { name: 'Hiring', value: recommendations.growthFund?.hiringBudget || 0, color: '#82ca9d' },
    { name: 'Equipment', value: recommendations.growthFund?.equipmentUpgrade || 0, color: '#ffc658' },
    { name: 'R&D', value: recommendations.growthFund?.researchDevelopment || 0, color: '#ff7300' }
  ].filter(item => item.value > 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial Planning Dashboard</h2>
          <p className="text-lg text-gray-600">
            Personalized recommendations for {businessData.industry?.charAt(0).toUpperCase() + businessData.industry?.slice(1)} business
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
          <Button onClick={downloadReport} disabled={downloadingReport}>
            <Download className="h-4 w-4 mr-2" />
            {downloadingReport ? 'Generating...' : 'Download Report'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Fund Needed</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${recommendations.emergencyFund?.recommendedAmount?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {recommendations.emergencyFund?.multiplier || 4} months of expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Investment</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${recommendations.growthFund?.totalBudget?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly growth budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${recommendations.taxPlanning?.estimatedTaxLiability?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Annual estimated tax
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retirement Plan</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${recommendations.retirementPlanning?.recommendedContribution?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {recommendations.retirementPlanning?.recommendedPlan || 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recommendations */}
      <Tabs defaultValue="emergency" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="emergency">Emergency Fund</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="tax">Tax Planning</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
        </TabsList>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Emergency Fund Recommendations</span>
              </CardTitle>
              <CardDescription>
                Build a financial safety net for unexpected business expenses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Progress</span>
                      <span>
                        ${(businessData.currentSavings || 0).toLocaleString()} / 
                        ${recommendations.emergencyFund?.recommendedAmount?.toLocaleString() || '0'}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, ((businessData.currentSavings || 0) / (recommendations.emergencyFund?.recommendedAmount || 1)) * 100)} 
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Monthly Contribution</p>
                      <p className="text-2xl font-bold text-blue-900">
                        ${recommendations.emergencyFund?.monthlyContribution?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Time to Goal</p>
                      <p className="text-2xl font-bold text-green-900">
                        {recommendations.emergencyFund?.timeToGoal?.toFixed(1) || '0'} months
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Why This Amount?</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Based on {recommendations.emergencyFund?.multiplier || 4} months of operating expenses</li>
                    <li>• Industry risk level: {businessData.industry || 'N/A'}</li>
                    <li>• Monthly expenses: ${recommendations.emergencyFund?.monthlyExpenses?.toLocaleString() || '0'}</li>
                    <li>• Covers payroll, rent, utilities, and essential operations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Growth Investment Strategy</span>
              </CardTitle>
              <CardDescription>
                Allocate resources for business expansion and development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Marketing</p>
                      <p className="text-xl font-bold text-green-900">
                        ${recommendations.growthFund?.marketingBudget?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Hiring</p>
                      <p className="text-xl font-bold text-blue-900">
                        ${recommendations.growthFund?.hiringBudget?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Equipment</p>
                      <p className="text-xl font-bold text-purple-900">
                        ${recommendations.growthFund?.equipmentUpgrade?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">R&D</p>
                      <p className="text-xl font-bold text-orange-900">
                        ${recommendations.growthFund?.researchDevelopment?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={growthAllocation}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {growthAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-purple-600" />
                <span>Employee Benefits Fund</span>
              </CardTitle>
              <CardDescription>
                Invest in your team with competitive benefits packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Health Benefits</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${recommendations.employeeBenefitsFund?.healthBenefits?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-purple-600">Monthly budget</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Retirement</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ${recommendations.employeeBenefitsFund?.retirementContribution?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-blue-600">Monthly contribution</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Bonus Pool</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${recommendations.employeeBenefitsFund?.bonusPool?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-green-600">Monthly allocation</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Per Employee Monthly:</strong> ${recommendations.employeeBenefitsFund?.perEmployeeMonthly?.toLocaleString() || '0'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total Monthly Budget:</strong> ${recommendations.employeeBenefitsFund?.totalBudget?.toLocaleString() || '0'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span>Tax Planning Strategy</span>
              </CardTitle>
              <CardDescription>
                Optimize your tax strategy and maximize deductions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Corporate Tax</p>
                      <p className="text-xl font-bold text-red-900">
                        ${recommendations.taxPlanning?.corporateTax?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Payroll Tax</p>
                      <p className="text-xl font-bold text-orange-900">
                        ${recommendations.taxPlanning?.payrollTax?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Annual Profit</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${recommendations.taxPlanning?.annualProfit?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Available Deductions</h4>
                    <ul className="text-sm space-y-1">
                      {recommendations.taxPlanning?.recommendedDeductions?.map((deduction, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          <span>{deduction}</span>
                        </li>
                      )) || []}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tax Saving Strategies</h4>
                    <ul className="text-sm space-y-1">
                      {recommendations.taxPlanning?.taxSavingStrategies?.map((strategy, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                          <span>{strategy}</span>
                        </li>
                      )) || []}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <span>Debt Management Strategy</span>
              </CardTitle>
              <CardDescription>
                Optimize your debt structure and payment strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-600 font-medium">Total Debt</p>
                      <p className="text-xl font-bold text-orange-900">
                        ${recommendations.debtManagement?.totalDebt?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <p className="text-sm text-red-600 font-medium">Monthly Payments</p>
                      <p className="text-xl font-bold text-red-900">
                        ${recommendations.debtManagement?.monthlyPayments?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Potential Savings</p>
                    <p className="text-xl font-bold text-green-900">
                      ${recommendations.debtManagement?.potentialSavings?.toLocaleString() || '0'}
                    </p>
                    <p className="text-xs text-green-600">Annual through consolidation</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Recommended Strategy</h4>
                    <p className="text-sm text-gray-600">
                      {recommendations.debtManagement?.payoffStrategy || 'No debt management needed'}
                    </p>
                  </div>
                  {recommendations.debtManagement?.consolidationOpportunities?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Consolidation Opportunities</h4>
                      {recommendations.debtManagement.consolidationOpportunities.map((opp, index) => (
                        <div key={index} className="bg-blue-50 p-3 rounded-lg mb-2">
                          <p className="text-sm font-medium">{opp.type}</p>
                          <p className="text-xs text-gray-600">
                            Amount: ${opp.totalAmount?.toLocaleString()} | 
                            Current Rate: {(opp.currentAvgRate * 100).toFixed(2)}% | 
                            New Rate: {(opp.potentialNewRate * 100).toFixed(2)}%
                          </p>
                          <p className="text-xs text-green-600">
                            Monthly Savings: ${opp.monthlySavings?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5 text-indigo-600" />
                <span>Retirement Planning</span>
              </CardTitle>
              <CardDescription>
                Secure your future and provide benefits for your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <p className="text-sm text-indigo-600 font-medium">Recommended Plan</p>
                    <p className="text-xl font-bold text-indigo-900">
                      {recommendations.retirementPlanning?.recommendedPlan || 'N/A'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">Max Contribution</p>
                      <p className="text-lg font-bold text-blue-900">
                        ${recommendations.retirementPlanning?.maxContribution?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Recommended</p>
                      <p className="text-lg font-bold text-green-900">
                        ${recommendations.retirementPlanning?.recommendedContribution?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Tax Benefits</h4>
                    <p className="text-sm text-gray-600">
                      {recommendations.retirementPlanning?.taxBenefits || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Plan Details</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Employee Count: {recommendations.retirementPlanning?.employeeCount || 0}</li>
                      <li>• Contribution Rate: {((recommendations.retirementPlanning?.contributionPercentage || 0) * 100).toFixed(1)}%</li>
                      <li>• Annual Contribution: ${(recommendations.retirementPlanning?.recommendedContribution || 0).toLocaleString()}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cash Flow Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>12-Month Cash Flow Forecast</span>
          </CardTitle>
          <CardDescription>
            Projected revenue, expenses, and net cash flow with seasonal adjustments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="netCashFlow" stroke="#ffc658" strokeWidth={2} name="Net Cash Flow" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Annual Revenue</p>
              <p className="text-xl font-bold text-blue-900">
                ${recommendations.cashFlowForecast?.annualSummary?.totalRevenue?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Total Annual Expenses</p>
              <p className="text-xl font-bold text-red-900">
                ${recommendations.cashFlowForecast?.annualSummary?.totalExpenses?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Net Annual Cash Flow</p>
              <p className="text-xl font-bold text-green-900">
                ${recommendations.cashFlowForecast?.annualSummary?.totalNetCashFlow?.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard

