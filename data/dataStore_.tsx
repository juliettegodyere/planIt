import {
    CameraIcon,
    ScanTextIcon,
    VideoIcon,
  } from "lucide-react-native";
  
  type MenuOption = {
    label: string;
    icon: any; // You can replace `any` with `IconType` if you have a better type
  };
  
  export const imageAttachmentOptions: MenuOption[] = [
    { label: "Take Photo", icon: CameraIcon },
    { label: "Scan Document", icon: ScanTextIcon },
    { label: "Photo Library", icon: VideoIcon },
  ];