import { StyleSheet, Text, View, FlatList, Animated } from 'react-native';
import React, {  useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import slides from './slide'; // Asegúrate de que 'slides' es el nombre correcto del import
import BItem from './BItem';
import Paginador from './Paginador';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Bienvenida() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const slidesRef = React.useRef(null);

  const viewableItemsChanged = React.useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = React.useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderItem = ({ item, index }) => {
    const isLastItem = index === slides.length - 1;
    return <BItem item={item} isLastItem={isLastItem} />;
  };

  useEffect(() => {
    
    const checkAuthentication = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        
        if (username && password) {
          navigation.replace('Home');
        }
      } catch (error) {
        console.error('Error checking authentication', error);
      }
    };
  
    checkAuthentication();
  

     
    
    
    
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ flex: 3}}>
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <Paginador data={slides} scrollX={scrollX} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ... any other styles you might have
});
