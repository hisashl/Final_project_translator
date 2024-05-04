// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   StyleSheet,
//   TextInput,
//   Text,
//   View,
//   SafeAreaView,
//   ActivityIndicator,
//   FlatList,
//   Button,
//   Alert,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform 
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { useFocusEffect , useNavigation } from '@react-navigation/native';
// import { useStyle } from './StyleContext'

// const TextScreen = () => {
  

//   const { styler, updateStyles, theme, toggleTheme } = useStyle();
//   const navigation = useNavigation();
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchText, setSearchText] = useState("");
  

//   const handleFocus = useCallback(() => {
//     console.log('Screen is focused');

//     fetchDocuments();

//     return () => {
     
//       console.log('Screen is unfocused');
//     };
//   }, []);

//   useFocusEffect(handleFocus);
  
//   const fetchDocuments = async () => {
//     const userId = await AsyncStorage.getItem('username');
//     if (userId) {
//       try {
//         const response = await fetch(
//           'https://us-central1-lingua-80a59.cloudfunctions.net/list_documents',
//           {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ user_id: userId }),
//           }
//         );
//         const result = await response.json();
//         console.log('Fetched documents:', result);
//         if (!response.ok) {
//           throw new Error(result.error || 'Failed to retrieve documents');
//         }
        
//         // Ordenar documentos por fecha de última modificación
//         const sortedDocuments = result.sort((a, b) => new Date(b.last_modification) - new Date(a.last_modification));
//         setDocuments(sortedDocuments);
//       } catch (error) {
//         console.error('Error retrieving documents:', error);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
  
//   const handleDeleteDocument = async (doc) => {
    
//     const userId = await AsyncStorage.getItem('username');
   
//     const response = await fetch(
//       'https://us-central1-lingua-80a59.cloudfunctions.net/remove_document',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: userId,
//           document_id: doc.document_id,
          
//         }),
//       }
//     );
    
//     const result = await response.json();
 
    
//     if (response.ok) {
//       Alert.alert('Success', 'Document deleted successfully.');
//       fetchDocuments(); // Refresh the list after deletion
//     } else {
//       Alert.alert('Error', result.error || 'Failed to delete the document.');
//     }
//     fetchDocuments();
//   };
//   const renderDocument = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       onPress={() => navigation.navigate('ShowText', { document: item })}
//     >
//       <Text style={styles.title}>{item.title || 'No Title'}</Text>
//       <Text style={styles.description}>{item.description || 'No Description'}</Text>
//       <Text style={styles.text}>{item.text ? item.text.substring(0, 20) + '...' : 'No Text Available'}</Text>
//       <Text style={styles.date}>{item.last_modification || 'No Date'}</Text>
//       <View style={styles.trashcontainer}>
//       <View style={styles.trashcontainer}>
//       <Ionicons name="close" size={25} color={'#2E2E2E'} onPress={() => handleDeleteDocument(item)}/>
//       </View>
//       </View>
//     </TouchableOpacity>
//   );
  
//   const styles = StyleSheet.create({
     
//     trashcontainer: {
//       position: 'absolute',
//       right: 10, // Margen derecho
//       top: '80%', // Para centrar verticalmente
//       transform: [{ translateY: -12.5 }], // Ajustar según el tamaño del ícono (25px)
//     },
//     safeArea: {
//       flex: 1,
//       backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
//     },
//     card: {
//       margin: 10,
//       padding: 10,
//       backgroundColor: theme === 'light' ? '#dde1f0' : '#75777B',
//       borderRadius: 5,
//       elevation: 3,
//     },
//     title: {
//       fontSize: 18,
//       color: theme === 'light' ? 'black' : 'white',
//       fontWeight: 'bold',
//     },
//     description: {
//       fontSize: 14,
//       color: theme === 'light' ? 'black' : 'white',
      
//     },
//     text: {
//       fontSize: 12,
//       color: theme === 'light' ? 'black' : 'white',
//     },
//     date: {
//       fontSize: 12,

//       color: 'blue',
//     },
//   });
  
  

