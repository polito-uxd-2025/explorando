export function trimWrappingQuotes(input: string | undefined | null): string {
  if (typeof input !== 'string') return '';
  if (input.length >= 2) {
    const first = input[0];
    const last = input[input.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return input.slice(1, -1);
    }
  }
  return input;
}
