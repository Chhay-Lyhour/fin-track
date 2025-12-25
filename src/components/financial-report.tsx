"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, TrendingUp, TrendingDown, AlertCircle, CheckCircle, DollarSign } from "lucide-react"

interface FinancialReportProps {
  currentMonth: {
    income: number
    expenses: number
    savings: number
    savingsRate: number
  }
  previousMonth: {
    income: number
    expenses: number
    savings: number
    savingsRate: number
  }
  topCategory: {
    name: string
    amount: number
    percentage: number
  } | null
  projectedExpenses: number
  daysRemaining: number
}

export function FinancialReport({
  currentMonth,
  previousMonth,
  topCategory,
  projectedExpenses,
  daysRemaining,
}: FinancialReportProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const incomeChange = currentMonth.income - previousMonth.income
  const expenseChange = currentMonth.expenses - previousMonth.expenses
  const savingsChange = currentMonth.savings - previousMonth.savings

  const getFinancialHealth = () => {
    const score =
      (currentMonth.savingsRate >= 20 ? 30 : currentMonth.savingsRate >= 10 ? 20 : 10) +
      (expenseChange <= 0 ? 30 : expenseChange < previousMonth.expenses * 0.1 ? 20 : 10) +
      (incomeChange >= 0 ? 40 : 20)

    if (score >= 80) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle }
    if (score >= 60) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp }
    if (score >= 40) return { text: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: AlertCircle }
    return { text: 'Needs Attention', color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle }
  }

  const health = getFinancialHealth()
  const HealthIcon = health.icon

  const recommendations = []

  if (currentMonth.savingsRate < 20) {
    recommendations.push('Consider increasing your savings rate to at least 20%')
  }
  if (expenseChange > 0) {
    recommendations.push('Your expenses increased this month. Review spending habits')
  }
  if (topCategory && topCategory.percentage > 40) {
    recommendations.push(`${topCategory.name} is ${topCategory.percentage}% of expenses. Consider reducing`)
  }
  if (projectedExpenses > currentMonth.expenses * 1.5) {
    recommendations.push('Current spending pace is high. Slow down to meet budget')
  }
  if (currentMonth.savingsRate >= 20 && expenseChange <= 0) {
    recommendations.push('Great job! Keep up the excellent financial habits')
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            Financial Report Summary
          </CardTitle>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${health.bg}`}>
            <HealthIcon className={`h-4 w-4 ${health.color}`} />
            <span className={`text-sm font-semibold ${health.color}`}>
              {health.text}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Total Income</span>
            </div>
            <p className="text-xl font-bold text-green-900">{formatCurrency(currentMonth.income)}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {incomeChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{formatCurrency(Math.abs(incomeChange))} vs last month</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-red-800">Total Expenses</span>
            </div>
            <p className="text-xl font-bold text-red-900">{formatCurrency(currentMonth.expenses)}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {expenseChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{formatCurrency(Math.abs(expenseChange))} vs last month</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Net Savings</span>
            </div>
            <p className="text-xl font-bold text-blue-900">{formatCurrency(currentMonth.savings)}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${savingsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {savingsChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{formatCurrency(Math.abs(savingsChange))} vs last month</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-800">Savings Rate</span>
            </div>
            <p className="text-xl font-bold text-purple-900">{currentMonth.savingsRate.toFixed(1)}%</p>
            <p className="text-xs text-purple-700 mt-1">
              {currentMonth.savingsRate >= 20 ? 'Excellent!' : currentMonth.savingsRate >= 10 ? 'Good' : 'Improve'}
            </p>
          </div>
        </div>

        {/* Top Spending Category */}
        {topCategory && (
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Highest Spending Category</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{topCategory.name}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(topCategory.amount)}</p>
                <p className="text-sm text-gray-600">{topCategory.percentage}% of expenses</p>
              </div>
            </div>
          </div>
        )}

        {/* Month Projection */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Month-End Projection</p>
            <span className="text-xs text-gray-500">{daysRemaining} days remaining</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Projected Total Expenses</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(projectedExpenses)}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-600">Projected Savings</p>
              <p className={`text-xl font-bold ${currentMonth.income - projectedExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(currentMonth.income - projectedExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            Recommendations
          </p>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-semibold mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-gray-700">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

