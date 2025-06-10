import { useState, useEffect } from 'react'
import { Building, MapPin, Users, DollarSign, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'

const BusinessInfoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    location: {
      country: '',
      region: '',
      city: ''
    },
    industry: '',
    employeeCount: '',
    monthlyRevenue: '',
    currency: 'USD',
    operatingExpenses: {
      rent: '',
      utilities: '',
      materials: '',
      marketing: '',
      insurance: '',
      other: ''
    }
  })

  const [countries, setCountries] = useState([])
  const [industries, setIndustries] = useState([])
  const [currencies, setCurrencies] = useState([])

  useEffect(() => {
    // Fetch reference data
    const fetchReferenceData = async () => {
      try {
        const [countriesRes, industriesRes, currenciesRes] = await Promise.all([
          fetch(`https://financialplanning-production.up.railway.app/api/countries`),
          fetch(`https://financialplanning-production.up.railway.app/api/industries`),
          fetch(`https://financialplanning-production.up.railway.app/api/currencies`)
        ])

        const countriesData = await countriesRes.json()
        const industriesData = await industriesRes.json()
        const currenciesData = await currenciesRes.json()

        if (countriesData.success) setCountries(countriesData.data)
        if (industriesData.success) setIndustries(industriesData.data)
        if (currenciesData.success) setCurrencies(currenciesData.data)
      } catch (error) {
        console.error('Error fetching reference data:', error)
      }
    }

    fetchReferenceData()
  }, [])

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert string numbers to actual numbers
    const processedData = {
      ...formData,
      employeeCount: parseInt(formData.employeeCount) || 0,
      monthlyRevenue: parseFloat(formData.monthlyRevenue) || 0,
      operatingExpenses: {
        rent: parseFloat(formData.operatingExpenses.rent) || 0,
        utilities: parseFloat(formData.operatingExpenses.utilities) || 0,
        materials: parseFloat(formData.operatingExpenses.materials) || 0,
        marketing: parseFloat(formData.operatingExpenses.marketing) || 0,
        insurance: parseFloat(formData.operatingExpenses.insurance) || 0,
        other: parseFloat(formData.operatingExpenses.other) || 0
      }
    }
    
    onSubmit(processedData)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Building className="h-6 w-6 text-blue-600" />
          <span>Business Information</span>
        </CardTitle>
        <CardDescription>
          Tell us about your business to get personalized financial recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>Location</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.location.country} onValueChange={(value) => handleInputChange('location.country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="region">Region/State</Label>
                <Input
                  id="region"
                  value={formData.location.region}
                  onChange={(e) => handleInputChange('location.region', e.target.value)}
                  placeholder="e.g., California, Ontario"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  placeholder="e.g., San Francisco"
                />
              </div>
            </div>
          </div>

          {/* Business Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-600" />
              <span>Business Details</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.code} value={industry.code}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employeeCount" className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Number of Employees</span>
                </Label>
                <Input
                  id="employeeCount"
                  type="number"
                  min="0"
                  value={formData.employeeCount}
                  onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                  placeholder="e.g., 25"
                />
              </div>
            </div>
          </div>

          {/* Financial Overview Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span>Financial Overview</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                  placeholder="e.g., 50000"
                />
              </div>
              <div>
                <Label htmlFor="currency" className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>Currency</span>
                </Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Operating Expenses Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Monthly Operating Expenses</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rent">Rent/Lease</Label>
                <Input
                  id="rent"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.operatingExpenses.rent}
                  onChange={(e) => handleInputChange('operatingExpenses.rent', e.target.value)}
                  placeholder="e.g., 5000"
                />
              </div>
              <div>
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.operatingExpenses.utilities}
                  onChange={(e) => handleInputChange('operatingExpenses.utilities', e.target.value)}
                  placeholder="e.g., 800"
                />
              </div>
              <div>
                <Label htmlFor="materials">Materials/Inventory</Label>
                <Input
                  id="materials"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.operatingExpenses.materials}
                  onChange={(e) => handleInputChange('operatingExpenses.materials', e.target.value)}
                  placeholder="e.g., 10000"
                />
              </div>
              <div>
                <Label htmlFor="marketing">Marketing</Label>
                <Input
                  id="marketing"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.operatingExpenses.marketing}
                  onChange={(e) => handleInputChange('operatingExpenses.marketing', e.target.value)}
                  placeholder="e.g., 2000"
                />
              </div>
              <div>
                <Label htmlFor="insurance">Insurance</Label>
                <Input
                  id="insurance"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.operatingExpenses.insurance}
                  onChange={(e) => handleInputChange('operatingExpenses.insurance', e.target.value)}
                  placeholder="e.g., 1200"
                />
              </div>
              <div>
                <Label htmlFor="other">Other Expenses</Label>
                <Input
                  id="other"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.operatingExpenses.other}
                  onChange={(e) => handleInputChange('operatingExpenses.other', e.target.value)}
                  placeholder="e.g., 1500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              Continue to Financial Information
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default BusinessInfoForm

