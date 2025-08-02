import { CameraIcon, FileIcon, FileUpIcon, ScanBarcodeIcon, ScanTextIcon, UploadCloud, VideoIcon } from "lucide-react-native";
import { MaterialCommunityIcons, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';

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
    { label: "Bakery", value: "bakery" },
    { label: "Beverages", value: "beverages" },
    { label: "Grains & Flours", value: "grains_flours" },
    { label: "Legumes & Pulses", value: "legumes_pulses" },
    { label: "Whole Spices", value: "whole_spices" },
    { label: "Powdered Spices", value: "powdered_spices" },
    { label: "Oils", value: "oils" },
    { label: "Fresh & Frozen Items", value: "fresh_frozen" },
    { label: "Miscellaneous", value: "miscellaneous" },
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
  export const earlyReminderOptions = ["None", "5 minutes before", "I5 minutes before", "30 minutes before", "I hour before", "I day before", "2 days before", "1 week before", "2 weeks before", "I month before","6 months before", "Custom"]
  export const repeatReminderOptions = ["Never","Daily", "Weekdays", "Weekends", "Weekly", "Fortnightly", "Monthly", "Every 3 Months", "Every 6 Months", "Yearly", "Custom"]

  export const imageAttachmentOptions = [
    { label: "Take Photo", icon: CameraIcon},
    { label: "Scan Document", value: ScanTextIcon },
    { label: "Photo Lbrary", value: VideoIcon },
  ];

  export const countries = [
    { countryName: "United Kingdom", currencyCode: "GBP", currencySymbol: "£" },
    { countryName: "Canada", currencyCode: "CAD", currencySymbol: "C$" },
    { countryName: "Nigeria", currencyCode: "NGN", currencySymbol: "₦" },
    { countryName: "Germany", currencyCode: "EUR", currencySymbol: "€" },
    { countryName: "Japan", currencyCode: "JPY", currencySymbol: "¥" },
    { countryName: "United State", currencyCode: "USD", currencySymbol: "$" },
  ];


  export const MainCategoryOptions = [
    {
      label: "Grocery",
      IconName: "cart-outline",
      IconPack: Ionicons,
      color: "#10B981", // emerald-500
    },
    {
      label: "African",
      IconName: "food-variant",
      IconPack: MaterialCommunityIcons,
      color: "#8B5CF6", // violet-500
    },
    {
      label: "Chinese",
      IconName: "noodles",
      IconPack: MaterialCommunityIcons,
      color: "#F97316", // orange-500
    },
    {
      label: "Vegetables",
      IconName: "food-apple-outline",
      IconPack: MaterialCommunityIcons,
      color: "#22C55E", // green-500
    },
    {
      label: "Fruits",
      IconName: "fruit-cherries",
      IconPack: MaterialCommunityIcons,
      color: "#EF4444", // red-500
    },
    {
      label: "Drinks",
      IconName: "cup-water",
      IconPack: MaterialCommunityIcons,
      color: "#3B82F6", // blue-500
    },
    {
      label: "Snacks",
      IconName: "cookie",
      IconPack: MaterialCommunityIcons,
      color: "#F59E0B", // amber-500
    },
    {
      label: "Dairy",
      IconName: "cheese",
      IconPack: FontAwesome5,
      color: "#FBBF24", // yellow-400
    },
    {
      label: "Meat",
      IconName: "food-steak",
      IconPack: MaterialCommunityIcons,
      color: "#DC2626", // red-600
    },
    {
      label: "Household",
      IconName: "broom",
      IconPack: MaterialCommunityIcons,
      color: "#6B7280", // gray-500
    },
    {
      label: "Bakery",
      IconName: "hamburger",
      IconPack: Ionicons,
      color: "#10B981", // emerald-500
    },
    {
      label: "Beverages",
      IconName: "tea",
      IconPack: MaterialCommunityIcons,
      color: "#8B5CF6", // violet-500
    },
    {
      label: "Grains & Flours",
      IconName: "grain",
      IconPack: MaterialCommunityIcons,
      color: "#F97316", // orange-500
    },
    {
      label: "Legumes & Pulses",
      IconName: "leaf",
      IconPack: MaterialCommunityIcons,
      color: "#22C55E", // green-500
    },
    {
      label: "Whole Spices",
      IconName: "pepper-hot",
      IconPack: FontAwesome5,
      color: "#EF4444", // red-500
    },
    {
      label: "Powdered Spices",
      IconName: "grain",
      IconPack: MaterialCommunityIcons,
      color: "#3B82F6", // blue-500
    },
    {
      label: "Oils",
      IconName: "oil",
      IconPack: MaterialCommunityIcons,
      color: "#F59E0B", // amber-500
    },
    {
      label: "Fresh & Frozen Items",
      IconName: "fish",
      IconPack: MaterialCommunityIcons,
      color: "#FBBF24", // yellow-400
    },
    {
      label: "Miscellaneous",
      IconName: "food-steak",
      IconPack: MaterialCommunityIcons,
      color: "#DC2626", // red-600
    },
    {
      label: "Uncategorized",
      IconName: "category",
      IconPack: MaterialCommunityIcons,
      color: "#6B7280", // gray-500
    },
  ];

  
