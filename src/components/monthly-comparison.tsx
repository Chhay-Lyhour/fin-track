"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, BarChart2, CheckCircle, AlertTriangle, ThumbsUp, Zap } from "lucide-react"
interface MonthlyComparisonProps {
  current: {
    income: number
    expenses: number
  }
  previous: {
    income: number
    expenses: number
  }
}
export function MonthlyComparison({ current, previous }: MonthlyComparisonProps) {
  const incomeDiff = current.income - previous.income
  const expenseDiff = current.expenses - previous.expenses
  const incomePercent = previous.income ? ((incomeDiff / previous.income) * 100).toFixed(1) : 0
  const expensePercent = previous.expenses ? ((expenseDiff / previous.expenses) * 100).toFixed(1) : 0
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-purple-600" />
          Monthly Comparison
          <span className="text-sm font-normal text-gray-500">vs Last Month</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
          <div>
            <span className="text-sm text-gray-600">Income</span>
            <p className="font-semibold text-lg text-gray-900">{formatCurrency(current.income)}</p>
          </div>
          <div className="text-right">
            {incomeDiff !== 0 ? (
              <div className={`flex items-center gap-1 ${incomeDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {incomeDiff >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{incomePercent}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <Minus className="h-4 w-4" />
                <span className="font-semibold">0%</span>
              </div>
            )}
            <span className="text-xs text-gray-500">
              {incomeDiff >= 0 ? '+' : ''}{formatCurrency(incomeDiff)}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
          <div>
            <span className="text-sm text-gray-600">Expenses</span>
            <p className="font-semibold text-lg text-gray-900">{formatCurrency(current.expenses)}</p>
          </div>
          <div className="text-right">
            {expenseDiff !== 0 ? (
              <div className={`flex items-center gap-1 ${expenseDiff <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {expenseDiff <= 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                <span className="font-semibold">{Math.abs(Number(expensePercent))}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <Minus className="h-4 w-4" />
                <span className="font-semibold">0%</span>
              </div>
            )}
            <span className="text-xs text-gray-500">
              {expenseDiff >= 0 ? '+' : ''}{formatCurrency(expenseDiff)}
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            {incomeDiff > 0 && expenseDiff < 0 && (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Great job! Income up, expenses down!
              </>
            )}
            {incomeDiff > 0 && expenseDiff >= 0 && (
              <>
                <ThumbsUp className="h-4 w-4 text-blue-600" />
                Income increased, watch your expenses.
              </>
            )}
            {incomeDiff <= 0 && expenseDiff < 0 && (
              <>
                <Zap className="h-4 w-4 text-green-600" />
                Expenses reduced, keep it up!
              </>
            )}
            {incomeDiff <= 0 && expenseDiff >= 0 && (
              <>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Focus on increasing income & reducing expenses.
              </>
            )}
            {incomeDiff === 0 && expenseDiff === 0 && (
              <>
                <BarChart2 className="h-4 w-4 text-gray-600" />
                Same as last month.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
