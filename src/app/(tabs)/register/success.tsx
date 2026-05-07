import { useWizard } from "@/context/WizardContext";
import { Button } from "heroui-native/button";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterSuccessScreen() {
  const { reset } = useWizard();

  const goDashboard = () => {
    reset();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-8">
        <View className="h-24 w-24 items-center justify-center rounded-full bg-[oklch(0.62_0.19_145)]">
          <Ionicons name="checkmark" size={52} color="white" />
        </View>
        <Text className="mt-8 text-center text-4xl font-black text-[oklch(0.15_0_0)]">¡Guardado!</Text>
        <Text className="mt-3 text-center text-lg text-neutral-500">Registro agregado exitosamente</Text>

        <Button
          size="lg"
          className="mt-12 min-h-[72px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
          onPress={goDashboard}
        >
          <Button.Label className="text-lg font-bold text-white">Volver al Dashboard</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
