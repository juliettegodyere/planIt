import {Platform, View} from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import {useShoppingListContext} from '../service/store'
import {setSearchQuery} from '../service/stateActions'
import { Icon, EditIcon } from "@/components/ui/icon"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

MaterialCommunityIcons


export default function SortItem() {
    const { state, dispatch } = useShoppingListContext();

    return (
        <MaterialCommunityIcons size={25} name="sort" color="#ffff"/>
    );
  }