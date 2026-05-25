import { AccessibilityRole, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {action ? (
        onAction ? (
          <Pressable
            onPress={onAction}
            hitSlop={10}
            accessibilityRole={"button" as AccessibilityRole}
            accessibilityLabel={action}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.action}>{action}</Text>
          </Pressable>
        ) : (
          <Text style={styles.action} numberOfLines={1}>{action}</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 18,
  },
  action: {
    color: colors.secondary,
    fontFamily: "Sora_700Bold",
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});
