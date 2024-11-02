import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, IconButton, TextInput, Menu } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native";
import { CardResource } from "./CardResource";
import { data } from "./CardResource";

export const ResourceScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState("Todos");
    

    const uniqueLabels = ["Todos", ...new Set(data.map((item) => item.label))];

    const handleSearch = (query: any) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    const handleFilterSelect = (label: string) => {
        setSelectedFilter(label);
        setMenuVisible(false);
        if (label === "Todos") {
            setFilteredData(data);
        } else {
            const filtered = data.filter((item) => item.label === label);
            setFilteredData(filtered);
        }
    };

    return (
        <>
            <SafeAreaView style={styles.safeArea}>
                <Appbar.Header style={{ backgroundColor: "#fff" }}>
                    <Appbar.Content
                        title="Recursos"
                        style={styles.appbarContent}
                        titleStyle={styles.titulo}
                        mode="center-aligned"
                    />
                </Appbar.Header>
                <View style={styles.searchcontainer}>
                    <TextInput
                        placeholder="Buscar..."
                        placeholderTextColor={"#ABB7C2"}
                        activeOutlineColor="#ABB7C2"
                        mode="outlined"
                        outlineColor="#ABB7C2"
                        value={searchQuery}
                        onChangeText={handleSearch}
                        style={{ width: "73%" }}
                        theme={{ roundness: 10 }}
                        right={
                            <TextInput.Icon
                                icon={() => (
                                    <MaterialCommunityIcons name="magnify" size={24} color="#ABB7C2" />
                                )}
                            />
                        }
                    />
                    <View style={styles.icon}>
                        <Menu
                            visible={menuVisible}
                            onDismiss={() => setMenuVisible(false)}
                            anchor={
                                <IconButton
                                    icon="tune-variant"
                                    iconColor="#ABB7C2"
                                    size={27}
                                    onPress={() => setMenuVisible(true)}
                                />
                            }
                        >
                            {uniqueLabels.map((label) => (
                                <Menu.Item
                                    key={label}
                                    onPress={() => handleFilterSelect(label)}
                                    title={label}
                                />
                            ))}
                        </Menu>
                    </View>
                </View>
                <ScrollView>
                    <CardResource data={filteredData} />
                </ScrollView>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    appbarContent: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    titulo: {
        fontWeight: "bold",
        fontFamily: "Urbanist-Semibold",
        fontSize: 22,
        color: "#00635D",
    },
    searchcontainer: {
        paddingTop: 20,
        paddingLeft: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    icon: {
        borderCurve: "circular",
        borderWidth: 1.5,
        borderRadius: 15,
        borderColor: "#ABB7C2",
        marginRight: 25,
    },
});
