import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // const transactionsSum = await this.createQueryBuilder('transactions')
    //   .select('transactions.type')
    //   .addSelect('SUM(transactions.value)', 'sum')
    //   .groupBy('transactions.type')
    //   .getRawMany();
    // const income = transactionsSum.find(t => t.transactions_type === 'income')
    //   .sum;
    // const outcome = transactionsSum.find(t => t.transactions_type === 'outcome')
    //   .sum;

    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }

        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public async all(): Promise<Transaction[]> {
    const transactions = await this.find({ relations: ['category'] });

    return transactions;
  }
}

export default TransactionsRepository;
