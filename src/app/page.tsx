"use client"

import { useEffect, useState } from "react"
import { Plus, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { StatisticsCards } from "@/components/statistics-cards"
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

  const fetchData = async () => {
    try {
      const [transactionsRes, categoriesRes, statisticsRes] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/categories'),
        fetch('/api/statistics'),
      ])

      const transactionsData = await transactionsRes.json()
      const categoriesData = await categoriesRes.json()
      const statisticsData = await statisticsRes.json()

      setTransactions(transactionsData)
      setCategories(categoriesData)
      setStatistics(statisticsData)
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
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-6 w-6 text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">FinTrack</h1>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

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

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <ExpenseChart data={statistics.categoryBreakdown} />
            <IncomeChart data={statistics.categoryBreakdown} />
          </div>

          {/* Transaction List */}
          <TransactionList
            transactions={transactions}
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
