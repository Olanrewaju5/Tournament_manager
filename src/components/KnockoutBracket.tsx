import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Trophy } from "lucide-react-native";
import { repository } from "@/lib/mock-repository";
import { Bracket, BracketMatch, BracketSlot } from "@/types/domain";
import { colors } from "@/theme/colors";
import { TeamBadge } from "@/components/TeamBadge";

const MATCH_WIDTH = 152;
const MATCH_HEIGHT = 78;
const ROUND_GAP = 52;
const CELL_HEIGHT = 112;
const TROPHY_COL_WIDTH = 60;

type Props = {
  bracket: Bracket;
};

function getRoundX(roundIndex: number) {
  return roundIndex * (MATCH_WIDTH + ROUND_GAP);
}

function getMatchCenterY(totalHeight: number, matchesInRound: number, matchIndex: number) {
  const slotHeight = totalHeight / matchesInRound;
  return matchIndex * slotHeight + slotHeight / 2;
}

function TeamRow({ slot, isWinner }: { slot: BracketSlot; isWinner: boolean }) {
  const team = slot.teamId ? repository.getTeamById(slot.teamId) : null;
  const hasScore = slot.score !== null;

  return (
    <View style={styles.teamRow}>
      {team ? (
        <TeamBadge team={team} size="sm" />
      ) : (
        <View style={styles.tbdBadge} />
      )}
      <Text style={[styles.teamName, isWinner && styles.winnerName]} numberOfLines={1}>
        {team?.shortName ?? "TBD"}
      </Text>
      {hasScore ? (
        <Text style={[styles.score, isWinner && styles.winnerScore]}>{slot.score}</Text>
      ) : (
        <Text style={styles.scoreDash}>—</Text>
      )}
    </View>
  );
}

function MatchCard({ match }: { match: BracketMatch }) {
  const isCompleted = match.home.winner || match.away.winner;
  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted]}>
      {match.label ? (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{match.label}</Text>
        </View>
      ) : match.scheduledDate ? (
        <View style={styles.labelRow}>
          <Text style={styles.dateText}>{match.scheduledDate}</Text>
        </View>
      ) : null}
      <TeamRow slot={match.home} isWinner={match.home.winner} />
      <View style={styles.divider} />
      <TeamRow slot={match.away} isWinner={match.away.winner} />
    </View>
  );
}

