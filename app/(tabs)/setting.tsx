import React, {useEffect} from "react";
import { View } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { useShoppingListContext } from "@/service/store";
import CustomSelectItem from "@/components/CustomSelectItem";
import {GuestUserInfo} from "../../service/state"
import {setGuestUser} from "../../service/stateActions"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {countryOptions, currencyOptions} from "../../data/dataStore"
import {getCurrencyLabelByValue, getCurrencyByCountry} from "../../Util/HelperFunction"

export default function Settings() {
  const { state, dispatch } = useShoppingListContext();
  const { guest } = state;

  useEffect(() => {
   
  }, [getCurrencyLabelByValue, getCurrencyByCountry]);
 
  const updateGuestInfo = async (type : string, val:string) => {
    const updatedGuestUser: GuestUserInfo = {
      name: guest?.name,
      sessionId: guest?.sessionId,
      createdAt: guest?.createdAt,
      country: type === 'country'? val : '',
      currency: getCurrencyByCountry(val),
    };
  
    dispatch(setGuestUser(updatedGuestUser));
    await AsyncStorage.setItem("@guestUser", JSON.stringify(updatedGuestUser));
  };

  return (
    <Box>
      <VStack>
        <Card size="md" variant="elevated" className="m-3">
          <HStack space="md">
            <Avatar className="bg-indigo-600">
              <AvatarFallbackText className="text-white">
                {guest?.name}
              </AvatarFallbackText>
              <AvatarBadge />
            </Avatar>
            <VStack>
              <Heading size="sm">{guest?.name}</Heading>
              <Text size="sm">sessionId: {guest?.sessionId}</Text>
            </VStack>
          </HStack>
        </Card>
        <Card size="md" variant="elevated" className="m-3">
          <Heading size="md" className="mb-2">
            Location Details
          </Heading>
          <CustomSelectItem
              content={countryOptions}
              onValueChange={(val) => updateGuestInfo("country", val)}
              placeholder="Select country"
              selectedValue={guest?.country}
            />
            <Text size="sm" ></Text>
             <CustomSelectItem
              content={currencyOptions}
              onValueChange={(val) => console.log("I have been set when the country was selected")}
              placeholder="Select currency"
              selectedValue={getCurrencyLabelByValue(guest?.currency)}
            />
        </Card>
      </VStack>
    </Box>
  );
}
