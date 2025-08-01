import { Button, ButtonIcon } from "@/components/ui/button";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import {
    CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Icon,
  MenuIcon,
  ThreeDotsIcon,
} from "@/components/ui/icon";
import {Text} from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Key } from "@react-types/shared";
import { categoryOptions } from "@/data/dataStore";
import React from "react";
import { Heading } from "@/components/ui/heading";
import { VStack } from "./ui/vstack";

type CustomMenuProps = {
    onFilterBySelect: (key: string) => void;
    onSortBySelect: (key: string) => void;
    onGroupBySelect: (key: boolean) => void;
  };

export default function ThreeDotIconMenu({onFilterBySelect, onSortBySelect, onGroupBySelect}: CustomMenuProps) {
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selected, setSelected] = useState<Set<Key>>(new Set([""]));
  const [selectedValue, setSelectedValue] = useState("");
  const [sortValue, setSortValue] = useState<string>("Marked Items");
  const [filterValue, setFilterValue] = useState<string>("All");
  const [groupValue, setGroupValue] = useState<boolean>(false);

  return (
    <Menu
      offset={5}
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0] as string;
        setSelected(new Set(keys));
        setSelectedValue(selectedValue)
      }}
      trigger={({ ...triggerProps }) => (
        <Button {...triggerProps}  className="bg-transparent">
          <ButtonIcon
            as={ThreeDotsIcon}
            size="xl"
            style={{ color: "#FF6347" }}
          />
        </Button>
      )}
    >
      {/* Group By */}
      <MenuItem
        key="Group By Category"
        textValue="Group By Category"
        className="p-2 justify-between"
        onPress={() => {
            setGroupValue(prev => !prev)
            onGroupBySelect(groupValue)
        }}
      >
        <MenuItemLabel size="lg" className="font-bold">Group By Category</MenuItemLabel>
      </MenuItem>

      <MenuSeparator />

      {/* Sort By */}
      <MenuItem
        key="Sort By"
        textValue="Sort By"
        className="p-2 justify-between"
        closeOnSelect={false}
        onPress={(e) => {
          setShowSortOptions((prev) => !prev);
          setShowFilterOptions(showFilterOptions && false);
        }}
      >
        <MenuItemLabel size="md">
           <VStack>
           <Text size={sortValue ? "lg" : "md"} className="font-bold">Sort By</Text>
            {sortValue && <Text className="font-medium">      {sortValue}</Text>}
           </VStack>
        </MenuItemLabel>
        <Icon
          as={showSortOptions ? ChevronUpIcon : ChevronDownIcon}
          className="text-typography-500 m-2 w-5 h-5"
        />
      </MenuItem>

      {showSortOptions && (
        <>
          {["Alphabet", "Marked Items"].map((val) => (
            <MenuItem
                key={val}
                textValue={val}
                className="pl-5"
                onPress={() => {
                setSortValue(val);
                onSortBySelect(val)
                }}
            >
                {sortValue === val && <Icon as={CheckIcon} size="xl" className="font-medium"/>}
                <MenuItemLabel size="lg">{val}</MenuItemLabel>
            </MenuItem>
            ))}
        </>
      )}

      <MenuSeparator />

      {/* Filter By */}
      <MenuItem
        key="Filter By"
        textValue="Filter By"
        className="p-2 justify-between"
        closeOnSelect={false}
        onPress={() => {
          setShowFilterOptions((prev) => !prev);
          setShowSortOptions(showSortOptions && false);
        }}
      >
        <MenuItemLabel size="md">
        <VStack>
           <Text size={filterValue ? "lg" : "md"} className="font-bold">Filter By</Text>
            {filterValue && <Text className="font-medium">      {filterValue}</Text>}
           </VStack>
        </MenuItemLabel>
        <Icon
          as={showFilterOptions ? ChevronUpIcon : ChevronDownIcon}
          className="text-typography-500 m-2 w-5 h-5"
        />
      </MenuItem>

      {showFilterOptions && (
        <>
          {categoryOptions.map((cat, index) => (
            <React.Fragment key={index}>
              <MenuItem 
                className="pl-5" 
                key={cat.value} 
                textValue={cat.label}
                onPress={() => {
                    setFilterValue(cat.label)
                    onFilterBySelect(cat.label)
                }}
                >
              {(selected && filterValue === cat.value) && <Icon as={CheckIcon} size="md" />}
                <MenuItemLabel size="sm">{cat.label}</MenuItemLabel>
              </MenuItem>
            </React.Fragment>
          ))}
        </>
      )}

      <MenuSeparator />

      {/* <MenuItem key="Print" textValue="Print" className="p-2">
        <MenuItemLabel size="sm">Print</MenuItemLabel>
      </MenuItem> */}
    </Menu>
  );
}
