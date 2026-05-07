import { WizardChrome } from "@/components/WizardChrome";
import { useWizard } from "@/context/WizardContext";
import { R3_COLORS } from "@/constants/theme";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { Label } from "heroui-native/label";
import { TextField } from "heroui-native/text-field";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterQuantityScreen() {
  const { state, setKilograms, setRecordedAt } = useWizard();
  const insets = useSafeAreaInsets();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (!state.wasteType) router.replace("/register");
  }, [state.wasteType]);

  const valid = useMemo(() => {
    const n = Number(String(state.kilograms).replace(",", "."));
    return Number.isFinite(n) && n > 0;
  }, [state.kilograms]);

  const fmtDate = useMemo(() => {
    return state.recordedAt.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [state.recordedAt]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 px-4 pt-3">
        <WizardChrome stepLabel="Paso 2 de 4 — Cantidad" />

        <Text className="mt-8 text-3xl font-bold text-[oklch(0.15_0_0)]">Cantidad y Fecha</Text>
        <Text className="mt-2 text-base text-neutral-500">Ingresa los kilogramos reciclados</Text>

        <TextField className="mt-10 gap-2">
          <Label>
            <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
              Kilogramos (kg)
            </Label.Text>
          </Label>
          <View className="relative">
            <Input
              keyboardType="decimal-pad"
              value={state.kilograms}
              onChangeText={setKilograms}
              placeholder="0.0"
              className="min-h-[76px] rounded-2xl border border-[oklch(0.85_0_0)] bg-neutral-50 pl-4 pr-16 text-3xl font-bold text-neutral-700"
            />
            <Text
              className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-black"
              style={{ color: R3_COLORS.primary }}
            >
              kg
            </Text>
          </View>
        </TextField>

        <TextField className="mt-8 gap-2">
          <Label>
            <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
              Fecha de recolección
            </Label.Text>
          </Label>
          <Pressable
            onPress={() => setShowPicker(true)}
            className="min-h-[76px] flex-row items-center justify-between rounded-2xl border border-[oklch(0.85_0_0)] bg-neutral-50 px-4"
          >
            <Text className="text-xl font-bold text-neutral-900">{fmtDate}</Text>
            <Ionicons name="calendar-outline" size={26} color="#737373" />
          </Pressable>
        </TextField>

        {showPicker ? (
          <DateTimePicker
            value={state.recordedAt}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, d) => {
              setShowPicker(false);
              if (d) setRecordedAt(d);
            }}
          />
        ) : null}
      </View>

      <View
        style={{ paddingBottom: insets.bottom + 88 }}
        className="border-t border-neutral-100 bg-white px-4 pt-3"
      >
        <Button
          size="lg"
          isDisabled={!valid}
          className="min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
          onPress={() => router.push("/register/location")}
        >
          <Button.Label className="text-lg font-bold text-white">Siguiente</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
