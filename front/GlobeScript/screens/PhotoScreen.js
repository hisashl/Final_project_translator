import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Button, Image,Text, Alert, Animated, Easing } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import languageOptions from '../lenguajes.json';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, FlashMode } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

import {firebase} from '../config';

const imgDir = FileSystem.documentDirectory + '/images/';
const ensureDirExist = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
}

const placeholder = {
  label: 'idioma',
  value: null,
  color: '#9EA0A4',
};


const PhotoScreen = () => {
  const [showWarning, setShowWarning] = useState(true);
const [dontShowAgain, setDontShowAgain] = useState(false);

  const [isTranslating, setIsTranslating] = useState(false);
  const [heartColor, setHeartColor] = useState('#D3D3D3');
  const [image, setImage] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState();
  const [targetLanguage, setTargetLanguage] = useState();
  const [textToTranslate, setTextToTranslate] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const MAX_SIZE = 30 * 1024 * 1024; // 30MB en bytes
  const showTranslationWarning = () => {
    if (showWarning && !dontShowAgain) {
      Alert.alert(
        'Advertencia',
        'Si la imagen no cumple con los requisitos de texto continuo, el resultado se puede ver afectado.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'No volver a mostrar',
            onPress: () => {
              setShowWarning(false); // No mostrar la advertencia en futuras traducciones
             
            },
          },
        ],
        { cancelable: false }
      );
      return; // Detén la ejecución de la función aquí
    }
  };
  
  
