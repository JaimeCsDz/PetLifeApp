import { useState } from "react";
import { BottomNavigation, useTheme } from "react-native-paper";
import { DashboardScreen } from "../dashboard/DashboardScreen";
import { MapsScreen } from "../maps/MapsScreen";
import { ProfileScreen } from '../perfil/ProfileScreen';
import { ResourceScreen } from '../recursos/ResourceScreen';
import { useColorScheme } from "react-native";

const DashboardRoute = () => <DashboardScreen />;
const MapsRoute = () => <MapsScreen />;
const ProfileRoute = () => <ProfileScreen />;
const ResourcesRoute = () => <ResourceScreen />;

export const HomeScreen = () => {
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {
      key: "dashboard",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "mapa",
      title: "Mapa",
      focusedIcon: "map",
      unfocusedIcon: "map-outline",
    },
    {
      key: "perfil",
      title: "Perfil",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    },
    {
      key: "recursos",
      title: "Recursos",
      focusedIcon: "folder",
      unfocusedIcon: "folder-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    dashboard: DashboardRoute,
    mapa: MapsRoute,
    perfil: ProfileRoute,
    recursos: ResourcesRoute,
  });

  const { colors } = useTheme();
  const scheme = useColorScheme();

  return (
    <BottomNavigation
      barStyle={{
        backgroundColor: colors.background,
        shadowColor: colors.shadow,
        shadowOpacity: scheme === "light" ? 0.1 : 0.3,
        shadowRadius: 10,
      }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};
