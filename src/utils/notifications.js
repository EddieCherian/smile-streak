export async function requestNotificationPermission() {
  // iOS Safari: do nothing silently
  if (
    !("Notification" in window) ||
    /iPhone|iPad|iPod/.test(navigator.userAgent)
  ) {
    return "unsupported";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  return await Notification.requestPermission();
}
