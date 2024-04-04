import React, { useState } 
from 'react';import {
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
  SafeAreaView,
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome5  } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';

import ColorPicker, { Panel3, Preview, BrightnessSlider, OpacitySlider } from 'reanimated-color-picker';

export default function EditScreen() {
  const [isEditing, setIsEditing] = useState(false); // Nuevo estado para controlar si se está editando
  const [fontSize, setFontSize] = useState(14);
  const [selectedFont, setSelectedFont] = useState('Verdana');
  const [textColor, setTextColor] = useState('#000000'); // Estado para el color del texto
  const [inputColor, setInputColor] = useState('#000000'); // Estado para el color del texto ingresado manualmente
  const [isEditingBackground, setIsEditingBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [inputBackgroundColor, setInputBackgroundColor] = useState('#FFFFFF');
 
 
  const handleCompleteColorPicker = ({ hex }) => {
    setTextColor(hex);
    setInputColor(hex);
    setIsEditing(false); // Desactivar modo edición cuando se selecciona un color
  };
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Actualizar el color del panel y de los otros componentes cuando se termine de editar
      handleCompleteColorPicker({ hex: inputColor });
    }
  };
  const handleColorInputChange = (color) => {
    // Validar y actualizar el color solo si es un código hexadecimal válido
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      setInputColor(color);
      setTextColor(color); // Esto asegura que el valor del texto y el color se actualicen
    }
  };

  const fonts = {
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
    'Calibri': require('../assets/fonts/calibri.ttf'),
    'TimesNewRoman': require('../assets/fonts/Times New Roman.ttf'),
    'Verdana': require('../assets/fonts/Verdana.ttf'),
  };

  const [fontsLoaded] = useFonts(fonts);
   // Manejador para el cambio de color desde el TextInput
   const handleTextInputColor = (hex) => {
    setInputColor(hex);
    // Opcionalmente, valida y actualiza el color del texto solo si es un hex válido
    if (/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
      setTextColor(hex);
    }
  };
  const handleCompleteBackgroundPicker = ({ hex }) => {
    setBackgroundColor(hex);
    setInputBackgroundColor(hex);
    setIsEditingBackground(false);
  };

  const toggleEditBackground = () => {
    setIsEditingBackground(!isEditingBackground);
    if (!isEditingBackground) {
      // Solo actualiza el color de fondo cuando se inicia la edición
      setInputBackgroundColor(backgroundColor);
    }
  };

   const handleBackgroundInputChange = (color) => {
    setInputBackgroundColor(color); // Actualiza siempre el color ingresado
    if (/^#[0-9A-F]{6}$/i.test(color)) {
      setBackgroundColor(color); // Solo actualiza el color de fondo si es válido
    }
  };


  if (!fontsLoaded) {
    return <View style={styles.centered}><Text>Loading...</Text></View>;
  }
 
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: backgroundColor }]}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: backgroundColor }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.navBar}>
            <Text style={styles.navTitle}>Audio</Text>
          </View>
          <View style={styles.footerMenu}>
          <Ionicons name="create" size={40} color="#000" />
            </View>
         
      <ColorPicker
          style={{ width: '60%' }}
          value={textColor}
          onComplete={handleCompleteColorPicker}
          onColorChange={({ hex }) => setTextColor(hex)} // Actualizar en tiempo real mientras se selecciona el color
        >
          {isEditing ? (
           <TextInput
           style={styles.colorInput}
           value={inputColor}
           onChangeText={handleTextInputColor}
           maxLength={7} // Longitud para el formato hexadecimal #RRGGBB
           autoCapitalize='characters' // Asegura que la entrada esté en mayúsculas
           placeholder='#RRGGBB'
         />
          ) : (
            <TouchableOpacity onPress={toggleEdit}>
              <Preview hideInitialColor={true} color={textColor} />
            </TouchableOpacity>
          )}
          
          <View style={styles.colorPickerComponent}>
            <Panel3 />
          </View>
          <View style={styles.colorPickerComponent}>
            <BrightnessSlider />
          </View>
          <OpacitySlider />
        </ColorPicker>
        <Text style={[styles.previewText, { fontFamily: selectedFont, fontSize, color: textColor }]}>
        LinguaSync: La Sincronía del Lenguaje
        </Text>
        <Text style={styles.label}>Tamaño de Fuente:</Text>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={30}
          step={1}
          value={fontSize}
          onValueChange={setFontSize}
        />
 
        <Text style={styles.label}>Selecciona la Fuente:</Text>
        <Picker
          selectedValue={selectedFont}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedFont(itemValue)}
        >
          {Object.keys(fonts).map((font) => (
            <Picker.Item key={font} label={font} value={font} />
          ))}
        </Picker>
               <Text style={styles.label}>Color de Fondo:</Text>
               <ColorPicker
          style={{ width: '60%' }}
          value={backgroundColor}
          onComplete={handleCompleteBackgroundPicker}
          onColorChange={({ hex }) => setBackgroundColor(hex)}
        >
       
          {isEditingBackground ? (
             <TextInput
             style={styles.colorInput}
             value={inputBackgroundColor}
             onChangeText={handleBackgroundInputChange}
             maxLength={7} // Longitud para el formato hexadecimal #RRGGBB
             autoCapitalize='characters' // Asegura que la entrada esté en mayúsculas
             placeholder='#RRGGBB'/>
          ) : (
            <TouchableOpacity onPress={toggleEditBackground}>
              <Preview hideInitialColor={true} color={backgroundColor} />
            </TouchableOpacity>
          )}
          <View style={styles.colorPickerComponent}>
            <Panel3 />
          </View>
          <View style={styles.colorPickerComponent}>
            <BrightnessSlider />
          </View>
          <OpacitySlider />
        </ColorPicker>

         

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
   </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  colorInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 30,
    paddingHorizontal: 60,
    marginBottom: 20, // Espacio después del TextInput
    marginTop: 20, // Espacio antes del TextInput
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
  textInput: {
    borderRadius: 10,
    padding: 16,
    backgroundColor: 'transparent',
    fontSize: 18,
    marginVertical: 20, // Espacio vertical entre los componentes
  },
  colorPickerComponent: {
    marginVertical: 20, // Agrega un margen vertical entre los componentes del ColorPicker
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footerMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20, // Espacio vertical para la vista centrada
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20, // Espacio vertical dentro del ScrollView
  },
  label: {
    marginTop: 20, // Espacio antes de cada etiqueta
    fontSize: 16,
  },
  slider: {
    width: '70%',
    marginVertical: 20, // Espacio vertical para el Slider
  },
  picker: {
    width: '70%',
    marginTop: 20, // Espacio antes del Picker
    marginBottom: 20, // Espacio después del Picker
  },
  previewText: {
    textAlign: 'center',
    marginVertical: 20, // Espacio vertical para el texto de previsualización
  },
}); 