export function KnockoutBracket({ bracket }: Props) {
  const { rounds } = bracket;
  const maxMatches = rounds[0]?.matches.length ?? 1;
  const totalHeight = maxMatches * CELL_HEIGHT;
  const totalWidth = rounds.length * (MATCH_WIDTH + ROUND_GAP) + TROPHY_COL_WIDTH;

  const finalRound = rounds[rounds.length - 1];
  const finalMatch = finalRound?.matches[0];
  const championSlot = finalMatch?.home.winner
    ? finalMatch.home
    : finalMatch?.away.winner
    ? finalMatch.away
    : null;
  const champion = championSlot?.teamId ? repository.getTeamById(championSlot.teamId) : null;

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: totalWidth }}>
          {/* Round header labels */}
          <View style={styles.headerRow}>
            {rounds.map((round) => (
              <View key={round.id} style={{ width: MATCH_WIDTH + ROUND_GAP, alignItems: "center" }}>
                <Text style={styles.roundLabel}>{round.name}</Text>
              </View>
            ))}
            <View style={{ width: TROPHY_COL_WIDTH, alignItems: "center" }}>
              <Text style={styles.roundLabel}>Winner</Text>
            </View>
          </View>

          {/* Bracket body */}
          <View style={{ width: totalWidth, height: totalHeight }}>
            {/* Match cards */}
            {rounds.map((round, roundIndex) => {
              const matchesInRound = round.matches.length;
              const x = getRoundX(roundIndex);

              return round.matches.map((match, matchIndex) => {
                const centerY = getMatchCenterY(totalHeight, matchesInRound, matchIndex);
                return (
                  <View
                    key={match.id}
                    style={{
                      position: "absolute",
                      top: centerY - MATCH_HEIGHT / 2,
                      left: x,
                      width: MATCH_WIDTH,
                    }}
                  >
                    <MatchCard match={match} />
                  </View>
                );
              });
            })}

            {/* Connector lines between rounds */}
            {rounds.slice(0, -1).flatMap((round, roundIndex) => {
              const matchesInRound = round.matches.length;
              const x = getRoundX(roundIndex);
              const junctionX = x + MATCH_WIDTH + ROUND_GAP * 0.48;
              const nextX = getRoundX(roundIndex + 1);
              const lines: React.ReactElement[] = [];

              for (let i = 0; i < matchesInRound; i += 2) {
                const topY = getMatchCenterY(totalHeight, matchesInRound, i);
                const botY = getMatchCenterY(totalHeight, matchesInRound, i + 1);
                const midY = (topY + botY) / 2;
                const k = `${roundIndex}-${i}`;

                lines.push(
                  // Stub from top match right edge to junction
                  <View
                    key={`h1-${k}`}
                    style={{
                      position: "absolute",
                      top: topY - 0.5,
                      left: x + MATCH_WIDTH,
                      width: junctionX - x - MATCH_WIDTH,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />,
                  // Stub from bottom match right edge to junction
                  <View
                    key={`h2-${k}`}
                    style={{
                      position: "absolute",
                      top: botY - 0.5,
                      left: x + MATCH_WIDTH,
                      width: junctionX - x - MATCH_WIDTH,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />,
                  // Vertical line spanning top → bottom at junction
                  <View
                    key={`v-${k}`}
                    style={{
                      position: "absolute",
                      top: topY,
                      left: junctionX - 0.5,
                      width: 1,
                      height: botY - topY,
                      backgroundColor: colors.border,
                    }}
                  />,
                  // Horizontal line from junction midpoint to next round
                  <View
                    key={`h3-${k}`}
                    style={{
                      position: "absolute",
                      top: midY - 0.5,
                      left: junctionX,
                      width: nextX - junctionX,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                );
              }

              return lines;
            })}

            {/* Line from Final to trophy */}
            <View
              style={{
                position: "absolute",
                top: totalHeight / 2 - 0.5,
                left: getRoundX(rounds.length - 1) + MATCH_WIDTH,
                width: ROUND_GAP * 0.48,
                height: 1,
                backgroundColor: colors.border,
              }}
            />

            {/* Trophy / champion column */}
            <View
              style={{
                position: "absolute",
                top: totalHeight / 2 - 32,
                left: getRoundX(rounds.length - 1) + MATCH_WIDTH + ROUND_GAP * 0.48,
                width: TROPHY_COL_WIDTH,
                alignItems: "center",
                gap: 6,
              }}
            >
              <Trophy
                color={champion ? "#F59E0B" : colors.textSubtle}
                size={30}
              />
              <Text style={[styles.championLabel, champion && styles.championFound]}>
                {champion ? champion.shortName : "TBD"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  roundLabel: {
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 11,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardCompleted: {
    borderColor: colors.border,
  },
  labelRow: {
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  labelText: {
    color: colors.secondary,
    fontFamily: "Sora_700Bold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateText: {
    color: colors.textSubtle,
    fontFamily: "Sora_500Medium",
    fontSize: 9,
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 5,
    gap: 6,
  },
  tbdBadge: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamName: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: "Sora_600SemiBold",
    fontSize: 11,
  },
  winnerName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
  },
  score: {
    color: colors.textMuted,
    fontFamily: "Sora_700Bold",
    fontSize: 14,
    minWidth: 22,
    textAlign: "right",
  },
  winnerScore: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
  },
  scoreDash: {
    color: colors.textSubtle,
    fontFamily: "Sora_500Medium",
    fontSize: 12,
    minWidth: 22,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 7,
  },
  championLabel: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 10,
    textAlign: "center",
  },
  championFound: {
    color: "#F59E0B",
  },
});
