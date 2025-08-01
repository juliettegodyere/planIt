import React, { useState, useEffect } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';

export interface DatePickerUtilProps {
    value?: string;
    onChange?: (date: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    mode?: 'date';
    [key: string]: any; // Additional props like minimumDate, theme, locale
  }
  
  export default function DatePickerUtil({
  value,
  onChange,
  open,
  onOpenChange,
  mode = 'date',
  ...rest
}: DatePickerUtilProps) {

  // const [localDate, setLocalDate] = useState(new Date());
  const [localDate, setLocalDate] = useState<Date>(() => new Date());

  useEffect(() => {
    console.log("DatePickerUtil - useEffect")
    console.log(localDate)
    console.log(typeof(localDate))
    console.log(localDate instanceof Date); // true
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = new Date(value);
      console.log(parsed)
      console.log(typeof(parsed))
      if (!isNaN(parsed.getTime())) {
        setLocalDate(parsed);
      }
    }
  }, [value]);

  const handleConfirm = (selectedDate: Date) => {
    console.log("DatePickerUtil - handleConfirm")
    console.log(selectedDate)
    console.log(typeof(selectedDate))
    console.log(selectedDate instanceof Date); // true
    setLocalDate(selectedDate);
    onChange?.(selectedDate.toISOString());
    onOpenChange?.(false);
  };

  const isValidDate = (val: string) => {
    const d = new Date(val);
    return !isNaN(d.getTime());
  };

  const handleCancel = () => {
    onOpenChange?.(false);
  };
  console.log("DatePickerUtil - main")
    console.log(localDate)
    console.log(typeof(localDate))
    console.log(localDate instanceof Date); // true
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

