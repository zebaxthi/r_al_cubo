import { View } from "react-native";
import { R3_COLORS } from "../constants/theme";

type Props = {
  value: number;
  className?: string;
};

/** HeroUI Native no incluye Progress; barra simple accesible. */
export function ProgressBar({ value }: Props) {
  const pct = Math.min(100, Math.max(0, Math.round(value * 100)));
  return (
    <View className="h-4 w-full overflow-hidden rounded-full bg-neutral-200">
      <View
        style={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: R3_COLORS.primary,
          borderRadius: 9999,
        }}
      />
    </View>
  );
}
