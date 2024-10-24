import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { MapsScreen } from "../maps/MapsScreen";
import { ProfileScreen } from "../perfil/ProfileScreen";
import { ResourceScreen } from "../recursos/ResourceScreen";
import { Citas } from "../citas/Citas";

const DashboardRoute = () => <DashboardScreen />;
const CitaRoute = () => <Citas />;
const MapsRoute = () => <MapsScreen />;
const ProfileRoute = () => <ProfileScreen />;
const ResourcesRoute = () => <ResourceScreen />;

export const HomeScreen = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: "dashboard", title: "Home", focusedIcon: "home-outline" as const, unfocusedIcon: "home-outline" as const },
    { key: "cita", title: "Citas", focusedIcon: "paw-outline" as const, unfocusedIcon: "paw-outline" as const },
    { key: "mapa", title: "", focusedIcon: "map-marker" as const, unfocusedIcon: "map-marker-outline" as const },
    { key: "perfil", title: "Perfil", focusedIcon: "account-outline" as const, unfocusedIcon: "account-outline" as const },
    { key: "recursos", title: "Recursos", focusedIcon: "phone-plus-outline" as const, unfocusedIcon: "phone-plus-outline" as const },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    cita: CitaRoute,
    mapa: MapsRoute,
    perfil: ProfileRoute,
    recursos: ResourcesRoute,
  });

  return (
    <View style={styles.container}>
      <BottomNavigation
        barStyle={styles.bottomBar}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={({ route, focused }) => (
          <View
            style={[
              styles.iconContainer,
              route.key === "mapa" ? styles.circleIcon : null,
            ]}
          >
            <MaterialCommunityIcons
              name={focused ? route.focusedIcon : route.unfocusedIcon}
              color={route.key === "mapa" ? "#FFFFFF" : (focused ? "#037972" : "#A2A2A2")}
              size={focused ? 28 : 24}
            />
          </View>
        )}
        activeColor="#037972"
        inactiveColor="#A2A2A2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  bottomBar: {
    backgroundColor: "#F6F6F6",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    position: 'static',
    zIndex: 0,
    height: 80,
    paddingBottom: 20,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleIcon: {
    backgroundColor: "#037972",
    borderRadius: 50,
    position: 'absolute',
    top: -15,
    width: 65,
    height: 65,
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "#ffff",
    zIndex: 1,
  },
});
