import Highcharts from "highcharts";

export const getDonutOptions = (
  inflow: number,
  expense: number
): Highcharts.Options => ({
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
    title: {
      text: "Days of Month",
      style: { color: "#9CA3AF", fontWeight: "600" },
    },
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

export const getMonthlyBarChartOptions = (data: {
  categories: string[];
  inflow: number[];
  expense: number[];
}) => ({
  chart: {
    type: "column",
    backgroundColor: "transparent",
  },
  title: {
    text: "Monthly Inflow & Expense – This Year",
    style: { color: "#9CA3AF" },
  },
  xAxis: {
    categories: data.categories,
    crosshair: true,
    labels: {
      style: {
        color: "#fff",
      },
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "Amount",
      style: {
        color: "#fff",
      },
    },
    labels: {
      style: {
        color: "#fff",
      },
    },
  },
  legend: {
    itemStyle: {
      color: "#fff",
    },
  },
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
  series: [
    {
      name: "Inflow",
      data: data.inflow,
      color: "#4ade80", // green
    },
    {
      name: "Expense",
      data: data.expense,
      color: "#f87171", // red
    },
  ],
});


export const getCategoryWiseMonthlyOptions = (
  categoryWiseMonthlyData: {
    categories: string[];
    data: number[];
  }
) => ({
  chart: {
    type: 'column',
    backgroundColor: 'transparent'
  },
  title: {
    text: 'Spending by Category - This Month',
    style: { color: '#ccc' }
  },
  xAxis: {
    categories: categoryWiseMonthlyData.categories,
    labels: { style: { color: '#ccc' } }
  },
  yAxis: {
    min: 0,
    title: {
      text: 'Amount Spent',
      style: { color: '#ccc' }
    },
    labels: { style: { color: '#ccc' } }
  },
  legend: {
    itemStyle: {
      color: '#ccc',
    }
  },
  series: [
    {
      name: 'Expenses',
      data: categoryWiseMonthlyData.data,
      type: 'column',
      color: '#46d212'
    }
  ],
  plotOptions: {
    column: {
      pointPadding: 0.2,
      borderWidth: 0,
    },
  },
});


export const getCategoryWiseMonthlyOptionsDonut = ({
  categories,
  data,
}: {
  categories: string[];
  data: number[];
}): Highcharts.Options => {
  const donutCategoryData = categories.map((category, idx) => ({
    name: category,
    y: data[idx],
  }));

  return {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: "Category-wise Monthly Expenses",
      style: {
        color: "#ffffff",
        fontSize: "18px",
      },
    },
    tooltip: {
      pointFormat: "<b>{point.y:.2f}</b> ({point.percentage:.1f}%)",
    },
    plotOptions: {
      pie: {
        innerSize: "60%", // donut look
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f}%",
          style: {
            color: "#ffffff",
          },
        },
      },
    },
    series: [
      {
        data: donutCategoryData,
        type: "pie",
      },
    ],
    credits: {
      enabled: false,
    },
  };
};
