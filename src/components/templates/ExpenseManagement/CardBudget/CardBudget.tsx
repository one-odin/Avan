import React, { useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import * as yup from "yup";
import { Formik } from "formik";
import Card from "../../../modules/Card/Card";
import { showToastSuccess } from "../../../../utils/ShowToast";
import { BudgeListType } from "../../../../data.type";
import dayjs from "dayjs";

type CardBudgetProp = {
  getAllBudge: () => Promise<void>;
  currentBudget: number;
};

const CardBudget: React.FC<CardBudgetProp> = ({ getAllBudge, currentBudget }): JSX.Element => {
  const [showModalBudget, setShowModalBudget] = useState<boolean>(false);

  // validation input from
  const inputValidationSchema = yup.object().shape({
    amount: yup.string().min(0, "حداقل باید 0 باشد").required("وارد کردن مبلغ الزامیست"),
  });

  //initial value for Formik
  const initialValues: BudgeListType = { amount: 0 };

  const addBudgetHandler = async (values: BudgeListType): Promise<void> => {
    const newItem: BudgeListType = {
      date: dayjs().format("YYYY-MM-DD"),
      amount: currentBudget + values.amount,
    };

    const res = await fetch("http://localhost:3000/budget", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    if (res.status === 201) {
      showToastSuccess("مبلغ بودجه به روز گردید");
      getAllBudge();
      setTimeout(() => {
        setShowModalBudget(false);
      }, 1000);
    }
  };

  return (
    <>
      <Card count={currentBudget} description="موجودی کیف پول">
        <button
          onClick={() => {
            setShowModalBudget(true);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:from-blue-400 hover:to-purple-500"
        >
          <PlusCircleIcon className="inline-block h-6 w-6" />
        </button>
      </Card>
      <Transition show={showModalBudget}>
        <Dialog open={showModalBudget} onClose={() => setShowModalBudget(false)} className="relative z-50">
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
                  <div className="font-bold text-center text-xl text-transparent bg-clip-text bg-gradient-to-r to-blue-500 from-purple-600">افزایش موجودی</div>
                </DialogTitle>
                <div className="text-right">
                  <Formik
                    validationSchema={inputValidationSchema}
                    initialValues={initialValues}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={(values) => {
                      addBudgetHandler(values);
                    }}
                  >
                    {(props) => {
                      return (
                        <form onSubmit={props.handleSubmit} dir="rtl">
                          <div className="mb-5">
                            <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-600">
                              مبلغ مدنظر
                            </label>
                            <input
                              className={`border ${
                                props.touched.amount && Boolean(props.errors.amount) && "border-red-500"
                              } border-gray-300 text-gray-600 text-sm rounded-lg focus:ring-gray-50 focus:border-gray-50 block w-full p-2.5`}
                              type="number"
                              id="amount"
                              placeholder="مبلغ مدنظر را وارد نمایید"
                              {...props.getFieldProps("amount")}
                            />
                            {props.touched.amount && props.errors.amount && <div className="invalid-feedback mt-1 text-sm font-light text-red-500">{props.errors.amount}</div>}
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
                              onClick={() => setShowModalBudget(false)}
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

export default CardBudget;
