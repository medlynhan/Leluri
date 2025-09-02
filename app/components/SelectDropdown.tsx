import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface SelectDropdownProps {
  options: {
    id: string,
    name: string
  }[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "w-[200px]"
}: SelectDropdownProps) {
  
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={`${className} justify-between`}>
          {value
            ? options.find((o) => o.id === value)?.name
            : placeholder}
          <span className="ml-2">▾</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
      className={`${className} p-2`}
      style={{ width: "var(--radix-popover-trigger-width)" }}>
        <div className="flex flex-col">
          {options.map((option) => (
            <div
              key={option.id}
              className="p-2 rounded-md cursor-pointer hover:bg-[var(--light-grey)]"
              onClick={() => {
                onChange(option.id)
                setOpen(false)
              }}
            >
              {option.name}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default SelectDropdown