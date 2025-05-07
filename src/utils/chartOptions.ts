import Highcharts from "highcharts";

export const getDonutOptions = (inflow: number, expense: number): Highcharts.Options => ({
  chart: {
    type: "pie",
    backgroundColor: "transparent",
    style: {
      color: "#9CA3AF",
    },
  },
  title: {
    text: "Monthly Fund Distribution",
    style: { color: "#9CA3AF" },
  },
  plotOptions: {
    pie: {
      innerSize: "60%",
      dataLabels: {
        format: "<b>{point.name}</b>: ₹{point.y}",
        style: { color: "#9CA3AF" },
      },
    },
  },
  series: [
    {
      type: "pie",
      data: [
        { name: "Inflow", y: inflow, color: "#6366F1" },
        { name: "Expense", y: expense, color: "#F43F5E" },
      ],
    },
  ],
});

export const getBarChartOptions = (dailyBarData: {
  categories: string[];
  inflow: number[];
  expense: number[];
}): Highcharts.Options => ({
  chart: {
    type: "column",
    backgroundColor: "transparent",
    style: {
      color: "#9CA3AF",
    },
  },
  title: {
    text: "Daily Inflow & Expense – This Month",
    style: { color: "#9CA3AF" },
  },
  xAxis: {
    categories: dailyBarData.categories,
    title: { text: "Days of Month", style: { color: "#9CA3AF", fontWeight: "600" } },
    labels: { style: { color: "#9CA3AF", fontWeight: "600" } },
  },
  yAxis: {
    title: { text: "Amount (₹)", style: { color: "#9CA3AF" } },
    labels: { style: { color: "#9CA3AF" } },
  },
  tooltip: {
    shared: true,
    valuePrefix: "₹",
    style: { color: "#9CA3AF" },
  },
  legend: {
    itemStyle: {
      color: "#9CA3AF",
    },
  },
  plotOptions: {
    column: {
      pointPadding: 2.5,
      borderWidth: 0,
      pointWidth: 5,
    },
  },
  series: [
    {
      name: "Inflow",
      data: dailyBarData.inflow,
      type: "column",
      color: "#6366F1",
    },
    {
      name: "Expense",
      data: dailyBarData.expense,
      type: "column",
      color: "#F43F5E",
    },
  ],
});
