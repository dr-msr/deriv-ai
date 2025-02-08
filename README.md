# Unleashed AI - Contextual Transaction Analytics with Reasoning Model O1

## Overview

We are a team of developers participating in the **Deriv AI Hackathon** (held on **February 8th-9th, 2025**) at Deriv HQ in Cyberjaya, Malaysia. Our team, consisting of **Mohd Syamirulah Rahim**, **Saladin**, and **Suzaril Shah**, is working on **Challenge 3: Social Trading**, while focusing on improving transaction logs.

Our project, **Unleashed AI**, enhances the traditional transaction log by incorporating **contextual data** like news headlines. These headlines are **vectorized**, allowing for semantic analysis that connects transaction data with global events. After an initial mathematical analysis is performed on related data points, the results are refined using **O1**, a reasoning model, to ensure that the conclusions are well-supported and logical.

An important aspect of this system is that, as more transactions are logged, even similar transactional values (such as amounts or profits) can have different real-world contexts. This allows the system to produce more **accurate** and **real-world relevant analysis** as it learns to differentiate the contexts surrounding similar transactions.

The demo of **Unleashed AI** is available at [Unleashed AI Demo](https://unleashed-ai.vercel.app).

## Core Features

### 1. **Contextual Transaction Analytics**
   - Our system enhances traditional transaction logs by associating **relevant news headlines** with each transaction. This enables the system to capture not just the transaction details (amount, time), but also the **context** in which the transaction occurred.

### 2. **Vectorized News Integration**
   - The **news headlines** are processed and converted into data points that are analyzed alongside transaction data. This helps the system understand the **real-world context** of each transaction, allowing for more accurate insights.

### 3. **Reasoning Model O1**
   - After an initial analysis between related data points, **O1** refines the results by applying reasoning. This step ensures that the conclusions drawn are logical and well-grounded, improving the quality and reliability of the insights.

### 4. **Improved Accuracy Over Time**
   - As the system logs more transactions, it becomes better at distinguishing between similar transactions that might have different real-world contexts. This allows the analysis to reflect **real-world scenarios more accurately**, leading to more reliable insights and predictions.
   
## Hackathon Participation: Deriv AI Hackathon

We are participating in the **Deriv AI Hackathon**, which has a prize pool of RM 30,000. The event is organized at **Deriv HQ in Cyberjaya**, where participants work on real-world AI challenges. 

**Hackathon Details**:
- **Challenge 3: Social Trading**: Build an AI-powered platform for real-time replication of successful trading strategies.
- **Date**: February 8-9, 2025
- **Location**: Deriv HQ, Cyberjaya, Malaysia
- [Learn more about the hackathon](https://deriv.com/hackathon)

## Features and Benefits

- **Contextual Transaction Analytics**: By connecting transaction data with relevant news headlines, our system provides insights that account for external factors.
  
- **Reasoning Model O1**: The initial analysis is further refined with **O1**, a reasoning model that ensures the results are logical and coherent.

- **Improved Accuracy Over Time**: The more transactions that are logged, the more accurate the system becomes at differentiating between similar transactions and understanding their distinct **real-world contexts**. This leads to **better predictions** and more **reliable insights**.

## Installation

Follow these steps to get started with the project:

1. **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/unleashed-ai.git
    cd unleashed-ai
    ```

2. **Install Dependencies**
    ```bash
    pnpm install
    ```

3. **Set Up Environment Variables**
    ```bash
    cp .env.example .env
    ```

4. **Set Up Database and Models**
    ```bash
    pnpm prisma generate
    pnpm prisma db push
    ```

5. **Start the Development Server**
    ```bash
    pnpm dev
    ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js 15.1.0
- **Language**: TypeScript
- **UI Components**: Shadcn/UI, Radix UI, Tailwind CSS
- **Database**: Prisma with PostgreSQL
- **Data Visualization**: Recharts
- **LLM Integration**: OpenAI for semantic insights
- **Vectorization**: Custom logic for news headlines integration
- **Reasoning Model**: O1 for logical analysis refinement

## Challenges Addressed

- **Challenge 3: Social Trading** - Create an AI-driven platform for users to follow, interact, and replicate trading strategies.
- **Future Directions**: The **Contextual Transaction Analytics** system will evolve, integrating **real-time AI insights** for improved market predictions and user experience.

## Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**.
2. **Create a feature branch** (`git checkout -b feature/contextual-transaction-analytics`).
3. **Commit your changes** (`git commit -m 'Enhance transaction log with semantic context'`).
4. **Push to your branch** (`git push origin feature/contextual-transaction-analytics`).
5. **Open a Pull Request**.

## License

This project is open-source and licensed under the **MIT License**.

---

For more information about **Next.js** and **OpenAI models**, visit:
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://beta.openai.com/docs/)
