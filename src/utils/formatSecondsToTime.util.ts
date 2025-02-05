export default function formatSecondsToTime(seconds: number, decimals = 0) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60)
    .toFixed(decimals)
    .padStart(2 + (decimals ? decimals + 1 : 0), "0");
  return `${mins}:${secs}`;
}
