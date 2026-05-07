import { useAuth } from "@/context/AuthContext";
import { R3_COLORS } from "@/constants/theme";
import { Button } from "heroui-native/button";
import { Input } from "heroui-native/input";
import { Switch } from "heroui-native/switch";
import { TextField } from "heroui-native/text-field";
import { Label } from "heroui-native/label";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { R3Logo } from "@/components/R3Logo";

const { height: WINDOW_HEIGHT_RAW } = Dimensions.get("window");
const WINDOW_HEIGHT =
  typeof WINDOW_HEIGHT_RAW === "number" &&
    Number.isFinite(WINDOW_HEIGHT_RAW) &&
    WINDOW_HEIGHT_RAW > 0
    ? WINDOW_HEIGHT_RAW
    : 800;

export default function SignInScreen() {
  const { user, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [secure, setSecure] = useState(true);
  const [registerMode, setRegisterMode] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const headerHeight = WINDOW_HEIGHT * 0.3;
  const logoHeightRaw = Math.round(headerHeight);
  // En export web estático, `Dimensions` puede venir raro; forzamos un rango visual.
  const logoHeight =
    Number.isFinite(logoHeightRaw) && logoHeightRaw > 0
      ? Math.max(120, Math.min(240, logoHeightRaw))
      : 180;

  const toggleRegister = () => {
    setRegisterMode(!registerMode);
  };

  const onSubmitLogin = async () => {
    try {
      setError(null);
      await signIn(email, password, remember);
      router.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al iniciar sesión");
    }
  };

  const onSubmitRegister = async () => {
    try {
      setError(null);
      await signIn(regEmail, regPassword, true);
      router.replace("/(tabs)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al registrarse");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera marca */}
        <View
          className="w-full overflow-hidden bg-[oklch(0.62_0.19_145)]"
          style={{ minHeight: headerHeight }}
        >
          <View className="absolute -right-8 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <View className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-black/5" />
          <View className="flex-1 items-center justify-center px-6 pt-12">
            <R3Logo
              accessibilityLabel="R³"
              height={logoHeight}
            />
            <Text className="mt-3 text-center text-sm font-semibold uppercase tracking-wide text-white">
              🍃 RECICLA · REGISTRA · REPORTA 🍃
            </Text>
          </View>
        </View>

        <View>
          {!registerMode ? (
            <View className="px-6 pb-10 pt-8">
              <Text className="text-3xl font-bold text-[oklch(0.15_0_0)]">
                Iniciar Sesión
              </Text>
              <Text className="mt-1 text-base text-neutral-500">Bienvenido de vuelta</Text>

              {error ? (
                <Text className="mt-4 text-center text-sm text-red-600">{error}</Text>
              ) : null}

              <TextField className="mt-8 gap-2">
                <Label className="mb-1">
                  <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
                    Correo electrónico
                  </Label.Text>
                </Label>
                <Input
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChangeText={setEmail}
                  className="min-h-[72px] rounded-2xl border border-[oklch(0.85_0_0)] px-4 text-lg"
                />
              </TextField>

              <TextField className="mt-6 gap-2">
                <Label className="mb-1">
                  <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
                    Contraseña
                  </Label.Text>
                </Label>
                <View className="relative">
                  <Input
                    secureTextEntry={secure}
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    className="min-h-[72px] rounded-2xl border border-[oklch(0.85_0_0)] pr-14 pl-4 text-lg"
                  />
                  <Pressable
                    accessibilityLabel={secure ? "Mostrar contraseña" : "Ocultar contraseña"}
                    onPress={() => setSecure(!secure)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                  >
                    <Ionicons name={secure ? "eye-outline" : "eye-off-outline"} size={26} color="#737373" />
                  </Pressable>
                </View>
              </TextField>

              <View className="mt-6 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Switch isSelected={remember} onSelectedChange={setRemember} />
                  <Text className="text-base font-medium text-neutral-700">Recuérdame</Text>
                </View>
                <Pressable onPress={() => {}} accessibilityRole="button">
                  <Text className="font-semibold" style={{ color: R3_COLORS.primary }}>
                    ¿Olvidaste?
                  </Text>
                </Pressable>
              </View>

              <Button
                size="lg"
                className="mt-10 min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)] shadow-lg shadow-black/10"
                onPress={onSubmitLogin}
              >
                <Button.Label className="text-lg font-bold text-white">Iniciar Sesión</Button.Label>
              </Button>

              <Pressable onPress={toggleRegister} className="mt-10 items-center">
                <Text className="text-base text-neutral-600">
                  ¿No tienes cuenta?{" "}
                  <Text style={{ color: R3_COLORS.primary }} className="font-bold">
                    Regístrate &gt;
                  </Text>
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="px-6 pb-10 pt-8">
              <Text className="text-3xl font-bold text-[oklch(0.15_0_0)]">Crear cuenta</Text>
              <Text className="mt-1 text-base text-neutral-500">Únete a R³</Text>

              {error ? (
                <Text className="mt-4 text-center text-sm text-red-600">{error}</Text>
              ) : null}

              <TextField className="mt-8 gap-2">
                <Label className="mb-1">
                  <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
                    Correo electrónico
                  </Label.Text>
                </Label>
                <Input
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regEmail}
                  onChangeText={setRegEmail}
                  className="min-h-[72px] rounded-2xl border border-[oklch(0.85_0_0)] px-4 text-lg"
                />
              </TextField>

              <TextField className="mt-6 gap-2">
                <Label className="mb-1">
                  <Label.Text className="text-xs font-bold uppercase tracking-wide text-[oklch(0.15_0_0)]">
                    Contraseña
                  </Label.Text>
                </Label>
                <Input
                  secureTextEntry
                  value={regPassword}
                  onChangeText={setRegPassword}
                  className="min-h-[72px] rounded-2xl border border-[oklch(0.85_0_0)] px-4 text-lg"
                />
              </TextField>

              <Button
                size="lg"
                className="mt-10 min-h-[80px] w-full rounded-2xl bg-[oklch(0.62_0.19_145)]"
                onPress={onSubmitRegister}
              >
                <Button.Label className="text-lg font-bold text-white">Registrarse</Button.Label>
              </Button>

              <Pressable onPress={toggleRegister} className="mt-10 items-center">
                <Text className="text-base text-neutral-600">
                  ¿Ya tienes cuenta?{" "}
                  <Text style={{ color: R3_COLORS.primary }} className="font-bold">
                    Inicia sesión
                  </Text>
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
