import React from 'react';
import { Switch } from "@/components/ui/switch";

interface CustomSwitchProps {
  value: boolean;
  onToggle: () => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onToggle }) => {
  return (
    <Switch
      value={value}
      onToggle={onToggle}
      trackColor={{ false: '#F1F1F1', true: '#FF6347' }}
      thumbColor="#F1F1F1"
    />
  );
};

export default CustomSwitch;

