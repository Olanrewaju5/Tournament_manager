import { Stack, useLocalSearchParams } from "expo-router";
import { Activity, ArrowLeftRight, MessageSquare, MessageSquareText, Square, Target } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";
import { MatchEventType } from "@/types/domain";

const EVENT_META: Record<MatchEventType, { icon: typeof Target; color: string }> = {
  goal: { icon: Target, color: colors.success },
  card: { icon: Square, color: colors.warning },
  substitution: { icon: ArrowLeftRight, color: colors.secondary },
  commentary: { icon: MessageSquare, color: colors.textMuted }
};

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = repository.getMatchById(id);

  if (!match) {
    return (
      <Screen>
        <Text style={styles.title}>Match not found</Text>
      </Screen>
    );
  }

  const home = repository.getTeamById(match.homeTeamId);
  const away = repository.getTeamById(match.awayTeamId);

  if (!home || !away) {
    return null;
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: `${home.shortName} vs ${away.shortName}` }} />
      <LinearGradient colors={["#1E2C51", "#141419"]} style={styles.scoreboard}>
        <View style={styles.liveRow}>
          <Activity color={match.status === "live" ? colors.success : colors.textMuted} size={16} />
          <Text style={[styles.liveText, match.status === "live" && styles.live]}>{match.status === "live" ? `${match.timer} live` : match.status}</Text>
        </View>
        <View style={styles.teams}>
          <View style={styles.teamBlock}>
            <TeamBadge team={home} size="lg" />
            <Text style={styles.teamName}>{home.name}</Text>
          </View>
          <View style={styles.score}>
            <Text style={styles.scoreText}>{match.homeScore}</Text>
            <Text style={styles.separator}>:</Text>
            <Text style={styles.scoreText}>{match.awayScore}</Text>
          </View>
          <View style={styles.teamBlock}>
            <TeamBadge team={away} size="lg" />
            <Text style={styles.teamName}>{away.name}</Text>
          </View>
        </View>
        <Text style={styles.venue}>{match.round} · {match.venue}</Text>
      </LinearGradient>

      <SectionHeader title="Event feed" action={`${match.events.length} updates`} />
      <View style={styles.feed}>
        {match.events.map((event) => {
          const meta = EVENT_META[event.type];
          const Icon = meta.icon;
          return (
            <View key={event.id} style={styles.event}>
              <View style={styles.eventLeft}>
                <View style={[styles.eventIcon, { backgroundColor: `${meta.color}22` }]}>
                  <Icon color={meta.color} size={16} />
                </View>
                <Text style={styles.minuteText}>{event.minute}'</Text>
              </View>
              <View style={styles.eventCopy}>
                <Text style={styles.eventTitle}>{event.playerName ?? "Commentary"}</Text>
                <Text style={styles.eventBody}>{event.note}</Text>
              </View>
            </View>
          );
        })}
        {match.events.length === 0 ? (
          <View style={styles.noEvents}>
            <MessageSquareText color={colors.textMuted} size={22} />
            <Text style={styles.noEventsText}>No live events yet. Kickoff updates will appear here.</Text>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 28
  },
  scoreboard: {
    borderRadius: 8,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  liveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  liveText: {
    color: colors.textMuted,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 12,
    textTransform: "uppercase"
  },
  live: {
    color: colors.success
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    gap: 10
  },
  teamBlock: {
    flex: 1,
    alignItems: "center",
    gap: 10
  },
  teamName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 13,
    textAlign: "center"
  },
  score: {
    minWidth: 116,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  scoreText: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 46
  },
  separator: {
    color: colors.textSubtle,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 26
  },
  venue: {
    color: colors.textMuted,
    fontFamily: "Sora_500Medium",
    fontSize: 12,
    textAlign: "center",
    marginTop: 24
  },
  feed: {
    gap: 10
  },
  event: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  eventLeft: {
    alignItems: "center",
    gap: 4,
    width: 42
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  minuteText: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 10
  },
  eventCopy: {
    flex: 1
  },
  eventTitle: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  eventBody: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  noEvents: {
    alignItems: "center",
    gap: 8,
    padding: 20
  },
  noEventsText: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    textAlign: "center"
  }
});
