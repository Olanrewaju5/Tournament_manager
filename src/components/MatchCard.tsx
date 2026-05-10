import { router } from "expo-router";
import { Clock3, MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";
import { Match } from "@/types/domain";
import { TeamBadge } from "@/components/TeamBadge";

type MatchCardProps = {
  match: Match;
};

export function MatchCard({ match }: MatchCardProps) {
  const home = repository.getTeamById(match.homeTeamId);
  const away = repository.getTeamById(match.awayTeamId);

  if (!home || !away) {
    return null;
  }

  const statusLabel = match.status === "live" ? match.timer ?? "Live" : match.status === "final" ? "Final" : "Upcoming";

  return (
    <Pressable
      onPress={() => router.push(`/matches/${match.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.round}>{match.round}</Text>
        <Text style={[styles.status, match.status === "live" && styles.live]}>{statusLabel}</Text>
      </View>
      <View style={styles.scoreRow}>
        <View style={styles.team}>
          <TeamBadge team={home} />
          <Text style={styles.teamName} numberOfLines={1}>{home.name}</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.score}>{match.homeScore}</Text>
          <Text style={styles.dash}>-</Text>
          <Text style={styles.score}>{match.awayScore}</Text>
        </View>
        <View style={styles.team}>
          <TeamBadge team={away} />
          <Text style={styles.teamName} numberOfLines={1}>{away.name}</Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <MapPin color={colors.textSubtle} size={14} />
        <Text style={styles.meta}>{match.venue}</Text>
        <Clock3 color={colors.textSubtle} size={14} />
        <Text style={styles.meta}>{new Date(match.startsAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14
  },
  pressed: {
    opacity: 0.86
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  round: {
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 12
  },
  status: {
    color: colors.textMuted,
    fontFamily: "Sora_700Bold",
    fontSize: 12
  },
  live: {
    color: colors.success
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  team: {
    flex: 1,
    alignItems: "center",
    gap: 8
  },
  teamName: {
    color: colors.text,
    fontFamily: "Sora_600SemiBold",
    fontSize: 12,
    textAlign: "center"
  },
  scoreBox: {
    minWidth: 96,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  score: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 34
  },
  dash: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 18
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  meta: {
    color: colors.textSubtle,
    fontFamily: "Sora_500Medium",
    fontSize: 11,
    marginRight: 8
  }
});
