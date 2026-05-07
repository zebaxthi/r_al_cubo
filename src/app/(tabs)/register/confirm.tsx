import { WizardChrome } from "@/components/WizardChrome";
import { WasteTypeIcon } from "@/components/WasteTypeIcon";
import { useWizard } from "@/context/WizardContext";
import { insertWasteRecord } from "@/db/wasteRecords";
import { WASTE_LABELS } from "@/utils/waste";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, type ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterConfirmScreen() {
  const { state } = useWizard();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!state.wasteType) router.replace("/register");
  }, [state.wasteType]);

  const kg = useMemo(
    () => Number(String(state.kilograms).replace(",", ".")),
    [state.kilograms]
  );

  const canSave = useMemo(() => {
    return (
      state.wasteType !== null && Number.isFinite(kg) && kg > 0
    );
  }, [state.wasteType, kg]);

  const isoDate = useMemo(() => state.recordedAt.toISOString().slice(0, 10), [state.recordedAt]);

  const onConfirm = () => {
    if (!state.wasteType || !canSave) return;
    insertWasteRecord({
      wasteType: state.wasteType,
      kilograms: kg,
      recordedAt: state.recordedAt,
      addressLabel: state.addressLabel,
      latitude: state.latitude,
      longitude: state.longitude,
      photoUri: state.photoUri,
      synced: false,
    });
    router.replace("/register/success");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-4 pt-3" contentContainerStyle={{ paddingBottom: 140 }}>
        <WizardChrome stepLabel="Paso 4 de 4 — Confirmar" />

        <Text className="mt-8 text-3xl font-bold text-[oklch(0.15_0_0)]">Confirmar Registro</Text>
        <Text className="mt-2 text-base text-neutral-500">Revisa los datos antes de guardar</Text>

        <Card className="mt-8 rounded-3xl border border-[oklch(0.85_0_0)] bg-white">
          <Card.Body className="gap-0">
            <SummaryRow
              icon={
                state.wasteType ? (
                  <WasteTypeIcon type={state.wasteType} />
                ) : (
                  <Ionicons name="leaf-outline" size={22} color="#404040" />
                )
              }
              label="Tipo de residuo"
              value={state.wasteType ? WASTE_LABELS[state.wasteType] : "—"}
            />
            <Divider />
            <SummaryRow
              icon={<Ionicons name="scale-outline" size={22} color="#404040" />}
              label="Kilogramos"
              value={`${kg.toFixed(1)} kg`}
            />
            <Divider />
            <SummaryRow
              icon={<Ionicons name="calendar-outline" size={22} color="#404040" />}
              label="Fecha"
              value={isoDate}
            />
            <Divider />
            <SummaryRow
              icon={<Ionicons name="location-outline" size={22} color="#db2777" />}
              label="Ubicación"
              value={state.addressLabel || "—"}
            />
            <Divider />
            <SummaryRow
              icon={<Ionicons name="camera-outline" size={22} color="#404040" />}
              label="Foto"
              value={state.photoUri ? "Capturada" : "Sin foto"}
            />
          </Card.Body>
        </Card>
      </ScrollView>

      <View
        style={{ paddingBottom: insets.bottom + 88 }}
        className="border-t border-neutral-100 bg-white px-4 pt-3"
      >
        <Button
          size="lg"
          isDisabled={!canSave}
          className="min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
          onPress={onConfirm}
        >
          <Button.Label className="text-lg font-bold text-white">Confirmar y Guardar</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function Divider() {
  return <View className="h-px w-full bg-neutral-200" />;
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View className="flex-row items-center gap-4 px-4 py-5">
      <View className="w-10 items-center">{icon}</View>
      <View className="flex-1">
        <Text className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">{label}</Text>
        <Text className="mt-1 text-lg font-bold text-neutral-900">{value}</Text>
      </View>
    </View>
  );
}
