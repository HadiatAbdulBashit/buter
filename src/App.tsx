import { useState } from "react";
import { Button, buttonVariants } from "./components/ui/button";
import { ScrollArea, ScrollBar } from "./components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import FromSection from "./components/form";
import HistorySection from "./components/history";
import { useTheme } from "./contexts/theme-provider";
import { Moon, Settings, Sun } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordion";
import { DrawerDialogBudget } from "./components/drawer-dialog";
import PieChartComponent from "./components/pie-chart";
import { EXPENSE_CATEGORY_COLORS, EXPENSE_CHART_CONFIG, INCOME_CATEGORY_COLORS, INCOME_CHAR_CONFIG } from "./constants";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./components/ui/sheet";
import SettingsComponent from "./components/setting";
import { cn } from "./lib/utils";

function App() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const { setTheme } = useTheme();

  const [year, setYear] = useState<number>(currentYear);
  const [activeMonth, setActiveMonth] = useState<number>(currentMonth);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const months = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(navigator.language, { month: "long" }).format(new Date(2000, i, 1))
  );

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
        <h1 className='font-semibold text-2xl text-center mb-4 border-b-4 border-b-primary sm:border-0 sm:text-left'>
          Buter: Budget Tracker
        </h1>
        <div className='flex gap-2 items-center mb-2 sm:mb-8 justify-between'>
          {/* Months */}
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
          <div className='flex gap-2'>
            {/* Year */}
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

            {/* Theme */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className='hidden sm:flex'>
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

            {/* Setting */}
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                <Settings />
              </SheetTrigger>
              <SheetContent className='w-full sm:w-3/4'>
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>Make the app personal for you</SheetDescription>
                </SheetHeader>
                <SettingsComponent />
              </SheetContent>
            </Sheet>

            {/* Button Add Budget */}
            <div className='xl:hidden'>
              <DrawerDialogBudget setUpdateTrigger={setUpdateTrigger} />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          <div>
            <Accordion type='multiple' defaultValue={["item-1"]}>
              <AccordionItem value='item-1'>
                <AccordionTrigger>Total Income per category</AccordionTrigger>
                <AccordionContent>
                  <PieChartComponent
                    selectedMonth={activeMonth + 1}
                    selectedYear={year}
                    updateTrigger={updateTrigger}
                    selectedBudget='income'
                    chartConfigProps={INCOME_CHAR_CONFIG}
                    categoryColors={INCOME_CATEGORY_COLORS}
                  />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>Total Expense per category</AccordionTrigger>
                <AccordionContent>
                  <PieChartComponent
                    selectedMonth={activeMonth + 1}
                    selectedYear={year}
                    updateTrigger={updateTrigger}
                    selectedBudget='expense'
                    chartConfigProps={EXPENSE_CHART_CONFIG}
                    categoryColors={EXPENSE_CATEGORY_COLORS}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div>
            <HistorySection month={activeMonth + 1} year={year} updateTrigger={updateTrigger} setUpdateTrigger={setUpdateTrigger} />
          </div>
          <div className='hidden xl:block'>
            <FromSection setUpdateTrigger={setUpdateTrigger} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
