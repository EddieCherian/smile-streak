export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("Notifications not supported");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    new Notification("Notifications enabled 🔔");
  }
}
