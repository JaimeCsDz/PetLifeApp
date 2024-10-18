import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StackNavigator } from './src/ui/routes/StackNavigator';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './src/ui/constants/Colors';
import * as Font from 'expo-font';
import { LoadingScreen } from './src/ui/screens/loading/LoadingScreen';

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;
  
  const [isLoading, setIsLoading] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
      'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
      'Urbanist-Semibold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts().then(() => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });
  }, []);

  if (isLoading || !fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <GestureHandlerRootView style={{ flex: 1 }}> 
            <StackNavigator />
        </GestureHandlerRootView>
      </NavigationContainer>
    </PaperProvider>
  );
}
