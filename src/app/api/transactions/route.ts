import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  date: z.string().datetime(),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string(),
  notes: z.string().nullable().optional(),
});

// GET /api/transactions - Get all transactions
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = transactionSchema.parse(body);

    const transaction = await prisma.transaction.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

