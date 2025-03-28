import { useState } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import FormSection from "./form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ScrollArea } from "./ui/scroll-area";
import { PlusIcon } from "lucide-react";

export function DrawerDialogBudget({ setUpdateTrigger }: { setUpdateTrigger: React.Dispatch<React.SetStateAction<number>> }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add Budget</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader className='hidden'>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {/* Tambahkan ScrollArea di dalam DialogContent */}
          <ScrollArea className='max-h-[80vh] overflow-y-auto p-2'>
            <FormSection setUpdateTrigger={setUpdateTrigger} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild className='fixed bottom-4 right-1/2 translate-x-1/2 z-20'>
        <Button className='p-2 h-fit'>
          <PlusIcon className='w-8! h-8!' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* Tambahkan ScrollArea di dalam DrawerContent */}
        <ScrollArea className='max-h-[80vh] overflow-y-auto'>
          <DrawerHeader className='hidden'>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className='container mx-auto max-w-sm'>
            <FormSection setUpdateTrigger={setUpdateTrigger} />
          </div>
          <DrawerFooter className='pt-2 container mx-auto max-w-sm'>
            <DrawerClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
