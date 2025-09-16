/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const theme = {
    colors: {
      backgroundPrimary: "#EFEFEF", // Light gray
      backgroundSecondary: "#FFFFFF", // Pure white
      fontPrimary: "#333333", // Dark for readability
      fontSecondary: "#777777", // Softer gray
      buttonPrimary: "#FF6347", //(Tomato Red): #FF6347
      buttonSecondary: "#FFC0CB", // SSecondary Color (Pink)
      iconPrimary: "#E91E63", // Pink (complements blue)
      iconSecondary: "#F48FB1", // Lighter pink
    },
    fonts: {
      regular: "Poppins-Regular", // Customize if using a specific font
      medium: "Poppins-Medium",
      bold: "Poppins-Bold",
    },
    sizes: {
      small: 12,
      medium: 16,
      large: 20,
      xLarge: 24,
    },
  };

  // Suggested Color Palette
// Primary Color (Tomato Red): #FF6347

// Secondary Color (Pink): #FFC0CB

// Accent Color (Deep Pink): #FF1493

// Neutral Background: #FFFFFF (White)

// Text Color: #333333 (Dark Gray)
