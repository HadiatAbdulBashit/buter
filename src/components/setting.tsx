import { useSettings } from "@/contexts/setting-context";
import { useState } from "react";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-provider";

export default function SettingsPage() {
  const { currency, setCurrency, primaryColor, setPrimaryColor, dateFormat, setDateFormat } = useSettings();
  const [customSymbol, setCustomSymbol] = useState(currency.custom ? currency.symbol : "");
  const [customCode, setCustomCode] = useState(currency.custom ? currency.code : "");
  const [isCustom, setIsCustom] = useState(currency.custom);
  const { setTheme } = useTheme();

  console.log(dateFormat);

  const currencyOptions = [
    { custom: false, symbol: "$", code: "USD" },
    { custom: false, symbol: "€", code: "EUR" },
    { custom: false, symbol: "Rp", code: "IDR" },
    { custom: true, symbol: customSymbol, code: customCode },
  ];

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = JSON.parse(e.target.value);
    console.log(selected);

    if (selected.custom) {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setCurrency(selected);
    }
  };

  const saveCustomCurrency = () => {
    setCurrency({ custom: true, symbol: customSymbol, code: customCode });
  };

  return (
    <div className='px-4'>
      <h2 className='text-xl font-semibold mb-4'></h2>

      {/* Currency Selection */}
      <div className='mb-4'>
        <Label className='mb-2'>Currency</Label>

        <Select onValueChange={(e) => handleCurrencyChange({ target: { value: e } } as any)} value={JSON.stringify(currency)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={isCustom ? "Other (Custom)" : JSON.stringify(currency)} />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((option, idx) => (
              <SelectItem key={idx} value={JSON.stringify(option)}>
                {option.custom ? "Other (Custom)" : `${option.symbol} - ${option.code}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isCustom && (
          <div className='mt-2 flex gap-2'>
            <Input type='text' placeholder='Symbol' value={customSymbol} onChange={(e) => setCustomSymbol(e.target.value)} />
            <Input type='text' placeholder='Code' value={customCode} onChange={(e) => setCustomCode(e.target.value)} />
            <Button onClick={saveCustomCurrency}>Save</Button>
          </div>
        )}
      </div>

      {/* Primary Color Picker */}
      <div className='mb-4'>
        <Label className='mb-2'>Primary Color</Label>
        <Input type='color' value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className='p-0' />
      </div>

      <div className='flex gap-2'>
        {/* Date Format Selection */}
        <div className='mb-4 flex-1'>
          <Label className='mb-2'>Date Format</Label>

          <Select onValueChange={(e) => setDateFormat(e)} value={dateFormat}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={dateFormat} />
            </SelectTrigger>
            <SelectContent>
              {["yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy"].map((date, idx) => (
                <SelectItem key={idx} value={date}>
                  {format(new Date(), date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Selection */}
        <div className='mb-4 flex-1 sm:hidden '>
          <Label className='mb-2'>Theme</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='w-full'>
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
      </div>
    </div>
  );
}
