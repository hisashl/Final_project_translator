import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity,TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Button, Image,Text, Alert, Animated, Easing } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import CheckBox from '@react-native-community/checkbox';
import Highlighter from 'react-native-highlight-words';
import languageOptions from '../lenguajes.json';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Camera, FlashMode } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native'; 
import {firebase} from '../config';
import styles from './parts/StyleP';
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


const PhotoScreen = ({ route  }) => {
  
  const [showWarning, setShowWarning] = useState(true);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [heartColor, setHeartColor] = useState('#D3D3D3');
  const [image, setImage] = useState(null);
  const [imageVisible, setImageVisible] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState();
  const [targetLanguage, setTargetLanguage] = useState();
  const [textToTranslate, setTextToTranslate] = useState('Introduce algo');
  const [translatedText, setTranslatedText] = useState('');
  const [definition, setDefinition] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const MAX_SIZE = 30 * 1024 * 1024; 


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
  


  useEffect(() => {
    // Carga de imágenes
    const loadImages = async () => {
      await ensureDirExist();
      const files = await FileSystem.readDirectoryAsync(imgDir);
      if (files.length > 0) {
        setImage(files.map(f => imgDir + f)[0]); // Solo muestra la primera imagen
      }
    };
    loadImages(); 
    if (route.params?.data) {
      animateText(route.params.data);
     
    }
  }, [route.params?.data]);
    
    

  const handleImagePress = () => {
    setImageVisible(false);
    
  };
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

  
  const callCloudFunction = async (word) => {
    try {
     
      const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word }),
      });
      const data = await response.json();
      console.log('Cloud function response:', data);
      setDefinition(data.significados);
      setSynonyms(data.sinonimos);
    } catch (error) {
      console.error('Error calling cloud function:', error);
    }
    setModalVisible(!modalVisible);
  };















  const [isEditing, setIsEditing] = useState(false);
  
  const [searchWord, setSearchWord] = useState('');

  const [search, setSearch] = useState('');

  const [searcht, setSearcht] = useState('');

  const [found, setFound] = useState(true);

  const handlePress = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };
 

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
  
    return (
      <Text>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ?
            <Text key={index} style={styles.highlightedText}>{part}</Text> :
            <Text key={index}>{part}</Text>
        )}
      </Text>
    );
  };
  const check = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    const hasHighlight = parts.some((part) => part.toLowerCase() === highlight.toLowerCase());
  
    console.log(`Checking if "${highlight}" is in "${text}": ${hasHighlight}`);
  
    return hasHighlight;
  };
  
 
  
  const searchtrans = () => {
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
  }; 
  const handleSearchInput = async () => {
    const foundInOriginalText = check(textToTranslate, search);
    if (foundInOriginalText ===  false){
      Alert.alert('No se encontró ', `"${search}" no se encontró en el texto original.`);
      return;
    }
    setSearchWord(search);
    console.log(`Found in original text: ${foundInOriginalText}`);
  
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
  
    const translatedTextres = await translateText(search, targetLanguage);
    console.log(`Translated text: ${translatedTextres}`);
  
    if (translatedTextres) {
      const foundInTranslatedText = check(translatedText, translatedTextres);
      console.log(`Found in translated text: ${foundInTranslatedText}`);
  
      if (!foundInTranslatedText) {
        Alert.alert('No se encontró ', `"${translatedTextres}" no se encontró en el texto traducido.`);
      } else {
        setSearcht(translatedTextres);
      }
    }
  };
  
  
  const handleSearchTrans = async () => {
    const foundInOriginalText = check(translatedText, search);
     
    if (foundInOriginalText ===  false){
      Alert.alert('No se encontró ', `"${search}" no se encontró en el texto original.`);
      return;
    }
    setSearcht(search);
    setSearchWord(searcht);
    searchtrans();
    
    if (!sourceLanguage || !targetLanguage) {
      Alert.alert('Error', 'Por favor, selecciona los idiomas de origen y destino.');
      return;
    }
  
    const translatedWord = await translateText(search, sourceLanguage); // Traduce la palabra del idioma de destino al idioma de origen
    console.log(`Translated word back to source language: ${translatedWord}`);
  
    if (translatedWord) {
      const foundInOriginalText = check(textToTranslate, translatedWord); // Verifica si la palabra traducida inversa se encuentra en el texto original
      console.log(`Found in original text: ${foundInOriginalText}`);
  
      if (!foundInOriginalText) {
        Alert.alert('No se encontró la palabra', `La palabra "${translatedWord}" no se encontró en el texto original.`);
      } else {
        setSearchWord(translatedWord); // Subraya la palabra en el texto original
      }
    }
  };
  
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.navBar}>
            <Text style={styles.navTitle}>Traducir</Text>
            <Ionicons name="search-outline" size={24} color="gray" onPress={() => setShowSearch(!showSearch)} />
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
          </View>
          
          {showSearch && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.textInput}
                onChangeText={setSearch}
                value={search}
                placeholder="Buscar palabra"
              />
             <Text style={styles.searchButton} onPress={handleSearchInput}>
              Buscar input
            </Text>
            <Text style={styles.searchButton} onPress={handleSearchTrans}>
              Buscar trans
            </Text>
            </View>
          )}

  
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
            
 
          <View>
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            onChangeText={setTextToTranslate}
            value={textToTranslate}
            multiline
            autoFocus
            onBlur={handleSave}
          />
        ) : (
          <TouchableWithoutFeedback onPress={handlePress}>
            <View>
              <Text style={styles.textInput}>
                {getHighlightedText(textToTranslate, searchWord)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

  
            <TouchableOpacity style={styles.translateButton} onPress={handleTranslation} disabled={isTranslating}>
              {isTranslating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="language" size={24} color="white" />
              )}
            </TouchableOpacity>
  
            <Text style={styles.translatedText}>
                {getHighlightedText(translatedText, searcht)}
            </Text>
  
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>"Sinonimos: " {synonyms} </Text>
                  <Text style={styles.modalText}>"Definición: " {definition} </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={styles.textStyle}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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

export default PhotoScreen;   
 
 