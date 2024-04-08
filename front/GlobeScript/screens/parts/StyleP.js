import { StyleSheet } from 'react-native';
import { useStyle } from '../StyleContext'
const useCustomStyles = () => {
  const { styler } = useStyle();
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
      backgroundColor: 'white',
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
    wording:{
      marginTop: 20,
      marginBottom: 15,
      fontSize: 18,
    },
    word: {
      
      fontFamily: styler.fontFamily,
      fontSize: styler.fontSize || 18, // Usa el tamaño de fuente de styler o cae de nuevo a 18
      color:  styler.textColor, // Usa el color de texto de styler o cae de nuevo a negro
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
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
      backgroundColor:  'white',
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
      backgroundColor: 'white',
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
      color: 'black' ,
    },
    footerMenu: {
      flexDirection: 'row',
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
    textsearch: {
      marginBottom: 15,
      borderRadius: 10,
      marginLeft: 20,
      flex: 1,
      backgroundColor: 'transparent',
      fontSize: 16,
    },
    
    
    textInput: {
      marginBottom: 15,
      borderRadius: 10,
      // padding: 16,
      
      flex: 1,
      backgroundColor: 'transparent',
      fontFamily: styler.fontFamily,
      fontSize: styler.fontSize || 18, // Usa el tamaño de fuente de styler o cae de nuevo a 18
      color: styler.textColor || 'black', // Usa el color de texto de styler o cae de nuevo a negro
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
     
     
      marginLeft: 20,  // Aumenta el espacio a la izquierda
      marginRight: 50,  // Reduce el espacio a la derecha si es necesario
      padding: 16,
      borderWidth: 2,
      borderColor: '#ccc',
       
      backgroundColor: styler.backgroundColor,
      borderRadius: 10,
    },    
    
    sourcee: {
      fontSize: 18,
      marginBottom: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: '#ccc',
      backgroundColor: styler.backgroundColor, // Si el color de la fuente es blanco, usa un fondo oscuro
      borderRadius: 10, 
    },
    
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'right',
      marginBottom: 15,
    },
    searchButton: {
      marginRight: 10,
      backgroundColor: '#61a5ff',
      padding: 10,
      borderRadius: 5,
    },
    
  });
}
export default useCustomStyles;