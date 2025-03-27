import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { INCOME_CATEGORY_COLORS } from "@/constants";
import { useEffect, useState } from "react";

const chartConfig = {
  income: {
    label: "Income",
  },
  Business: {
    label: "Business",
    color: "#6DA3A1",
  },
  Investments: {
    label: "Investments",
    color: "#78B5B2",
  },
  "Extra income": {
    label: "Extra income",
    color: "#82C7C4",
  },
  Deposits: {
    label: "Deposits",
    color: "#8CD9D6",
  },
  Lottery: {
    label: "Lottery",
    color: "#97ECE8",
  },
  Gifts: {
    label: "Gifts",
    color: "#A3F5F1",
  },
  Salary: {
    label: "Salary",
    color: "#AEEDEC",
  },
  Savings: {
    label: "Savings",
    color: "#B9E5E6",
  },
  "Rental income": {
    label: "Rental income",
    color: "#C5DEDF",
  },
  Other: {
    label: "Other",
    color: "#D0D6D8",
  },
} satisfies ChartConfig;

export function IncomePieChart({
  selectedMonth,
  selectedYear,
  updateTrigger,
}: {
  selectedMonth: string;
  selectedYear: string;
  updateTrigger: number;
}) {
  const id = "pie-income";
  const [incomeData, setIncomeData] = useState<{ category: string; total: number; fill: string }[]>([]);

  // console.log(incomeData);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");
    const incomes = storedData.income || [];

    // Filter data sesuai bulan & tahun yang dipilih
    const filteredIncome = incomes.filter((item: any) => {
      const date = new Date(item.date);
      return (
        date.getMonth() === new Date(`${selectedMonth} 1, ${selectedYear}`).getMonth() && date.getFullYear() === parseInt(selectedYear, 10)
      );
    });

    // Kelompokkan income berdasarkan kategori
    const incomeByCategory: Record<string, number> = {};
    filteredIncome.forEach((item: any) => {
      if (!incomeByCategory[item.category]) {
        incomeByCategory[item.category] = 0;
      }
      incomeByCategory[item.category] += item.amount;
    });

    // Format data untuk PieChart
    const formattedData = Object.entries(incomeByCategory).map(([category, total]) => ({
      category,
      total,
      fill: INCOME_CATEGORY_COLORS[category] || "#d0ed57",
    }));

    setIncomeData(formattedData);
  }, [selectedMonth, selectedYear, updateTrigger]);

  const totalIncome = incomeData.reduce((acc, item) => acc + item.total, 0);

  return (
    <Card data-chart={id} className='flex flex-col'>
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className='flex-row items-start space-y-0 pb-0'>
        <div className='grid gap-1'>
          <CardTitle>Income Pie Chart</CardTitle>
          <CardDescription>
            {selectedMonth} {selectedYear}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='flex flex-1 justify-center pb-0'>
        <ChartContainer id={id} config={chartConfig} className='mx-auto aspect-square w-full max-w-full'>
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={incomeData}
              dataKey='total'
              nameKey='category'
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill='hsla(var(--foreground))'
                    className='fill-foreground'
                  >
                    {payload.total}
                  </text>
                );
              }}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 5} />
                  <Sector {...props} outerRadius={outerRadius + 12} innerRadius={outerRadius + 7} />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                        <tspan x={viewBox.cx} y={viewBox.cy} className='fill-foreground text-3xl font-bold'>
                          {totalIncome.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground'>
                          Income
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey='category' />}
              className='-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center min-w-fit'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
