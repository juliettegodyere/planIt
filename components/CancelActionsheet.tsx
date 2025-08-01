import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from "./ui/actionsheet";
import { Text } from "@/components/ui/text";
import { VStack } from "./ui/vstack";
import { Divider } from "./ui/divider";

export interface Props {
    isOpen: boolean;
    handleClose: () => void;
    handleCancel: () => void;
    text1: string;
    text2: string;
    topInfo?: string;
    subtopInfo?: string
}
const CancelActionSheet: React.FC<Props> = ({
    isOpen,
    handleClose,
    handleCancel,
    text1,
    text2,
    topInfo,
    subtopInfo
  }) => {

    return (
        <Actionsheet isOpen={isOpen} onClose={handleClose} className="bg-transparent">
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-transparent border-0">
            <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            {
                topInfo && (
                    <ActionsheetItem  className="justify-center align-middle bg-white ">
               <VStack space="md" >
                        <ActionsheetItemText className="text-center text-lg text-gray-900 font-bold">{topInfo}?</ActionsheetItemText>
                        <ActionsheetItemText className="text-center text-sm text-gray-700">{subtopInfo}</ActionsheetItemText>
                        </VStack>
            </ActionsheetItem>
                )
            }
            <Divider />
            <ActionsheetItem onPress={handleClose}  className="justify-center align-middle bg-white mb-4 ">
                <ActionsheetItemText className="text-red-600 font-medium text-2xl mb-3" >{text1}</ActionsheetItemText>
            </ActionsheetItem>

            <ActionsheetItem onPress={handleCancel}  className="justify-center align-middle bg-white mb-4">
            <ActionsheetItemText className="text-blue-600 font-medium text-xl mb-3">{text2}</ActionsheetItemText>
            </ActionsheetItem>
        </ActionsheetContent>
        </Actionsheet>

 )}

 export default CancelActionSheet

 //Handle close this action sheet