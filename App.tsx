import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { StackNavigator } from './src/ui/routes/StackNavigator';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './src/ui/constants/Colors';

export default function App() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}> 
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <StackNavigator />
        </PaperProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}