import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type SectionHeaderProps = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, action, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        onAction ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={styles.action}>{action}</Text>
          </Pressable>
        ) : (
          <Text style={styles.action}>{action}</Text>
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
    marginBottom: 12
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 18
  },
  action: {
    color: colors.secondary,
    fontFamily: "Sora_700Bold",
    fontSize: 12
  }
});
