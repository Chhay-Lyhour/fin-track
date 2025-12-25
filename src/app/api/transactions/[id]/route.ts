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

// GET /api/transactions/[id] - Get single transaction
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        category: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// PUT /api/transactions/[id] - Update transaction
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const validatedData = transactionSchema.parse(body);

    const transaction = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    await prisma.transaction.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
