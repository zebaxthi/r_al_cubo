import { WasteTypeIcon } from "@/components/WasteTypeIcon";
import { R3_COLORS } from "@/constants/theme";
import { listAllOrdered, searchRecords } from "@/db/wasteRecords";
import type { WasteRecordRow } from "@/db/wasteRecords";
import { WASTE_LABELS } from "@/utils/waste";
import { formatDateShort } from "@/utils/waste";
import { Card } from "heroui-native/card";
import { Input } from "heroui-native/input";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportsListScreen() {
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setTick((n) => n + 1);
    }, [])
  );

  const rows = useMemo(() => {
    const list = q.trim() ? searchRecords(q) : listAllOrdered();
    return list;
  }, [q, tick]);

  const totals = useMemo(() => {
    const totalKg = rows.reduce((a, r) => a + r.kilograms, 0);
    return { count: rows.length, totalKg };
  }, [rows]);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header fijo (sticky visual) para buscar + filtrar */}
      <View className="px-4 pt-2 pb-3 bg-white border-b border-neutral-100">
        <Text className="mt-2 text-3xl font-black text-[oklch(0.15_0_0)]">
          Historial de Registros
        </Text>

        <View className="mt-6 flex-row items-center gap-3">
          <View className="min-h-[56px] flex-1 flex-row items-center rounded-full border border-[oklch(0.85_0_0)] bg-neutral-50 px-4">
            <Ionicons name="search-outline" size={22} color="#737373" />
            <Input
              value={q}
              onChangeText={setQ}
              placeholder="Buscar registros..."
              className="ml-2 flex-1 border-0 bg-transparent text-base"
            />
          </View>
          <Pressable
            accessibilityRole="button"
            className="h-14 w-14 items-center justify-center rounded-2xl border border-[oklch(0.85_0_0)] bg-white"
            onPress={() => {}}
          >
            <Ionicons name="options-outline" size={26} color="#404040" />
          </Pressable>
        </View>

        <View className="mt-6 flex-row items-center justify-between rounded-2xl bg-emerald-50 px-4 py-4">
          <Text className="text-base font-semibold text-emerald-900">
            {totals.count} registros
          </Text>
          <Text className="text-lg font-black text-emerald-600">
            Total: {totals.totalKg.toFixed(1)} kg
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}>
        {rows.map((r) => (
          <RecordRow key={r.id} row={r} onOpen={() => router.push(`/reports/${r.id}`)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function RecordRow({ row, onOpen }: { row: WasteRecordRow; onOpen: () => void }) {
  const pending = row.synced === 0;
  return (
    <Pressable onPress={onOpen} accessibilityRole="button" className="mb-3">
      <Card className="min-h-[96px] rounded-3xl border border-[oklch(0.85_0_0)] bg-white">
        <Card.Body className="flex-row items-center justify-between py-4">
          <View className="flex-row items-start gap-3">
            <View className="rounded-2xl bg-sky-100 p-3">
              <WasteTypeIcon type={row.waste_type} />
            </View>
            <View className="max-w-[62%]">
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-neutral-900">{WASTE_LABELS[row.waste_type]}</Text>
                {pending ? (
                  <View className="rounded-full bg-orange-100 px-2 py-1">
                    <Text className="text-[10px] font-black uppercase text-orange-700">Pendiente</Text>
                  </View>
                ) : null}
              </View>
              <View className="mt-2 flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color="#737373" />
                <Text className="text-sm text-neutral-600">{formatDateShort(row.recorded_at)}</Text>
              </View>
              {row.address_label ? (
                <Text className="mt-1 text-xs text-neutral-500" numberOfLines={1}>
                  {row.address_label}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="items-end">
            <Text className="text-2xl font-black" style={{ color: R3_COLORS.primary }}>
              {row.kilograms.toFixed(1)}
            </Text>
            <Text className="text-xs font-bold text-emerald-700">kg</Text>
            <View className="mt-2">
              <Ionicons name="chevron-forward" size={18} color="#d4d4d4" />
            </View>
          </View>
        </Card.Body>
      </Card>
    </Pressable>
  );
}
