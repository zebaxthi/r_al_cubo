import { WasteTypeIcon } from "@/components/WasteTypeIcon";
import { R3_COLORS } from "@/constants/theme";
import { getById } from "@/db/wasteRecords";
import { WASTE_LABELS } from "@/utils/waste";
import { formatDateShort } from "@/utils/waste";
import { Button } from "heroui-native/button";
import { Card } from "heroui-native/card";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, type ReactNode } from "react";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const row = useMemo(() => (typeof id === "string" ? getById(id) : null), [id]);

  const openMap = () => {
    if (row?.latitude != null && row.longitude != null) {
      const url = `https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`;
      Linking.openURL(url).catch(() => {});
      return;
    }
    if (row?.address_label) {
      const q = encodeURIComponent(row.address_label);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`).catch(() => {});
    }
  };

  if (!row) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-neutral-600">Registro no encontrado.</Text>
        <Button className="mt-6" onPress={() => router.back()}>
          <Button.Label>Volver</Button.Label>
        </Button>
      </SafeAreaView>
    );
  }

  const syncedLabel = row.synced === 1 ? "✓ Sincronizado" : "Pendiente de sync";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="border-b border-[oklch(0.85_0_0)] pb-4">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="h-14 w-14 items-center justify-center rounded-2xl border border-[oklch(0.85_0_0)] bg-white"
              accessibilityRole="button"
              accessibilityLabel="Volver"
            >
              <Ionicons name="chevron-back" size={26} color="#171717" />
            </Pressable>
            <Text className="flex-1 text-xl font-bold text-[oklch(0.15_0_0)]">Detalle del Registro</Text>
          </View>
        </View>

        <Card className="mt-6 rounded-3xl border border-sky-100 bg-sky-50">
          <Card.Body className="gap-2 py-6">
            <View className="flex-row items-center gap-3">
              <WasteTypeIcon type={row.waste_type} />
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase text-sky-800">Tipo de residuo</Text>
                <Text className="mt-1 text-2xl font-black text-neutral-900">
                  {WASTE_LABELS[row.waste_type]}
                </Text>
                <Text className="mt-2 text-3xl font-black" style={{ color: R3_COLORS.primary }}>
                  {row.kilograms.toFixed(1)} kg
                </Text>
              </View>
            </View>
          </Card.Body>
        </Card>

        <Card className="mt-4 rounded-3xl border border-neutral-200 bg-neutral-50">
          <Card.Body className="gap-0">
            <DetailRow icon={<Ionicons name="calendar-outline" size={22} />} label="Fecha" value={formatDateShort(row.recorded_at)} />
            <View className="h-px bg-neutral-200" />
            <DetailRow
              icon={<Ionicons name="cloud-outline" size={22} />}
              label="Estado de sync"
              value={syncedLabel}
              valueTone={row.synced === 1 ? "ok" : "warn"}
            />
            <View className="h-px bg-neutral-200" />
            <DetailRow
              icon={<Ionicons name="camera-outline" size={22} />}
              label="Foto"
              value={row.photo_uri ? "Disponible" : "No disponible"}
            />
          </Card.Body>
        </Card>

        <View className="mt-6 overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-50">
          {row.photo_uri ? (
            <Image source={{ uri: row.photo_uri }} className="h-56 w-full" resizeMode="cover" />
          ) : (
            <View className="h-56 w-full items-center justify-center">
              <MaterialCommunityIcons name="image-outline" size={44} color="#a3a3a3" />
              <Text className="mt-3 text-xs font-black uppercase tracking-wide text-neutral-400">
                Vista previa de foto
              </Text>
            </View>
          )}
        </View>

        <Button
          size="lg"
          className="mt-8 min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
          onPress={openMap}
        >
          <Button.Label className="text-lg font-bold text-white">Ver en el Mapa</Button.Label>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueTone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  valueTone?: "ok" | "warn";
}) {
  const color =
    valueTone === "ok" ? "#15803d" : valueTone === "warn" ? "#c2410c" : "#171717";
  return (
    <View className="flex-row items-center gap-4 px-4 py-5">
      <View className="w-8 items-center">{icon}</View>
      <View className="flex-1">
        <Text className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">{label}</Text>
        <Text className="mt-1 text-lg font-bold" style={{ color }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
