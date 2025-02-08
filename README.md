# Deriv AI

A Next.js-based AI-powered analytics platform for financial data analysis.

## Features

- Real-time financial data analysis
- Interactive data visualization using Recharts
- AI-powered insights using OpenAI integration
- Modern UI components with Shadcn/UI
- Prisma ORM for database management
- Yahoo Finance integration for market data

## Prerequisites

- Node.js (via nvm)
- pnpm package manager
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/deriv-ai.git
cd deriv-ai
```

2. Set up Node.js using nvm:
```bash
nvm use node
```

3. Install dependencies:
```bash
pnpm install
```

4. Set up your environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

5. Set up the database:
```bash
pnpm prisma generate
pnpm prisma db push
```

## Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework:** Next.js 15.1.0
- **Language:** TypeScript
- **UI Components:** 
  - Shadcn/UI
  - Radix UI
  - Tailwind CSS
- **State Management:** Jotai
- **Database:** Prisma with PostgreSQL
- **Data Visualization:** Recharts
- **Financial Data:** Yahoo Finance API
- **AI Integration:** OpenAI

## Project Structure

- `/app` - Next.js application routes and API endpoints
- `/components` - Reusable UI components
- `/database` - Database configurations and utilities
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared logic
- `/prisma` - Database schema and migrations
- `/public` - Static assets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

---

For more information about Next.js, check out:
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
