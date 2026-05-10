import { LucideIcon } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type EmptyStateProps = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export function EmptyState({ title, body, icon: Icon }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <Icon color={colors.textMuted} size={28} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    padding: 20,
    gap: 8
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 15
  },
  body: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  }
});
