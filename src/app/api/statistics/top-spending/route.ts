import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

// GET /api/statistics/top-spending - Get top spending categories for current month
export async function GET() {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Get current month expense transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'EXPENSE',
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate total expenses
    const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

    // Group by category and calculate totals
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const categoryName = transaction.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          icon: transaction.category.icon,
          color: transaction.category.color,
          amount: 0,
        };
      }
      acc[categoryName].amount += transaction.amount;
      return acc;
    }, {} as Record<string, any>);

    // Convert to array and add percentages
    const categoryArray = Object.values(categoryTotals).map((cat: any) => ({
      ...cat,
      percentage: totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0,
    }));

    // Sort by amount descending
    categoryArray.sort((a: any, b: any) => b.amount - a.amount);

    return NextResponse.json(categoryArray);
  } catch (error) {
    console.error('Error fetching top spending:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top spending' },
      { status: 500 }
    );
  }
}

