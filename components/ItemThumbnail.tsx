import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

interface ItemThumbnailProps {
  name: string;
  size?: number;
  bgColor?: string;
  textColor?: string;
}

const ItemThumbnail: React.FC<ItemThumbnailProps> = ({
  name,
  size = 40,
  bgColor = "#3498db", // default blue
  textColor = "#fff",
}) => {
  const initials = name
    .trim()
    .split(" ")
    .map(part => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2); // max 2 letters

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bgColor,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: textColor, fontWeight: "bold", fontSize: size / 2 }}>
        {initials}
      </Text>
    </View>
  );
};

export default ItemThumbnail;
