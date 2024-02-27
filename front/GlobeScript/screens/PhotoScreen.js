import React, { useState, useEffect } from 'react'; // Importa useEffect
import { StyleSheet, View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const imgDir = FileSystem.documentDirectory + '/images/';
const ensureDirExist = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
}
const PhotoScreen = () => { 
  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      await ensureDirExist();
      const files = await FileSystem.readDirectoryAsync(imgDir);
      if (files.length > 0) {
        setImage(files.map(f => imgDir + f)[0]); // Solo muestra la primera imagen
      }
    };
    loadImages();
  }, []);
 
  const pickImageFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      saveImage(result.assets[0].uri);
      console.log('Image URI from gallery:', result.assets[0].uri);
    }
  };

  const saveImage = async (uri) => { // Añade el parámetro uri
    await ensureDirExist();
    const filename = new Date().getTime() + '.jpg'; // Corrige la concatenación
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest }); // Usa el parámetro uri
    setImage(dest); // Actualiza el estado de la imagen
  };
  

  const takePhotoWithCamera = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
       result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }); 
  
      if (!result.cancelled) { 
        saveImage(result.assets[0].uri);
        console.log('Image URI from camera:', result.assets[0].uri);
      }
    } else {
      Alert.alert('Permissions required', 'Camera and media library permissions are required to take photos');
    }
  };
  
  const selectFileFromFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*', // Para seleccionar solo imágenes
      copyToCacheDirectory: true, // Copia el archivo seleccionado al directorio de caché de la aplicación
    });

    if (!result.cancelled) {
      saveImage(result.assets[0].uri);
      console.log('Image URI from files:', result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select from Gallery" onPress={pickImageFromGallery} />
      <Button title="Take a Photo" onPress={takePhotoWithCamera} />
      <Button title="Select from Files" onPress={selectFileFromFiles} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});

export default PhotoScreen;
