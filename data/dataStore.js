import { CameraIcon, FileIcon, FileUpIcon, ScanBarcodeIcon, ScanTextIcon, UploadCloud, VideoIcon } from "lucide-react-native";


export const countryOptions = [
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "Canada", value: "Canada" },
    { label: "Nigeria", value: "Nigeria" },
    { label: "United State", value: "United State" },
  ];

export const currencyOptions = [
    { label: "£-GBP - British Pound", value: "£" },
    { label: "CAD$ - CAD - Canada Dallar", value: "CAD$" },
    { label: "NGN - Nigerian Naira", value: "N" },
    { label: "US$ - USD - US Dollar", value: "US$" },
  ];

  export const categoryOptions = [
    { label: "All", value: "all" },
    { label: "Grocery", value: "grocery" },
    { label: "African", value: "african" },
    { label: "Chinese", value: "chinese" },
    { label: "Vegetables", value: "vegetables" },
    { label: "Fruits", value: "fruits" },
    { label: "Drinks", value: "drinks" },
    { label: "Snacks", value: "snacks" },
    { label: "Dairy", value: "dairy" },
    { label: "Meat", value: "meat" },
    { label: "Household", value: "household" },
    { label: "Uncategorized", value: "uncategorized"},
  ];

  export const categoryLists = [
    { label: "Grocery", value: "grocery" },
    { label: "African", value: "african" },
    { label: "Chinese", value: "chinese" },
    { label: "Everyday Essentials", value: "essentials" },
  ];

  export const qtyOptions = ["None","Bag", "Packet", "Satchet", "Carton", "Box", "Bottle"]
  export const priorityOption = ["None", "Low", "Medium", "High"]

  export const imageAttachmentOptions = [
    { label: "Take Photo", icon: CameraIcon},
    { label: "Scan Document", value: ScanTextIcon },
    { label: "Photo Lbrary", value: VideoIcon },
  ];

  
