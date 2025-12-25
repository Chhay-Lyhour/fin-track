"use client"
}
  )
    </div>
      </Card>
        </CardContent>
          </div>
            </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            </div>
              </p>
                {largestIncome > 0 ? 'Highest single income' : 'No income yet'}
              <p className="text-xs text-gray-500 mt-1">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(largestIncome)}</p>
              <p className="text-sm font-medium text-gray-600">Largest Income</p>
            <div>
          <div className="flex items-center justify-between">
        <CardContent className="pt-6">
      <Card className="border-l-4 border-l-green-500">

      </Card>
        </CardContent>
          </div>
            </div>
              <TrendingDown className="h-6 w-6 text-red-600" />
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            </div>
              </p>
                {largestExpense > 0 ? 'Highest single expense' : 'No expenses yet'}
              <p className="text-xs text-gray-500 mt-1">
              <p className="text-2xl font-bold text-red-600">{formatCurrency(largestExpense)}</p>
              <p className="text-sm font-medium text-gray-600">Largest Expense</p>
            <div>
          <div className="flex items-center justify-between">
        <CardContent className="pt-6">
      <Card className="border-l-4 border-l-red-500">

      </Card>
        </CardContent>
          </div>
            </div>
              <DollarSign className="h-6 w-6 text-blue-600" />
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            </div>
              </p>
                {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
              <p className="text-xs text-gray-500 mt-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(avgExpense)}</p>
              <p className="text-sm font-medium text-gray-600">Average Expense</p>
            <div>
          <div className="flex items-center justify-between">
        <CardContent className="pt-6">
      <Card className="border-l-4 border-l-blue-500">
    <div className="grid gap-4 md:grid-cols-3">
  return (

  }
    }).format(amount)
      currency: 'USD',
      style: 'currency',
    return new Intl.NumberFormat('en-US', {
  const formatCurrency = (amount: number) => {

    : 0
    ? Math.max(...incomes.map(t => t.amount))
  const largestIncome = incomes.length

    : 0
    ? Math.max(...expenses.map(t => t.amount))
  const largestExpense = expenses.length

    : 0
    ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
  const avgExpense = expenses.length

  const incomes = transactions.filter(t => t.type === 'INCOME')
  const expenses = transactions.filter(t => t.type === 'EXPENSE')
export function QuickStats({ transactions }: QuickStatsProps) {

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


