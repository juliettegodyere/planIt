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
import { Box } from "./ui/box";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectItemProps {
  content: SelectOption[]; // array of options
  onValueChange?: (value: string) => void; // optional callback
  placeholder?: string; // optional placeholder
  selectedValue?:string
}

const CustomSelectItem: React.FC<SelectItemProps> = ({
  content,
  onValueChange,
  placeholder = "Select option",
  selectedValue
}) => {
  return (
    <Box style={{ width: '100%' }} >
      <Select onValueChange={onValueChange} selectedValue={selectedValue}>
      <SelectTrigger 
        variant="outline" 
        size="xl" 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
        >
        <SelectInput
            placeholder={placeholder}
            style={{ flex: 1, textAlign: 'left' }}
          />
          <SelectIcon
            as={ChevronDownIcon}
            style={{ marginLeft: 6 }}
          />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {content.map((item) => (
            <SelectItem
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
    </Box>
  );
};
export default CustomSelectItem;
