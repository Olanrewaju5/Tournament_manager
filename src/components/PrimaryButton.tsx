import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/theme/colors";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, icon, variant = "primary", style }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        style
      ]}
    >
      {icon}
      <Text style={[styles.label, variant === "ghost" && styles.ghostLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  ghost: {
    backgroundColor: "transparent"
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }]
  },
  label: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 15
  },
  ghostLabel: {
    color: colors.textMuted
  }
});
