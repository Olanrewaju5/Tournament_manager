import { ReactNode } from "react";
import { AccessibilityRole, Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors } from "@/theme/colors";

type PrimaryButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
};

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = "primary",
  style,
  disabled = false,
  accessibilityLabel,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={"button" as AccessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabledBtn,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          variant === "ghost" && styles.ghostLabel,
          variant === "danger" && styles.dangerLabel,
          disabled && styles.disabledLabel,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: colors.danger + "18",
    borderWidth: 1,
    borderColor: colors.danger + "60",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
  disabledBtn: {
    opacity: 0.42,
  },
  label: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 15,
  },
  ghostLabel: {
    color: colors.textMuted,
  },
  dangerLabel: {
    color: colors.danger,
  },
  disabledLabel: {
    color: colors.textSubtle,
  },
});
