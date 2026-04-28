const VALS = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
const SYMS = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];

export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return 'Out of range (1–3999)';
  let result = '';
  let rem = n;
  for (let i = 0; i < VALS.length; i++) {
    while (rem >= VALS[i]) { result += SYMS[i]; rem -= VALS[i]; }
  }
  return result;
}

export function fromRoman(s: string): number {
  const str = s.trim().toUpperCase();
  const map: Record<string, number> = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const cur = map[str[i]];
    const nxt = map[str[i + 1]];
    if (!cur) return NaN;
    if (nxt && cur < nxt) result -= cur;
    else result += cur;
  }
  return result;
}
