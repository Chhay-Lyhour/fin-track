"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Calendar, CheckCircle, AlertTriangle, BarChart3 } from "lucide-react"

interface WeeklySummaryProps {
  thisWeek: {
    income: number
    expenses: number
    transactions: number
  }
  lastWeek: {
    income: number
    expenses: number
    transactions: number
  }
}

export function WeeklySummary({ thisWeek, lastWeek }: WeeklySummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getChange = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true }
    const change = ((current - previous) / previous * 100).toFixed(1)
    return { value: Math.abs(Number(change)), isPositive: Number(change) >= 0 }
  }

  const incomeChange = getChange(thisWeek.income, lastWeek.income)
  const expenseChange = getChange(thisWeek.expenses, lastWeek.expenses)
  const transactionChange = getChange(thisWeek.transactions, lastWeek.transactions)

  const thisWeekBalance = thisWeek.income - thisWeek.expenses
  const lastWeekBalance = lastWeek.income - lastWeek.expenses

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          This Week vs Last Week
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Income Comparison */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">Income</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(thisWeek.income)}</p>
            <p className="text-xs text-gray-500">Last week: {formatCurrency(lastWeek.income)}</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${incomeChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {incomeChange.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-semibold">{incomeChange.value}%</span>
            </div>
          </div>
        </div>

        {/* Expense Comparison */}
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">Expenses</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(thisWeek.expenses)}</p>
            <p className="text-xs text-gray-500">Last week: {formatCurrency(lastWeek.expenses)}</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${!expenseChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {expenseChange.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="font-semibold">{expenseChange.value}%</span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Balance</p>
            <p className={`text-xl font-bold ${thisWeekBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(thisWeekBalance)}
            </p>
            <p className="text-xs text-gray-500">Last week: {formatCurrency(lastWeekBalance)}</p>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-lg font-bold text-gray-900">{thisWeek.transactions} this week</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${transactionChange.isPositive ? 'text-blue-600' : 'text-gray-600'}`}>
            {transactionChange.isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-semibold">{transactionChange.value}%</span>
          </div>
        </div>

        {/* Weekly Insight */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            {thisWeekBalance > lastWeekBalance && (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Better than last week!
              </>
            )}
            {thisWeekBalance < lastWeekBalance && thisWeek.expenses < lastWeek.expenses && (
              <>
                <TrendingDown className="h-4 w-4 text-green-600" />
                Lower expenses this week!
              </>
            )}
            {thisWeekBalance < lastWeekBalance && thisWeek.expenses >= lastWeek.expenses && (
              <>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Watch your spending this week.
              </>
            )}
            {thisWeekBalance === lastWeekBalance && (
              <>
                <BarChart3 className="h-4 w-4 text-gray-600" />
                Same as last week.
              </>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

