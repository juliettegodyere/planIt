import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Button,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { HStack } from "./ui/hstack";
import { Pressable } from "./ui/pressable";
import { Image } from "@/components/ui/image";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AttachmentParam } from "./type";
import { VStack } from "./ui/vstack";

const { width, height } = Dimensions.get("window");
type Prop = {
  onCancel: () => any;
  onCapture: (attachment: AttachmentParam) => void;
};
export default function TakePhotoComponent({ onCapture, onCancel }: Prop) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const ref = useRef<CameraView>(null);

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
    const photo = await ref.current?.takePictureAsync({ quality: 0.5 });
    if (photo && photo?.uri) {
      //onCapture(photo?.uri);
      //onCapture({ type: 'image', data: photo?.uri });
      setPreviewUri(photo.uri);
    }
  };

  const handleUsePhoto = () => {
    if (previewUri) {
      onCapture({ type: "image", data: previewUri });
      setPreviewUri(null);
      onCancel()
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {previewUri ? (
        <View style={styles.camera}>
          <VStack className="w-full flex-1 my-2">
            <Image
            source={{ uri: previewUri }}
            style={{
              resizeMode: 'cover',
            }}
            className="w-full h-full"
          />
          </VStack>
            <View style={styles.overlay}>
              <HStack className="justify-evenly items-center">
                <Pressable onPress={handleRetake}>
                  <Text style={styles.actionText}>Retake</Text>
                </Pressable>
          
                <Pressable onPress={handleUsePhoto}>
                  <Text style={styles.actionText}>Use Photo</Text>
                </Pressable>
              </HStack>
            </View>
      </View>
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={ref}>
          <View style={styles.overlay}>
            <HStack className="justify-evenly items-center">
              <Pressable onPress={onCancel}>
                <Text style={styles.actionText}>Cancel</Text>
              </Pressable>
  
              <Pressable onPress={takePicture} style={styles.captureButtonWrapper}>
                <View style={styles.captureOuter}>
                  <View style={styles.captureInner} />
                </View>
              </Pressable>
  
              <Pressable onPress={toggleCameraFacing}>
                <MaterialCommunityIcons size={30} name="camera-flip" color="#fff" />
              </Pressable>
            </HStack>
          </View>
        </CameraView>
      )}
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
  overlay: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  
  actionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  
  captureButtonWrapper: {
    alignItems: "center",
  },
  
  captureOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  
  captureInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  
});
