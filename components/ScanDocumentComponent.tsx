import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { HStack } from './ui/hstack';
import { Pressable } from './ui/pressable';
import { AttachmentParam } from './type';
const { width, height } = Dimensions.get("window");
type Prop = {
  onScan:  (attachment: AttachmentParam) => void;
  onCancel: () => void;
};

export default function ScanDocumentComponent({ onScan, onCancel }: Prop) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedText, setScannedText] = useState<string | null>(null);
  const ref = useRef<CameraView>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

  if (!permission) {
    // Permission status is loading
    return <View><Text>Loading permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Permission not granted
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
        <Button onPress={onCancel} title="Cancel" />
      </View>
    );
  }

  async function takePictureAndScan() {
    if (ref.current && !isProcessing) {
      setIsProcessing(true);
      try {
        const photo = await ref.current.takePictureAsync({
          quality: 0.5,
          base64: false,
        });
    
        if (photo?.uri) {
          const path = photo.uri.replace('file://', '');
          // const result = await MlkitOcr.detectFromFile(path);
          //console.log("Scan result:", result);
         // const recognizedText = result.map(block => block.text).join('\n');
          // console.log("Final recognized text:", recognizedText);
          // setScannedText(recognizedText); 
  
          // Optionally process result here
          // const recognizedText = result.map(item => item.text).join('\n');
          // setScannedText(recognizedText);
         // onScan(recognizedText);
          //onScan({ type: 'text', data: recognizedText });
        } else {
          console.warn("Photo is undefined or missing URI.");
        }
      } catch (error) {
        console.error('Text recognition failed:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  }
  
  console.log("ScanDocumentComponent - main")
  return (
    <View style={styles.container}>
      <CameraView 
        ref={ref} 
        style={styles.camera} 
        facing={facing}
      >
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

          <Pressable style={{ alignItems: "center" }} onPress={takePictureAndScan}>
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

          <Pressable >
            {/* <MaterialCommunityIcons size={30} name="camera-flip" color="#fff" /> */}
          </Pressable>
        </HStack>
      </View>
      </CameraView>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={takePictureAndScan} disabled={isProcessing}>
          <Text style={styles.text}>{isProcessing ? 'Scanning...' : 'Scan Text'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {scannedText ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Recognized Text:</Text>
          <Text style={styles.resultText}>{scannedText}</Text>
        </View>
      ) : null} */}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
  },
  resultContainer: {
    padding: 10,
    backgroundColor: '#eee',
  },
  resultTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 14,
  },
});
