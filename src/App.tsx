import { useState } from "react";
import { Button } from "./components/ui/button";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import FromSection from "./components/form";
import HistorySection from "./components/history";

function App() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [year, setYear] = useState<number>(currentYear);
  const [activeMonth, setActiveMonth] = useState<number>(currentMonth);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const filteredMonths = year === currentYear ? months.slice(0, currentMonth + 1) : months;

  const handleYearChange = (value: string) => {
    const newYear = Number(value);
    setYear(newYear);
    if (newYear === currentYear) {
      setActiveMonth(currentMonth);
      return;
    }
    setActiveMonth(filteredMonths.length - 1);
  };

  return (
    <>
      <div className='container mx-auto py-4'>
        <h1>Monager</h1>
        <div className='flex gap-2 items-center mb-8'>
          <ScrollArea className='whitespace-nowrap overflow-hidden'>
            <div className='flex w-max space-x-2'>
              {filteredMonths.map((month, index) => (
                <Button
                  className={`capitalize shrink-0`}
                  variant={index === activeMonth ? "default" : "secondary"}
                  key={index}
                  onClick={() => setActiveMonth(index)}
                >
                  {month}
                </Button>
              ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          <Select onValueChange={handleYearChange} defaultValue={year.toString()}>
            <SelectTrigger className='w-fit'>
              <SelectValue placeholder='Pilih Tahun' />
            </SelectTrigger>
            <SelectContent>
              {[...Array(5)].map((_, i) => (
                <SelectItem key={currentYear - i} value={(currentYear - i).toString()}>
                  {currentYear - i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div>grapf</div>
          <div>
            <HistorySection month={activeMonth + 1} year={year} updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />
          </div>
          <div>
            <FromSection setUpdateTrigger={setUpdateTrigger} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
