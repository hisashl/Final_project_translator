import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCensorOption = async () => {
  try {
    const censorOption = await AsyncStorage.getItem('censorOption');
    return censorOption || 'none'; // Devuelve 'none' como valor por defecto si no se encuentra nada guardado
  } catch (error) {
   // console.error('Failed to retrieve the censor option', error);
    return 'none'; // Devuelve un valor por defecto en caso de error
  }
};
