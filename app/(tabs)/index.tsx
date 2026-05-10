import { router } from "expo-router";
import { BellRing, CalendarClock, ImagePlus, Plus, UsersRound } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MatchCard } from "@/components/MatchCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatPill } from "@/components/StatPill";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";

export default function HomeScreen() {
  const role = useAppStore((state) => state.selectedRole);
  const tournaments = repository.getTournaments();
  const liveMatch = repository.getLiveMatch();
  const selectedTournament = tournaments[0];
  const roleTitle = role === "team-manager" ? "Team desk" : role === "spectator" ? "Follow desk" : role === "player" ? "Player desk" : "Organizer desk";

  return (
    <Screen>
      <Text style={styles.kicker}>{roleTitle}</Text>
      <Text style={styles.title}>Your next matchday is already moving.</Text>

      <LinearGradient colors={["#13213F", "#15151C"]} style={styles.commandPanel}>
        <View>
          <Text style={styles.panelLabel}>Active tournament</Text>
          <Text style={styles.panelTitle}>{selectedTournament.name}</Text>
          <Text style={styles.panelBody}>{selectedTournament.registeredTeams}/{selectedTournament.teamLimit} teams approved · {selectedTournament.prizePool} prize pool</Text>
        </View>
        <View style={styles.quickActions}>
          <PrimaryButton label="Create" icon={<Plus color={colors.text} size={18} />} style={styles.quickButton} />
          <PrimaryButton label="Teams" variant="secondary" icon={<UsersRound color={colors.text} size={18} />} style={styles.quickButton} onPress={() => router.push("/teams/islanders")} />
        </View>
      </LinearGradient>

      <View style={styles.stats}>
        <StatPill label="Pending" value={3} tone="warning" />
        <StatPill label="Live" value={1} tone="success" />
        <StatPill label="Templates" value={8} />
      </View>

      <SectionHeader title="Live now" action="Match center" />
      {liveMatch ? <MatchCard match={liveMatch} /> : null}

      <SectionHeader title="Run the day" />
      <View style={styles.taskList}>
        <Task icon={CalendarClock} title="Review today’s fixtures" body="2 matches need venue confirmation." />
        <Task icon={BellRing} title="Send team reminders" body="Notify captains before warm-up windows." />
        <Task icon={ImagePlus} title="Prepare result graphics" body="Use team colors for the next scorecard." />
      </View>
    </Screen>
  );
}

function Task({ icon: Icon, title, body }: { icon: typeof CalendarClock; title: string; body: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.task, pressed && styles.pressed]}>
      <View style={styles.taskIcon}>
        <Icon color={colors.secondary} size={20} />
      </View>
      <View style={styles.taskCopy}>
        <Text style={styles.taskTitle}>{title}</Text>
        <Text style={styles.taskBody}>{body}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 12,
    marginTop: 8,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 30,
    lineHeight: 38,
    marginTop: 8
  },
  commandPanel: {
    borderRadius: 8,
    padding: 18,
    marginTop: 22,
    borderWidth: 1,
    borderColor: colors.border
  },
  panelLabel: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
    textTransform: "uppercase"
  },
  panelTitle: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 22,
    marginTop: 8
  },
  panelBody: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6
  },
  quickActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16
  },
  quickButton: {
    flex: 1
  },
  stats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  taskList: {
    gap: 10
  },
  task: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    gap: 12
  },
  pressed: {
    opacity: 0.86
  },
  taskIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft
  },
  taskCopy: {
    flex: 1
  },
  taskTitle: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  taskBody: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  }
});