//   return (
//     <SafeAreaView style={styles.safeArea}>
//        <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={[styles.container]}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search by title..."
//         value={searchText}
//         onChangeText={setSearchText}
//       />
//      <Button title="Search" onPress={() => {
//   const filtered = documents.filter((doc) =>
//     doc.title && doc.title.toLowerCase().includes(searchText.toLowerCase())
//   );
//   setDocuments(filtered);
// }} />

//       {loading ? (
//         <ActivityIndicator size="large" />
//       ) : (
//         <FlatList
//           data={documents}
//           renderItem={renderDocument}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       )}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default TextScreen;


import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useStyle } from './StyleContext'

const TextScreen = () => {
  const { theme } = useStyle();
  const navigation = useNavigation();
  const [allDocuments, setAllDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const handleFocus = useCallback(() => {
    fetchDocuments();
  }, []);

  useFocusEffect(handleFocus);

  const fetchDocuments = async () => {
    const userId = await AsyncStorage.getItem('username');
    if (userId) {
      try {
        const response = await fetch(
          'https://us-central1-lingua-80a59.cloudfunctions.net/list_documents',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || 'Failed to retrieve documents');
        }
        
        const sortedDocuments = result.sort((a, b) => new Date(b.last_modification) - new Date(a.last_modification));
        setAllDocuments(sortedDocuments);
        setDocuments(sortedDocuments);
      } catch (error) {
        console.error('Error retrieving documents:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteDocument = async (doc) => {
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
          document_id: doc.document_id,
        }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      Alert.alert('Success', 'Document deleted successfully.');
      fetchDocuments();
    } else {
      Alert.alert('Error', result.error || 'Failed to delete the document.');
    }
  };
  
  const renderDocument = ({ item }) => {
    // Check if the last_modification is a valid date string
    let formattedDate = 'No Date';
    if (item.last_modification) {
      const date = new Date(item.last_modification);
      if (!isNaN(date)) {
        // Format the date using toLocaleDateString or toLocaleString
        formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true, // Use 12-hour clock format
        });
      }
    }
  
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ShowText', { document: item })}
      >
        <Text style={styles.title}>{item.title || 'No Title'}</Text>
        <Text style={styles.description}>{item.description || 'No Description'}</Text>
        <Text style={styles.text}>{item.text ? item.text.substring(0, 20) + '...' : 'No Text Available'}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={styles.trashcontainer}>
          <Ionicons name="trash" size={25} color="#1338bd" onPress={() => handleDeleteDocument(item)} />
        </View>
      </TouchableOpacity>
    );
  };
  

  // Filtrar documentos cada vez que `searchText` cambie
  useEffect(() => {
    if (searchText === "") {
      setDocuments(allDocuments);
    } else {
      const filteredDocuments = allDocuments.filter(doc =>
        doc.title && doc.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setDocuments(filteredDocuments);
    }
  }, [searchText, allDocuments]);

  const styles = StyleSheet.create({
    searchInput: {

      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
      padding: 10,
      margin: 10,
      borderRadius: 1,
      fontSize: 24,
      color: theme === 'light' ? 'black' : 'white',


    },
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
    },
    trashcontainer: {
      position: 'absolute',
      right: 10,
      top: '50%',
      
    },
    card: {
      margin: 10,
      padding: 10,
      backgroundColor: theme === 'light' ? '#dde1f0' : '#75777B',
      borderRadius: 10,
      elevation: 3,
      position: 'relative',
    },
    title: {
      fontSize: 19,
      fontWeight: 'bold',
      color: theme === 'light' ? '#8fa3eb' : '#8fa3eb',
    },
    description: {
      fontSize: 18,
      color: theme === 'light' ? '#b9c4eb' : '#b9c4eb',
    },
    text: {
      fontSize: 16,
      color: theme === 'light' ? 'black' : 'white',
    },
    date: {
      fontSize: 12,
      color: theme === 'light' ? 'black' : 'white',
    },
  });
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container]}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          placeholderTextColor={theme === 'light' ? "#888" : 'gray'}
          value={searchText}
          onChangeText={setSearchText} // Actualiza el texto de búsqueda
        />
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            data={documents}
            renderItem={renderDocument}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TextScreen;














