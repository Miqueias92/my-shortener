const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function toBase62(n: number): string {
  if (n === 0) return "0";
  let s = "";
  while (n > 0) {
    s = alphabet[n % 62] + s;
    n = Math.floor(n / 62);
  }
  return s;
}