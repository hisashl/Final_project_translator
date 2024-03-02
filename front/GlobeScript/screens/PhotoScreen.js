import React, { useState, useEffect, useRef } from 'react'; // Importa useEffect
import { StyleSheet, View, Button, Image, Text, TextInput, Alert, Animated, Easing } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import {firebase} from '../config';
 

const imgDir = FileSystem.documentDirectory + '/images/';
const ensureDirExist = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
}
const PhotoScreen = () => {   
  // Funciones existentes...
  const [image, setImage] = useState(null);
    // Estados y referencias existentes...
   
    

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
  

    
  

  const saveImage = async (uri) => {
    // Asegurarse de que el directorio existe
    await ensureDirExist();
  
    // Crear un nombre de archivo único para la imagen
    const filename = new Date().getTime() + '.jpg';
    const dest = imgDir + filename;
  
    // Copiar la imagen al directorio local
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImage(dest); // Actualizar el estado de la imagen
  
    // Subir imagen a Firebase Storage
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = firebase.storage().ref().child(`images/${filename}`);
    const uploadTask = storageRef.put(blob);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Opcional: mostrar progreso de la carga
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Manejar errores de carga
        console.error('Error al subir la imagen:', error);
        Alert.alert('Error', 'Error al subir la imagen: ' + error.message);
      },
      async () => {
        // Obtener URL de la imagen subida
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log('File available at', downloadURL);
  
        // Detectar texto en la imagen usando la API de Google Cloud Vision
        try {
          const apiUrl = 'https://vision.googleapis.com/v1/images:annotate';
          const apiKey = 'AIzaSyCKwODEaYC4H8aB8maNH537gEWHjmQftAY'; // Reemplaza con tu clave de API
  
          const requestBody = JSON.stringify({
            requests: [
              {
                image: {
                  source: { imageUri: downloadURL }
                },
                features: [
                  { type: 'TEXT_DETECTION' }
                ],
              },
            ],
          });
  
          const visionResponse = await fetch(`${apiUrl}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody,
          });
  
          if (visionResponse.ok) {
            const data = await visionResponse.json();
            const textAnnotations = data.responses[0].textAnnotations;
            if (textAnnotations && textAnnotations.length > 0) {
              const detectedText = textAnnotations[0].description;
              console.log('Detected text:', detectedText);
                         
            
            } else {
              console.log('No text found in image.');
               
            }
          } else {
            console.error('Error:', visionResponse.status, await visionResponse.text());
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    );
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
      {image && (
        <Animated.Image
          source={{ uri: image }}
           
        />
      )}
 
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    minHeight: 50,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});


export default PhotoScreen;
