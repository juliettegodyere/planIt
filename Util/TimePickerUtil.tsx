import React, { useState, useEffect } from 'react';
import DatePicker from 'react-native-date-picker';

export interface TimePickerUtilProps {
    value?: Date;
    onChange?: (date: Date) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    mode?: 'time';
    [key: string]: any; // Additional props like theme, locale
  }
  
  export default function TimePickerUtil({
    value,
    onChange,
    open,
    onOpenChange,
    mode = 'time',
    ...rest
  }: TimePickerUtilProps) {
    const getSafeDate = (input?: Date): Date => {
      if (!input || isNaN(input.getTime())) {
        return new Date();
      }
      return input;
    };
  
    const [localTime, setLocalTime] = useState(() => getSafeDate(value));

    useEffect(() => {
      if (value && !isNaN(value.getTime())) {
        setLocalTime(value);
      }
    }, [value]);
  
    const handleConfirm = (selectedTime: Date) => {
      setLocalTime(selectedTime);
      onChange?.(selectedTime);
      onOpenChange?.(false);
    };
  
    const handleCancel = () => {
      onOpenChange?.(false);
    };
  
    return (
      <DatePicker
        modal
        open={open ?? false}
        date={getSafeDate(value || localTime)}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        {...rest}
      />
    );
  }
