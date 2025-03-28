import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function AreaChartByDate({
  selectedMonth,
  selectedYear,
  updateTrigger,
}: {
  selectedMonth: number;
  selectedYear: number;
  updateTrigger: number;
}) {
  const [chartData, setChartData] = useState<{ date: string; expense: number; income: number }[]>([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");
    const expenses = storedData["expense"] || [];
    const incomes = storedData["income"] || [];

    const processData = (data: any[]) => {
      const result: Record<string, number> = {};
      data.forEach((item: any) => {
        const date = new Date(item.date);
        if (date.getMonth() === selectedMonth - 1 && date.getFullYear() === selectedYear) {
          const day = date.getDate().toString();
          result[day] = (result[day] || 0) + item.amount;
        }
      });
      return result;
    };

    const expenseData = processData(expenses);
    const incomeData = processData(incomes);

    // Format data untuk chart
    const formattedData = Array.from({ length: 31 }, (_, i) => ({
      date: (i + 1).toString(),
      expense: expenseData[i + 1] || 0,
      income: incomeData[i + 1] || 0,
    }));

    setChartData(formattedData);
  }, [selectedMonth, selectedYear, updateTrigger]);

  return (
    <Card>
      <CardContent>
        <ChartContainer
          config={{
            label: {
              label: "Budget per Tanggal",
            },
            color: {
              color: "hsl(var(--chart-1))",
            },
          }}
        >
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
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
