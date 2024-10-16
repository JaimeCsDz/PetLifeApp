import { ScrollView, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CardCategory } from "./CardCategory";
import { CardInformation } from "./CardInformation";

export const DashboardScreen = () => {
    return (
        <>
        <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.text}>
                        Hola, <Text style={{fontWeight: "bold"}}>Javier Can</Text>
                    </Text>
                    <Icon name='notifications-none' size={30} />
                </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <View style={styles.searchcontainer}>
                    <TextInput
                    placeholder="Buscar..."
                    placeholderTextColor={'#ABB7C2'}
                    activeOutlineColor="#ABB7C2"
                    mode="outlined"
                    outlineColor="#ABB7C2"
                    style={{width: '75%'}}
                    theme={{roundness: 20}}
                    right={
                        <TextInput.Icon
                            icon={() => (
                                <MaterialCommunityIcons name="magnify" size={24} color="#ABB7C2" />
                        )}
                        />
                    }>
                    </TextInput>
                    <View style={styles.icon}>
                        <IconButton
                            icon={'tune-variant'}
                            iconColor="#ABB7C2"
                            size={27}
                        />
                    </View>
                </View>

                <View>
                    <CardCategory />
                </View>

                <View style={styles.rowContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.boldText}>Reciente</Text>
                        <Text style={{color: 'gray', marginLeft: 15}}>Popular</Text>
                    </View>
                    <Text style={{color: '#4E7AD8'}}>Ver todo</Text>
                </View>

                <View>
                    <CardInformation />
                </View>
            </ScrollView>
        </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create ({
    headerContainer: {
        paddingLeft: 20,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 20,
    },
    text: {
        fontSize: 22,
    },
    boldText: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    searchcontainer:{
        paddingTop: 20,
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon:{
        borderCurve: 'circular',
        borderWidth: 1.5,
        borderRadius: 15,
        borderColor: '#ABB7C2',
        marginRight: 10
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
