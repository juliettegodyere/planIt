import React from "react";
import { Button, ButtonText } from "./ui/button";

type ShoppingButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: "solid" | "outline";
  color?: string;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
};

const ShoppingButton: React.FC<ShoppingButtonProps> = ({
  label,
  onPress,
  variant = "solid",
  color = "#FF6347",
  size = "md",
  rounded = true,
}) => {
  const isSolid = variant === "solid";

  return (
    <Button
      variant={variant}
      size={size}
      onPress={onPress}
      className={rounded ? "rounded-full" : ""}
      style={{
        borderColor: isSolid ? color : "#888888",
        borderWidth: isSolid ? 0 : 1,
        backgroundColor: isSolid ? color : "transparent",
      }}
    >
      <ButtonText
        style={{
          color: isSolid ? "#fff" : "#888888",
        }}
      >
        {label}
      </ButtonText>
    </Button>
  );
};

export default ShoppingButton;
