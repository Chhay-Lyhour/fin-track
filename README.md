# FinTrack - Personal Finance Tracker

A modern, full-featured personal finance tracking application built with Next.js 14, Prisma, and TailwindCSS.

## Features

 **Core Features:**
-  Track income and expenses
-  Interactive charts and data visualization
-  Category-based budgeting
-  Monthly financial summaries
-  Dark/Light mode support
-  Fully responsive design
-  Real-time updates

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** TailwindCSS v4
- **UI Components:** Custom shadcn/ui components
- **Charts:** Recharts
- **Icons:** Lucide React
- **Theme:** next-themes
- **Validation:** Zod

## Project Structure

```
fin-track/
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   └── statistics/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main dashboard
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── charts.tsx       # Chart components
│   │   ├── transaction-form.tsx
│   │   ├── transaction-list.tsx
│   │   ├── statistics-cards.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── utils.ts         # Utility functions
│   └── generated/
│       └── prisma/          # Generated Prisma client
├── .env                      # Environment variables
├── next.config.ts           # Next.js configuration
├── prisma.config.ts         # Prisma 7 configuration
├── tailwind.config.ts       # TailwindCSS configuration
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "/Users/sopheappit/Desktop/Intensive Internship/fin-track"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the database:**
   
   The project uses SQLite with Prisma ORM. Generate the Prisma client and create the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Seed the database (optional):**
   
   Populate the database with sample categories and transactions:
   ```bash
   npm run db:seed
   ```
   
   **Note:** If seeding encounters issues with Prisma 7 adapters, you can manually create categories through the UI once the app is running.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in the terminal)

## Database Schema

### Category Model
- `id`: Unique identifier
- `name`: Category name
- `icon`: Emoji icon
- `color`: Hex color code
- `type`: INCOME or EXPENSE
- `transactions`: Related transactions

### Transaction Model
- `id`: Unique identifier
- `amount`: Transaction amount
- `description`: Transaction description
- `date`: Transaction date
- `type`: INCOME or EXPENSE
- `categoryId`: Foreign key to Category
- `category`: Related category

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:setup` - Run all database setup steps

## API Routes

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/[id]` - Get single transaction
- `PUT /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions/[id]` - Delete transaction

### Categories
- `GET /api/categories` - Get all categories

### Statistics
- `GET /api/statistics` - Get financial statistics for current month

## Features in Detail

### Dashboard
- **Statistics Cards**: Display total balance, income, expenses, and transaction count
- **Charts**: Visual breakdown of income and expenses by category
- **Transaction List**: Recent transactions with edit/delete actions

### Transaction Management
- **Add Transaction**: Modal form to create new income or expense
- **Edit Transaction**: Update existing transaction details
- **Delete Transaction**: Remove transactions with confirmation
- **Category Filtering**: Categories filtered by transaction type

### Dark Mode
- Toggle between light and dark themes
- System preference detection
- Persistent theme selection

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface

## Troubleshooting

### Prisma Issues

If you encounter issues with Prisma client generation or database connections:

1. **Clear generated files:**
   ```bash
   rm -rf src/generated/prisma
   rm -rf prisma/dev.db
   ```

2. **Regenerate everything:**
   ```bash
   npm run db:setup
   ```

3. **Check environment variables:**
   Ensure `.env` contains:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   ```

### Port Already in Use

If port 3000 is busy:
```bash
lsof -ti:3000 | xargs kill -9
```

### Build Errors

Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

## Future Enhancements

-  Advanced analytics and reports
-  Recurring transactions
-  Data export (CSV, PDF)
-  Search and filter transactions
-  Multi-user support with authentication
-  Multiple currency support
-  Progressive Web App (PWA)
-  Budget alerts and notifications

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

For platforms like Railway, Render, or Fly.io:
1. Ensure database persistence
2. Set `DATABASE_URL` environment variable
3. Run build command: `npm run build`
4. Start command: `npm run start`

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the troubleshooting section
- Review Prisma documentation: https://www.prisma.io/docs
- Review Next.js documentation: https://nextjs.org/docs

---

Built with using Next.js, Prisma, and modern web technologies.

