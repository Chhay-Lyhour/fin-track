"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DollarSign, Calendar, FileText, Tag } from "lucide-react"

interface Category {
  id: string
  name: string
  icon: string
  type: 'INCOME' | 'EXPENSE'
}

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  notes?: string | null
}

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: Category[]
  transaction?: Transaction | null
  onSuccess: () => void
}

export function TransactionForm({
  open,
  onOpenChange,
  categories,
  transaction,
  onSuccess,
}: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>(
    transaction?.type || 'EXPENSE'
  )
  const [formData, setFormData] = useState({
    amount: transaction?.amount.toString() || '',
    description: transaction?.description || '',
    date: transaction?.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    categoryId: transaction?.categoryId || '',
    notes: transaction?.notes || '',
  })


  // Update form when transaction changes
  useEffect(() => {
    if (transaction) {
      setType(transaction.type)
      setFormData({
        amount: transaction.amount.toString(),
        description: transaction.description,
        date: new Date(transaction.date).toISOString().split('T')[0],
        categoryId: transaction.categoryId,
        notes: transaction.notes || '',
      })
    } else {
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        notes: '',
      })
      setType('EXPENSE')
    }
  }, [transaction, open])

  const filteredCategories = categories.filter((cat) => cat.type === type)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = transaction
        ? `/api/transactions/${transaction.id}`
        : '/api/transactions'

      const method = transaction ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        type,
        categoryId: formData.categoryId,
        notes: formData.notes || null,
      }),
      })

      if (!response.ok) {
        throw new Error('Failed to save transaction')
      }

      onSuccess()
      onOpenChange(false)

      // Reset form
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        categoryId: '',
        notes: '',
      })
      setType('EXPENSE')
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {transaction ? '✏️ Edit Transaction' : '➕ Add Transaction'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {transaction
              ? 'Update your transaction details below.'
              : 'Fill in the details to add a new transaction to your records.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2 text-gray-900">
              <Tag className="h-4 w-4 text-gray-700" />
              Transaction Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('EXPENSE')
                  setFormData({ ...formData, categoryId: '' })
                }}
                className={`
                  h-12 rounded-lg border-2 font-semibold transition-all duration-200
                  ${type === 'EXPENSE'
                    ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-200 scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600 shadow-sm'
                  }
                `}
              >
                💸 Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setType('INCOME')
                  setFormData({ ...formData, categoryId: '' })
                }}
                className={`
                  h-12 rounded-lg border-2 font-semibold transition-all duration-200
                  ${type === 'INCOME'
                    ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-200 scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-600 shadow-sm'
                  }
                `}
              >
                💰 Income
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="text-sm font-semibold flex items-center gap-2 text-gray-900">
              <DollarSign className="h-4 w-4 text-gray-700" />
              Amount
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xl">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="pl-10 h-14 text-xl font-semibold border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50"
                required
              />
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-3">
            <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-2 text-gray-900">
              <Tag className="h-4 w-4 text-gray-700" />
              Category
            </Label>
            <Select
              id="category"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50 text-gray-900"
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.icon} {category.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Description Textarea */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold flex items-center gap-2 text-gray-900">
              <FileText className="h-4 w-4 text-gray-700" />
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter a description for this transaction..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[80px] resize-none border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50"
              required
            />
          </div>

          {/* Notes Textarea (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-semibold flex items-center gap-2 text-gray-900">
              <FileText className="h-4 w-4 text-gray-700" />
              Notes <span className="text-xs font-normal text-gray-500">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes or context..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="min-h-[60px] resize-none border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50"
            />
          </div>

          {/* Date Input */}
          <div className="space-y-3">
            <Label htmlFor="date" className="text-sm font-semibold flex items-center gap-2 text-gray-900">
              <Calendar className="h-4 w-4 text-gray-700" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-gray-50"
              required
            />
          </div>

          {/* Action Buttons */}
          <DialogFooter className="gap-3 pt-6 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 h-12 font-semibold border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className={`flex-1 h-12 font-semibold shadow-lg transition-all ${
                type === 'INCOME'
                  ? 'bg-green-500 hover:bg-green-600 shadow-green-200'
                  : 'bg-red-500 hover:bg-red-600 shadow-red-200'
              } text-white`}
            >
              {loading ? 'Saving...' : transaction ? '✓ Update Transaction' : '+ Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
