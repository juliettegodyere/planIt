import React from "react";
import { Platform, View } from "react-native";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { useShoppingListContext } from "../service/store";
import { setSearchQuery } from "../service/stateActions";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import CustomSelectItem from "@/components/CustomSelectItem";
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetBackdrop,
  ActionsheetVirtualizedList,
  ActionsheetSectionList,
} from "@/components/ui/actionsheet";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Heading } from "./ui/heading";
import {categoryOptions} from "../data/dataStore"

export default function FilterItem() {
  const { state, dispatch } = useShoppingListContext();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const [catVal, setCatVal] = React.useState("")
  const [priorityVal, setPriorityVal] = React.useState("")

  const handleClose = () => setShowActionsheet(false);
  console.log(catVal)
  console.log(priorityVal)

  const handleFilter = () => {
    
  }
  return (
    <>
      <AntDesignIcon
        size={25}
        name="filter"
        color="#ffff"
        onPress={() => setShowActionsheet(true)}
      />
      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[35]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent >
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="" space="lg" style={{alignItems:'stretch', width:'100%'}}>
            <Heading size="lg" className="font-bold text-center pt-2">
              Filter
            </Heading>
            <CustomSelectItem
              content={categoryOptions}
              onValueChange={(val) => setCatVal(val)}
              placeholder="Select category"
            />

            <CustomSelectItem
              content={categoryOptions}
              onValueChange={(val) => setPriorityVal(val)}
              placeholder="Select priority"
            />
             <Button size="md" variant="solid" action="primary">
              <ButtonText>Apply</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}
