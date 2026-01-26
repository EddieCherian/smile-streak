export function getYesterdayKey(dateKey) {
  const d = new Date(dateKey);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
