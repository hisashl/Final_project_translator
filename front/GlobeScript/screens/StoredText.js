import React, { useCallback, useState, useEffect }
from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  View,
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import useCustomStyles from './parts/StyleP'; // Ajusta la ruta según necesidad './parts/StyleP';
import { Picker } from '@react-native-picker/picker';
import { useStyle } from './StyleContext'

const StoredText = ({ route  }) => {
    
    const { styler, updateStyles, theme, toggleTheme } = useStyle();
    const styles = useCustomStyles();
    const initialText = route.params.text; // Asume que 'text' es la clave correcta

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [text, setText] =  useState(initialText);  // Asumiendo que el texto se pasa como 'text' en route.params
    const [userID, setUserID] =  useState('');

    
    useEffect(() => {
      const loaduser = async () => {
        try {
          const userId = await AsyncStorage.getItem('username');
          setUserID(userId);
        } catch (error) {
          console.error('Error retrieving user ID:');
        }
      }

      loaduser();
    

    });
    const checkAndSave = async () => {
      if (title.length > 30) {
          Alert.alert("Error", "El título no puede tener más de 30 caracteres.");
          return;
      }
      if (title.length < 1) {
          Alert.alert("Error", "Ingresa un titulo valido");
          return;
      }
      if (description.length > 255) {
          Alert.alert("Error", "La descripción no puede tener más de 255 caracteres.");
          return;
      }
      console.log({userID});
      // Verificar la cantidad de documentos existentes
      try {
          const response = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/list_documents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userID })
          });
          const data = await response.json();
          
          if (!response.ok) throw new Error(data.message || "Failed to fetch documents");
  
          if (data.length >= 10) {
              Alert.alert("Error", "Ya has alcanzado el límite de 10 documentos.");
              return;
          }
  
          // Si hay menos de 10 documentos, procede a guardar el nuevo documento
          const saveResponse = await fetch('https://us-central1-lingua-80a59.cloudfunctions.net/documents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  user_id: userID,
                  title: title,
                  description: description,
                  text: text // Asumiendo que también se envía un texto
              })
          });
  
          const saveResult = await saveResponse.json();
          if (!saveResponse.ok) throw new Error(saveResult.message || "Failed to save document");
  
          Alert.alert("Éxito", "Documento guardado exitosamente!");
  
      } catch (error) {
          Alert.alert("Error", error.message || "An error occurred");
      }
  };
  
    return (
      <SafeAreaView style={[styles.safeArea]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container]}>
          
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.navBar}>
              <Text style={styles.navTitle}>Save</Text>
              <Ionicons name="save" size={30} color="#000" />
            </View>
            <View style={styles.footerMenu}>
  
            <TextInput
                style={styles.titlesave}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={theme === 'light' ? "#888" : '#fffe'}
              />
              
              
      </View>
      <View style = {styles.multilineInput}>
          
      <TextInput
                style={styles.wording}
                placeholder="Description"
                value = {description}
                onChangeText={setDescription}
                placeholderTextColor={theme === 'light' ? "#888" : '#fffe'}
                multiline
              />
        </View>
        <View style = {styles.modalView}>
          
          <TextInput
                    style={styles.wording}
                    placeholder="Text"
                    value = {text}
                    onChangeText={setText}
                    placeholderTextColor={theme === 'light' ? "#888" : '#fffe'}
                    multiline
                  />
                  </View>
                  
                <Button title="Checar y guardar" onPress={checkAndSave} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </SafeAreaView>
  
    )
  }

export default StoredText;
