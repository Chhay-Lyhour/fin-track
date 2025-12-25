"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface CategorySpending {
  name: string
  icon: string
  color: string
  amount: number
  percentage: number
}

interface TopSpendingProps {
  categories: CategorySpending[]
}

export function TopSpendingCategories({ categories }: TopSpendingProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const topCategories = categories
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🏆 Top Spending Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topCategories.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No spending data yet</p>
        ) : (
          topCategories.map((category, index) => (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{category.name}</span>
                      {index === 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                          #1
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{category.percentage}% of expenses</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{formatCurrency(category.amount)}</div>
                  <div className="flex items-center gap-1 text-xs text-red-600">
                    <TrendingUp className="h-3 w-3" />
                    Rank #{index + 1}
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${category.percentage}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

