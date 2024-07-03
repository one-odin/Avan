import { FunctionComponent, useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import * as yup from "yup";
import { Formik } from "formik";
import { showToastSuccess } from "../../utils/ShowToast";
import { ExpenseType, ExpenseCategory, BudgeListType } from "../../data.type";
import dayjs from "dayjs";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

type EditExpenseProp = {
  itemAmount: number;
  itemID: number;
  allCat: ExpenseCategory[];
  getAllExpenses: () => Promise<void>;
  getAllBudge: () => Promise<void>;
  currentBudget: number;
};

const EditExpense: FunctionComponent<EditExpenseProp> = ({ allCat, getAllExpenses, getAllBudge, currentBudget, itemID, itemAmount }): JSX.Element => {
  const [showModalEditExpense, setShowModalEditExpense] = useState<boolean>(false);
  const [dataItem, setDataItem] = useState<ExpenseType>({} as ExpenseType);

  useEffect(() => {
    fetch(`http://localhost:3000/expenses/${itemID}`)
      .then((res) => res.json())
      .then((data) => setDataItem(data));
  }, []);

  // validation input from
  const inputValidationSchema = yup.object().shape({
    amount: yup.string().min(0, "حداقل باید 0 باشد").required("وارد کردن مبلغ الزامیست"),
    description: yup.string().min(4, "حداقل باید 4 حرف باشد").required("وارد کردن توضیحات الزامیست"),
    categoryId: yup.string().required("انتخاب دسته بندی الزامیست"),
  });

  //initial value for Formik
  const initialValues: ExpenseType = { description: dataItem.description, amount: dataItem.amount, categoryId: dataItem.categoryId };

  const EditExpenseHandler = async (values: ExpenseType): Promise<void> => {
    const newItem: ExpenseType = {
      description: values.description,
      amount: values.amount,
      categoryId: values.categoryId,
    };

    const res = await fetch(`http://localhost:3000/expenses/${itemID}`, {
      method: "PUT",
      body: JSON.stringify(newItem),
    });
    if (res.status === 200) {
      getAllExpenses();
      showToastSuccess("هزینه با موفقیت ویرایش گردید");

      // calculate for new budget
      let newCurrentBudget;
      if (itemAmount > values.amount) {
        const diffAmount = itemAmount - values.amount;
        newCurrentBudget = currentBudget + diffAmount;
      } else if (itemAmount < values.amount) {
        const diffAmount = values.amount - itemAmount;
        newCurrentBudget = currentBudget - diffAmount;
      } else {
        newCurrentBudget = currentBudget;
      }

      if (itemAmount != values.amount) {
        const newItemBudget: BudgeListType = {
          date: dayjs().format("YYYY-MM-DD"),
          amount: newCurrentBudget,
        };

        const resBudget = await fetch("http://localhost:3000/budget", {
          method: "POST",
          body: JSON.stringify(newItemBudget),
        });
        if (resBudget.status === 201) {
          getAllBudge();
          setTimeout(() => {
            setShowModalEditExpense(false);
          }, 1000);
        }
      }
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModalEditExpense(true);
        }}
        className="text-blue-500 hover:text-blue-400"
      >
        <PencilSquareIcon className="h-5 w-5" />
      </button>
      <Transition show={showModalEditExpense}>
        <Dialog open={showModalEditExpense} onClose={() => setShowModalEditExpense(false)} className="relative z-50 w-screen">
          <TransitionChild enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>
          <div className="fixed inset-0 flex items-center justify-center p-2">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-3xl w-screen">
                <DialogTitle className="text-center">
                  <div className="font-bold text-center text-xl text-transparent bg-clip-text bg-gradient-to-r to-blue-500 from-purple-600">ویرایش هزینه</div>
                </DialogTitle>
                <div className="text-right">
                  <Formik
                    validationSchema={inputValidationSchema}
                    initialValues={initialValues}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={(values) => {
                      EditExpenseHandler(values);
                    }}
                  >
                    {(props) => {
                      return (
                        <form onSubmit={props.handleSubmit} dir="rtl">
                          <div className="mb-5">
                            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-600">
                              توضیحات
                            </label>
                            <textarea
                              className={`border ${
                                props.touched.description && Boolean(props.errors.description) && "border-red-500"
                              } border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5`}
                              id="description"
                              rows={3}
                              placeholder="توضیحات را وارد نمایید"
                              {...props.getFieldProps("description")}
                            />
                            {props.touched.description && props.errors.description && <div className="invalid-feedback mt-1 text-sm font-light text-red-500">{props.errors.description}</div>}
                          </div>
                          <div className="mb-5">
                            <label htmlFor="amount" className="block mb-1 text-sm font-medium text-gray-600">
                              مبلغ مدنظر (دلار)
                            </label>
                            <input
                              className={`border ${props.touched.amount && Boolean(props.errors.amount) && "border-red-500"} border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5`}
                              type="number"
                              id="amount"
                              placeholder="مبلغ مدنظر را وارد نمایید"
                              {...props.getFieldProps("amount")}
                            />
                            {props.touched.amount && props.errors.amount && <div className="invalid-feedback mt-1 text-sm font-light text-red-500">{props.errors.amount}</div>}
                          </div>
                          <div className="mb-5">
                            <label htmlFor="categoryId" className="block mb-1 text-sm font-medium text-gray-600">
                              دسته‌بندی
                            </label>
                            <select className="border border-gray-300 text-gray-600 text-sm rounded-lg block w-full p-2.5" {...props.getFieldProps("categoryId")}>
                              <option>انتخاب نمایید</option>
                              {allCat.map((item) => {
                                return (
                                  <option key={item.id} value={item.id}>
                                    {item.title}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          <div className="text-center mt-4">
                            <button
                              type="submit"
                              id="submit-button"
                              className="text-white bg-gradient-to-br from-green-400 to-green-600 hover:bg-gradient-to-b focus:ring-4 focus:outline-none focus:ring-green-200 rounded-lg text-sm px-10 py-2"
                            >
                              تایید
                            </button>
                            <button
                              className="py-2 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                              onClick={() => setShowModalEditExpense(false)}
                              type="button"
                            >
                              بستن
                            </button>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditExpense;
