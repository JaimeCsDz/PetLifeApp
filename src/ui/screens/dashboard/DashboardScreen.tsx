import React, { useState, useEffect } from 'react';
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CardCategory } from "./CardCategory";
import { CardInformation } from "./CardInformation";
import { fetchNoticiasMascotas, IArticle } from "../../../actions/dashboard/dashboard";

export const DashboardScreen = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('pets');
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>(''); 

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        const fetchArticles = async () => {
            setIsLoading(true);
            const response = await fetchNoticiasMascotas(1, selectedCategory);
            if (response.isSuccess) {
                setArticles(response.data || []);
            }
            setIsLoading(false);
        };
        
        fetchArticles();
    }, [selectedCategory]);

    const handleSearch = async () => {
        if (searchTerm) {
            setIsLoading(true);
            const response = await fetchNoticiasMascotas(1, searchTerm);
            if (response.isSuccess) {
                setArticles(response.data || []);
            }
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className='flex-1'>
            <View className="pl-6 pt-5 flex-row items-center justify-between pr-6">
                <Text className='text-2xl'>
                    Hola, <Text style={{fontWeight: "bold"}}>Javier Can</Text>
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
                <View>
                    <CardInformation articles={articles} isLoading={isLoading} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

