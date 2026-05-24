import { router, Stack, useLocalSearchParams } from "expo-router";
import { Check, ChevronRight, Plus, ShieldCheck, Star } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { StatPill } from "@/components/StatPill";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = repository.getTeamById(id);
  const followedTeamIds = useAppStore((state) => state.followedTeamIds);
  const toggleFollowedTeam = useAppStore((state) => state.toggleFollowedTeam);

  if (!team) {
    return (
      <Screen>
        <Text style={styles.title}>Team not found</Text>
      </Screen>
    );
  }

  const roster = repository.getPlayersByTeam(team.id);
  const isFollowing = followedTeamIds.includes(team.id);

  return (
    <Screen>
      <Stack.Screen options={{ title: team.name }} />
      <View style={styles.hero}>
        <TeamBadge team={team} size="lg" />
        <Text style={styles.title}>{team.name}</Text>
        <Text style={styles.city}>{team.city}</Text>
        <Text style={styles.bio}>{team.bio}</Text>
        <PrimaryButton
          label={isFollowing ? "Following" : "Follow team"}
          variant={isFollowing ? "secondary" : "primary"}
          icon={isFollowing ? <Check color={colors.text} size={17} /> : <Plus color={colors.text} size={17} />}
          onPress={() => toggleFollowedTeam(team.id)}
          style={styles.followBtn}
        />
      </View>

      <View style={styles.stats}>
        <StatPill label="Wins" value={team.wins} tone="success" />
        <StatPill label="Draws" value={team.draws} />
        <StatPill label="Losses" value={team.losses} tone="warning" />
      </View>

      <SectionHeader title="Captain" />
      <View style={styles.captain}>
        <ShieldCheck color={colors.secondary} size={22} />
        <View>
          <Text style={styles.captainName}>{team.captain}</Text>
          <Text style={styles.captainMeta}>Roster approvals and matchday contact</Text>
        </View>
      </View>

      <SectionHeader title="Roster" action={`${roster.length} players`} />
      <View style={styles.roster}>
        {roster.map((player) => (
          <Pressable
            key={player.id}
            style={({ pressed }) => [styles.player, pressed && styles.pressed]}
            onPress={() => router.push(`/players/${player.id}`)}
          >
            <View style={styles.number}>
              <Text style={styles.numberText}>{player.jerseyNumber}</Text>
            </View>
            <View style={styles.playerCopy}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.position}>{player.position} · {player.goals} goals · {player.assists} assists</Text>
            </View>
            {player.awards.length ? <Star color={colors.warning} size={18} /> : null}
            <ChevronRight color={colors.textSubtle} size={16} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    padding: 20,
    marginTop: 8
  },
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 28,
    marginTop: 12,
    textAlign: "center"
  },
  city: {
    color: colors.secondary,
    fontFamily: "Sora_700Bold",
    fontSize: 12,
    marginTop: 4
  },
  followBtn: {
    alignSelf: "stretch",
    marginTop: 14
  },
  bio: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    textAlign: "center"
  },
  stats: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14
  },
  captain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  captainName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  captainMeta: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    marginTop: 4
  },
  roster: {
    gap: 10
  },
  player: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12
  },
  pressed: {
    opacity: 0.86
  },
  number: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft
  },
  numberText: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 15
  },
  playerCopy: {
    flex: 1
  },
  playerName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  position: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    marginTop: 4
  }
});
