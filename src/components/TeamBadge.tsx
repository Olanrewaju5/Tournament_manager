import { StyleSheet, Text, View } from "react-native";
import { Team } from "@/types/domain";
import { colors } from "@/theme/colors";

type TeamBadgeProps = {
  team: Team;
  size?: "sm" | "md" | "lg";
};

export function TeamBadge({ team, size = "md" }: TeamBadgeProps) {
  return (
    <View style={[styles.badge, styles[size], { backgroundColor: team.colors[0] }]}>
      <Text style={[styles.text, size === "sm" && styles.smallText]}>{team.shortName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)"
  },
  sm: {
    width: 34,
    height: 34
  },
  md: {
    width: 46,
    height: 46
  },
  lg: {
    width: 64,
    height: 64
  },
  text: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 12
  },
  smallText: {
    fontSize: 9
  }
});
