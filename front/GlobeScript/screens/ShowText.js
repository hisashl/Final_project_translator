import React, { useRef, useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View, Alert, Text,  Button, Dimensions , TextInput, StatusBar, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import useCustomStyles from './parts/StyleP';
import { useStyle } from './StyleContext'
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
// const color =  theme === 'light' ? 'black' : 'white'
const ShowText = ({ route, navigation }) => {
  const webviewRef = useRef(null);
  const [title, setTitle] = useState(route.params?.document.title || '');
  const [description, setDescription] = useState(route.params?.document.description || '');
  const [text, setText] = useState(route.params?.document.text || '');
  const [textstyle, setTextstyle] = useState(route.params?.document.textstyle || route.params?.document.text || '');
  const initialComments = JSON.stringify(route.params?.document.comments || {});
  const [selectedText, setSelectedText] = useState('');
  const styles = useCustomStyles();
  const { styler, updateStyles, theme, toggleTheme } = useStyle();
  const color =  theme === 'light' ? 'white' : '#656A6D';
  const [webviewHeight, setWebviewHeight] = useState(Dimensions.get('window').height - 200); // Ajusta el tamaño según sea necesario
  const [selectedColor, setSelectedColor] = useState('#FFFF00'); // Default to yellow
const [modalVisible, setModalVisible] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const { width, height } = Dimensions.get('window');
  const handleDownload = async () => {
    const fileUri = `${FileSystem.documentDirectory}${title.replace(/\s+/g, '_') || 'document'}.txt`;

    try {
      await FileSystem.writeAsStringAsync(fileUri, selectedText || text, { encoding: FileSystem.EncodingType.UTF8 });

      if (Platform.OS === 'ios') {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('No se puede compartir', 'El dispositivo no admite el sistema de compartir');
        }
      } else {
        Alert.alert('Descargado', `Archivo guardado en: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo descargar el archivo. Intenta nuevamente.');
      console.error('Error descargando el archivo:', error);
    }
  };
 
  const handleSave = async () => {
    console.log(title.length);
    if (title.length === 0) {
      Alert.alert("Error", "Ingresa un título");
      return;
    } else if (title.length > 30) {
      Alert.alert("Error", "El título no puede tener más de 30 caracteres.");
      return;
    }
    if (description.length > 255) {
      Alert.alert("Error", "La descripcion excede el tamaño de 255 caracteres");
      return;
    } 
    const userId = await AsyncStorage.getItem('username');
    if (userId) {
      try {
        const response = await fetch(
          'https://us-central1-lingua-80a59.cloudfunctions.net/update_document',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_id: userId,
              text: selectedText || text,
              textstyle: textstyle,
              comments: comments,
              title: title,
              description: description,
              document_id: route.params?.document.document_id,
            }),
          }
        );
        const result = await response.text();
        console.log('Fetched documents:', result);
        if (!response.ok) {
          throw new Error(result.error || 'Failed to retrieve documents');
        }
      } catch (error) {
        //console.error('Error updating documents:', error);
      }
    }
    Alert.alert('Update', 'Document updated successfully!');
  };

  const handleDeleteDocument = async () => {
    Alert.alert(
      'Advertencia',
      'Confirmar que desea eliminar el texto almacenado.',
      [
        {
          text: 'Aceptar',
          onPress: async () => {
            const userId = await AsyncStorage.getItem('username');
            const response = await fetch(
              'https://us-central1-lingua-80a59.cloudfunctions.net/remove_document',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user_id: userId,
                  document_id: route.params?.document.document_id,
                }),
              }
            );

            const result = await response.json();

            if (response.ok) {
              Alert.alert('Success', 'Document deleted successfully.');
              navigation.goBack();
            } else {
              Alert.alert('Error', result.error || 'Failed to delete the document.');
            }
          },
        },
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
      ]
    );
  };
  const handleShare = async () => {
    try {
      // Crea un archivo temporal
      const fileUri = FileSystem.documentDirectory + title + '.txt';
      await FileSystem.writeAsStringAsync(fileUri, text);
      
      // Comprueba si el dispositivo admite el sistema de compartir
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('No se puede compartir', 'El dispositivo no admite el sistema de compartir');
      }
    } catch (error) {
      console.error('Error al compartir el archivo', error);
      Alert.alert('Error', 'Hubo un error al compartir el archivo');
    }
  };

    
const htmlContent = `
<html>
<head>
  <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
  <style>
    body {
      background-color: ${color}; /* Color de fondo claro */ 
       font-family: Arial; }
    #editor-container {
      background-color:  ${color}; /* Color de fondo claro */ 
      height: 300px; }
     
    .commented { background-color: green; }
    .highlight { background-color: yellow; }
    <style>
    @font-face {
      font-family: 'Verdana';
      src: url('https://example.com/Verdana.ttf');
    }
    @font-face {
      font-family: 'Calibri';
      src: url('https://example.com/calibri.ttf');
    }
    @font-face {
      font-family: 'Times New Roman';
      src: url('https://example.com/Times-New-Roman.ttf');
    }
    @font-face {
      font-family: 'Arial';
      src: url('https://example.com/Arial.ttf');
    }
    @font-face {
      font-family: 'Roboto';
      src: url('https://example.com/Roboto-Regular.ttf');
    }
   
   
</style>
  </style>
</head>

<button onclick="changeFont('Verdana')">Verdana</button>

<button onclick="changeFont('Times New Roman')">Times New Roman</button>
<button onclick="changeFont('Arial')">Arial</button>
<button onclick="changeFont('Calibri')">Calibri</button>
<button onclick="changeFont('Roboto')">Roboto</button>

<body>
  <div id="toolbar">
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <select class="ql-background">
    <option value="#00ff3c00">Nothing</option>
    <option value="#f00">Rojo</option>
    <option value="#0f0">Verde</option>
    <option value="#00f">Azul</option>
    <option value="#ff0">Amarillo</option>
<option value="#f0f">Magenta</option>
<option value="#0ff">Cian</option>
<option value="#ffa500">Naranja</option>
<option value="#800080">Púrpura</option>
<option value="#800000">Marrón</option>
<option value="#000000">Negro</option>
  </select>
    
    <button class="ql-align" value=""></button>
    <button class="ql-align" value="center"></button>
    <button class="ql-align" value="right"></button>
    <button class="ql-align" value="justify"></button>
    <button class="ql-uppercase">Aa</button>
  </div>
  <input type="text" id="search-box" placeholder="Buscar texto..." />
  <button onclick="searchText()">Buscar</button>
  
  <div id="editor-container">${textstyle}</div>
  <button onclick="saveContent()">Guardar y Mostrar Contenido</button>
  <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
  <script>
  var quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
      toolbar: {
        container: '#toolbar',
       
        handlers: {
          'background': function(value) {
            if (value) {
              var range = quill.getSelection();
              if (range) {
                quill.format('background', value);
              }
            }
          }, // Faltaba una coma aquí para separar los manejadores de eventos
          'uppercase': function() {
            var range = quill.getSelection();
            if (range) {
              var text = quill.getText(range);
              var upperText = text === text.toUpperCase() ? text.toLowerCase() : text.toUpperCase();
              quill.deleteText(range.index, range.length);
              quill.insertText(range.index, upperText);
            }
          }
        }
      }
    }
  });
  function searchText() {
    var textToSearch = document.getElementById('search-box').value;
    if (!textToSearch) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ searchStatus: 'empty' }));
      return;
    }

    var range = quill.getLength();
    quill.removeFormat(0, range); // Remove only search-related formatting
    var text = quill.getText();
    var position = text.indexOf(textToSearch);
    if (position === -1) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ searchStatus: 'notFound' }));
      return;
    }

    while (position !== -1) {
      quill.formatText(position, textToSearch.length, { background: 'grey' }); // Apply grey background
      position = text.indexOf(textToSearch, position + textToSearch.length);
    }
    window.ReactNativeWebView.postMessage(JSON.stringify({ searchStatus: 'found' }));
  }

    function changeFont(font) {
      const editor = document.querySelector('.ql-editor');
      editor.style.fontFamily = font;
    }
    function changeFontColor(color) {
     const editor = document.querySelector('.ql-editor');
     editor.style.color = color;
   }
    function highlightText() {
      var quill = window.quill;
      if (quill) {
        var range = quill.getSelection();
        if (range && range.length) {
          quill.formatText(range.index, range.length, { 'background': 'yellow' });
        }
      }
    }
    function saveContent() {
      const htmlContent = quill.root.innerHTML; // Captura el HTML con estilos
      const textContent = quill.getText(); // Captura el texto sin formato
      window.ReactNativeWebView.postMessage(JSON.stringify({ htmlContent: htmlContent, textContent: textContent, allComments: comments }));
    }







    var comments = ${initialComments};

    
    function addComment() {
      var range = quill.getSelection();
      if (range && range.length) {
        var commentText = prompt('Escribe un comentario para este fragmento:', '');
        if (commentText) {
          quill.formatText(range.index, range.length, 'background', 'green');
          comments[range.index] = {
            length: range.length,
            comment: commentText
          };
        }
      }
    }
 






 





    document.addEventListener('selectionchange', function() {
      var range = quill.getSelection();
      if (range && range.length > 0) {
        var selectedText = quill.getText(range.index, range.length);
        window.ReactNativeWebView.postMessage(JSON.stringify({ selectedText }));
      } else {
        window.ReactNativeWebView.postMessage(JSON.stringify({ selectedText: '' }));
      }
      if (range && range.length === 0) {
        var keys = Object.keys(comments);
        var found = keys.find(key => {
          let start = parseInt(key);
          let end = start + comments[key].length;
          return range.index >= start && range.index < end;
        });
        if (comments[found]) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ comment: comments[found].comment }));
      } else {
          window.ReactNativeWebView.postMessage(JSON.stringify({ comment: '' }));
      }
      
      }



      
    });
  </script>
