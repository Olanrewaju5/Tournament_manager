import { router } from "expo-router";
import { Activity, BellRing, CalendarClock, Check, ImagePlus, LucideIcon, Plus, UserRound, UsersRound } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { EmptyState } from "@/components/EmptyState";
import { MatchCard } from "@/components/MatchCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatPill } from "@/components/StatPill";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { Team, UserRole } from "@/types/domain";

function ManagementPanel({ tournament, role }: { tournament: NonNullable<ReturnType<typeof repository.getTournamentById>>; role: UserRole }) {
  return (
    <LinearGradient colors={["#13213F", "#15151C"]} style={styles.commandPanel}>
      <View>
        <Text style={styles.panelLabel}>Active tournament</Text>
        <Text style={styles.panelTitle}>{tournament.name}</Text>
        <Text style={styles.panelBody}>
          {tournament.registeredTeams}/{tournament.teamLimit} teams approved · {tournament.prizePool} prize pool
        </Text>
      </View>
      <View style={styles.quickActions}>
        {role === "organizer" ? (
          <>
            <PrimaryButton
              label="Add team"
              icon={<Plus color={colors.text} size={18} />}
              style={styles.quickButton}
              onPress={() => router.push("/teams/new")}
            />
            <PrimaryButton
              label="Leagues"
              variant="secondary"
              icon={<UsersRound color={colors.text} size={18} />}
              style={styles.quickButton}
              onPress={() => router.push("/tournaments/" + tournament.id)}
            />
          </>
        ) : (
          <>
            <PrimaryButton
              label="Add team"
              icon={<Plus color={colors.text} size={18} />}
              style={styles.quickButton}
              onPress={() => router.push("/teams/new")}
            />
            <PrimaryButton
              label="Fixtures"
              variant="secondary"
              icon={<CalendarClock color={colors.text} size={18} />}
              style={styles.quickButton}
              onPress={() => router.push(`/tournaments/${tournament.id}`)}
            />
          </>
        )}
      </View>
    </LinearGradient>
  );
}

function FollowPanel({ teams }: { teams: Team[] }) {
  if (teams.length === 0) {
    return (
      <View style={styles.followEmpty}>
        <Text style={styles.followEmptyText}>
          Go to Leagues, open a tournament, then tap a team and hit Follow to track them here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.followList}>
      {teams.map((team) => {
        const pts = team.wins * 3 + team.draws;
        return (
          <Pressable
            key={team.id}
            style={({ pressed }) => [styles.followedTeam, pressed && styles.pressed]}
            onPress={() => router.push(`/teams/${team.id}`)}
          >
            <TeamBadge team={team} />
            <View style={styles.followedCopy}>
              <Text style={styles.followedName}>{team.name}</Text>
              <Text style={styles.followedMeta}>{team.wins}W · {team.draws}D · {team.losses}L</Text>
            </View>
            <View style={styles.followedRight}>
              <Text style={styles.followedPts}>{pts}</Text>
              <Text style={styles.followedPtsLabel}>pts</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const role = useAppStore((state) => state.selectedRole);
  const selectedTournamentId = useAppStore((state) => state.selectedTournamentId);
  const followedTeamIds = useAppStore((state) => state.followedTeamIds);

  const tournament = repository.getTournamentById(selectedTournamentId);
  const liveMatch = repository.getLiveMatch();
  const allMatches = repository.getMatchesByTournament(selectedTournamentId);
  const templates = repository.getGraphicTemplates();

  const pendingCount = allMatches.filter((m) => m.status === "scheduled").length;
  const liveCount = allMatches.filter((m) => m.status === "live").length;
  const followedTeams = followedTeamIds
    .map((id) => repository.getTeamById(id))
    .filter((t): t is Team => t !== undefined);

  const isManagement = role === "organizer" || role === "team-manager";

  const roleTitle =
    role === "team-manager" ? "Team desk"
    : role === "spectator" ? "Follow desk"
    : role === "player" ? "Player desk"
    : "Organizer desk";

  const heroTitle =
    role === "organizer" ? "Your next matchday is already moving."
    : role === "team-manager" ? "Keep your squad match-ready."
    : role === "player" ? "Track your stats and show up ready."
    : "Your teams, live and in the table.";

  return (
    <Screen>
      <View style={styles.topBar}>
        <Text style={styles.kicker}>{roleTitle}</Text>
        <Pressable
          onPress={() => router.push("/profile")}
          hitSlop={8}
          style={styles.profileBtn}
          accessibilityRole="button"
          accessibilityLabel="Open profile and role settings"
        >
          <UserRound color={colors.textMuted} size={22} />
        </Pressable>
      </View>
      <Text style={styles.title}>{heroTitle}</Text>

      {isManagement && tournament ? (
        <ManagementPanel tournament={tournament} role={role} />
      ) : (
        <FollowPanel teams={followedTeams} />
      )}

      <View style={styles.stats}>
        {isManagement ? (
          <>
            <StatPill label="Pending" value={pendingCount} tone="warning" />
            <StatPill label="Live" value={liveCount} tone="success" />
            <StatPill label="Templates" value={templates.length} />
          </>
        ) : (
          <>
            <StatPill label="Following" value={followedTeams.length} />
            <StatPill label="Live" value={liveCount} tone="success" />
            <StatPill label="Matchday" value={5} />
          </>
        )}
      </View>

      <SectionHeader title="Live now" action="Match center" onAction={() => router.push("/matches")} />
      {liveMatch ? (
        <MatchCard match={liveMatch} />
      ) : (
        <EmptyState
          icon={Activity}
          title="No live matches"
          body="Active matches will appear here as they kick off."
        />
      )}

      {isManagement ? (
        <>
          <SectionHeader title={role === "organizer" ? "Run the day" : "Team actions"} />
          <View style={styles.taskList}>
            {role === "organizer" ? (
              <>
                <Task icon={CalendarClock} title="Review today's fixtures" body="2 matches need venue confirmation." />
                <Task icon={BellRing} title="Send team reminders" body="Notify captains before warm-up windows." />
                <Task icon={ImagePlus} title="Prepare result graphics" body="Use team colors for the next scorecard." />
              </>
            ) : (
              <>
                <Task icon={UsersRound} title="Check your lineup" body="Confirm your squad for the next fixture." />
                <Task icon={BellRing} title="Notify players" body="Send kickoff time to all registered players." />
                <Task icon={Check} title="Submit team sheet" body="Deadline is 2 hours before kickoff." />
              </>
            )}
          </View>
        </>
      ) : null}
    </Screen>
  );
}

function Task({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8
  },
  profileBtn: {
    padding: 4
  },
  kicker: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 12,
    textTransform: "uppercase"
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 30,
    lineHeight: 38,
    marginTop: 8
  },
  // Management panel
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
  // Follow panel
  followEmpty: {
    marginTop: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
    alignItems: "center"
  },
  followEmptyText: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center"
  },
  followList: {
    marginTop: 22,
    gap: 10
  },
  followedTeam: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  pressed: {
    opacity: 0.86
  },
  followedCopy: {
    flex: 1
  },
  followedName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  followedMeta: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    marginTop: 3
  },
  followedRight: {
    alignItems: "flex-end"
  },
  followedPts: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 20
  },
  followedPtsLabel: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 10
  },
  // Stats row
  stats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  // Task list
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
