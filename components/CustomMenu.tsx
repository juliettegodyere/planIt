import React from "react";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { CheckIcon, Icon } from "@/components/ui/icon";
import { ChevronsUpDownIcon } from "lucide-react-native";
import { Pressable } from "./ui/pressable";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { Key } from "@react-types/shared";
import { Button, ButtonIcon, ButtonText } from "./ui/button";

type MenuOption = {
  key: string;
  label: string;
};

type CustomMenuProps = {
  value: string;
  menuItems: string[];
  onSelect: (key: string) => void;
  text?: string
};

const CustomMenu: React.FC<CustomMenuProps> = ({ value, menuItems, onSelect, text }: CustomMenuProps) => {
    const [selected, setSelected] = React.useState<Set<Key>>(new Set([""]));

  return (
    <Menu
      placement="bottom left"
      selectionMode="single"
      selectedKeys={selected}
      offset={0}
      //className="p-1.5"
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0] as string;
        setSelected(new Set(keys));
        onSelect(selectedValue)
      }}
      closeOnSelect={true}
      trigger={({ ...triggerProps }) => {
        return (
          <Pressable {...triggerProps}>
            {/* <HStack space="sm" style={{alignItems:"center"}}>
              {text ? (
                 <Button variant="outline" className="rounded-full mt-4" style={{borderColor:"#888888"}}>
                 <ButtonText style={{color:"#888888"}}>{text}</ButtonText>
                 <ButtonIcon as={ChevronsUpDownIcon} className="ml-2" style={{color:"#888888"}}/>
               </Button>
              ):(
                <>
                <Text className="font-medium text-lg">{value}</Text> 
                <Icon as={ChevronsUpDownIcon} size="lg" /></>
              )} */}
              {/* <Text className="font-medium text-lg">{value}</Text> */}
              {/* <Text className="font-medium text-lg">{text ? text : value}</Text>
              <Icon as={ChevronsUpDownIcon} size="lg" /> */}
            {/* </HStack> */}
            <Button variant="outline" className="rounded-full" style={{borderColor:"#888888"}} {...triggerProps}>
                 <ButtonText style={{color:"#888888"}}>{value ? value : text}</ButtonText>
                 <ButtonIcon as={ChevronsUpDownIcon} className="ml-2" style={{color:"#888888"}}/>
               </Button>
          </Pressable>
        );
        
      }}
    >
      {menuItems.map((item, key) => (
        <MenuItem key={key} textValue={item} className="p-2">
          {(selected && value == item) && <Icon as={CheckIcon} size="md" />}
          <MenuItemLabel size="sm" className="ml-2 font-medium text-lg">{item}</MenuItemLabel>
        </MenuItem>
      ))}
      <MenuSeparator />
    </Menu>
  );
};

export default CustomMenu;
