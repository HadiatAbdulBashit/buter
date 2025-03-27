"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { v4 as uuidv4 } from "uuid";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { INCOME_CATEGORY_COLORS } from "@/constants";

const chartConfig = {
  income: {
    label: "Income",
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
  const [incomeData, setIncomeData] = React.useState<{ category: string; total: number; fill: string }[]>([]);

  React.useEffect(() => {
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
        <ChartContainer id={id} config={chartConfig} className='mx-auto aspect-square w-full max-w-[300px]'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={incomeData}
              dataKey='total'
              nameKey='category'
              innerRadius={60}
              strokeWidth={5}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
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
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
