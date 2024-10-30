import React, { useState, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, IconButton, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardCategory } from "./CardCategory";
import { CardInformation } from "./CardInformation";
import { fetchNoticiasMascotas, fetchCategorias, fetchCategoriasById, fetchTipoById } from '../../../actions/dashboard/dashboard';
import { IDashboard } from '../../../interfaces/dashboard/IDashboard';
import { Buffer } from 'buffer';
import { ICategorias } from '../../../interfaces/dashboard/ICategorias';

interface DecodedToken {
  nombre: string;
  apPaterno: string;
  apMaterno: string;
}

export const DashboardScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<IDashboard[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [nombre, setNombre] = useState<string>(''); 
  const [apellido, setApellido] = useState<string>(''); 
  const [visibleCategoria, setVisibleCategoria] = useState(false);
  const [categorias, setCategorias] = useState<ICategorias[]>([]);

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

  const handleToggleMenu = () => {
    setVisibleCategoria(!visibleCategoria);
    console.log(`Menú de categorías ${!visibleCategoria ? 'abierto' : 'cerrado'}`);
  };

  useEffect(() => {
    const getUserDataFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decoded: any = decodeJWT(token);
          setNombre(decoded.nombre || '');
          setApellido(decoded.apellido || '');
        }
      } catch (error) {
        console.error('Error al obtener datos del token:', error);
      }
    };

    const fetchCategoriasData = async () => {
      try {
        const data = await fetchCategorias();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    getUserDataFromToken();
    fetchCategoriasData();
  }, []);

  useEffect(() => {
    const fetchInitialArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetchNoticiasMascotas();
        setArticles(response);
      } catch (error) {
        console.error("Error al cargar las noticias iniciales:", error);
      }
      setIsLoading(false);
    };
    fetchInitialArticles();
  }, []);

  // Maneja el filtro de la barra de categorías
  const handleCategoryPress = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    try {
      const filteredArticles = await fetchCategoriasById(categoryId);
      setArticles(filteredArticles);
    } catch (error) {
      console.error("Error fetching articles by category:", error);
    }
    setIsLoading(false);
  };

  const handleTypePress = async (typeId: string) => {
    setIsLoading(true);
    try {
      const filteredArticles = await fetchTipoById(typeId);
      setArticles(filteredArticles);
      if(filteredArticles.length === 0){
        Alert.alert('Aviso', 'No se encontraron consejos para este tipo de mascota')
      }
    } catch (error) {
      console.error("Error fetching articles by type:", error);
    }
    setIsLoading(false);
  };

  const handleSearch = async () => {
    const searchQuery = searchTerm.trim().toLowerCase();
    
    if (searchQuery) {
      setIsLoading(true);
  
      try {
        const response = await fetchNoticiasMascotas();
        
        const filteredArticles = response.filter(article =>
          (article.titulo.toLowerCase().includes(searchQuery) || 
            article.descripcion.toLowerCase().includes(searchQuery))
        );
  
        setArticles(filteredArticles);
  
        if (filteredArticles.length === 0) {
          Alert.alert("Aviso", "No se encontraron consejos para la búsqueda especificada.");
        }
  
      } catch (error) {
        console.error("Error fetching search results:", error);
        Alert.alert("Error", "Hubo un problema al realizar la búsqueda. Inténtalo de nuevo.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResetFilters = async () => {
    setIsLoading(true);
    setSearchTerm('');
    setSelectedCategory('');
    
    try {
      const response = await fetchNoticiasMascotas();
      setArticles(response);
    } catch (error) {
      console.error("Error fetching all articles:", error);
      Alert.alert("Error", "Hubo un problema al cargar todas las noticias. Inténtalo de nuevo.");
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className="pl-6 pt-5 flex-row items-center justify-between pr-6">
        <Text className='text-2xl'>
          Hola, <Text style={{ fontWeight: "bold" }}>{nombre} {apellido}</Text>
        </Text>
        <Icon name='notifications-none' size={30} />
      </View>

      <View className='pt-5 pl-5 flex-row align-middle justify-between'>
        <TextInput
          placeholder="Buscar..."
          placeholderTextColor={'#ABB7C2'}
          activeOutlineColor="#ABB7C2"
          mode="outlined"
          outlineColor="#ABB7C2"
          style={{ width: '78%' }}
          theme={{ roundness: 20 }}
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
        <Menu
          visible={visibleCategoria}
          onDismiss={() => setVisibleCategoria(false)}
          anchorPosition="bottom"
          anchor={
            <View className="border rounded-xl border-gray-400 mr-3">
              <IconButton
                icon={'tune-variant'}
                iconColor="#ABB7C2"
                size={27}
                onPress={handleToggleMenu}
              />
            </View>
          }
        >
          {categorias.map((categoria) => (
            <Menu.Item
              key={categoria.id}
              onPress={() => {
                handleCategoryPress(categoria.id);
                setVisibleCategoria(false);
              }}
              title={categoria.nombreCate}
            />
          ))}
        </Menu>
      </View>

      <View>
        <CardCategory onCategoryPress={handleTypePress} />
      </View>

      <ScrollView className='flex-grow pb-5'>
        <View className='flex-row justify-between align-middle pl-5 pr-5 pt-3'>
          <View className='flex-row align-middle'>
            <Text className='font-bold underline'>Reciente</Text>
            <Text className='text-gray-500 ml-3'>Popular</Text>
          </View>
          <Text className='text-blue-600' onPress={handleResetFilters}>Ver todo</Text>
        </View>

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
