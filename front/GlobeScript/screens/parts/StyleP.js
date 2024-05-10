import { StyleSheet, StatusBar } from 'react-native';
import { useStyle } from '../StyleContext'
const useCustomStyles = () => {
 

  const { styler, updateStyles, theme, toggleTheme } = useStyle();
  const isFontColorWhite = styler.textColor === '#ffffff';
  return StyleSheet.create({
    warningContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    highlightedText: {
      backgroundColor: 'gray',
    },
    incorrectText: {
      backgroundColor: 'red',
    },
    colorth: {
        // Usa el color de texto de styler o cae de nuevo a negro
    },
    checkbox: {
      marginRight: 10,
    },
    warningText: {
      fontSize: 14,
      color: 'red',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      
    },
    place: {
      marginBottom: 15,
      borderRadius: 10,
      // padding: 16,
      
      flex: 1,
      backgroundColor: 'transparent',
       
      color: 'gray', // Usa el color de texto de styler o cae de nuevo a negro
    }, 
    modalView: {
      margin: 20,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalViewss: {
      margin: 20,
      backgroundColor: theme === 'light' ? '#fff' : '#3d3e40',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#b0c4eb',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalViews: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    incorrectWord: {
      fontSize: 18,
      color: 'red',
      marginBottom: 10,
      marginTop: 10,
    },
    
  
    speakerIcon: {
      position: 'absolute',
      right: 30,
      top: 15,
    },
  
    wordings:{
      // marginTop: 20,
      // marginBottom: 15,
      fontSize: 18,
      color:  theme === 'light' ? styler.textColor : 'white',  // Usa el color de texto de styler o cae de nuevo a negro
    },
    wording:{
      width: 280,  // Ancho fijo
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 15,
      fontSize: 16,
      color:  theme === 'light' ? styler.textColor : 'white',  // Usa el color de texto de styler o cae de nuevo a negro
    },
    titlesave:{
      marginTop: 20,
      marginBottom: 15,
      fontSize: 24,
      color:  theme === 'light' ? styler.textColor : 'white',  // Usa el color de texto de styler o cae de nuevo a negro
    },
    commentBox: {
      padding: 10,
      margin: 10,
      backgroundColor: '#f0f0f0',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ccc'
    },
    commentText: {
      color: '#333',
      fontSize: 16,
    },

    word: {
      
      fontFamily: styler.fontFamily,
      fontSize: styler.fontSize || 18, // Usa el tamaño de fuente de styler o cae de nuevo a 18
      color:  theme === 'light' ? styler.textColor : 'white',  // Usa el color de texto de styler o cae de nuevo a negro
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color:  theme === 'light' ? 'black' : 'white',  // Usa el color de texto de styler o cae de nuevo a negro
    },
    buttonClose: {
      backgroundColor: '#F194FF',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
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
      backgroundColor: theme === 'light' ? '#fff' : '#2E2E2E',
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
      color: theme === 'light' ? 'black' : 'white',
    },
    ModalTitle: {
      fontSize: 19,
      fontWeight: 'bold',
      color: theme === 'light' ? 'black' : 'white',
    },
    navdescription: {
      fontSize: 30,
      fontWeight: 'bold',
      color: theme === 'light' ? 'black' : 'white',
    },
    footerMenu: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      borderTopWidth: 1,
      borderColor:  '#ddd',
      // styler.backgroundColor
    },
    footershowtext: {
      
      justifyContent: 'space-around',
      padding: 16,
      borderTopWidth: 1,
      borderColor:  '#ddd',
      // styler.backgroundColor
    },
    mainContainer: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'flex-start',
      paddingTop: 20,
    },
    multilineInput: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    textsearch: {
      marginBottom: 15,
      borderRadius: 10,
      marginLeft: 20,
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: 16,
      color: theme === 'light' ? 'black' : 'white',
    },
    textdescription: {
      marginBottom: 15,
      borderRadius: 10,
      marginLeft: 20,
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: 20,

      fontWeight: 'bold',

      color: theme === 'light' ? 'black' : 'white',
    },
    
    
    textInput: {
      marginBottom: 15,
      borderRadius: 10,
      // padding: 16,
      
      flex: 1,
      backgroundColor: 'transparent',
      fontFamily: styler.fontFamily,
      fontSize: styler.fontSize , // Usa el tamaño de fuente de styler o cae de nuevo a 18
      color:  theme === 'light' ? styler.textColor : 'white', // Usa el color de texto de styler o cae de nuevo a negro
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
      width: 350,  // Ancho fijo
       
    
      marginLeft: 20,  // Aumenta el espacio a la izquierda
      marginRight: 50,  // Reduce el espacio a la derecha si es necesario
      padding: 16,
      borderWidth: 2,
      borderColor: '#ccc',
      
      backgroundColor: theme === 'light' ? styler.backgroundColor : '#2E2E2E',
      
      borderRadius: 10,
    },
    
    
    
    sourcee: {
      fontSize: 18,
      marginBottom: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: '#ccc',
    
      backgroundColor: theme === 'light' ? styler.backgroundColor : '#2E2E2E',
      borderRadius: 10, 
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center', // Cambia 'right' por 'center' para alinear correctamente los elementos
      marginBottom: 15,
      
    },
    searchButton: {
      marginRight: 10,
      backgroundColor: '#61a5ff',
      padding: 10,
      borderRadius: 30, // Aumenta el valor para esquinas más redondeadas
    },
    searchButtonText: {
      color: 'white', // Agrega color blanco al texto del botón para que sea visible
    },
    corrector:{
      marginLeft: 260,
      flexDirection: 'row',
    },
    title: {
      fontWeight: 'bold',
      alignSelf: 'center',
      paddingVertical: 10,
    },
    scrollViewContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20, // Espacio vertical dentro del ScrollView
    },
    navigationButton: {
      color: '#259CF6',
      marginHorizontal: 20,
    },
    closeIcon: {
      marginTop: 15,
    },
    navigationButtons: {
      flexDirection: 'row',
      marginTop: 20,
      
  
    },
    root: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
      backgroundColor: '#eaeaea',
    },
    replaceerrors: {
      marginLeft:15,
     
    },
    lupa: {
      marginTop: 2,
    },
    editor: {
      flex: 1,
      padding: 0,
    
      borderWidth: 1,
      marginHorizontal: 30,
      marginVertical: 5,
   
    },
    
  });
}
export default useCustomStyles;