import { WizardChrome } from "@/components/WizardChrome";
import { useWizard } from "@/context/WizardContext";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { TextField } from "heroui-native/text-field";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterLocationScreen() {
  const { state, setAddressLabel, setPhotoUri, setGeo } = useWizard();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!state.wasteType) router.replace("/register");
  }, [state.wasteType]);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permiso requerido", "Activa el acceso a la cámara para tomar la foto.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled && res.assets[0]) {
      setPhotoUri(res.assets[0].uri);
      setGeo(19.4326, -99.1332);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 px-4 pt-3">
        <WizardChrome stepLabel="Paso 3 de 4 — Ubicación" />

        <Text className="mt-8 text-3xl font-bold text-[oklch(0.15_0_0)]">Ubicación y Foto</Text>
        <Text className="mt-2 text-base text-neutral-500">Documenta el punto de recolección</Text>

        {/* Map placeholder */}
        <View className="relative mt-8 overflow-hidden rounded-3xl border border-[oklch(0.85_0_0)] bg-emerald-50">
          <View className="h-56 w-full bg-emerald-100 opacity-90">
            <View className="absolute inset-0 opacity-25">
              {Array.from({ length: 10 }).map((_, i) => (
                <View key={i} className="absolute h-full w-px bg-emerald-700/30" style={{ left: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <View key={`h-${i}`} className="absolute h-px w-full bg-emerald-700/30" style={{ top: `${i * 14}%` }} />
              ))}
            </View>
            <View className="absolute inset-0 items-center justify-center">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.62_0.19_145)]">
                <MaterialCommunityIcons name="map-marker" size={28} color="white" />
              </View>
            </View>
          </View>
          <View className="absolute bottom-4 left-4 right-4 items-center">
            <View className="flex-row items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
              <MaterialCommunityIcons name="map-marker" size={18} color="#dc2626" />
              <Text className="text-sm font-semibold text-neutral-900">{state.addressLabel}</Text>
            </View>
          </View>
        </View>

        <TextField className="mt-6 gap-2">
          <Label>
            <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
              Dirección mostrada
            </Label.Text>
          </Label>
          <Input
            value={state.addressLabel}
            onChangeText={setAddressLabel}
            className="min-h-[56px] rounded-2xl border border-[oklch(0.85_0_0)] px-4 text-base"
          />
        </TextField>

        <Pressable
          onPress={takePhoto}
          className="mt-6 min-h-[76px] w-full flex-row items-center gap-4 rounded-2xl bg-neutral-100 px-4"
          accessibilityRole="button"
        >
          <View className="rounded-2xl bg-neutral-200 p-3">
            <Ionicons name="camera" size={26} color="#404040" />
          </View>
          <Text className="flex-1 text-center text-lg font-bold text-neutral-900">Tomar Foto</Text>
        </Pressable>
      </View>

      <View
        style={{ paddingBottom: insets.bottom + 88 }}
        className="border-t border-neutral-100 bg-white px-4 pt-3"
      >
        <Button
          size="lg"
          className="min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
          onPress={() => router.push("/register/confirm")}
        >
          <Button.Label className="text-lg font-bold text-white">Siguiente</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
