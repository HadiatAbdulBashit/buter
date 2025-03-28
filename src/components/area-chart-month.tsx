import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function AreaChartByMonth({ selectedYear, updateTrigger }: { selectedYear: number; updateTrigger: number }) {
  const [chartData, setChartData] = useState<{ month: string; expense: number; income: number }[]>([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");
    const expenses = storedData["expense"] || [];
    const incomes = storedData["income"] || [];

    const processData = (data: any[]) => {
      const result: Record<number, number> = {};
      data.forEach((item: any) => {
        const date = new Date(item.date);
        if (date.getFullYear() === selectedYear) {
          const month = date.getMonth();
          result[month] = (result[month] || 0) + item.amount;
        }
      });
      return result;
    };

    const expenseData = processData(expenses);
    const incomeData = processData(incomes);

    const formattedData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      expense: expenseData[i] || 0,
      income: incomeData[i] || 0,
    }));

    setChartData(formattedData);
  }, [selectedYear, updateTrigger]);

  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={{
            label: {
              label: "Budget per month",
            },
            color: {
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id='fillExpense' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#d50000' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#d50000' stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id='fillIncome' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#78b5b2' stopOpacity={0.8} />
                <stop offset='95%' stopColor='#78b5b2' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area dataKey='expense' type='monotone' fill='url(#fillExpense)' stroke='#d50000' />
            <Area dataKey='income' type='monotone' fill='url(#fillIncome)' stroke='#78b5b2' />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
