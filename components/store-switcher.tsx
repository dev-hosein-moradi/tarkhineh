"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, Store as StoreIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { IBranch } from "@/types";
import { useDispatch } from "react-redux";
import { clearCart, setSelectedBranch } from "@/hooks/use-cart";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: IBranch[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState("");

  const formattedItems = items?.map((item) => ({
    label: item.name,
    value: String(item.id), // Convert `item.id` to string to ensure type matching
  }));

  useEffect(() => {
    if (items.length > 0) {
      setCurrentStore(items[0].name);
      dispatch(setSelectedBranch(items[0].id));
    }
  }, [dispatch, items]);

  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    setCurrentStore(store.label);
    dispatch(clearCart());
    dispatch(setSelectedBranch(store.value));
  };

  if(!items) return <></>
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between text-center", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore || "انتخاب شعبه"}
          <ChevronsUpDown className="w-4 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput dir="rtl" placeholder="جستجو شعبه" />
            <CommandEmpty>No store found!</CommandEmpty>

            <CommandGroup dir="rtl" heading="شعبه ها">
              {formattedItems?.map((item) => (
                <CommandItem
                  key={item.value}
                  onSelect={() => onStoreSelect(item)}
                  className="text-sm"
                >
                  <StoreIcon className="ml-2 h-4 w-4" />
                  {item.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore === item.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
