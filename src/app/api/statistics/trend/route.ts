import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

// GET /api/statistics/trend - Get 6-month trend data
export async function GET() {
  try {
    const now = new Date();
    const monthsData = [];

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);

      const transactions = await prisma.transaction.findMany({
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
      });

      const income = transactions
        .filter(t => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = transactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0);

      monthsData.push({
        month: format(monthDate, 'MMM yy'),
        income,
        expenses,
        balance: income - expenses,
      });
    }

    return NextResponse.json(monthsData);
  } catch (error) {
    console.error('Error fetching trend data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}

