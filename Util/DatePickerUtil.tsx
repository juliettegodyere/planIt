import React, { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';

export interface DatePickerUtilProps {
    value?: string;
    onChange?: (date: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    mode?: 'date';
    [key: string]: any; 
  }
  
  export default function DatePickerUtil({
  value,
  onChange,
  open,
  onOpenChange,
  mode = 'date',
  ...rest
}: DatePickerUtilProps) {

  const [localDate, setLocalDate] = useState<Date>(() => new Date());

  useEffect(() => {
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setLocalDate(parsed);
      }
    }
  }, [value]);

  const handleConfirm = (selectedDate: Date) => {
    setLocalDate(selectedDate);
    onChange?.(selectedDate.toISOString());
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };
  return (
    <DatePicker
      modal
      open={open ?? false}
      date={localDate}
      mode={mode}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      {...rest}
    />
  )
}

