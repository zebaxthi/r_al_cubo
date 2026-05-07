import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { WasteType } from "../db/wasteRecords";
import { View } from "react-native";

const MAP: Record<WasteType, keyof typeof MaterialCommunityIcons.glyphMap> = {
  plastic: "recycle",
  paper: "file-document-outline",
  metal: "wrench",
  glass: "glass-wine",
};

type Props = {
  type: WasteType;
  size?: number;
  color?: string;
};

export function WasteTypeIcon({ type, size = 28, color = "#15803d" }: Props) {
  const name = MAP[type];
  return (
    <View className="items-center justify-center">
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </View>
  );
}
