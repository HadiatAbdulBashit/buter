import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useSettings } from "@/contexts/setting-context";
import { formatCurrency } from "@/lib/utils";

interface HistorySectionProps {
  month: number;
  year: number;
  updateTrigger: number;
  setUpdateTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const HistorySection = ({ month, year, updateTrigger, setUpdateTrigger }: HistorySectionProps) => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { currency, dateFormat } = useSettings();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");

    if (!storedData.income) storedData.income = [];
    if (!storedData.expense) storedData.expense = [];

    const allData = [...storedData.income, ...storedData.expense]
      .filter((item) => {
        const itemDate = parseISO(item.date);
        return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredData(allData);
  }, [month, year, updateTrigger]);

  const handleDelete = (id: string, type: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete transaction?`);
    if (!confirmDelete) return;

    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");
    if (!storedData[type]) return;

    storedData[type] = storedData[type].filter((item: any) => item.id !== id);

    localStorage.setItem("budgetData", JSON.stringify(storedData));

    toast.success("Transaction deleted");

    setUpdateTrigger((prev) => prev + 1);
  };

  return (
    <>
      <h2 className='text-xl font-semibold mb-4 text-center'>History for {format(new Date(year, month - 1), "MMMM yyyy")}</h2>

      {filteredData.length > 0 ? (
        <div className='grid gap-2'>
          {filteredData.map((item, index) => (
            <Card
              key={index}
              className={`p-4 border gap-4 flex-row border-l-4 md:border-l-8 ${
                item.type === "income" ? "border-l-income" : "border-l-expense"
              }`}
            >
              <div className='grow'>
                <CardContent className='p-0'>
                  <div className='flex justify-between'>
                    <CardTitle className='text-lg font-semibold'>{item.category}</CardTitle>
                    <p className={`font-bold ${item.type === "income" ? "text-income" : "text-expense"}`}>
                      {item.type === "income" ? "+ " : "- "} {formatCurrency(item.amount, currency.symbol)}
                    </p>
                  </div>
                  <div className='flex justify-between items-end gap-2'>
                    <div>
                      <p className='text-gray-500'>Date: {format(parseISO(item.date), dateFormat)}</p>
                      {item.note && <p className='text-gray-500'>Note: {item.note}</p>}
                    </div>
                    <Button variant={"outline"} onClick={() => handleDelete(item.id, item.type)} className='p-1'>
                      <Trash2 className='h-5 w-5' />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className='text-gray-500 text-center'>No transactions found for this month.</p>
      )}
    </>
  );
};

export default HistorySection;
