import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

const CustomPriceInput = () => {
  const [value, setValue] = useState("");

  const handleChange = (text: string) => {
    // Accept only digits and dot
    //const formatted = text.replace(/[^0-9.]/g, '');
    setValue(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
       
        <TextInput
          //style={styles.input}
          value={value}
          onChangeText={handleChange}
          keyboardType="decimal-pad"
          placeholder=""
          //maxLength={10}
          onPressIn={() => console.log("Pressed in")}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    //padding: 20,
    backgroundColor: '#fff',
  },
  container: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    //paddingVertical: 10,
    minHeight: 40,
  },
  input: {
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: 'bold',
    //color: '#000',
  },
  placeholder: {
    position: 'absolute',
    top: 1,
    left: 0,
    flexDirection: 'row',
    //fontSize: 18,
  },
  pound: {
    fontWeight: 'bold',
    //color: '#000',
  },
  gray: {
    color: '#aaa',
  },
  overlay: {
    position: 'absolute',
    //top: 1,
    left: 0,
    //fontSize: 18,
  },
});

export default CustomPriceInput;
