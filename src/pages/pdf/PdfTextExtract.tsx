import { useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';
import { PDFDocument } from 'pdf-lib';

export default function PdfTextExtract() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [pageCount, setPageCount] = useState(0);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setStatus('Extracting…'); setText('');
    try {
      const ab = await f.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      setPageCount(pdf.getPageCount());
      // pdf-lib doesn't support direct text extraction from page streams,
      // so we extract visible strings from the raw PDF bytes using a heuristic
      const bytes = new Uint8Array(ab);
      const raw = new TextDecoder('latin1').decode(bytes);
      // Extract text between parentheses (PDF text operators) and Tj/TJ
      const matches: string[] = [];
      const re = /\(([^)\\]{1,200})\)\s*(?:Tj|TJ|'|")/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(raw)) !== null) {
        const s = m[1].replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\\\/g, '\\').trim();
        if (s.length > 1) matches.push(s);
      }
      const extracted = matches.join(' ');
      setText(extracted || '(No extractable text found in this PDF. The file may contain scanned images.)');
      setStatus(`Extracted from ${pdf.getPageCount()} pages.`);
    } catch { setStatus('Failed to extract text.'); }
  }

  return (
    <ConverterShell title="PDF Text Extract" description="Extract readable text content from a PDF file." category="image">
      <div className={styles.form}>
        <div className={styles.field}><label>Select PDF</label><input type="file" accept="application/pdf" onChange={onFile} /></div>
        {status && <p style={{ color: status.startsWith('Extracted') ? 'var(--success)' : status.startsWith('Failed') ? 'var(--error)' : 'var(--muted)' }}>{status}</p>}
        {pageCount > 0 && <p style={{ color: 'var(--muted)', margin: 0 }}>{pageCount} pages</p>}
        {text && (
          <>
            <div className={styles.field}><label>Extracted text</label><textarea className={styles.outputArea} readOnly value={text} rows={14} /></div>
            <div className={styles.actions}><button onClick={() => navigator.clipboard.writeText(text)}>Copy text</button></div>
          </>
        )}
      </div>
    </ConverterShell>
  );
}
