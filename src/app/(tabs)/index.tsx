import { ProgressBar } from "@/components/ProgressBar";
import { WasteTypeIcon } from "@/components/WasteTypeIcon";
import { R3Logo } from "@/components/R3Logo";
import { R3_COLORS, WEEKLY_GOAL_KG } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import {
  countUnsynced,
  getLast7DaysSum,
  getPrevious7DaysSum,
  getTotals,
  getWeeklyProgress,
  listRecent,
} from "@/db/wasteRecords";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WASTE_LABELS } from "@/utils/waste";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card } from "heroui-native/card";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function greetingLabel(): string {
  const h = new Date().getHours();
  if (h < 12) return "Buenos días";
  if (h < 19) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const online = useOnlineStatus();
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const totals = useMemo(() => getTotals(), [tick]);
  const week = useMemo(() => getWeeklyProgress(), [tick]);
  const last7 = useMemo(() => getLast7DaysSum(), [tick]);
  const prev7 = useMemo(() => getPrevious7DaysSum(), [tick]);
  const recent = useMemo(() => listRecent(5), [tick]);
  const unsynced = useMemo(() => countUnsynced(), [tick]);

  const trendDelta = last7 - prev7;
  const weekRatio = Math.min(1, week.weekSumKg / WEEKLY_GOAL_KG);
  const remaining = Math.max(0, WEEKLY_GOAL_KG - week.weekSumKg);
  const pct = Math.round(weekRatio * 100);

  const syncState = useMemo(() => {
    if (!online) return { label: "SIN RED", tone: "warning" as const };
    if (unsynced > 0) return { label: "PENDIENTE", tone: "warning" as const };
    return { label: "SINCRONIZADO", tone: "ok" as const };
  }, [online, unsynced]);

  const pillBorder =
    syncState.tone === "ok" ? "border-emerald-300 bg-emerald-50" : "border-orange-300 bg-orange-50";
  const pillText = syncState.tone === "ok" ? "text-emerald-700" : "text-orange-700";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Top bar */}
        <View className="mt-2 flex-row items-center justify-between">
          <View className="flex-row items-end">
            <R3Logo height={36} accessibilityLabel="R³" />
          </View>
          <View className="flex-row items-center gap-3">
            <View className={`flex-row items-center gap-2 rounded-full border px-3 py-2 ${pillBorder}`}>
              <Ionicons
                name="cloud-outline"
                size={18}
                color={syncState.tone === "ok" ? R3_COLORS.syncGreen : R3_COLORS.warning}
              />
              <Text className={`text-xs font-bold ${pillText}`}>{syncState.label}</Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[oklch(0.62_0.19_145)]">
              <Ionicons name="person" size={22} color="white" />
            </View>
          </View>
        </View>

        <Text className="mt-6 text-lg text-neutral-600">
          {greetingLabel()} 👋
        </Text>
        <Text className="mt-1 text-3xl font-bold text-[oklch(0.15_0_0)]">{user?.name ?? "Usuario"}</Text>

        {/* Kilos card */}
        <Card className="mt-6 rounded-3xl border-0 bg-[oklch(0.62_0.19_145)] p-5 shadow-sm">
          <Card.Body className="gap-3">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons name="leaf" size={18} color="white" />
              <Text className="text-xs font-bold uppercase tracking-wide text-white/90">
                Kilos reciclados
              </Text>
            </View>
            <Text className="text-5xl font-black text-white">{totals.totalKg.toFixed(1)} kg</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="trending-up" size={18} color="white" />
              <Text className="text-sm font-semibold text-white/90">
                {trendDelta >= 0 ? "+" : ""}
                {trendDelta.toFixed(1)} kg vs semana anterior
              </Text>
            </View>
          </Card.Body>
        </Card>

        {/* Weekly goal */}
        <Card className="mt-4 rounded-3xl border border-[oklch(0.85_0_0)] bg-white p-5 shadow-sm">
          <Card.Body className="gap-3">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                  Meta semanal
                </Text>
                <Text className="mt-2 text-2xl font-bold text-neutral-900">
                  {week.weekSumKg.toFixed(1)} / {WEEKLY_GOAL_KG} kg
                </Text>
              </View>
              <View className="rounded-2xl bg-emerald-50 p-2">
                <Ionicons name="trending-up-outline" size={22} color={R3_COLORS.primary} />
              </View>
            </View>
            <ProgressBar value={weekRatio} />
            <View className="flex-row justify-between">
              <Text className="text-sm text-neutral-600">{pct}% completado</Text>
              <Text className="text-sm font-semibold text-emerald-600">{remaining.toFixed(1)} kg restantes</Text>
            </View>
          </Card.Body>
        </Card>

        {/* Grid stats */}
        <View className="mt-4 flex-row gap-3">
          <Card className="flex-1 rounded-3xl border border-[oklch(0.85_0_0)] bg-white p-4">
            <Card.Body className="gap-2">
              <View className="self-start rounded-2xl bg-sky-100 p-2">
                <MaterialCommunityIcons name="database-outline" size={22} color="#0284c7" />
              </View>
              <Text className="text-3xl font-black text-neutral-900">{totals.count}</Text>
              <Text className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                Registros totales
              </Text>
            </Card.Body>
          </Card>

          <Card className="flex-1 rounded-3xl border border-[oklch(0.85_0_0)] bg-white p-4">
            <Card.Body className="gap-2">
              <View className="self-start rounded-2xl bg-emerald-100 p-2">
                <MaterialCommunityIcons name="sync" size={22} color="#15803d" />
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={22} color="#15803d" />
                <Text className="text-sm font-black text-emerald-700">
                  {online ? "SINCRONIZADO" : "OFFLINE"}
                </Text>
              </View>
              <Text className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">
                Estado sync
              </Text>
            </Card.Body>
          </Card>
        </View>

        {/* Recent */}
        <Text className="mb-3 mt-8 text-sm font-black uppercase tracking-wide text-neutral-900">
          Últimos registros
        </Text>
        {recent.length === 0 ? (
          <Text className="text-neutral-500">Aún no hay registros. Pulsa + para agregar.</Text>
        ) : (
          recent.map((r) => (
            <Card key={r.id} className="mb-3 rounded-2xl border border-[oklch(0.85_0_0)] bg-white">
              <Card.Body className="flex-row items-center justify-between py-4">
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                    <WasteTypeIcon type={r.waste_type} />
                  </View>
                  <Text className="text-lg font-bold text-neutral-900">
                    {WASTE_LABELS[r.waste_type]}
                  </Text>
                </View>
                <Text className="text-lg font-black text-emerald-600">{r.kilograms.toFixed(1)} kg</Text>
              </Card.Body>
            </Card>
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => router.push("/register")}
        className="absolute bottom-24 right-5 h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.62_0.19_145)] shadow-lg shadow-black/20"
        accessibilityRole="button"
        accessibilityLabel="Agregar registro"
      >
        <Ionicons name="add" size={34} color="white" />
      </Pressable>
    </SafeAreaView>
  );
}
