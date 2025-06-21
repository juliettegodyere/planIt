import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { Icon } from "./ui/icon";
import { Image } from "@/components/ui/image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AttachmentParam } from "./type";

const { width, height } = Dimensions.get("window");
type Prop = {
  onCancel: () => any;
  onCapture:  (attachment: AttachmentParam) => void;
};
export default function TakePhotoComponent({ onCapture, onCancel }: Prop) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);

  useEffect(() => {
    console.log("TakePhotoComponent mounted");
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
        <Button onPress={onCancel} title="Cancel" />
      </View>
    );
  }
  const takePicture = async () => {
    console.log("I got here");
    const photo = await ref.current?.takePictureAsync({ quality: 0.5 });
    console.log(photo);
    if (photo) {
      //onCapture(photo?.uri);
      onCapture({ type: 'image', data: photo?.uri });
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={ref}>
        {/* Bottom Control Bar */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            paddingVertical: 50,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <HStack className="justify-evenly items-center">
            <Pressable onPress={onCancel}>
              <Text className="text-white text-xl">Cancel</Text>
            </Pressable>
  
            <Pressable style={{ alignItems: "center" }} onPress={takePicture}>
              <View
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                  borderWidth: 5,
                  borderColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#fff",
                  }}
                />
              </View>
            </Pressable>
  
            <Pressable onPress={toggleCameraFacing}>
              <MaterialCommunityIcons size={30} name="camera-flip" color="#fff" />
            </Pressable>
          </HStack>
        </View>
      </CameraView>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: {
    width: width,
    height: height * 0.95, // or use height for full screen
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  button: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
  },
  message: { textAlign: "center", margin: 20 },
});
