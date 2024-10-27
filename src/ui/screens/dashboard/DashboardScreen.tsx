import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardCategory } from "./CardCategory";
import { CardInformation } from "./CardInformation";
import { fetchNoticiasMascotas } from "../../../actions/dashboard/dashboard";
import { IDashboard } from '../../../interfaces/dashboard/IDashboard';
import { Buffer } from 'buffer';


interface DecodedToken {
  nombre: string;
  apPaterno: string;
  apMaterno: string;}

export const DashboardScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('pets');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<IDashboard[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [nombre, setNombre] = useState<string>(''); 
  const [apellido, setApellido] = useState<string>(''); 

  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  };
  
  
  useEffect(() => {
    const getUserDataFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded: any = decodeJWT(token);
          console.log('Datos del token decodificado:', decoded);
  
          setNombre(decoded.nombre || '');
          setApellido(decoded.apellido || '');
        }
      } catch (error) {
        console.error('Error al obtener datos del token:', error);
      }
    };
  
    getUserDataFromToken();
  }, []);
  
  


  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const response = await fetchNoticiasMascotas();
            if (response.length > 0) {
                setArticles(response);
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
        setIsLoading(false);
    };
    
    fetchArticles();
}, [selectedCategory]);

    const handleSearch = async () => {
        if (searchTerm) {
            setIsLoading(true);
            try {
                const response = await fetchNoticiasMascotas(); 
                setArticles(response);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
            setIsLoading(false);
        }
    };

  return (
    <SafeAreaView className='flex-1'>
      <View className="pl-6 pt-5 flex-row items-center justify-between pr-6">
        <Text className='text-2xl'>
          Hola, <Text style={{ fontWeight: "bold" }}>{nombre} {apellido}</Text>
        </Text>
        <Icon name='notifications-none' size={30} />
      </View>

            {/* Barra de búsqueda */}
            <View className='pt-5 pl-5 flex-row align-middle justify-between'>
                <TextInput
                    placeholder="Buscar..."
                    placeholderTextColor={'#ABB7C2'}
                    activeOutlineColor="#ABB7C2"
                    mode="outlined"
                    outlineColor="#ABB7C2"
                    style={{width: '78%'}}
                    theme={{roundness: 20}}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={handleSearch}
                    right={
                        <TextInput.Icon
                            icon={() => (
                                <MaterialCommunityIcons name="magnify" size={24} color="#ABB7C2" />
                            )}
                            onPress={handleSearch}
                        />
                    }
                />
                <View className="border rounded-xl border-gray-400 mr-3">
                    <IconButton
                        icon={'tune-variant'}
                        iconColor="#ABB7C2"
                        size={27}
                    />
                </View>
            </View>

            <View>
                <CardCategory onCategoryPress={handleCategoryPress} />
            </View>

            <ScrollView className='flex-grow pb-5'>
                <View className='flex-row justify-between align-middle pl-5 pr-5 pt-3'>
                    <View className='flex-row align-middle'>
                        <Text className='font-bold underline'>Reciente</Text>
                        <Text className='text-gray-500 ml-3'>Popular</Text>
                    </View>
                    <Text className='text-blue-600'>Ver todo</Text>
                </View>
                
                {/* Mostrar noticias o un indicador de carga */}
                <View>
                    {isLoading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <CardInformation articles={articles} isLoading={isLoading} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
