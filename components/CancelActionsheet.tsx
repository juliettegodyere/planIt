import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem } from "./ui/actionsheet";
import { Text } from "@/components/ui/text";

export interface Props {
    isOpen: boolean;
    handleClose: () => void;
    handleCancel: () => void;
    text1: string;
    text2: string;
    topInfo: string
}
const CancelActionSheet: React.FC<Props> = ({
    isOpen,
    handleClose,
    handleCancel,
    text1,
    text2,
    topInfo
  }) => {

    return (
        <Actionsheet isOpen={isOpen} onClose={handleClose} className="bg-transparent">
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-transparent border-0">
            <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem onPress={handleClose}  className="justify-center align-middle bg-white mb-4 rounded-md">
               {topInfo && (
                     <Text>{topInfo}</Text>
               )}
                <Text className="text-red-600 font-medium text-2xl mb-3" >{text1}</Text>
            </ActionsheetItem>

            <ActionsheetItem onPress={handleCancel}  className="justify-center align-middle bg-white rounded-md mb-4">
            <Text className="text-blue-600 font-medium text-xl mb-3">{text2}</Text>
            </ActionsheetItem>
        </ActionsheetContent>
        </Actionsheet>

 )}

 export default CancelActionSheet

 //Handle close this action sheet