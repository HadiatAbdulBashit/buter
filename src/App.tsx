import { useState } from "react";
import { Button } from "./components/ui/button";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import FromSection from "./components/form";
import HistorySection from "./components/history";
import { useTheme } from "./components/theme-provider";
import { Moon, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { IncomePieChart } from "./components/IncomePieChart";

function App() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const { setTheme } = useTheme();

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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon'>
                <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
                <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
                <span className='sr-only'>Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <IncomePieChart selectedMonth={(activeMonth + 1).toString()} selectedYear={year.toString()} updateTrigger={updateTrigger} />
          </div>
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
