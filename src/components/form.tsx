import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { EXPENSE_CATEGORY, INCOME_CATEGORY } from "@/constants";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be greater than zero"),
  date: z.date(),
  note: z.string().optional(),
});

const FormSection = ({ setUpdateTrigger }: { setUpdateTrigger: React.Dispatch<React.SetStateAction<number>> }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "income",
      category: "Bills",
      amount: 0,
      date: new Date(),
      note: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setTimeout(() => {
      const storedData = JSON.parse(localStorage.getItem("budgetData") || "{}");

      const newData = {
        id: uuidv4(), // 🆕 Tambahkan ID unik
        ...data,
        date: data.date.toISOString(), // Simpan sebagai string ISO agar kompatibel
      };

      // Pastikan ada kategori untuk income dan expense
      if (!storedData.income) storedData.income = [];
      if (!storedData.expense) storedData.expense = [];

      // Tambahkan data baru berdasarkan tipe
      storedData[data.type].push(newData);

      // Simpan kembali ke localStorage
      localStorage.setItem("budgetData", JSON.stringify(storedData));

      toast.success("Budget added successfully");

      setUpdateTrigger((prev) => prev + 1);
      setIsLoading(false);
    }, 1);
  };

  useEffect(() => {
    const type = form.watch("type");
    const newCategory = type === "income" ? INCOME_CATEGORY[0] : EXPENSE_CATEGORY[0];
    form.setValue("category", newCategory);
  }, [form.watch("type")]);

  return (
    <>
      <h2 className='text-xl font-semibold text-center mb-4'>Add Budget</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Type Selection with Cards */}
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <div className='grid grid-cols-2 gap-4'>
                  <Card
                    className={cn(
                      "w-full py-2 cursor-pointer border-2 transition-all",
                      field.value === "income" ? "border-green-500" : "border-gray-300"
                    )}
                    onClick={() => field.onChange("income")}
                  >
                    <CardContent className={`text-center transition-transform font-semibold ${field.value === "income" && " scale-125"}`}>
                      Income
                    </CardContent>
                  </Card>

                  <Card
                    className={cn(
                      "w-full py-2 cursor-pointer border-2 transition-all",
                      field.value === "expense" ? "border-red-500" : "border-gray-300"
                    )}
                    onClick={() => field.onChange("expense")}
                  >
                    <CardContent className={`text-center transition-transform font-semibold ${field.value === "expense" && " scale-125"}`}>
                      Expense
                    </CardContent>
                  </Card>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={field.value || "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(form.watch("type") === "income" ? INCOME_CATEGORY : EXPENSE_CATEGORY).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <div className='relative'>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter amount'
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className='peer pe-12 ps-6'
                    />
                  </FormControl>
                  <span className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
                    $
                  </span>
                  <span className='pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50'>
                    USD
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date Picker */}
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note */}
          <FormField
            control={form.control}
            name='note'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder='Add a note' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading && <span className='loader'></span>} Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default FormSection;
