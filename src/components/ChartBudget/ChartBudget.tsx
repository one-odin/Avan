import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { EyeIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import Card from "../Card/Card";
import { BudgeListType } from "../../data.type";

type ChartBudgetPropType = {
  allBudget: BudgeListType[];
};

const ChartBudget: React.FC<ChartBudgetPropType> = ({ allBudget }): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const chartOptions: ApexOptions = {
    chart: {
      id: "gradient-area",
      toolbar: {
        show: false, // Hide the toolbar
      },
      fontFamily: "iranyekanBakh",
    },
    xaxis: {
      categories: allBudget.map((item) => dayjs(item.date).calendar("jalali").locale("fa").format("YYYY-MM-DD")),
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0,
      },
    },
    fill: {
      type: "gradient", // Use gradient fill
      gradient: {
        type: "vertical", // Linear gradient
        gradientToColors: ["#9333EA", "#3B82F6"],
        shadeIntensity: 0.5,
        opacityFrom: 0.5,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
  };

  const chartSeries = [
    {
      name: "موجودی (دلار)",
      data: allBudget.map((item) => item.amount),
      dataLabels: {
        enabled: false, // Hide data point labels
      },
      stroke: {
        curve: "smooth", // Make the area smooth
      },
    },
  ];

  return (
    <>
      <Card title="نمودار" description="وضعیت موجودی">
        <button
          onClick={() => {
            setShowModal(true);
          }}
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:from-blue-400 hover:to-purple-500"
        >
          <EyeIcon className="inline-block h-6 w-6" />
        </button>
      </Card>

      <Transition show={showModal}>
        <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50 w-screen">
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
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-8 rounded-3xl w-screen">
                <DialogTitle className="text-center">
                  <div className="font-bold text-center text-xl text-transparent bg-clip-text bg-gradient-to-r to-blue-500 from-purple-600">نمودار وضعیت موجودی</div>
                </DialogTitle>
                <div className="text-right">
                  <Chart options={chartOptions} series={chartSeries} type="area" className="w-full" />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ChartBudget;
