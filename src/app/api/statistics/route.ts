import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

// GET /api/statistics - Get financial statistics for current month
export async function GET() {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get current month transactions
    const monthTransactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate totals
    const totalIncome = monthTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Category breakdown for charts
    const categoryBreakdown = monthTransactions.reduce((acc, transaction) => {
      const categoryName = transaction.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          amount: 0,
          color: transaction.category.color,
          icon: transaction.category.icon,
          type: transaction.type,
        };
      }
      acc[categoryName].amount += transaction.amount;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      balance,
      categoryBreakdown: Object.values(categoryBreakdown),
      transactionCount: monthTransactions.length,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

