import { Image, Platform } from "react-native";

const R3_LOGO = require("../../assets/r3-logo.png");

type Props = {
  /**
   * Si `height` se define, usamos `aspectRatio: 1` para mantener el logo cuadrado.
   * En móviles, normalmente basta con ajustar la altura.
   */
  height?: number;
  className?: string;
  accessibilityLabel?: string;
  debugBorder?: boolean;
};

export function R3Logo({
  height,
  className,
  accessibilityLabel = "R³",
  debugBorder = false,
}: Props) {
  const resolved = R3_LOGO as any;
  const uri: string | undefined = resolved?.uri;

  // RN Web a veces no pinta `Image` con `require()` en export estático.
  // Para asegurar que el logo se vea en web, renderizamos `<img>`.
  if (Platform.OS === "web" && uri) {
    const size = height ?? undefined;
    return (
      <img
        aria-label={accessibilityLabel}
        alt={accessibilityLabel}
        className={className}
        src={uri}
        style={{
          height: size,
          width: size,
          objectFit: "contain",
          display: "block",
          borderWidth: debugBorder ? 2 : 0,
          borderColor: debugBorder ? "red" : "transparent",
        }}
      />
    );
  }

  return (
    <Image
      source={R3_LOGO}
      accessibilityLabel={accessibilityLabel}
      resizeMode="contain"
      className={className}
      style={
        height
          ? {
              height,
              aspectRatio: 1,
              width: height,
              borderWidth: debugBorder ? 2 : 0,
              borderColor: debugBorder ? "red" : "transparent",
            }
          : undefined
      }
    />
  );
}