const animateText = (text) => {
  let animatedText = '';
  let index = 0;

  const intervalId = setInterval(() => {
    animatedText += text[index];
    setTextToTranslate(animatedText);
    index++;

    if (index === text.length) {
      clearInterval(intervalId);
      setIsTranslating(false); // Desactiva el estado de carga una vez que la animación haya terminado
    
    }
  }, 50); // Ajusta la velocidad de la animación según sea necesario
};
const animatetranslated = (text) => {
  let animatedText = '';
  let index = 0;

  const intervalId = setInterval(() => {
    animatedText += text[index];
    setTranslatedText(animatedText);
    index++;

    if (index === text.length) {
      clearInterval(intervalId);
      setIsTranslating(false); // Desactiva el estado de carga una vez que la animación haya terminado
    
    }
  }, 50); // Ajusta la velocidad de la animación según sea necesario
};


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
    if (showWarning && !dontShowAgain) {
      showTranslationWarning();
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

     
    if  (result && !result.cancelled && result.assets && result.assets.length > 0)  {
      if (!result.cancelled && result.assets[0].size > MAX_SIZE) {
        Alert.alert('Error', 'La imagen excede el límite de 30MB.');
        return;
      }
      setImageVisible(true);
      saveImage(result.assets[0].uri);
      console.log('Image URI from gallery:', result.assets[0].uri);
      animateText("cargando texto...");
    }
  };
  
  const selectFileFromFiles = async () => {
    if (showWarning && !dontShowAgain) {
      showTranslationWarning();
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*', // Para seleccionar solo imágenes
      copyToCacheDirectory: true, // Copia el archivo seleccionado al directorio de caché de la aplicación
    });
    
  


    if  (result && !result.cancelled && result.assets && result.assets.length > 0)  {
      if (!result.cancelled && result.assets[0].size > MAX_SIZE) {
        Alert.alert('Error', 'La imagen excede el límite de 30MB.');
        return;
      }
      setImageVisible(true);
      saveImage(result.assets[0].uri);
      console.log('Image URI from files:', result.assets[0].uri);
      animateText("cargando texto...");
    }
  };

  const takePhotoWithCamera = async () => {
    if (showWarning && !dontShowAgain) {
      showTranslationWarning();
      return;
    }
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const cameraRollPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
       result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }); 
      
  

      if  (result && !result.cancelled && result.assets && result.assets.length > 0)  { 
        if (!result.cancelled && result.assets[0].size > MAX_SIZE) {
          Alert.alert('Error', 'La imagen excede el límite de 30MB.');
          return;
        }
        setImageVisible(true);
        saveImage(result.assets[0].uri);
        console.log('Image URI from camera:', result.assets[0].uri);
        animateText("cargando texto...");
      }
    } else {
      Alert.alert('Permissions required', 'Camera and media library permissions are required to take photos');
    }
  };
  

  
  const translateText = async (text, targetLanguage) => {
    try {
      const translateApiUrl = 'https://translation.googleapis.com/language/translate/v2';
      const translateApiKey = 'AIzaSyCKwODEaYC4H8aB8maNH537gEWHjmQftAY'; // Reemplaza con tu clave de API de Google Translate
  
      const translateRequestBody = JSON.stringify({
        q: text,
        target: targetLanguage,
      });
  
      const translateResponse = await fetch(`${translateApiUrl}?key=${translateApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: translateRequestBody,
      });
  
      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        const translatedText = translateData.data.translations[0].translatedText;
        console.log('Translated text:', translatedText);
        return translatedText;
      } else {
        console.error('Translation error:', translateResponse.status, await translateResponse.text());
        return null;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return null;
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
        animateText(ErrorMessage);
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
               
                // Animar el texto detectado
               animateText(detectedText);
              
            
              
            } else {
              console.log('No text found in image.');
              Alert.alert('Error', 'No se detecto texto');
              setTextToTranslate("    ")
               
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
  //setTextToTranslate
  const handleTranslation = async () => {
    
    
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
    setIsTranslating(true);
    const translatedText = await translateText(textToTranslate, targetLanguage); // Usar el idioma de destino seleccionado por el usuario
    if (translatedText) {
      console.log('Translated text:', translatedText);
      animatetranslated(translatedText);
    }
    
  
   // Activa el estado de carga
   setIsTranslating(true);
  
  };
  


  const handleImagePress = () => {
    setImageVisible(false);
    
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.navBar}>
            <Text style={styles.navTitle}>Traducir</Text>
            <Ionicons name="settings-outline" size={24} color="black" />
          </View>
        
          <View style={styles.footerMenu}>
            <Ionicons name="images-outline" size={24} color="gray" onPress={pickImageFromGallery}/>
            <Ionicons name="camera" size={24} color="gray"  onPress={takePhotoWithCamera} />
            <Ionicons name="folder-outline" size={24} color="gray" onPress={selectFileFromFiles} />
            <Ionicons
  name="heart"
  size={24}
  color={heartColor}
  onPress={() => setHeartColor(heartColor === '#D3D3D3' ? '#FF0000' : '#D3D3D3')}
/>
 
            {/* //#ADD8E6 */}
          </View>
          
          <View style={styles.mainContainer}>
          {image && imageVisible && (
              <TouchableOpacity onPress={handleImagePress}>
                <Image source={{ uri: image }} style={styles.image} />
              </TouchableOpacity>
            )} 
            <View style={styles.languageSelectorsContainer}>
              <RNPickerSelect
                placeholder={placeholder}
                items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
                onValueChange={(value) => setSourceLanguage(value)}
                style={pickerSelectStyles}
                value={sourceLanguage}
                useNativeAndroidPickerStyle={false}
              />
              <View style={styles.arrowIconContainer}>
                <Ionicons name="arrow-forward" size={24} color="#61a5ff" />
              </View>
              <RNPickerSelect
                placeholder={placeholder}
                items={languageOptions.map(lang => ({ label: lang.name, value: lang.code }))}
                onValueChange={(value) => setTargetLanguage(value)}
                style={pickerSelectStyles}
                value={targetLanguage}
                useNativeAndroidPickerStyle={false}
              />
            
            </View>
            
            <TextInput
              style={styles.textInput}
              onChangeText={setTextToTranslate}
              value={textToTranslate}
              placeholder="Introduce el texto aquí"
              multiline
            />

            <TouchableOpacity style={styles.translateButton} onPress={handleTranslation}  disabled={isTranslating}>
              {/* <Text style={styles.translateButtonText}>Traducir</Text> */}
              {isTranslating ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Ionicons name="language" size={24} color="white" />
  )}
            </TouchableOpacity>

            <Text style={styles.translatedText}>{translatedText}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#61a5ff',
    borderRadius: 10,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    width: 130, 
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
    width: 130, // Adjust the width as needed
  },
  iconContainer: {
    top: 5,
    right: 15,
  },
};

const styles = StyleSheet.create({
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  warningText: {
    fontSize: 14,
    color: 'red',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  languageSelectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  arrowIconContainer: {
    paddingHorizontal: 10, // Adjust the padding as needed
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: 350, // Ajusta el ancho según tus necesidades
    height: 200, // Ajusta la altura según tus necesidades
    marginBottom: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  textInput: {
    fontSize: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  translateButton: {
    backgroundColor: '#1E90FF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  translateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  translatedText: {
    fontSize: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
});

export default PhotoScreen;
