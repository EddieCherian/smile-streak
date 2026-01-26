export function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  Notification.requestPermission();
}

export function sendNotification(title, body) {
  if (Notification.permission !== "granted") return;

  new Notification(title, { body });
}
