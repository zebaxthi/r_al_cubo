import { useAuth } from "@/context/AuthContext";
import { WizardProvider } from "@/context/WizardContext";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <WizardProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#16a34a",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
          tabBarStyle: {
            height: 78,
            paddingBottom: 14,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: "#e5e5e5",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            title: "Registrar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="clipboard-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: "Reportes",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </WizardProvider>
  );
}
