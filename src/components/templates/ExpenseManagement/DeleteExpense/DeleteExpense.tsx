import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { showToastSuccess, showToastError } from "../../../../utils/ShowToast";
import { TrashIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { BudgeListType } from "../../../../data.type";

type DeleteExpenseProp = {
  itemID: string;
  itemAmount: number;
  getAllExpenses: () => Promise<void>;
  getAllBudge: () => Promise<void>;
  currentBudget: number;
};

const DeleteExpense: React.FC<DeleteExpenseProp> = ({ getAllExpenses, getAllBudge, currentBudget, itemID, itemAmount }) => {
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);

  const deleteExpenseHandler = async (): Promise<void> => {
    try {
      const res = await fetch(`http://localhost:3000/expenses/${itemID}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        showToastSuccess("اطلاعات مورد نظر با موفقيت حذف گرديد");
        getAllExpenses();

        const newItem: BudgeListType = {
          date: dayjs().format("YYYY-MM-DD"),
          amount: currentBudget + itemAmount,
        };

        const resBudget = await fetch("http://localhost:3000/budget", {
          method: "POST",
          body: JSON.stringify(newItem),
        });
        if (resBudget.status === 201) {
          getAllBudge();
          setTimeout(() => {
            setShowModalDelete(false);
          }, 1000);
        }
      }
    } catch (error) {
      showToastError("عملیات انجام نشد، مجددا تلاش نمایید");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModalDelete(true);
        }}
        className="text-red-500 hover:text-red-400"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
      <Transition show={showModalDelete}>
        <Dialog open={showModalDelete} onClose={() => setShowModalDelete(false)} className="relative z-50">
          <TransitionChild enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-3xl">
                <DialogTitle className="p-4 md:p-5 text-center">
                  <svg className="mx-auto mb-4 text-gray-400 w-12 h-12" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <div className="mb-5 text-lg font-normal text-gray-500">آيا از حذف مقاله اطمينان داريد ؟</div>
                </DialogTitle>
                <div className="flex gap-4">
                  <button
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    onClick={() => {
                      deleteExpenseHandler();
                      setShowModalDelete(false);
                    }}
                  >
                    بله، مطمئنم
                  </button>
                  <button
                    className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                    onClick={() => setShowModalDelete(false)}
                  >
                    خير، بستن
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteExpense;
