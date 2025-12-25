"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
}

interface QuickStatsProps {
  transactions: Transaction[]
}

export function QuickStats({ transactions }: QuickStatsProps) {
  const expenses = transactions.filter(t => t.type === 'EXPENSE')
  const incomes = transactions.filter(t => t.type === 'INCOME')

  const avgExpense = expenses.length
    ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
    : 0

  const largestExpense = expenses.length
    ? Math.max(...expenses.map(t => t.amount))
    : 0

  const largestIncome = incomes.length
    ? Math.max(...incomes.map(t => t.amount))
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgExpense)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Largest Expense</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(largestExpense)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {largestExpense > 0 ? 'Highest single expense' : 'No expenses yet'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Largest Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(largestIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {largestIncome > 0 ? 'Highest single income' : 'No income yet'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
  transactions: Transaction[]
interface QuickStatsProps {

}
  type: 'INCOME' | 'EXPENSE'
  amount: number
  id: string
interface Transaction {

import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"


