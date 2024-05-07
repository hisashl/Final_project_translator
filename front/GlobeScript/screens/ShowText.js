
// import React, { useState } from 'react';
// import { View, Alert, Button, TextInput, StatusBar, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
// import useCustomStyles from './parts/StyleP';
// import * as Sharing from 'expo-sharing';
// import * as FileSystem from 'expo-file-system'; 
// const ShowText = ({ route, navigation }) => {
//   const _editor = React.createRef();

//   const { document } = route.params;
//   const [title, setTitle] = useState(document.title);
//   const [description, setDescription] = useState(document.description);
//   const [text, setText] = useState(document.text);
//   const styles = useCustomStyles();

//   const handleDownload = async () => {
//     try {
//       const downloadsFolder = FileSystem.documentDirectory + 'Download/';
//       const fileUri = downloadsFolder + `${title.replace(/\s+/g, '_') || 'document'}.txt`;

//       // Asegúrate de que la carpeta de descargas exista
//       const folderInfo = await FileSystem.getInfoAsync(downloadsFolder);
//       if (!folderInfo.exists) {
//         await FileSystem.makeDirectoryAsync(downloadsFolder, { intermediates: true });
//       }

//       await FileSystem.writeAsStringAsync(fileUri, text, { encoding: FileSystem.EncodingType.UTF8 });

//       Alert.alert('Descarga', `Archivo descargado: ${fileUri}`);
//     } catch (error) {
//       Alert.alert('Error', 'No se pudo descargar el archivo. Intenta nuevamente.');
//       console.error('Error descargando el archivo:', error);
//     }
//   };
//   const handleShare = async () => {
//     try {
//       // Crea un archivo temporal
//         const fileUri = FileSystem.documentDirectory + title +
//       '.txt';
//       await FileSystem.writeAsStringAsync(fileUri, text);
      
//       // Comprueba si el dispositivo admite el sistema de compartir
//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(fileUri);
//       } else {
//         Alert.alert('No se puede compartir', 'El dispositivo no admite el sistema de compartir');
//       }
//     } catch (error) {
//       console.error('Error al compartir el archivo', error);
//       Alert.alert('Error', 'Hubo un error al compartir el archivo');
//     }
//   };

//   const handleSave = async () => {
//     console.log(title.length); 
//     if (title.length === 0) {
//         Alert.alert("Error", "Ingresa un titulo");
//         setTitle("");
//         return;
//     } else if (title.length > 30) {
//         Alert.alert("Error", "El título no puede tener más de 30 caracteres.");
//         setTitle("");
//         return;
//     }
   
//     const userId = await AsyncStorage.getItem('username');
//     if (userId) {



    
//       try {
//         const response = await fetch(
//           'https://us-central1-lingua-80a59.cloudfunctions.net/update_document',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               user_id: userId,
//               text: text,
//               title: title,
//               description: description,
//               document_id: document.document_id,
//             }),
//           }
//         );
//         const result = await response.text();
//         console.log('Fetched documents:', result);
//         if (!response.ok) {
//           throw new Error(result.error || 'Failed to retrieve documents');
//         }
//       } catch (error) {
//         //console.error('Error updating documents:', error);
//       }
//     }
//     Alert.alert('Update', 'Document updated successfully!');
//   };

  





//   const handleDeleteDocument = async () => {
//     Alert.alert(
//       'Advertencia',
//       'Confirmar que desea eliminar el texto almacenado.',
//       [
//         {
//           text: 'Aceptar',
//           onPress: async () => {
//             const userId = await AsyncStorage.getItem('username');
//             const response = await fetch(
//               'https://us-central1-lingua-80a59.cloudfunctions.net/remove_document',
//               {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   user_id: userId,
//                   document_id: document.document_id,
//                 }),
//               }
//             );
  
//             const result = await response.json();
  
//             if (response.ok) {
//               Alert.alert('Success', 'Document deleted successfully.');
//               navigation.goBack();
//             } else {
//               Alert.alert('Error', result.error || 'Failed to delete the document.');
//             }
//           },
//         },
//         {
//           text: 'Cancelar',
//           onPress: () => {},
//           style: 'cancel',
//         },
//       ]
//     );
//   };














//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView contentContainerStyle={styles.scrollViewContent}>
//             <View style={styles.container}>
//               <View style={styles.navBar}>
//                 <TextInput
//                   style={styles.navdescription}
//                   value={title}
//                   onChangeText={setTitle}
//                   placeholder="Title"
//                 />
//               </View>

//               <View style={styles.footershowtext}>
//                 <TextInput
//                   style={styles.textdescription}
//                   value={description}
//                   onChangeText={setDescription}
//                   placeholder="Description"
//                   multiline
//                 />
//                 <View style={styles.sourcee}>
//                       <TextInput
//         style={styles.textsearch}
//         value={text}
//         onChangeText={setText}
//         placeholder="Text"
//         multiline
//       />
                   
//                 </View>

               

