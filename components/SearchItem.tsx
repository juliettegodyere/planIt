import {Platform, View} from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { SearchIcon } from "@/components/ui/icon"
import {useShoppingListContext} from '../service/store'
import {setSearchQuery} from '../service/stateActions'


export default function SearchItems() {
    const { state, dispatch } = useShoppingListContext();

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
            value={state.searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(state.searchQuery))}
            />
        </Input>
      </View>
    );
  }