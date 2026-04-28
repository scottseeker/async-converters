export interface RGB { r: number; g: number; b: number }
export interface HSL { h: number; s: number; l: number }
export interface HSV { h: number; s: number; v: number }

export function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0,2),16),
    g: parseInt(clean.slice(2,4),16),
    b: parseInt(clean.slice(4,6),16),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('').toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rr = r/255, gg = g/255, bb = b/255;
  const max = Math.max(rr,gg,bb), min = Math.min(rr,gg,bb);
  const l = (max+min)/2;
  if (max === min) return { h:0, s:0, l: Math.round(l*100) };
  const d = max - min;
  const s = l > 0.5 ? d/(2-max-min) : d/(max+min);
  let h = 0;
  if (max===rr) h = ((gg-bb)/d + (gg<bb?6:0))/6;
  else if (max===gg) h = ((bb-rr)/d + 2)/6;
  else h = ((rr-gg)/d + 4)/6;
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const ss = s/100, ll = l/100;
  const c = (1 - Math.abs(2*ll-1)) * ss;
  const x = c * (1 - Math.abs((h/60)%2 - 1));
  const m = ll - c/2;
  let r=0,g=0,b=0;
  if (h<60){r=c;g=x;}else if(h<120){r=x;g=c;}
  else if(h<180){g=c;b=x;}else if(h<240){g=x;b=c;}
  else if(h<300){r=x;b=c;}else{r=c;b=x;}
  return { r:Math.round((r+m)*255), g:Math.round((g+m)*255), b:Math.round((b+m)*255) };
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rr=r/255,gg=g/255,bb=b/255;
  const max=Math.max(rr,gg,bb), min=Math.min(rr,gg,bb);
  const d=max-min;
  const v=max;
  const s=max===0?0:d/max;
  let h=0;
  if(d!==0){
    if(max===rr) h=((gg-bb)/d)%6;
    else if(max===gg) h=(bb-rr)/d+2;
    else h=(rr-gg)/d+4;
    h=Math.round(h*60);
    if(h<0) h+=360;
  }
  return { h, s: Math.round(s*100), v: Math.round(v*100) };
}

export function contrastRatio(fg: RGB, bg: RGB): number {
  const lum = ({ r, g, b }: RGB) => {
    const chan = [r,g,b].map(c => {
      const s = c/255;
      return s <= 0.03928 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4);
    });
    return 0.2126*chan[0] + 0.7152*chan[1] + 0.0722*chan[2];
  };
  const l1 = lum(fg), l2 = lum(bg);
  const lighter = Math.max(l1,l2), darker = Math.min(l1,l2);
  return Math.round(((lighter+0.05)/(darker+0.05))*100)/100;
}