//                 <Button title="Save Changes" onPress={handleSave} />
//                 <Button title= "Delete Document" onPress={() => handleDeleteDocument()}/>
//                 <View>
//       {Platform.OS === 'android' ? (
//         <Button title="Download as Text File" onPress={handleDownload} />
//       ) : (
//         <Button title="Compartir archivo" onPress={handleShare} />
//       )}
//     </View>

//               </View>
                         
//       <StatusBar style="auto" />
//       <QuillEditor
//         style={styles.editor}
//         ref={_editor}
//         initialHtml={text}
//         onChange={(html) => setText(html)}
//       />
      
//                   <QuillToolbar editor={_editor} options="full" theme="dark" />
              
//             </View>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default ShowText;






import React, { useRef, useState, useEffect } from 'react';
import { View, Alert, Button, Dimensions , TextInput, StatusBar, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import useCustomStyles from './parts/StyleP';


const ShowText = ({ route, navigation }) => {
  const webviewRef = useRef(null);
  const [title, setTitle] = useState(route.params?.document.title || '');
  const [description, setDescription] = useState(route.params?.document.description || '');
  const [text, setText] = useState(route.params?.document.text || '');
  const [selectedText, setSelectedText] = useState('');
  const styles = useCustomStyles();
  const [webviewHeight, setWebviewHeight] = useState(Dimensions.get('window').height - 200); // Ajusta el tamaño según sea necesario
  const [selectedColor, setSelectedColor] = useState('#FFFF00'); // Default to yellow
 
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



 // Editor Quill con opciones de barra de herramientas ampliadas
 const htmlContent = `
 <html>
   <head>
     <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
     <style>
     @font-face {
       font-family: 'Verdana';
       src: url('https://example.com/Verdana.ttf');
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
 <style>
 .highlight { background-color: yellow; }
</style>
   <script>
   function highlightText() {
    var quill = window.quill;
    if (quill) {
      var range = quill.getSelection();
      if (range && range.length) {
        quill.formatText(range.index, range.length, { 'background': 'yellow' });
      }
    }
  }

   function changeFont(font) {
     const editor = document.querySelector('.ql-editor');
     editor.style.fontFamily = font;
   }
   function changeFontColor(color) {
    const editor = document.querySelector('.ql-editor');
    editor.style.color = color;
  }
   function loadQuill() {
     var quill = new Quill('#editor-container', {
       theme: 'snow',
     });
   }
    
  //   function removeHighlight() {
  //     var quill = window.quill;
  //     if (quill) {
  //       var range = quill.getSelection();
  //       if (range && range.length) {
  //         quill.formatText(range.index, range.length, { 'background': '' });
  //       }
  //     }
  //   }
  // }
 </script>
   </head>
   <body>
  
   <div>

   <button onclick="changeFont('Verdana')">Verdana</button>
   <button onclick="changeFont('Times New Roman')">Times New Roman</button>
   <button onclick="changeFont('Arial')">Arial</button>
   <button onclick="changeFont('Roboto')">Roboto</button>
   
 </div>
 <div>
 <div>
 <button onclick="highlightText()">Resaltar</button>
  
 <button onclick="removeHighlight()">Quitar resaltado</button>
 
     <div id="toolbar">
        
       <select class="ql-size">
         <option value="small"></option>
         <option selected></option>
         <option value="large"></option>
         <option value="huge"></option>
       </select>
       <button class="ql-bold"></button>
       <button class="ql-italic"></button>
       <button class="ql-underline"></button>
       <button class="ql-color"></button>
       <button class="ql-background"></button>
       <button class="ql-align" value=""></button>
       <button class="ql-align" value="center"></button>
       <button class="ql-align" value="right"></button>
       <button class="ql-align" value="justify"></button>
       <button class="ql-uppercase">Aa</button>
     </div>
     <div id="editor-container">${text}</div>
     <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
     <script>
       var quill = new Quill('#editor-container', {
         theme: 'snow',
         modules: {
           toolbar: {
             container: '#toolbar',
             handlers: {
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
       
       document.addEventListener('selectionchange', function() {
         var text = quill.root.innerHTML;
         window.ReactNativeWebView.postMessage(text);
       });
     </script>
   </body>
 </html>
`;
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
              <View style={styles.navBar}>
                <TextInput
                  style={styles.navdescription}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Title"
                />
              </View>

              <View style={styles.footershowtext}>
                <TextInput
                  style={styles.textdescription}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Description"
                  multiline
                />
                {/* <Button title="Negritas" onPress={injectBoldScript} /> */}
                <Button title="Save Changes" onPress={handleSave} />
                <Button title="Delete Document" onPress={() => handleDeleteDocument()} />
                <Button title="Compartir archivo" onPress={handleShare} />
                <Button title="Descargar texto seleccionado" onPress={handleDownload} disabled={!selectedText.trim()} />
              </View>
              <StatusBar style="auto" />
              
              <WebView
                ref={webviewRef}
                style={{ height: webviewHeight }}
                source={{ html: htmlContent }}
                onMessage={(event) => {
                  setSelectedText(event.nativeEvent.data);
                }}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShowText;



 