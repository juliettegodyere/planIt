import {Platform, View} from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { SearchIcon, CloseCircleIcon } from "@/components/ui/icon"
import {useShoppingListContext} from '../service/store'
import { useEffect, useMemo, useRef, useState } from 'react';
import { setCatalogItems } from '@/service/stateActions';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllCatalogItems } from '@/db/EntityManager';
import { HStack } from './ui/hstack';
import { Button, ButtonText } from './ui/button';
import { Pressable } from './ui/pressable';
import { TextInput } from 'react-native';
// import {setSearchQuery} from '../service/stateActions'


export default function SearchItems() {
    const { state, dispatch } = useShoppingListContext();
    const {catalogItems} = state
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const db = useSQLiteContext();
    const inputRef = useRef<TextInput>(null);

    const showCancel = isFocused || searchQuery.length > 0;

    const handleClear = () => {
      setSearchQuery('');
      inputRef.current?.focus();
    };

    const handleCancel = () => {
      setSearchQuery('');
      setIsFocused(false);
      inputRef.current?.blur();
    };
    

    useEffect(() => {
      const fetchAndFilter = async () => {
        const data = await getAllCatalogItems(db);
        const lower = searchQuery.toLowerCase();
        const filtered = data.filter(item =>
          item.label.toLowerCase().includes(lower)
        );
        dispatch(setCatalogItems(filtered));
      };
    
      fetchAndFilter();
    }, [searchQuery]);
    return (
      <HStack
      style={{
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
      }}
    >
      <Input
        ref={inputRef}
        size="xl"
        style={{
          flex: 1,
          marginRight: showCancel ? 8 : 0,
        }}
      >
        <InputSlot className="pl-3">
          <InputIcon as={SearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() =>{
            if (searchQuery === '') {
              setIsFocused(false);
            }
          }}
        />
         {searchQuery.length > 0 && (
       <InputSlot className="pl-2">
       <Pressable
         onPress={handleClear}
         className=" mr-1 "
         style={{ justifyContent: 'center', alignItems: 'center' }}
       >
         <InputIcon as={CloseCircleIcon} size="2xs" />
       </Pressable>
     </InputSlot>
  )}
      </Input>

      {showCancel && (
        <Button size="md" variant="solid" action="primary" onPress={handleCancel}>
          <ButtonText>Cancel</ButtonText>
        </Button>
      )}
    </HStack>
    );
  }