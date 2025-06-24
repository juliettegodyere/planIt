// components/CustomSelect.tsx

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  placeholder?: string;
  value?: string;
  onValueChange: (val: string) => void;
  options: SelectOption[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  placeholder = "Select option",
  value,
  onValueChange,
  options,
}) => {
  return (
    <Select selectedValue={value} onValueChange={onValueChange}>
      <SelectTrigger variant="outline" size="md">
        <SelectInput placeholder={placeholder} />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              label={option.label}
              value={option.value}
              isDisabled={option.disabled}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default CustomSelect;
