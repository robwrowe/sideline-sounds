export default function toTitleCase(str: string): string {
  return (
    str
      // Insert spaces before capital letters (PascalCase, camelCase)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Replace underscores and hyphens with spaces (snake_case, kebab-case)
      .replace(/[_-]/g, " ")
      // Convert first letter of each word to uppercase
      .replace(/\b\w/g, (match) => match.toUpperCase())
  );
}
