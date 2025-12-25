"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { TopSpendingCategories } from "@/components/top-spending"
import { WeeklySummary } from "@/components/weekly-summary"
import { MonthlyComparison } from "@/components/monthly-comparison"
import { SavingsRate } from "@/components/savings-rate"
import { SpendingVelocity } from "@/components/spending-velocity"
import { FinancialReport } from "@/components/financial-report"
import { QuickStats } from "@/components/quick-stats"
import { ExpenseChart, IncomeChart } from "@/components/charts"
import { TransactionForm } from "@/components/transaction-form"
import { BarChart3 } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  category: {
    id: string
    name: string
    icon: string
    color: string
    type: 'INCOME' | 'EXPENSE'
  }
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'INCOME' | 'EXPENSE'
}

export default function AnalyticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [topSpending, setTopSpending] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState({
    thisWeek: { income: 0, expenses: 0, transactions: 0 },
    lastWeek: { income: 0, expenses: 0, transactions: 0 },
  })
  const [comparisonData, setComparisonData] = useState({
    current: { income: 0, expenses: 0 },
    previous: { income: 0, expenses: 0 },
  })
  const [statistics, setStatistics] = useState<any>({
    categoryBreakdown: [],
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [
        transactionsRes,
        categoriesRes,
        statisticsRes,
        comparisonRes,
        trendRes,
        topSpendingRes,
        weeklyRes
      ] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/categories'),
        fetch('/api/statistics'),
        fetch('/api/statistics/comparison'),
        fetch('/api/statistics/trend'),
        fetch('/api/statistics/top-spending'),
        fetch('/api/statistics/weekly'),
      ])

      const transactionsData = await transactionsRes.json()
      const categoriesData = await categoriesRes.json()
      const statisticsData = await statisticsRes.json()
      const comparisonDataRes = await comparisonRes.json()
      const trendDataRes = await trendRes.json()
      const topSpendingDataRes = await topSpendingRes.json()
      const weeklyDataRes = await weeklyRes.json()

      setTransactions(transactionsData)
      setCategories(categoriesData)
      setStatistics(statisticsData)
      setComparisonData(comparisonDataRes)
      setTrendData(trendDataRes)
      setTopSpending(topSpendingDataRes)
      setWeeklyData(weeklyDataRes)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFormSuccess = () => {
    fetchData()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddTransaction={() => setIsFormOpen(true)} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive financial insights and trends</p>
          </div>

          {/* Financial Report Summary */}
          <FinancialReport
            currentMonth={{
              income: comparisonData.current.income,
              expenses: comparisonData.current.expenses,
              savings: comparisonData.current.income - comparisonData.current.expenses,
              savingsRate: comparisonData.current.income > 0
                ? ((comparisonData.current.income - comparisonData.current.expenses) / comparisonData.current.income * 100)
                : 0
            }}
            previousMonth={{
              income: comparisonData.previous.income,
              expenses: comparisonData.previous.expenses,
              savings: comparisonData.previous.income - comparisonData.previous.expenses,
              savingsRate: comparisonData.previous.income > 0
                ? ((comparisonData.previous.income - comparisonData.previous.expenses) / comparisonData.previous.income * 100)
                : 0
            }}
            topCategory={topSpending.length > 0 ? topSpending[0] : null}
            projectedExpenses={(comparisonData.current.expenses / new Date().getDate()) * new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
            daysRemaining={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate()}
          />

          {/* Quick Stats */}
          <QuickStats transactions={transactions} />

          {/* 6-Month Trend Chart */}
          {trendData.length > 0 && <MonthlyTrendChart data={trendData} />}

          {/* Weekly Summary and Top Spending */}
          <div className="grid gap-4 md:grid-cols-2">
            <WeeklySummary thisWeek={weeklyData.thisWeek} lastWeek={weeklyData.lastWeek} />
            <TopSpendingCategories categories={topSpending} />
          </div>

          {/* Monthly Comparison and Analytics Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <MonthlyComparison
              current={comparisonData.current}
              previous={comparisonData.previous}
            />
            <SavingsRate
              income={comparisonData.current.income}
              expenses={comparisonData.current.expenses}
              previousIncome={comparisonData.previous.income}
              previousExpenses={comparisonData.previous.expenses}
            />
            <SpendingVelocity
              currentExpenses={comparisonData.current.expenses}
              daysElapsed={new Date().getDate()}
              totalDaysInMonth={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()}
            />
          </div>

          {/* Expense and Income Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <ExpenseChart data={statistics.categoryBreakdown} />
            <IncomeChart data={statistics.categoryBreakdown} />
          </div>
        </div>
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        categories={categories}
        transaction={null}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

