import { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { format, parseISO } from "date-fns";
import { DollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface HistorySectionProps {
  month: number;
  year: number;
  updateTrigger: number;
  setUpdateTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const HistorySection = ({ month, year, updateTrigger, setUpdateTrigger }: HistorySectionProps) => {
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    // Ambil data dari localStorage
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");

    if (!storedData.income) storedData.income = [];
    if (!storedData.expense) storedData.expense = [];

    // Gabungkan income & expense, lalu filter berdasarkan bulan & tahun yang diterima
    const allData = [...storedData.income, ...storedData.expense]
      .filter((item) => {
        const itemDate = parseISO(item.date);
        return itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Urutkan berdasarkan tanggal terbaru

    setFilteredData(allData);
  }, [month, year, updateTrigger]);

  // ✅ Fungsi untuk hapus item
  const handleDelete = (id: string, type: string) => {
    const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");

    if (!storedData[type]) return;

    storedData[type] = storedData[type].filter((item: any) => item.id !== id); // 🆕 Hapus berdasarkan id

    localStorage.setItem("budgetData", JSON.stringify(storedData));

    toast.success("Transaction deleted");

    setUpdateTrigger((prev) => prev + 1); // 🔥 Trigger update
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold mb-4'>History for {format(new Date(year, month - 1), "MMMM yyyy")}</h2>

      {filteredData.length > 0 ? (
        <div className='grid gap-2'>
          {filteredData.map((item, index) => (
            <Card key={index} className='p-4 border gap-4 flex-row'>
              <div>
                <div
                  className={`${
                    item.type === "income" ? "bg-green-600" : "bg-red-600"
                  } rounded-full aspect-square h-full flex items-center justify-center`}
                >
                  <DollarSign className='text-white' />
                </div>
              </div>
              <div className='grow'>
                <CardContent className='p-0'>
                  <div className='flex justify-between'>
                    <CardTitle className='text-lg font-semibold'>{item.category}</CardTitle>
                    <p className={`font-bold ${item.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {item.type === "income" ? "+ " : "- "} ${item.amount}
                    </p>
                  </div>
                  <div className='flex justify-between'>
                    <div>
                      <p className='text-gray-500'>Date: {format(parseISO(item.date), "PPP")}</p>
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
        <p className='text-gray-500'>No transactions found for this month.</p>
      )}
    </div>
  );
};

export default HistorySection;
