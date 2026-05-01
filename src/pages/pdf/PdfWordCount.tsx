import { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './pdf.module.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface Stats {
  pages: number;
  words: number;
  chars: number;
  charsNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // minutes
}

function countStats(text: string): Omit<Stats, 'pages'> {
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const sentences = (text.match(/[.!?]+/g) ?? []).length;
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.max(1, Math.round(words / 238));
  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
}

export default function PdfWordCount() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [busy, setBusy] = useState(false);

  async function analyze(f: File) {
    setFile(f);
    setStats(null);
    setBusy(true);
    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageCount = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter((item) => 'str' in item)
          .map(item => (item as { str: string }).str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      setExtractedText(fullText.trim());
      setStats({ pages: pageCount, ...countStats(fullText) });
    } finally {
      setBusy(false);
    }
  }

  return (
    <ConverterShell
      title="PDF Word Count"
      description="Count words, characters, sentences, and pages in a PDF — all client-side."
      category="image"
    >
      <div className={styles.form}>
        <div
          className={styles.dropZone}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && !busy) analyze(f); }}
        >
          {file ? `✓ ${file.name} — click to change` : '📁 Click or drag a PDF here'}
          <input ref={inputRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) analyze(f); }} />
        </div>

        {busy && <p style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>Extracting text…</p>}

        {stats && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {[
                { label: 'Pages', value: stats.pages.toLocaleString() },
                { label: 'Words', value: stats.words.toLocaleString() },
                { label: 'Characters', value: stats.chars.toLocaleString() },
                { label: 'Chars (no spaces)', value: stats.charsNoSpaces.toLocaleString() },
                { label: 'Sentences', value: stats.sentences.toLocaleString() },
                { label: 'Paragraphs', value: stats.paragraphs.toLocaleString() },
                { label: 'Reading time', value: `~${stats.readingTime} min` },
              ].map(s => (
                <div key={s.label} className={styles.resultInfo} style={{ flexDirection: 'column', gap: '0.15rem' }}>
                  <span className={styles.statLabel}>{s.label}</span>
                  <span className={styles.statValue}>{s.value}</span>
                </div>
              ))}
            </div>

            {extractedText && (
              <div className={styles.field}>
                <label>Extracted Text</label>
                <textarea
                  className={styles.textOutput}
                  readOnly
                  value={extractedText}
                  style={{ minHeight: 200 }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </ConverterShell>
  );
}
