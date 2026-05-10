import { Bell, CircleAlert, CircleCheck, Info } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { repository } from "@/lib/mock-repository";
import { colors } from "@/theme/colors";

export default function NotificationsScreen() {
  const notifications = repository.getNotifications();

  return (
    <Screen>
      <Text style={styles.title}>Alerts</Text>
      <Text style={styles.body}>Match reminders, approvals, graphics, and awards in one calm feed.</Text>
      <View style={styles.list}>
        {notifications.map((notification) => {
          const Icon = notification.tone === "success" ? CircleCheck : notification.tone === "warning" ? CircleAlert : Info;
          const tone = notification.tone === "success" ? colors.success : notification.tone === "warning" ? colors.warning : colors.secondary;

          return (
            <View key={notification.id} style={styles.item}>
              <View style={[styles.icon, { backgroundColor: `${tone}22` }]}>
                <Icon color={tone} size={20} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.itemTitle}>{notification.title}</Text>
                <Text style={styles.itemBody}>{notification.body}</Text>
                <Text style={styles.time}>{notification.createdAt}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.empty}>
        <Bell color={colors.textSubtle} size={24} />
        <Text style={styles.emptyText}>Push and email channels will plug into this feed in a later backend phase.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: "Sora_800ExtraBold",
    fontSize: 30,
    marginTop: 8
  },
  body: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 18
  },
  list: {
    gap: 10
  },
  item: {
    flexDirection: "row",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  copy: {
    flex: 1
  },
  itemTitle: {
    color: colors.text,
    fontFamily: "Sora_700Bold",
    fontSize: 14
  },
  itemBody: {
    color: colors.textMuted,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4
  },
  time: {
    color: colors.textSubtle,
    fontFamily: "Sora_700Bold",
    fontSize: 10,
    marginTop: 8
  },
  empty: {
    marginTop: 18,
    alignItems: "center",
    gap: 8,
    padding: 18
  },
  emptyText: {
    color: colors.textSubtle,
    fontFamily: "Sora_400Regular",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18
  }
});
