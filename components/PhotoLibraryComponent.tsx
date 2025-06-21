import { useEffect, useState } from 'react';
import { Button, Image, View, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AttachmentParam } from './type';

type Prop = {
  onPick:  (attachment: AttachmentParam) => void; // string instead of ImagePickerAsset
  onCancel: () => void;
};

export default function PhotoLibraryComponent({ onPick, onCancel }: Prop) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
        onCancel();
      } else {
        pickImage();
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        //onPick(result.assets[0].uri);
        onPick({ type: 'image', data: result.assets[0].uri });
      } else {
        onCancel();
      }
    } catch (err) {
      console.error('Error picking image:', err);
      onCancel();
    }
  };

  return (
    <View style={styles.container}>
      <Text>Loading library...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
});
