export default function getFileName(path: string): string | null {
  const regex = /([^/\\]+)(?=\.[^/\\]+$)/;
  const match = path.match(regex);
  return match ? match[0] : null;
}
