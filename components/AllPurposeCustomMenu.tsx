import React from "react";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { CheckIcon, Icon, LinkIcon } from "@/components/ui/icon";
import { ChevronsUpDownIcon } from "lucide-react-native";
import { Pressable } from "./ui/pressable";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Key } from "@react-types/shared";

type MenuOption = {
  label: string;
  icon: any;
};

type CustomMenuProps = {
  value: string;
  menuItems: MenuOption[];
  onSelect: (key: string) => void;
};

const AllPurposeCustomMenu: React.FC<CustomMenuProps> = ({ value, menuItems, onSelect }: CustomMenuProps) => {
    const [selected, setSelected] = React.useState<Set<Key>>(new Set([""]));

  return (
    <Menu
      placement="top left"
      selectionMode="single"
      selectedKeys={selected}
      offset={5}
      className="p-1.5"
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0] as string;
        setSelected(new Set(keys));
        onSelect(selectedValue)
      }}
      closeOnSelect={true}
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps}>
            <HStack space="sm" style={{alignItems:"center"}}>
              <Icon as={LinkIcon} size="lg"  style={{color:"#FF6347"}}/>
              <Text className="font-medium text-lg" style={{color:"#FF6347"}}>{value}</Text>
            </HStack>
          </Pressable>
        );
        
      }}
    >
      {menuItems.map((item, key) => (
        <MenuItem key={key} textValue={item.label}  >
          <Icon as={item.icon} size="md"/>
          <MenuItemLabel size="sm" className="ml-4 font-medium text-lg" >{item.label}</MenuItemLabel>
        </MenuItem>
      ))}
      {/* <MenuSeparator /> */}
    </Menu>
  );
};

export default AllPurposeCustomMenu;