</body>
</html>
`;


const [comments, setComments] = useState({});
const [currentComment, setCurrentComment] = useState('');
const onMessage = (event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.searchStatus) {
      if (data.searchStatus === 'empty') {
        Alert.alert('Buscar', 'Por favor, ingresa un texto para buscar.');
      } else if (data.searchStatus === 'notFound') {
        Alert.alert('Buscar', 'No se encontraron coincidencias.');
      } else if (data.searchStatus === 'found') {
        // Nada que hacer si se encontraron coincidencias, el texto ya está resaltado
      }
    }
  } catch (error) {
    console.error('Error processing message from WebView:', error);
  }
  try {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.selectedText !== undefined) {
      setSelectedText(data.selectedText);
    }
    // Aquí también deberías manejar otros datos como currentComment y otros datos recibidos
  } catch (error) {
    console.error('Error processing message from WebView:', error);
  }
  try {
    const data = JSON.parse(event.nativeEvent.data);
    console.log(data.comment);
    if(data.comment){
    setCurrentComment(data.comment);}
    else
    {
      setCurrentComment("Sin comentarios");
    }
     
  } catch (error) {
    console.error('Error processing message from WebView:', error);
    // Puedes agregar más manejo de errores aquí, por ejemplo, establecer un estado de error
  }
  try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.htmlContent && data.textContent) {
          
          console.log("HTML Content:", data.htmlContent); // Imprimir el contenido HTML en la consola
          console.log("Text Content:", data.textContent); // Imprimir el texto sin formato en la consola
          console.log("Comments:", data.allComments); // Imprimir los comentarios en la consola
          setComments(data.allComments);
          setTextstyle(data.htmlContent);
          setText(data.textContent);
          handleSave();
          // Puedes hacer más procesamiento aquí, como actualizar el estado con estos valores
        }
      } catch (error) {
        console.error('Error processing message from WebView:', error);
      }
};

// const onMessage = (event) => {
//   try {
//     const data = JSON.parse(event.nativeEvent.data);
//     setCurrentComment(data.comment);
//   } catch (error) {
//     console.error('Error processing message from WebView:', error);
//     // Puedes agregar más manejo de errores aquí, por ejemplo, establecer un estado de error
//   }
//   try {
//     const data = JSON.parse(event.nativeEvent.data);
//     if (data.htmlContent && data.textContent) {
      
//       console.log("HTML Content:", data.htmlContent); // Imprimir el contenido HTML en la consola
//       console.log("Text Content:", data.textContent); // Imprimir el texto sin formato en la consola
//       // Puedes hacer más procesamiento aquí, como actualizar el estado con estos valores
//     }
//   } catch (error) {
//     console.error('Error processing message from WebView:', error);
//   }
// };
 

const CommentModal = () => (
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
        <Text style={styles.modalText}>{currentComment || "No hay comentario"}</Text>
        <TouchableOpacity
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Text style={styles.textStyle}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const handleAddComment = () => {
  const script = `addComment();`;
  webviewRef.current.injectJavaScript(script);
};
 
const handleSearch = () => {
  const script = `searchAndHighlight('${searchTerm}');`;
  webviewRef.current?.injectJavaScript(script);
};




 
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <View style={styles.navBar}>
              <CommentModal />
                <TextInput
                  style={styles.navdescription}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Titulo"
                />
              </View>

              <View style={styles.footershowtext}>
                <TextInput
                  style={styles.textdescription}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Descripcion"
                  placeholderTextColor={theme === 'light' ? "#888" : 'gray'}
                  multiline
                />
                  <View style={styles.footerMenu}>
                <Icon name="highlight-off" size={40} color={theme === 'light' ? "#888" : '#B1D3EE'}  onPress={() => handleDeleteDocument()} />
                <Ionicons name="archive" size={40} color={theme === 'light' ? "#888" : '#B1D3EE'}  onPress={handleShare}  />
                
                <Ionicons name="pricetag" size={40} color={theme === 'light' ? "#888" : '#B1D3EE'}  onPress={handleAddComment}  />
               

                  </View>
               
              </View>
              <Button title="Descargar Texto Seleccionado" onPress={handleDownload} disabled={!selectedText.trim()} />

              <View style={styles.commentBox}>
  {currentComment ? (
    <Text style={styles.commentText}>{currentComment}</Text>
  ) : (
    <Text style={styles.commentText}>No hay comentarios</Text>
  )}
</View>


              <StatusBar style="auto" />
             
             
<WebView
  ref={webviewRef}
  source={{ html: htmlContent }}
  onMessage={onMessage}
  javaScriptEnabled={true}
  style={{ width: width, height: height }} 
/>

       
            </View>


          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShowText;


