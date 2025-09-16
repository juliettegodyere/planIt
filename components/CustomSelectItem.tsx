import { ChevronDownIcon, ChevronRightIcon, Icon } from "@/components/ui/icon";
import { Box } from "./ui/box";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Heading } from "./ui/heading";
import { Pressable } from "./ui/pressable";
import { Button, ButtonText } from "./ui/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { guestUserType } from "@/service/types";

interface SelectItemProps {
  guestUser: guestUserType;
}

const CustomSelectItem: React.FC<SelectItemProps> = ({
  guestUser
}) => {
  const router = useRouter();

  return (
    <VStack space="sm">
      {/* Country */}
      <Pressable
        // onPress={() => {
        //   router.push({
        //     pathname: "/select-country",
        //     params: { page: page },
        //   });
        // }}
        onPress={() => {
          router.push({
            pathname: "/select-country",
            params: { page: "/setting", mode: "update", id:guestUser.id},
          });
        }}
        className="mb-5"
      >
        <HStack className="justify-between items-center">
          <Text size="lg" className="font-bold" style={{color:"#888888"}}>Country</Text>
          <HStack space="lg" className="items-center">
            <Text size="md" className="font-normal " style={{color:"#888888"}}>{guestUser ? guestUser.countryName : "Never"}</Text>
            <Icon
              as={ChevronRightIcon}
              size="lg"
              className="text-typography-100"
              style={{color:"#888888"}}
            />
          </HStack>
        </HStack>
      </Pressable>

      {/* Currency */}
      <Pressable className="mb-5">
        <HStack className="justify-between items-center">
          <Text size="lg" className="font-bold" style={{color:"#888888"}}>Currency</Text>
          <HStack space="lg" className="items-center">
            <Text size="md" className="font-normal " style={{color:"#888888"}}>{guestUser ? guestUser.currencyCode : "Never"}</Text>
            <Icon
              as={ChevronRightIcon}
              size="lg"
              className="text-typography-100"
              style={{color:"#888888"}}
            />
          </HStack>
        </HStack>
      </Pressable>

      {/* Continue Button */}
      {/* <Button
        size="sm"
        variant="outline"
        action={name ? "positive" : "negative"}
        onPress={handleGuestUserUpdate}
        style={{borderColor:"#FF6347"}}
        disabled={name && currencyCode ? true : false}
      >
        <ButtonText  style={{color:"#333333"}}>Continue</ButtonText>
      </Button> */}
    </VStack>
  );
};
export default CustomSelectItem;
