import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';

// GET /api/statistics/weekly - Get this week vs last week data
export async function GET() {
  try {
    const now = new Date();

    // This week range
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 0 });

    // Last week range
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });

    // Fetch this week transactions
    const thisWeekTransactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: thisWeekStart,
          lte: thisWeekEnd,
        },
      },
    });

    // Fetch last week transactions
    const lastWeekTransactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: lastWeekStart,
          lte: lastWeekEnd,
        },
      },
    });

    // Calculate this week totals
    const thisWeekIncome = thisWeekTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const thisWeekExpenses = thisWeekTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate last week totals
    const lastWeekIncome = lastWeekTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const lastWeekExpenses = lastWeekTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      thisWeek: {
        income: thisWeekIncome,
        expenses: thisWeekExpenses,
        transactions: thisWeekTransactions.length,
      },
      lastWeek: {
        income: lastWeekIncome,
        expenses: lastWeekExpenses,
        transactions: lastWeekTransactions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching weekly data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weekly data' },
      { status: 500 }
    );
  }
}

