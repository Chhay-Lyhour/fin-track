import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';

// Simple Prisma 6 initialization
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

console.log('Connecting to MongoDB...');
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password


async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();

  // Create expense categories
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Food & Dining',
        icon: '🍔',
        color: '#FF6B6B',
        type: 'EXPENSE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Transportation',
        icon: '🚗',
        color: '#4ECDC4',
        type: 'EXPENSE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Shopping',
        icon: '🛍️',
        color: '#95E1D3',
        type: 'EXPENSE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        icon: '🎬',
        color: '#F38181',
        type: 'EXPENSE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bills & Utilities',
        icon: '💡',
        color: '#AA96DA',
        type: 'EXPENSE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Healthcare',
        icon: '⚕️',
        color: '#FCBAD3',
        type: 'EXPENSE',
      },
    }),
  ]);

  // Create income categories
  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Salary',
        icon: '💰',
        color: '#4CAF50',
        type: 'INCOME',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Freelance',
        icon: '💻',
        color: '#8BC34A',
        type: 'INCOME',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Investment',
        icon: '📈',
        color: '#CDDC39',
        type: 'INCOME',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Other Income',
        icon: '💵',
        color: '#FFEB3B',
        type: 'INCOME',
      },
    }),
  ]);

  console.log('Categories created!');

  // Create sample transactions
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  await prisma.transaction.createMany({
    data: [
      // Income transactions
      {
        amount: 5000,
        description: 'Monthly Salary',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1),
        type: 'INCOME',
        categoryId: incomeCategories[0].id,
      },
      {
        amount: 1200,
        description: 'Freelance Project',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 10),
        type: 'INCOME',
        categoryId: incomeCategories[1].id,
      },
      // Expense transactions
      {
        amount: 85.50,
        description: 'Grocery Shopping',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 5),
        type: 'EXPENSE',
        categoryId: expenseCategories[0].id,
      },
      {
        amount: 45.00,
        description: 'Gas Station',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 7),
        type: 'EXPENSE',
        categoryId: expenseCategories[1].id,
      },
      {
        amount: 120.00,
        description: 'New Shoes',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 12),
        type: 'EXPENSE',
        categoryId: expenseCategories[2].id,
      },
      {
        amount: 25.00,
        description: 'Movie Tickets',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 15),
        type: 'EXPENSE',
        categoryId: expenseCategories[3].id,
      },
      {
        amount: 150.00,
        description: 'Electric Bill',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 3),
        type: 'EXPENSE',
        categoryId: expenseCategories[4].id,
      },
      {
        amount: 200.00,
        description: 'Internet & Phone',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 3),
        type: 'EXPENSE',
        categoryId: expenseCategories[4].id,
      },
      {
        amount: 60.00,
        description: 'Restaurant Dinner',
        date: new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 18),
        type: 'EXPENSE',
        categoryId: expenseCategories[0].id,
      },
    ],
  });

  console.log('Sample transactions created!');
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
