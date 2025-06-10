import { useState } from 'react'
import { Wallet, CreditCard, Target, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'

const FinancialInfoForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    currentSavings: '',
    investments: '',
    debtObligations: [],
    financialGoals: {
      shortTerm: [],
      mediumTerm: [],
      longTerm: []
    }
  })

  const [newDebt, setNewDebt] = useState({
    type: '',
    amount: '',
    interestRate: '',
    monthlyPayment: '',
    remainingTerm: ''
  })

  const [newGoal, setNewGoal] = useState('')
  const [goalType, setGoalType] = useState('shortTerm')

  const debtTypes = [
    'Business Loan',
    'Line of Credit',
    'Equipment Financing',
    'Credit Card',
    'Mortgage',
    'Other'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addDebt = () => {
    if (newDebt.type && newDebt.amount) {
      setFormData(prev => ({
        ...prev,
        debtObligations: [...prev.debtObligations, {
          ...newDebt,
          amount: parseFloat(newDebt.amount) || 0,
          interestRate: parseFloat(newDebt.interestRate) || 0,
          monthlyPayment: parseFloat(newDebt.monthlyPayment) || 0,
          remainingTerm: parseInt(newDebt.remainingTerm) || 0
        }]
      }))
      setNewDebt({
        type: '',
        amount: '',
        interestRate: '',
        monthlyPayment: '',
        remainingTerm: ''
      })
    }
  }

  const removeDebt = (index) => {
    setFormData(prev => ({
      ...prev,
      debtObligations: prev.debtObligations.filter((_, i) => i !== index)
    }))
  }

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        financialGoals: {
          ...prev.financialGoals,
          [goalType]: [...prev.financialGoals[goalType], newGoal.trim()]
        }
      }))
      setNewGoal('')
    }
  }

  const removeGoal = (type, index) => {
    setFormData(prev => ({
      ...prev,
      financialGoals: {
        ...prev.financialGoals,
        [type]: prev.financialGoals[type].filter((_, i) => i !== index)
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const processedData = {
      ...formData,
      currentSavings: parseFloat(formData.currentSavings) || 0,
      investments: parseFloat(formData.investments) || 0
    }
    
    onSubmit(processedData)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-blue-600" />
          <span>Financial Information</span>
        </CardTitle>
        <CardDescription>
          Provide details about your current financial situation and goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Financial Position */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span>Current Financial Position</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentSavings">Current Savings</Label>
                <Input
                  id="currentSavings"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.currentSavings}
                  onChange={(e) => handleInputChange('currentSavings', e.target.value)}
                  placeholder="e.g., 25000"
                />
              </div>
              <div>
                <Label htmlFor="investments">Current Investments</Label>
                <Input
                  id="investments"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.investments}
                  onChange={(e) => handleInputChange('investments', e.target.value)}
                  placeholder="e.g., 50000"
                />
              </div>
            </div>
          </div>

          {/* Debt Obligations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Debt Obligations</span>
            </h3>
            
            {/* Add New Debt */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-base">Add Debt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="debtType">Debt Type</Label>
                    <Select value={newDebt.type} onValueChange={(value) => setNewDebt(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select debt type" />
                      </SelectTrigger>
                      <SelectContent>
                        {debtTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="debtAmount">Amount Owed</Label>
                    <Input
                      id="debtAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newDebt.amount}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="e.g., 15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={newDebt.interestRate}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, interestRate: e.target.value }))}
                      placeholder="e.g., 5.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyPayment">Monthly Payment</Label>
                    <Input
                      id="monthlyPayment"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newDebt.monthlyPayment}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, monthlyPayment: e.target.value }))}
                      placeholder="e.g., 500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="remainingTerm">Remaining Term (months)</Label>
                    <Input
                      id="remainingTerm"
                      type="number"
                      min="0"
                      value={newDebt.remainingTerm}
                      onChange={(e) => setNewDebt(prev => ({ ...prev, remainingTerm: e.target.value }))}
                      placeholder="e.g., 36"
                    />
                  </div>
                </div>
                <Button type="button" onClick={addDebt} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Debt
                </Button>
              </CardContent>
            </Card>

            {/* Existing Debts */}
            {formData.debtObligations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Current Debts</h4>
                {formData.debtObligations.map((debt, index) => (
                  <Card key={index} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Type</span>
                            <p className="text-sm">{debt.type}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Amount</span>
                            <p className="text-sm">${debt.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Interest Rate</span>
                            <p className="text-sm">{debt.interestRate}%</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Monthly Payment</span>
                            <p className="text-sm">${debt.monthlyPayment.toLocaleString()}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDebt(index)}
                          className="ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Financial Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Financial Goals</span>
            </h3>
            
            {/* Add New Goal */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-base">Add Financial Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goalType">Goal Timeline</Label>
                    <Select value={goalType} onValueChange={setGoalType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shortTerm">Short Term (1-2 years)</SelectItem>
                        <SelectItem value="mediumTerm">Medium Term (3-5 years)</SelectItem>
                        <SelectItem value="longTerm">Long Term (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newGoal">Goal Description</Label>
                    <Input
                      id="newGoal"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="e.g., Expand to new location"
                      onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                    />
                  </div>
                </div>
                <Button type="button" onClick={addGoal} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Goal
                </Button>
              </CardContent>
            </Card>

            {/* Existing Goals */}
            {Object.entries(formData.financialGoals).some(([_, goals]) => goals.length > 0) && (
              <div className="space-y-4">
                {Object.entries(formData.financialGoals).map(([type, goals]) => (
                  goals.length > 0 && (
                    <div key={type}>
                      <h4 className="font-medium capitalize mb-2">
                        {type.replace('Term', ' Term')} Goals
                      </h4>
                      <div className="space-y-2">
                        {goals.map((goal, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-md border">
                            <span className="text-sm">{goal}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeGoal(type, index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="px-8">
              Generate Recommendations
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default FinancialInfoForm

