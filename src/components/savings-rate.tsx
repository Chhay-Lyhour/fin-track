"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PiggyBank, TrendingUp, TrendingDown, Target } from "lucide-react"
interface SavingsRateProps {
  income: number
  expenses: number
  previousIncome: number
  previousExpenses: number
}
export function SavingsRate({ income, expenses, previousIncome, previousExpenses }: SavingsRateProps) {
  const currentSavings = income - expenses
  const previousSavings = previousIncome - previousExpenses
  const currentRate = income > 0 ? ((currentSavings / income) * 100).toFixed(1) : 0
  const previousRate = previousIncome > 0 ? ((previousSavings / previousIncome) * 100).toFixed(1) : 0
  const rateChange = Number(currentRate) - Number(previousRate)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  const getSavingsColor = () => {
    const rate = Number(currentRate)
    if (rate >= 20) return 'text-green-600'
    if (rate >= 10) return 'text-blue-600'
    if (rate > 0) return 'text-yellow-600'
    return 'text-red-600'
  }
  const getSavingsMessage = () => {
    const rate = Number(currentRate)
    if (rate >= 20) return 'Excellent savings!'
    if (rate >= 10) return 'Good savings rate'
    if (rate > 0) return 'Keep it up'
    return 'Try to save more'
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-pink-600" />
          Savings Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getSavingsColor()}`}>
            {currentRate}%
          </div>
          <p className="text-sm text-gray-600 mt-1">{getSavingsMessage()}</p>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            {formatCurrency(currentSavings)} saved
          </p>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <span className="text-xs text-gray-600">vs Last Month</span>
            <p className="text-sm font-semibold text-gray-900">{previousRate}%</p>
          </div>
          <div className="text-right">
            {rateChange !== 0 && (
              <div className={`flex items-center gap-1 ${rateChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {rateChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{Math.abs(rateChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Savings Progress
            </span>
            <span>{currentRate}% of income</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                Number(currentRate) >= 20 ? 'bg-green-500' :
                Number(currentRate) >= 10 ? 'bg-blue-500' :
                Number(currentRate) > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(Math.abs(Number(currentRate)), 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 text-center">
            {Number(currentRate) >= 20 ? 'Great! Above 20% target' :
             Number(currentRate) >= 10 ? 'Close to 20% target' :
             'Target: 20% savings rate'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
