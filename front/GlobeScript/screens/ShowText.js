// import React, { useState } from 'react';
// import { View, Alert, Text, TextInput, Button, StatusBar, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
// import { useStyle } from './StyleContext'
// import useCustomStyles from './parts/StyleP'; 

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
// const ShowText = ({ route, navigation }) => {
//   const _editor = React.createRef();

//   const { document } = route.params;
//   const [title, setTitle] = useState(document.title);
//   const [description, setDescription] = useState(document.description);
//   const [text, setText] = useState(document.text);
//   const styles = useCustomStyles();

//   const handleSave = async () => {
//     document.document_id
//     const userId = await AsyncStorage.getItem('username');
//     if (userId) {

            
//         try {
//             const response = await fetch(
//               'https://us-central1-lingua-80a59.cloudfunctions.net/update_document',
//               {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   user_id: userId,
//                   text: text,
//                   title: title,
//                   description: description, 
//                   document_id: document.document_id,
//                 }),
//               }
             
        
//             );
//             const result = await response.text();
//             console.log('Fetched documents:', result);
//             if (!response.ok) {
//               throw new Error(result.error || 'Failed to retrieve documents');
//             }
//         } catch (error) {
//             console.error('Error updating documents:', error);
//         }

//     }

  
    
//     Alert.alert('Update', 'Document updated successfully!');
//   }
 
 
    
  

//   return (
//     <SafeAreaView style={styles.safeArea}>
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ScrollView contentContainerStyle={styles.scrollViewContent}>
//     <View style={styles.container}>
//     <View style={styles.navBar}>
//       <TextInput
//         style={styles.navdescription}
//         value={title}
//         onChangeText={setTitle}
//         placeholder="Title"
//       />
//       </View>
     
//       <View style={styles.footershowtext}>
     
//       <TextInput
//         style={styles.textdescription}
//         value={description}
//         onChangeText={setDescription}
//         placeholder="Description"
//         multiline
//       />
//       <View  style={styles.sourcee}>
//       <TextInput
//         style={styles.textsearch}
//         value={text}
//         onChangeText={setText}
//         placeholder="Text"
//         multiline
//       />
//       </View>
      
//       <Button title="Save Changes" onPress={handleSave} />
//     </View>
//     </View>
//     </ScrollView>
//     </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };
 

// export default ShowText; 




 
















// import React from 'react';
// import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
// import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
// export default function App() {
//   const _editor = React.createRef();

//   return (
//     <SafeAreaView style={styles.root}>
//       <StatusBar style="auto" />
//       <QuillEditor
//         style={styles.editor}
//         ref={_editor}
//         initialHtml="<h1>Quill Editor for react-native</h1>"
//       />
//       <QuillToolbar editor={_editor} options="full" theme="light" />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     paddingVertical: 10,
//   },
//   root: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//     backgroundColor: '#eaeaea',
//   },
//   editor: {
//     flex: 1,
//     padding: 0,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginHorizontal: 30,
//     marginVertical: 5,
//     backgroundColor: 'white',
//   },
// });
 
import React, { useState } from 'react';
import { View, Alert, Button, TextInput, StatusBar, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import useCustomStyles from './parts/StyleP';

const ShowText = ({ route, navigation }) => {
  const _editor = React.createRef();

  const { document } = route.params;
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description);
  const [text, setText] = useState(document.text);
  const styles = useCustomStyles();

  const handleSave = async () => {
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
              text: text,
              title: title,
              description: description,
              document_id: document.document_id,
            }),
          }
        );
        const result = await response.text();
        console.log('Fetched documents:', result);
        if (!response.ok) {
          throw new Error(result.error || 'Failed to retrieve documents');
        }
      } catch (error) {
        console.error('Error updating documents:', error);
      }
    }
    Alert.alert('Update', 'Document updated successfully!');
  };

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
                <View style={styles.sourcee}>
                      <TextInput
        style={styles.textsearch}
        value={text}
        onChangeText={setText}
        placeholder="Text"
        multiline
      />
                   
                </View>
     
   
                <Button title="Save Changes" onPress={handleSave} />
                
              </View>
                         
      <StatusBar style="auto" />
      <QuillEditor
        style={styles.editor}
        ref={_editor}
        initialHtml={text}
        onChange={(html) => setText(html)}
      />
      
                  <QuillToolbar editor={_editor} options="full" theme="dark" />
              
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ShowText;








// import React from 'react';
// import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
// import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
// export default function App() {
//   const _editor = React.createRef();

//   return (
//     <SafeAreaView style={styles.root}>
//       <StatusBar style="auto" />
//       <QuillEditor
//         style={styles.editor}
//         ref={_editor}
//         initialHtml="<h1>Quill Editor for react-native</h1>"
//       />
//       <QuillToolbar editor={_editor} options="full" theme="light" />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   title: {
//     fontWeight: 'bold',
//     alignSelf: 'center',
//     paddingVertical: 10,
//   },
//   root: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//     backgroundColor: '#eaeaea',
//   },
//   editor: {
//     flex: 1,
//     padding: 0,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginHorizontal: 30,
//     marginVertical: 5,
//     backgroundColor: 'white',
//   },
// });