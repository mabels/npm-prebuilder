
export function lstEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const as = a.sort();
  const bs = b.sort();
  for (let i = 0; i < as.length; ++i) {
    if (as[i] !== bs[i]) {
      return false;
    }
  }
  return true;
}
