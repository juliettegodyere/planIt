import {Platform, View} from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import {useShoppingListContext} from '../service/store'
import {setSearchQuery} from '../service/stateActions'
import Ionicons from "@expo/vector-icons/Ionicons";


export default function MyLocation() {
    const { state, dispatch } = useShoppingListContext();

    return (
        <Ionicons size={25} name="location-outline" color="#ffff"/>
    );
  }