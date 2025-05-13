import {Platform, View} from 'react-native'
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import {useShoppingListContext} from '../service/store'
import {setSearchQuery} from '../service/stateActions'
import { Icon, BellIcon } from "@/components/ui/icon"


export default function Notification() {
    const { state, dispatch } = useShoppingListContext();

    return (
        <Icon as={BellIcon} size="xl" color="#ffff"/>
    );
  }