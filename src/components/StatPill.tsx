import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type StatPillProps = {
  label: string;
  value: string | number;
  tone?: "default" | "success" | "warning";
};

export function StatPill({ label, value, tone = "default" }: StatPillProps) {
  const toneColor = tone === "success" ? colors.success : tone === "warning" ? colors.warning : colors.secondary;

  return (
    <View style={styles.pill}>
      <Text style={[styles.value, { color: toneColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minWidth: 82,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  value: {
    fontFamily: "Sora_800ExtraBold",
    fontSize: 18
  },
  label: {
    marginTop: 2,
    color: colors.textMuted,
    fontFamily: "Sora_500Medium",
    fontSize: 11
  }
});
