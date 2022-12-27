export function truncate(text: string, start = 0, end = 100) {
  return text.length > start ? `${text.slice(start, end)}...` : text;
}
