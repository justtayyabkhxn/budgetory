import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { getDonutOptions, getBarChartOptions } from "@/utils/chartOptions";

interface Props {
  inflow: number;
  expense: number;
  dailyBarData: {
    categories: string[];
    inflow: number[];
    expense: number[];
  };
}

const Charts: React.FC<Props> = ({ inflow, expense, dailyBarData }) => {
  const donutOptions = getDonutOptions(inflow, expense);
  const barChartOptions = getBarChartOptions(dailyBarData);

  return (
    <div className="grid grid-cols-1 gap-8 mt-2">
      {/* Donut Chart Section */}
      <div>
        <span className="text-2xl mb-2 text-indigo-400 border-b-4 font-extrabold tracking-tight">Monthly Fund Distribution</span>
        <p className="text-gray-400 mb-4 mt-3">
          This donut chart gives a quick visual overview of how your monthly budget is distributed
          between income and expenses.
        </p>
        <div className="bg-[#111]/10 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-1">
          <HighchartsReact highcharts={Highcharts} options={donutOptions} />
        </div>
      </div>

      {/* Bar Chart Section */}
      <div>
        <span className="text-2xl  mb-2 text-indigo-400 border-b-4 font-extrabold tracking-tight">Daily Inflow & Expenses</span>
        <p className="text-gray-400 mb-4 mt-3">
          This bar chart shows your daily income and spending throughout the current month to help
          you track financial trends.
        </p>
        <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-3">
          <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
