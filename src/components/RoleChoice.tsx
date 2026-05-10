import { LucideIcon } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme/colors";

type RoleChoiceProps = {
  title: string;
  description: string;
  selected: boolean;
  icon: LucideIcon;
  onPress: () => void;
};

export function RoleChoice({ title, description, selected, icon: Icon, onPress }: RoleChoiceProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.selected,
        pressed && styles.pressed
      ]}
    >
      <View style={[styles.iconWrap, selected && styles.iconSelected]}>
        <Icon color={selected ? colors.text : colors.textMuted} size={22} strokeWidth={2.4} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {selected ? <Text style={styles.check}>✓</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 84,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12
  },
  selected: {
    borderColor: colors.secondary,
    backgroundColor: "#112435"
  },
  pressed: {
    opacity: 0.86
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft
  },
  iconSelected: {
    backgroundColor: colors.primary
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 15
  },
  description: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  check: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 18
  }
});
