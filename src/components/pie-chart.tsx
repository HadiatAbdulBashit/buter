import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

export default function PieChartComponent({
  selectedMonth,
  selectedYear,
  updateTrigger,
  selectedBudget,
  chartConfigProps,
  categoryColors,
}: {
  selectedMonth: number;
  selectedYear: number;
  updateTrigger: number;
  selectedBudget: string;
  chartConfigProps: ChartConfig;
  categoryColors: Record<string, string>;
}) {
  const id = `pie-${selectedBudget}`;
  const [budgetData, setBudgetData] = useState<{ category: string; total: number; fill: string }[]>([]);
  const chartConfig = chartConfigProps satisfies ChartConfig;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");
    const budgets = storedData[selectedBudget] || [];

    // Filter data sesuai bulan & tahun yang dipilih
    const filteredBudget = budgets.filter((item: any) => {
      const date = new Date(item.date);
      return date.getMonth() === selectedMonth - 1 && date.getFullYear() === selectedYear;
    });

    // Kelompokkan budget berdasarkan kategori
    const budgetByCategory: Record<string, number> = {};
    filteredBudget.forEach((item: any) => {
      if (!budgetByCategory[item.category]) {
        budgetByCategory[item.category] = 0;
      }
      budgetByCategory[item.category] += item.amount;
    });

    // Format data untuk Component
    const formattedData = Object.entries(budgetByCategory).map(([category, total]) => ({
      category,
      total,
      fill: categoryColors[category] || "#d0ed57",
    }));

    setBudgetData(formattedData);
  }, [selectedMonth, selectedYear, updateTrigger]);

  const totalBudget = budgetData.reduce((acc, item) => acc + item.total, 0);

  return (
    <Card data-chart={id} className='flex flex-col'>
      <ChartStyle id={id} config={chartConfig} />
      <CardContent className='flex flex-1 justify-center pb-0'>
        <ChartContainer id={id} config={chartConfig} className='mx-auto aspect-square w-full max-w-full'>
          <PieChart>
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={budgetData}
              dataKey='total'
              nameKey='category'
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              label={({ payload, ...props }) => (
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
              )}
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
                          {totalBudget.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className='fill-muted-foreground capitalize'>
                          {selectedBudget}
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
