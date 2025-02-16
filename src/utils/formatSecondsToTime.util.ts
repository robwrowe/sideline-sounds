type FormatSecondsToTimeOptions = {
  decimals?: number;
  showZeroMinute?: boolean;
};

export default function formatSecondsToTime(
  seconds: number,
  opts?: FormatSecondsToTimeOptions
) {
  const decimals = opts?.decimals || 0;
  const showZeroMinute = opts?.showZeroMinute ?? true;

  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60)
    .toFixed(decimals)
    .padStart(2 + (decimals ? decimals + 1 : 0), "0");

  return `${mins > 0 || showZeroMinute ? mins : ""}:${secs}`;
}
