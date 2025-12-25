"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { TransactionFilters } from "@/components/transaction-filters"
import { StatisticsCards } from "@/components/statistics-cards"
import { MonthlyComparison } from "@/components/monthly-comparison"
import { QuickStats } from "@/components/quick-stats"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"
import { TopSpendingCategories } from "@/components/top-spending"
import { WeeklySummary } from "@/components/weekly-summary"
import { ExpenseChart, IncomeChart } from "@/components/charts"

interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: 'INCOME' | 'EXPENSE'
}

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  category: Category
}

interface Statistics {
  totalIncome: number
  totalExpenses: number
  balance: number
  categoryBreakdown: any[]
  transactionCount: number
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryBreakdown: [],
    transactionCount: 0,
  })
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Monthly comparison state
  const [comparisonData, setComparisonData] = useState({
    current: { income: 0, expenses: 0 },
    previous: { income: 0, expenses: 0 },
  })

  // New features state
  const [trendData, setTrendData] = useState<any[]>([])
  const [topSpending, setTopSpending] = useState<any[]>([])
  const [weeklyData, setWeeklyData] = useState({
    thisWeek: { income: 0, expenses: 0, transactions: 0 },
    lastWeek: { income: 0, expenses: 0, transactions: 0 },
  })

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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    fetchData()
  }

  const handleFormSuccess = () => {
    fetchData()
    setEditingTransaction(null)
  }

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open)
    if (!open) {
      setEditingTransaction(null)
    }
  }

  // Filter and sort transactions
  const filteredAndSortedTransactions = transactions
    .filter(transaction => {
      // Search filter
      if (searchQuery && !transaction.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Type filter
      if (filterType !== 'ALL' && transaction.type !== filterType) {
        return false
      }
      // Category filter
      if (filterCategory !== 'ALL' && transaction.categoryId !== filterCategory) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      let comparison = 0

      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount
      } else if (sortBy === 'category') {
        comparison = a.category.name.localeCompare(b.category.name)
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Notes']

    const rows = filteredAndSortedTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category.name,
      t.type,
      t.amount.toFixed(2),
      (t as any).notes || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fin-track-transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setFilterType('ALL')
    setFilterCategory('ALL')
    setSortBy('date')
    setSortOrder('desc')
  }

  // Check if filters are active
  const hasActiveFilters = searchQuery !== '' || filterType !== 'ALL' || filterCategory !== 'ALL'

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddTransaction={() => setIsFormOpen(true)} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Statistics Cards */}
          <StatisticsCards
            totalIncome={statistics.totalIncome}
            totalExpenses={statistics.totalExpenses}
            balance={statistics.balance}
            transactionCount={statistics.transactionCount}
          />


          {/* Transaction Filters */}
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
            filterCategory={filterCategory}
            onFilterCategoryChange={setFilterCategory}
            categories={categories}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            onExport={exportToCSV}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Transaction List */}
          <TransactionList
            transactions={filteredAndSortedTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {/* Transaction Form Modal */}
      <TransactionForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        categories={categories}
        transaction={editingTransaction}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
