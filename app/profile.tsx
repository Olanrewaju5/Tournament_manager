import { router, Stack } from "expo-router";
import { BellRing, ShieldCheck, Trophy, UserRound, UsersRound, X } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { SectionHeader } from "@/components/SectionHeader";
import { TeamBadge } from "@/components/TeamBadge";
import { repository } from "@/lib/mock-repository";
import { useAppStore } from "@/store/app-store";
import { colors } from "@/theme/colors";
import { UserRole } from "@/types/domain";

const ROLES: Array<{ id: UserRole; label: string; description: string; icon: typeof Trophy }> = [
  { id: "organizer", label: "Tournament organizer", description: "Create fixtures, approve teams, run matchday.", icon: Trophy },
  { id: "team-manager", label: "Team manager", description: "Manage squad, track fixtures, keep players ready.", icon: ShieldCheck },
  { id: "spectator", label: "Spectator", description: "Follow live scores, standings, and your teams.", icon: BellRing },
  { id: "player", label: "Player", description: "Track stats, collect awards, build your profile.", icon: UsersRound }
];

export default function ProfileScreen() {
  const selectedRole = useAppStore((state) => state.selectedRole);
  const setSelectedRole = useAppStore((state) => state.setSelectedRole);
  const followedTeamIds = useAppStore((state) => state.followedTeamIds);
  const toggleFollowedTeam = useAppStore((state) => state.toggleFollowedTeam);

  const followedTeams = followedTeamIds
    .map((id) => repository.getTeamById(id))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  const currentRole = ROLES.find((r) => r.id === selectedRole)!;
  const CurrentRoleIcon = currentRole.icon;

  return (
    <Screen>
      <Stack.Screen options={{ title: "Profile" }} />

      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <UserRound color={colors.textMuted} size={32} />
        </View>
        <View style={styles.avatarCopy}>
          <Text style={styles.avatarTitle}>Your account</Text>
          <View style={styles.roleBadge}>
            <CurrentRoleIcon color={colors.secondary} size={13} />
            <Text style={styles.roleBadgeText}>{currentRole.label}</Text>
          </View>
        </View>
      </View>

      <View style={styles.switchHint}>
        <Text style={styles.switchHintText}>
          Tap a role below to switch. The app adapts its features to the selected role.
        </Text>
      </View>

      <SectionHeader title="Switch role" />
      <View style={styles.roleList}>
        {ROLES.map((role) => {
          const Icon = role.icon;
          const selected = selectedRole === role.id;
          return (
            <Pressable
              key={role.id}
              style={({ pressed }) => [
                styles.roleRow,
                selected && styles.roleSelected,
                pressed && styles.pressed
              ]}
              onPress={() => setSelectedRole(role.id)}
            >
              <View style={[styles.roleIcon, selected && styles.roleIconSelected]}>
                <Icon color={selected ? colors.text : colors.textMuted} size={20} />
              </View>
              <View style={styles.roleCopy}>
                <Text style={styles.roleLabel}>{role.label}</Text>
                <Text style={styles.roleDesc}>{role.description}</Text>
              </View>
              {selected ? <Text style={styles.roleCheck}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Followed teams" action={followedTeams.length > 0 ? `${followedTeams.length} teams` : undefined} />
      {followedTeams.length > 0 ? (
        <View style={styles.teamList}>
          {followedTeams.map((team) => (
            <Pressable
              key={team.id}
              style={({ pressed }) => [styles.teamRow, pressed && styles.pressed]}
              onPress={() => router.push(`/teams/${team.id}`)}
            >
              <TeamBadge team={team} size="sm" />
              <View style={styles.teamCopy}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamCity}>{team.city}</Text>
              </View>
              <Pressable
                onPress={() => toggleFollowedTeam(team.id)}
                style={styles.unfollowBtn}
                hitSlop={8}
              >
                <X color={colors.textSubtle} size={16} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.emptyTeams}>
          <Text style={styles.emptyTeamsText}>
            Open any team detail and tap Follow to track them here.
          </Text>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 8
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarCopy: {
    flex: 1
  },
  avatarTitle: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 16
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
    backgroundColor: "#0d2535",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  roleBadgeText: {
    color: colors.secondary,
    fontFamily: "Sora_700Bold",
    fontSize: 11,
  },
  switchHint: {
    borderRadius: 8,
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 12,
  },
  switchHintText: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  roleList: {
    gap: 8
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  roleSelected: {
    borderColor: colors.secondary,
    backgroundColor: "#112435"
  },
  pressed: {
    opacity: 0.86
  },
  roleIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceSoft
  },
  roleIconSelected: {
    backgroundColor: colors.primary
  },
  roleCopy: {
    flex: 1
  },
  roleLabel: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  roleDesc: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3
  },
  roleCheck: {
    color: colors.secondary,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 18
  },
  teamList: {
    gap: 8
  },
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  teamCopy: {
    flex: 1
  },
  teamName: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  teamCity: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    marginTop: 3
  },
  unfollowBtn: {
    padding: 4
  },
  emptyTeams: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 20,
    alignItems: "center"
  },
  emptyTeamsText: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center"
  }
});
