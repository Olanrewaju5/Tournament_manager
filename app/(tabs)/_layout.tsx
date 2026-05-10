import { Tabs } from "expo-router";
import { Bell, Home, ImagePlus, ListOrdered, Trophy } from "lucide-react-native";
import { colors } from "@/theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          minHeight: 72,
          paddingTop: 8
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarLabelStyle: {
          fontFamily: "Sora_700Bold",
          fontSize: 10
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <Home color={color} size={22} /> }} />
      <Tabs.Screen name="tournaments" options={{ title: "Leagues", tabBarIcon: ({ color }) => <Trophy color={color} size={22} /> }} />
      <Tabs.Screen name="standings" options={{ title: "Table", tabBarIcon: ({ color }) => <ListOrdered color={color} size={22} /> }} />
      <Tabs.Screen name="graphics" options={{ title: "Studio", tabBarIcon: ({ color }) => <ImagePlus color={color} size={22} /> }} />
      <Tabs.Screen name="notifications" options={{ title: "Alerts", tabBarIcon: ({ color }) => <Bell color={color} size={22} /> }} />
    </Tabs>
  );
}
