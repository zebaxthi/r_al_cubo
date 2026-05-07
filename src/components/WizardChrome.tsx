import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  title?: string;
  stepLabel: string;
};

export function WizardChrome({ title = "Nuevo Registro", stepLabel }: Props) {
  const router = useRouter();

  return (
    <View className="border-b border-[oklch(0.85_0_0)] pb-4">
      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={() => router.back()}
          className="h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100"
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Ionicons name="chevron-back" size={28} color="#171717" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-bold text-[oklch(0.15_0_0)]">{title}</Text>
          <Text className="text-sm text-neutral-500">{stepLabel}</Text>
        </View>
      </View>
    </View>
  );
}
