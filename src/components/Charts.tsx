import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  getDonutOptions,
  getBarChartOptions,
  getMonthlyBarChartOptions,
  getCategoryWiseMonthlyOptions,
  getCategoryWiseMonthlyOptionsDonut,
  getCategoryWiseYearlyOptions, // ✅ NEW IMPORT
} from "@/utils/chartOptions";

interface Props {
  inflow: number;
  expense: number;
  dailyBarData: {
    categories: string[];
    inflow: number[];
    expense: number[];
  };
  monthlyBarData: {
    categories: string[];
    inflow: number[];
    expense: number[];
  };
  categoryWiseMonthlyData: {
    categories: string[];
    data: number[];
  };
  categoryWiseYearlyData: {
    categories: string[];
    data: number[];
  };
}

const Charts: React.FC<Props> = ({
  inflow,
  expense,
  dailyBarData,
  monthlyBarData,
  categoryWiseMonthlyData,
  categoryWiseYearlyData,
}) => {
  const donutOptions = getDonutOptions(inflow, expense);
  const barChartOptions = getBarChartOptions(dailyBarData);
  const monthlyBarChartOptions = getMonthlyBarChartOptions(monthlyBarData);
  const categoryWiseOptions = getCategoryWiseMonthlyOptions(
    categoryWiseMonthlyData
  );
  const categoryWiseDonutOptions = getCategoryWiseMonthlyOptionsDonut(
    categoryWiseMonthlyData
  );

  const categoryWiseYearlyOptions = getCategoryWiseYearlyOptions(
    categoryWiseYearlyData
  );

  return (
    <div className="grid grid-cols-1 gap-8 mt-2">
      {/* Donut Chart Section */}
      <div>
        <h2 className="text-2xl text-indigo-400 font-extrabold tracking-tight mb-2">
          <span className=" border-b-4">Monthly Fund Distribution</span>
        </h2>
        <p className="text-gray-400 mb-4">
          This donut chart gives a quick visual overview of how your monthly
          budget is distributed between income and expenses.
        </p>
        <div className="bg-[#111]/10 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact highcharts={Highcharts} options={donutOptions} />
        </div>
      </div>

      {/* Daily Bar Chart Section */}
      <div>
        <h2 className="text-2xl text-indigo-400 font-extrabold tracking-tight mb-2">
          <span className=" border-b-4">Daily Inflow & Expenses</span>
        </h2>
        <p className="text-gray-400 mb-4">
          This bar chart shows your daily income and spending throughout the
          current month to help you track financial trends.
        </p>
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        </div>
      </div>

      {/* Monthly Bar Chart Section */}
      <div>
        <h2 className="text-2xl text-indigo-400 font-extrabold tracking-tight mb-2">
          <span className=" border-b-4">Monthly Inflow & Expenses</span>
        </h2>
        <p className="text-gray-400 mb-4">
          This chart visualizes your inflow and expenses for each month, helping
          you compare financial performance over time.
        </p>
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact
            highcharts={Highcharts}
            options={monthlyBarChartOptions}
          />
        </div>
      </div>

      {/* Category-Wise Monthly Chart Section */}
      <div>
        <h2 className="text-2xl text-indigo-400 font-extrabold tracking-tight mb-2">
          <span className=" border-b-4">Category-Wise Monthly Expenses</span>
        </h2>
        <p className="text-gray-400 mb-4">
          This chart shows how your monthly expenses are divided across
          different categories.
        </p>
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact
            highcharts={Highcharts}
            options={categoryWiseOptions}
          />
        </div>
      </div>

      <div className="mt-10">
        <span className="text-2xl mb-2 text-indigo-400 border-b-4 font-extrabold tracking-tight">
          Category-Wise Monthly Expenses (Donut View)
        </span>
        <p className="text-gray-400 mb-4 mt-3">
          This donut chart provides a proportional view of your expenses per
          category.
        </p>
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact
            highcharts={Highcharts}
            options={categoryWiseDonutOptions}
          />
        </div>
      </div>

      {/* Category-Wise Yearly Expenses Section */}
      <div className="mt-10">
          <span className="text-2xl mb-2 text-indigo-400 border-b-4 font-extrabold tracking-tight">
            Category-Wise Yearly Expenses
          </span>
        <p className="text-gray-400 mb-4 mt-3">
          This bar chart highlights your total expenses in each category for the
          current year.
        </p>
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact
            highcharts={Highcharts}
            options={categoryWiseYearlyOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Charts;
