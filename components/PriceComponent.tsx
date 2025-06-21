import { View, FlatList, StyleSheet } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

type Props = {
  priceInput:string,
  handleChange: (text: string) => void;
  handleBlur: () => void;
  handleFocus: () => void;
};

const PriceComponent = ({ priceInput, handleChange, handleBlur,  handleFocus}: Props) => {

  return (
    <HStack
      space="sm"
      style={{
        alignItems: "center",
      }}
    >
      <Input size="md" variant="underlined" style={{ flex: 1 }}>
      <InputSlot className="pr-1" >
          <Text className="font-medium text-2xl">£</Text>
        </InputSlot>
        <InputField
          placeholder=""
          value={priceInput}
          keyboardType="numeric"
          onChangeText={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="font-medium text-2xl"
        />
         <InputSlot className="pr-3" >
              <Text className="font-medium">GBP</Text>
          </InputSlot>
      </Input>
    </HStack>
  );
};
export default PriceComponent;

const styles = StyleSheet.create({});


