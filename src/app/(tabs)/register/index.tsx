import { WizardChrome } from "@/components/WizardChrome";
import type { WasteType } from "@/db/wasteRecords";
import { useWizard } from "@/context/WizardContext";
import { WASTE_LABELS } from "@/utils/waste";
import { WasteTypeIcon } from "@/components/WasteTypeIcon";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const ORDER: WasteType[] = ["plastic", "paper", "metal", "glass"];

export default function RegisterStepTypeScreen() {
  const { state, setWasteType } = useWizard();
  const insets = useSafeAreaInsets();

  const canNext = useMemo(() => state.wasteType !== null, [state.wasteType]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 px-4 pt-3">
        <WizardChrome stepLabel="Paso 1 de 4 — Tipo" />

        <Text className="mt-8 text-3xl font-bold text-[oklch(0.15_0_0)]">¿Qué tipo de residuo?</Text>
        <Text className="mt-2 text-base text-neutral-500">Selecciona el material a registrar</Text>

        <View className="mt-8 flex-row flex-wrap justify-between gap-y-4">
          {ORDER.map((t) => {
            const selected = state.wasteType === t;
            return (
              <Pressable
                key={t}
                onPress={() => setWasteType(t)}
                className="w-[48%]"
                accessibilityRole="button"
                accessibilityState={{ selected }}
              >
                <Card
                  className={`rounded-3xl border-2 p-4 ${
                    selected ? "border-[oklch(0.62_0.19_145)] bg-emerald-50" : "border-[oklch(0.85_0_0)] bg-white"
                  }`}
                >
                  <Card.Body className="items-center gap-3 py-6">
                    <View className="rounded-2xl bg-neutral-100 px-4 py-3">
                      <WasteTypeIcon type={t} size={34} />
                    </View>
                    <Text className="text-lg font-bold text-neutral-900">{WASTE_LABELS[t]}</Text>
                  </Card.Body>
                </Card>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={{ paddingBottom: insets.bottom + 88 }}
        className="border-t border-neutral-100 bg-white px-4 pt-3"
      >
        <Button
          size="lg"
          isDisabled={!canNext}
          className="min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
          onPress={() => router.push("/register/quantity")}
        >
          <Button.Label className="text-lg font-bold text-white">Siguiente</Button.Label>
        </Button>
      </View>
    </SafeAreaView>
  );
}
