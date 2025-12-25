"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp } from "lucide-react"

interface MonthlyTrendData {
  month: string
  income: number
  expenses: number
  balance: number
}

interface MonthlyTrendChartProps {
  data: MonthlyTrendData[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const latestMonth = data[data.length - 1] || { income: 0, expenses: 0 }
  const previousMonth = data[data.length - 2] || { income: 0, expenses: 0 }

  const getChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous * 100).toFixed(1)
  }

  const incomeChange = getChange(latestMonth.income, previousMonth.income)
  const expenseChange = getChange(latestMonth.expenses, previousMonth.expenses)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            6-Month Expense Trend
          </CardTitle>
          <div className="flex gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Income</span>
              <span className={`font-semibold ${Number(incomeChange) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(incomeChange) >= 0 ? '+' : ''}{incomeChange}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Expenses</span>
              <span className={`font-semibold ${Number(expenseChange) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(expenseChange) >= 0 ? '+' : ''}{expenseChange}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
              name="Income"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Monthly Breakdown */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {data.map((month, index) => {
            const prevMonth = data[index - 1]
            const expenseChange = prevMonth ?
              ((month.expenses - prevMonth.expenses) / prevMonth.expenses * 100).toFixed(0) : 0

            return (
              <div key={month.month} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs font-semibold text-gray-600 mb-1">{month.month}</div>
                <div className="text-sm font-bold text-red-600 mb-1">
                  {formatCurrency(month.expenses)}
                </div>
                {index > 0 && (
                  <div className={`text-xs font-semibold ${Number(expenseChange) <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Number(expenseChange) > 0 ? '↑' : '↓'} {Math.abs(Number(expenseChange))}%
                  </div>
                )}
                {index === 0 && <div className="text-xs text-gray-400">—</div>}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

