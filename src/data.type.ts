export type ExpenseCategory = {
  id?: string;
  title?: string;
};

export type ExpenseType = {
  id?: string;
  date?: string;
  description: string;
  amount: number;
  categoryId: string;
  category?: {
    id: string;
    title: string;
  };
};

export type BudgeListType = {
  id?: string;
  date?: string;
  amount: number;
};

type CardTypeWithTitle = {
  children: React.ReactNode;
  description: string;
  count?: never;
  title: string;
};

type CardTypeWithCount = {
  children: React.ReactNode;
  description: string;
  count: number;
  title?: never;
};

export type CardType = CardTypeWithCount | CardTypeWithTitle;
