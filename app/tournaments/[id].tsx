import { useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  CalendarDays,
  MapPin,
  Plus,
  Star,
  Trophy,
  UsersRound,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MatchCard } from "@/components/MatchCard";
import { EmptyState } from "@/components/EmptyState";
import { KnockoutBracket } from "@/components/KnockoutBracket";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { StandingsTable } from "@/components/StandingsTable";
import { StatPill } from "@/components/StatPill";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";

type TabId = "overview" | "bracket" | "fixtures" | "table";

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const role = useAppStore((s) => s.selectedRole);
  const tournament = repository.getTournamentById(id);
  const matches = repository.getMatchesByTournament(id);
  const bracket = repository.getBracketByTournament(id);
  const canAddTeam = role === "organizer" || role === "team-manager";

  const isKnockout = tournament?.format === "knockout" || tournament?.format === "double-elimination";

  const tabs: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(isKnockout && bracket ? [{ id: "bracket" as TabId, label: "Bracket" }] : []),
    { id: "fixtures", label: "Fixtures" },
    { id: "table", label: "Table" },
  ];

  const [activeTab, setActiveTab] = useState<TabId>(
    isKnockout && bracket ? "bracket" : "overview"
  );

  const teamIds = [...new Set(matches.flatMap((m) => [m.homeTeamId, m.awayTeamId]))];
  const topScorers = teamIds
    .flatMap((tid) => repository.getPlayersByTeam(tid))
    .filter((p) => p.goals > 0)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);

  if (!tournament) {
    return (
      <Screen>
        <Text style={styles.notFound}>Tournament not found</Text>
      </Screen>
    );
  }

  const accent = tournament.accentColor;

  return (
    <Screen scroll={false} padded={false}>
      <Stack.Screen options={{ title: tournament.name }} />

      {/* Compact header */}
      <View style={[styles.compactHeader, { borderBottomColor: accent }]}>
        <View style={styles.headerMeta}>
          <Trophy color={accent} size={16} />
          <Text style={[styles.statusBadge, { color: accent }]}>
            {tournament.status.toUpperCase()}
          </Text>
          <View style={styles.metaDot} />
          <MapPin color={colors.textSubtle} size={13} />
          <Text style={styles.metaText} numberOfLines={1}>{tournament.venue}</Text>
        </View>
        <View style={styles.headerPills}>
          <StatPill label="Teams" value={`${tournament.registeredTeams}/${tournament.teamLimit}`} />
          <StatPill label="Prize" value={tournament.prizePool} tone="success" />
          <StatPill label="Format" value={tournament.format} />
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {tab.label}
              </Text>
              {active && (
                <View style={[styles.tabIndicator, { backgroundColor: accent }]} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Tab content */}
      <ScrollView
        key={activeTab}
        contentContainerStyle={styles.tabContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && (
          <View style={styles.section}>
            {/* Full tournament info */}
            <View style={[styles.infoCard, { borderColor: accent }]}>
              <Text style={styles.infoName}>{tournament.name}</Text>
              <Text style={styles.infoDesc}>{tournament.description}</Text>
              <View style={styles.infoRow}>
                <MapPin color={colors.textMuted} size={14} />
                <Text style={styles.infoMeta}>{tournament.venue}</Text>
              </View>
              <View style={styles.infoRow}>
                <CalendarDays color={colors.textMuted} size={14} />
                <Text style={styles.infoMeta}>
                  Starts {new Date(tournament.startsAt).toDateString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <CalendarDays color={colors.textMuted} size={14} />
                <Text style={styles.infoMeta}>
                  Registration closes{" "}
                  {new Date(tournament.registrationDeadline).toDateString()}
                </Text>
              </View>
            </View>

            {/* Organizer notes */}
            <View style={styles.noteCard}>
              <UsersRound color={colors.secondary} size={18} />
              <View style={styles.noteBody}>
                <Text style={styles.noteTitle}>Organizer · {tournament.organizer}</Text>
                <Text style={styles.noteText}>
                  Three roster approvals are pending before the next kickoff window.
                </Text>
              </View>
            </View>

            {canAddTeam && (
              <PrimaryButton
                label="Register a team"
                variant="secondary"
                icon={<Plus color={colors.text} size={17} />}
                onPress={() => router.push("/teams/new")}
              />
            )}
          </View>
        )}

        {activeTab === "bracket" && bracket && (
          <View style={styles.section}>
            <View style={styles.bracketWrap}>
              <KnockoutBracket bracket={bracket} />
            </View>
          </View>
        )}

        {activeTab === "fixtures" && (
          <View style={styles.section}>
            {canAddTeam && (
              <PrimaryButton
                label="Register a team"
                variant="secondary"
                icon={<Plus color={colors.text} size={17} />}
                onPress={() => router.push("/teams/new")}
                style={styles.registerBtn}
              />
            )}
            {matches.length > 0 ? (
              <View style={styles.list}>
                {matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </View>
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No fixtures yet"
                body="Fixtures will appear here once the organizer publishes the schedule."
              />
            )}
          </View>
        )}

        {activeTab === "table" && (
          <View style={styles.section}>
            {topScorers.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Top Scorers</Text>
                <View style={styles.scorerList}>
                  {topScorers.map((player, index) => {
                    const team = repository.getTeamById(player.teamId);
                    return (
                      <View key={player.id} style={styles.scorer}>
                        <Text style={styles.scorerRank}>{index + 1}</Text>
                        <View style={styles.scorerCopy}>
                          <Text style={styles.scorerName}>{player.name}</Text>
                          <Text style={styles.scorerMeta}>
                            {player.position} · {team?.shortName ?? "—"}
                          </Text>
                        </View>
                        <View style={styles.scorerBadge}>
                          <Star color={colors.warning} size={13} />
                          <Text style={styles.scorerGoals}>{player.goals}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}

            <Text style={[styles.sectionTitle, topScorers.length > 0 && styles.sectionTitleSpaced]}>
              Standings
            </Text>
            <StandingsTable tournamentId={id} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  notFound: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 16,
  },

  // Compact header
  compactHeader: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 2,
    gap: 10,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusBadge: {
    fontFamily: "Sora_800ExtraBold",
    fontSize: 11,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  metaText: {
    color: colors.textSubtle,
    fontFamily: "Sora_500Medium",
    fontSize: 12,
    flex: 1,
  },
  headerPills: {
    flexDirection: "row",
    gap: 8,
  },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  tabLabel: {
    color: colors.textSubtle,
    fontFamily: "Sora_600SemiBold",
    fontSize: 13,
  },
  tabLabelActive: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 8,
    right: 8,
    height: 2,
    borderRadius: 2,
  },

  // Tab content
  tabContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 18,
    gap: 12,
  },

  // Overview tab
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  infoName: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 22,
    lineHeight: 28,
  },
  infoDesc: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  infoMeta: {
    color: colors.textMuted,
    fontFamily: "Sora_500Medium",
    fontSize: 12,
  },
  noteCard: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  noteBody: {
    flex: 1,
    gap: 4,
  },
  noteTitle: {
    color: colors.text,
    fontFamily: "Sora_600SemiBold",
    fontSize: 13,
  },
  noteText: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  registerBtn: {
    marginBottom: 4,
  },

  // Bracket tab
  bracketWrap: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    overflow: "hidden",
  },

  // Fixtures tab
  list: {
    gap: 10,
  },

  // Table tab
  sectionTitle: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 15,
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  scorerList: {
    gap: 8,
  },
  scorer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  scorerRank: {
    width: 18,
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 13,
  },
  scorerCopy: {
    flex: 1,
  },
  scorerName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14,
  },
  scorerMeta: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  scorerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  scorerGoals: {
    color: colors.warning,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 16,
  },
});
