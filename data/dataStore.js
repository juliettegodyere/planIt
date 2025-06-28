import { CameraIcon, FileIcon, FileUpIcon, ScanBarcodeIcon, ScanTextIcon, UploadCloud, VideoIcon } from "lucide-react-native";

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

  export const countries = [
    { name: "United Kingdom", currencyCode: "GBP", symbol: "£" },
    { name: "Canada", currencyCode: "CAD", symbol: "C$" },
    { name: "Nigeria", currencyCode: "NGN", symbol: "₦" },
    { name: "Germany", currencyCode: "EUR", symbol: "€" },
    { name: "Japan", currencyCode: "JPY", symbol: "¥" },
  ];

  
