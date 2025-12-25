import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

// GET /api/statistics/comparison - Get monthly comparison data
export async function GET() {
  try {
    const now = new Date();

    // Current month range
    const currentStart = startOfMonth(now);
    const currentEnd = endOfMonth(now);

    // Previous month range
    const prevStart = startOfMonth(subMonths(now, 1));
    const prevEnd = endOfMonth(subMonths(now, 1));

    // Fetch transactions for both months
    const [currentTransactions, previousTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          date: {
            gte: currentStart,
            lte: currentEnd,
          },
        },
      }),
      prisma.transaction.findMany({
        where: {
          date: {
            gte: prevStart,
            lte: prevEnd,
          },
        },
      }),
    ]);

    // Calculate current month totals
    const currentIncome = currentTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate previous month totals
    const previousIncome = previousTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousExpenses = previousTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      current: {
        income: currentIncome,
        expenses: currentExpenses,
      },
      previous: {
        income: previousIncome,
        expenses: previousExpenses,
      },
    });
  } catch (error) {
    console.error('Error fetching comparison data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comparison data' },
      { status: 500 }
    );
  }
}

