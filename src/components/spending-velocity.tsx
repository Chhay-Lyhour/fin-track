"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
interface SpendingVelocityProps {
  currentExpenses: number
  daysElapsed: number
  totalDaysInMonth: number
}
export function SpendingVelocity({ currentExpenses, daysElapsed, totalDaysInMonth }: SpendingVelocityProps) {
  const dailyAverage = daysElapsed > 0 ? currentExpenses / daysElapsed : 0
  const projectedMonthEnd = dailyAverage * totalDaysInMonth
  const remainingDays = totalDaysInMonth - daysElapsed
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }
  // Calculate expected vs actual (assume even distribution)
  const expectedExpenses = (currentExpenses / daysElapsed) * daysElapsed
  const expectedDaily = currentExpenses / totalDaysInMonth
  const actualDaily = dailyAverage
  const pacePercentage = expectedDaily > 0 ? ((actualDaily / expectedDaily) * 100) : 100
  const getPaceStatus = () => {
    const pace = pacePercentage
    if (pace <= 80) return { text: 'Under Budget', color: 'text-green-600', bg: 'bg-green-50', icon: TrendingDown }
    if (pace <= 120) return { text: 'On Track', color: 'text-blue-600', bg: 'bg-blue-50', icon: Gauge }
    return { text: 'Over Budget', color: 'text-red-600', bg: 'bg-red-50', icon: TrendingUp }
  }
  const status = getPaceStatus()
  const StatusIcon = status.icon
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Gauge className="h-5 w-5 text-blue-600" />
          Spending Velocity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`p-3 rounded-lg ${status.bg}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-600">Daily Average</span>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dailyAverage)}</p>
            </div>
            <div className={`flex items-center gap-1 ${status.color}`}>
              <StatusIcon className="h-5 w-5" />
              <span className="font-semibold text-sm">{status.text}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600">Projected Total</span>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(projectedMonthEnd)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-600">Days Remaining</span>
            <p className="text-lg font-bold text-gray-900">{remainingDays} days</p>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700">
            {pacePercentage <= 80 && "Great pace! You're spending less than projected."}
            {pacePercentage > 80 && pacePercentage <= 120 && "You're on track with your spending pace."}
            {pacePercentage > 120 && "Spending faster than expected. Consider reviewing expenses."}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
