import { View, FlatList, StyleSheet } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

type Props = {
  noteInput: string;
  handleChange: (text: string) => void;
};

const NoteComponent = ({
  noteInput,
  handleChange,
}: Props) => {
  return (
    <HStack
      space="sm"
      style={{
        alignItems: "center",
      }}
      className="my-5"
    >
      <Input size="lg" variant="underlined" style={{ flex: 1 }}>
        <InputField
          placeholder="Note"
          value={noteInput}
          onChangeText={handleChange}
          className="font-medium text-lg"
        />
      </Input>
    </HStack>
  );
};
export default NoteComponent;

const styles = StyleSheet.create({});
