import {Platform, View} from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { SearchIcon } from "@/components/ui/icon"
import {useShoppingListContext} from '../service/store'
import { useEffect, useMemo, useState } from 'react';
import { setInventoryItems } from '@/service/stateActions';
import { getAllShoppingItems } from '@/db/queries';
import { useSQLiteContext } from 'expo-sqlite';
// import {setSearchQuery} from '../service/stateActions'


export default function SearchItems() {
    const { state, dispatch } = useShoppingListContext();
    const {inventoryItems} = state
    const [searchQuery, setSearchQuery] = useState("");
    const db = useSQLiteContext();
    

    useEffect(() => {
      const fetchAndFilter = async () => {
        const data = await getAllShoppingItems(db);
        const lower = searchQuery.toLowerCase();
        const filtered = data.filter(item =>
          item.label.toLowerCase().includes(lower)
        );
        dispatch(setInventoryItems(filtered));
      };
    
      fetchAndFilter();
    }, [searchQuery]);
    console.log(searchQuery)
    return (
        <View
        style={{
          paddingTop: 50, // space for status bar
          paddingHorizontal: 16,
          paddingBottom: 10,
          backgroundColor: '#fff',
        }}
      >
        <Input size="xl" style={{ width: '100%' }}>
          <InputSlot className="pl-3">
            <InputIcon 
                as={SearchIcon} 
                
            />
          </InputSlot>
          <InputField 
            placeholder="Search..." 
            value={searchQuery}
            onChangeText={setSearchQuery}
            />
        </Input>
      </View>
    );
  }