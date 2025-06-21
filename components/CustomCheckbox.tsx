import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "./ui/checkbox";
import { Icon, CheckIcon, CloseIcon } from "@/components/ui/icon";

interface Props {
    value: string;
    label: string;
    isChecked: any;
    onChange:any;
    size:any;
  }

const CustomCheckbox = ({
    value,
    label,
    isChecked,
    onChange,
    size,
  }:Props) => {
    return (
      <Checkbox
        value={value}
        size={size}
        isChecked={isChecked}
        onChange={onChange}
      >
        <CheckboxIndicator
          style={{
            backgroundColor: isChecked ? "#1c1616" : "transparent",
            borderColor: isChecked ? "#000" : "#000",
            borderWidth: 1,
            borderRadius: 9999,
            width: 15,
            height: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CheckboxIcon
            color="#fff"
            as={CheckIcon}
            size="sm"
            style={{ borderWidth: 2 }}
          />
        </CheckboxIndicator>
        <CheckboxLabel className="text-xl ml-1 text-gray-900 font-medium">
          {label}
        </CheckboxLabel>
      </Checkbox>
    );
  };
  
  export default CustomCheckbox;