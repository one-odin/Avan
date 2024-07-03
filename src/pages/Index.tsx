import { useEffect, useState } from "react";
import { Select } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { ToastContainer } from "react-toastify";
import dayjs from "dayjs";
import jalaliday from "jalaliday";
dayjs.extend(jalaliday);

import Card from "../components/Card/Card";
import CardBudget from "../components/CardBudget/CardBudget";
import AddExpense from "../components/AddExpense/AddExpense";

import { ExpenseType, ExpenseCategory, BudgeListType } from "../data.type";
import DeleteExpense from "../components/DeleteExpense/DeleteExpense";
import EditExpense from "../components/EditExpense/EditExpense";
import ChartBudget from "../components/ChartBudget/ChartBudget";

const Index: React.FC = () => {
  const [allBudget, setAllBudget] = useState<BudgeListType[]>([]);
  const [currentBudget, setCurrentBudget] = useState<number>(0);
  const [expensesList, setExpensesList] = useState<ExpenseType[]>([]);
  const [totalExpense, setTotalExpense] = useState<number>(0);

  const [allCat, setAllCat] = useState<ExpenseCategory[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const getAllBudge = async (): Promise<void> => {
    await fetch("http://localhost:3000/budget")
      .then((res) => res.json())
      .then((data: BudgeListType[]): void => {
        setAllBudget(data);
        const curBud = data[data.length - 1].amount;
        setCurrentBudget(curBud);
      });
  };

  const getAllExpenses = async (): Promise<void> => {
    await fetch(`http://localhost:3000/expenses?_embed=category`)
      .then((res) => res.json())
      .then((data: ExpenseType[]): void => {
        setExpensesList(data);

        // Calculate total expense
        const totalExpenseSum = data.reduce((x, y) => x + y.amount, 0);
        setTotalExpense(totalExpenseSum);
      });
  };

  const getCategories = async (): Promise<void> => {
    await fetch(`http://localhost:3000/categories`)
      .then((res) => res.json())
      .then((data: ExpenseCategory[]): void => {
        setAllCat(data);
      });
  };

  useEffect(() => {
    getAllBudge();
    getAllExpenses();
    getCategories();
  }, []);

  const filteredExpenses = categoryFilter === "all" ? expensesList : expensesList.filter((item: ExpenseType) => item.category && item.category.title === categoryFilter);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(event.target.value);
  };

  return (
    <div className="container mx-auto mt-20 lg:w-2/3">
      <ToastContainer limit={1} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 mb-5">
        <CardBudget currentBudget={currentBudget} getAllBudge={getAllBudge} />

        <Card count={totalExpense} description="مجموع هزینه‌ها">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:from-blue-400 hover:to-purple-500">
            <CreditCardIcon className="inline-block h-5 w-5" />
          </div>
        </Card>

        <ChartBudget allBudget={allBudget} />
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl mb-40">
        <table className="w-full text-sm text-gray-500 text-right">
          <caption>
            <div className="grid justify-between lg:grid-cols-2 grid-cols-1 items-center gap-4 p-5 mb-5">
              <div className="text-2xl font-bold text-right text-transparent bg-clip-text bg-gradient-to-r to-blue-500 from-purple-600">
                مدیریت هزینه‌ها
                <p className="mt-1 text-sm font-normal text-gray-500">در جدول زیر هزینه‌ها را مشاهده می‌کنید و می‌توانید آن‌ها را مدیریت نمایید.</p>
              </div>
              <div>
                <div className="flex gap-2 justify-end">
                  {/* sort on category */}
                  <div className="border text-gray-500 font-semibold rounded-lg p-2 h-10">
                    <FunnelIcon className="inline-block h-4 w-4" />
                    <Select name="status" defaultValue={categoryFilter} onChange={handleCategoryChange}>
                      <option value="all">همه دسته‌بندی‌ها</option>
                      {allCat.map((item) => {
                        return (
                          <option key={item.id} value={item.title}>
                            {item.title}
                          </option>
                        );
                      })}
                    </Select>
                  </div>

                  {/* add new expense */}
                  <AddExpense getAllExpenses={getAllExpenses} allCat={allCat} getAllBudge={getAllBudge} currentBudget={currentBudget} />
                </div>
              </div>
            </div>
          </caption>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                توضیحات
              </th>
              <th scope="col" className="px-6 py-3">
                تاریخ
              </th>
              <th scope="col" className="px-6 py-3">
                هزینه (دلار)
              </th>
              <th scope="col" className="px-6 py-3">
                دسته‌بندی
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">مدیریت</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((item: any) => {
              return (
                <tr key={item.id} className="bg-white [&:not(:last-child)]:border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.description}
                  </th>
                  <td className="px-6 py-4">{dayjs(item.date).calendar("jalali").locale("fa").format("DD MMMM YYYY")}</td>
                  <td className="px-6 py-4">{item.amount}</td>
                  <td className="px-6 py-4">{item.category && item.category.title}</td>
                  <td className="flex gap-6 px-6 py-4 text-right">
                    <EditExpense itemAmount={item.amount} itemID={item.id} allCat={allCat} getAllExpenses={getAllExpenses} getAllBudge={getAllBudge} currentBudget={currentBudget} />
                    <DeleteExpense itemAmount={item.amount} itemID={item.id} getAllExpenses={getAllExpenses} currentBudget={currentBudget} getAllBudge={getAllBudge} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
