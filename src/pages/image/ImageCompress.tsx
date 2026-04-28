import { useCallback, useRef, useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './image.module.css';
import compStyles from './imageCompress.module.css';
import type { CompressFormat, CompressRequest, CompressResult, WorkerResponse } from '../../workers/imageCompress.worker';

const FORMAT_LABELS: Record<CompressFormat, string> = {
  jpeg: 'JPEG (MozJPEG)',
  png: 'PNG (OxiPNG)',
  webp: 'WebP',
  avif: 'AVIF',
};

const EXT: Record<CompressFormat, string> = {
  jpeg: 'jpg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
};

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

function savings(orig: number, comp: number): string {
  const pct = ((orig - comp) / orig) * 100;
  return pct > 0 ? `-${pct.toFixed(1)}%` : `+${Math.abs(pct).toFixed(1)}%`;
}

interface ResultEntry extends CompressResult {
  isSmallest: boolean;
}

export default function ImageCompress() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [origFile, setOrigFile] = useState<File | null>(null);
  const [origPreview, setOrigPreview] = useState('');
  const [origBytes, setOrigBytes] = useState(0);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const [activeFormats, setActiveFormats] = useState<CompressFormat[]>(['jpeg', 'png', 'webp', 'avif']);
  const [jpegQuality, setJpegQuality] = useState(82);
  const [webpQuality, setWebpQuality] = useState(80);
  const [avifQuality, setAvifQuality] = useState(60);
  const [pngLevel, setPngLevel] = useState(3);
  const [stripMetadata] = useState(true);
  const [selectedPreview, setSelectedPreview] = useState<CompressFormat | null>(null);
  const [progress, setProgress] = useState<CompressFormat[]>([]);

  const toggleFormat = (fmt: CompressFormat) => {
    setActiveFormats(prev =>
      prev.includes(fmt) ? prev.filter(f => f !== fmt) : [...prev, fmt]
    );
  };

  const loadFile = useCallback((file: File) => {
    setOrigFile(file);
    setOrigBytes(file.size);
    setResults([]);
    setSelectedPreview(null);
    setProgress([]);
    const url = URL.createObjectURL(file);
    setOrigPreview(url);
  }, []);

  const compress = useCallback(async () => {
    if (!origFile || activeFormats.length === 0) return;
    setProcessing(true);
    setResults([]);
    setProgress([]);

    // Decode image → ImageData via createImageBitmap + Canvas
    const bitmap = await createImageBitmap(origFile);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const req: CompressRequest = {
      imageData,
      formats: activeFormats,
      jpegQuality,
      webpQuality,
      avifQuality,
      pngLevel,
      stripMetadata,
    };

    const worker = new Worker(
      new URL('../../workers/imageCompress.worker.ts', import.meta.url),
      { type: 'module' }
    );

    const collected: CompressResult[] = [];

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;
      if (msg.type === 'result' && msg.result && msg.format) {
        collected.push(msg.result);
        setProgress(prev => [...prev, msg.format!]);
      } else if (msg.type === 'error' && msg.format) {
        // push a placeholder so we can show the error
        setProgress(prev => [...prev, msg.format!]);
      }
      if (msg.type === 'progress' && msg.done) {
        worker.terminate();
        const minBytes = Math.min(...collected.map(r => r.bytes));
        const entries: ResultEntry[] = collected.map(r => ({
          ...r,
          isSmallest: r.bytes === minBytes,
        }));
        // sort smallest first
        entries.sort((a, b) => a.bytes - b.bytes);
        setResults(entries);
        setSelectedPreview(entries[0]?.format ?? null);
        setProcessing(false);
      }
    };

    worker.onerror = (err) => {
      console.error('Compression worker error:', err);
      worker.terminate();
      setProcessing(false);
    };

    worker.postMessage(req, [imageData.data.buffer]);
  }, [origFile, activeFormats, jpegQuality, webpQuality, avifQuality, pngLevel, stripMetadata]);

  const baseName = origFile ? origFile.name.replace(/\.[^.]+$/, '') : 'compressed';
  const selectedResult = results.find(r => r.format === selectedPreview);

  return (
    <ConverterShell
      title="Image Compressor"
      description="Compress JPEG, PNG, WebP, and AVIF images using high-quality WASM codecs (MozJPEG, OxiPNG, libwebp, libavif). All processing happens in your browser — no uploads."
      category="image"
    >
      <div className={styles.form}>
        {/* Drop Zone */}
        <div
          className={styles.dropZone}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
        >
          {origFile ? `✓ ${origFile.name} (${formatBytes(origBytes)}) — click to change` : '📁 Click or drag an image to compress'}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }}
          />
        </div>

        {/* Format + Quality Settings */}
        <div className={compStyles.settingsGrid}>
          <div className={compStyles.settingsCol}>
            <span className={compStyles.settingsLabel}>Output Formats</span>
            <div className={compStyles.formatToggles}>
              {(['jpeg', 'png', 'webp', 'avif'] as CompressFormat[]).map(fmt => (
                <button
                  key={fmt}
                  className={`${compStyles.fmtBtn} ${activeFormats.includes(fmt) ? compStyles.fmtBtnActive : ''}`}
                  onClick={() => toggleFormat(fmt)}
                  type="button"
                >
                  {EXT[fmt].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className={compStyles.settingsCol}>
            <span className={compStyles.settingsLabel}>JPEG Quality: {jpegQuality}</span>
            <input type="range" min={1} max={100} value={jpegQuality} onChange={e => setJpegQuality(Number(e.target.value))} disabled={!activeFormats.includes('jpeg')} />
          </div>

          <div className={compStyles.settingsCol}>
            <span className={compStyles.settingsLabel}>WebP Quality: {webpQuality}</span>
            <input type="range" min={1} max={100} value={webpQuality} onChange={e => setWebpQuality(Number(e.target.value))} disabled={!activeFormats.includes('webp')} />
          </div>

          <div className={compStyles.settingsCol}>
            <span className={compStyles.settingsLabel}>AVIF Quality: {avifQuality}</span>
            <input type="range" min={1} max={100} value={avifQuality} onChange={e => setAvifQuality(Number(e.target.value))} disabled={!activeFormats.includes('avif')} />
          </div>

          <div className={compStyles.settingsCol}>
            <span className={compStyles.settingsLabel}>PNG OxiPNG Level: {pngLevel}</span>
            <input type="range" min={0} max={6} value={pngLevel} onChange={e => setPngLevel(Number(e.target.value))} disabled={!activeFormats.includes('png')} />
          </div>
        </div>

        <button
          className={compStyles.compressBtn}
          onClick={compress}
          disabled={!origFile || processing || activeFormats.length === 0}
          type="button"
        >
          {processing ? `Compressing… (${progress.length}/${activeFormats.length})` : '⚡ Compress'}
        </button>

        {/* Results */}
        {results.length > 0 && (
          <div className={compStyles.results}>
            {/* Candidate cards */}
            <div className={compStyles.candidateGrid}>
              {results.map(r => (
                <button
                  key={r.format}
                  type="button"
                  className={`${compStyles.candidateCard} ${selectedPreview === r.format ? compStyles.candidateCardActive : ''} ${r.isSmallest ? compStyles.candidateCardBest : ''}`}
                  onClick={() => setSelectedPreview(r.format)}
                >
                  <span className={compStyles.candidateFmt}>{FORMAT_LABELS[r.format]}</span>
                  <span className={compStyles.candidateBytes}>{formatBytes(r.bytes)}</span>
                  <span className={`${compStyles.candidateSavings} ${r.bytes < origBytes ? compStyles.savingsGood : compStyles.savingsBad}`}>
                    {savings(origBytes, r.bytes)}
                  </span>
                  {r.isSmallest && <span className={compStyles.bestBadge}>Smallest</span>}
                </button>
              ))}
            </div>

            {/* Side-by-side preview */}
            {selectedResult && (
              <div className={compStyles.previewSection}>
                <div className={compStyles.previewPair}>
                  <div className={compStyles.previewBox}>
                    <span className={compStyles.previewTag}>Original · {formatBytes(origBytes)}</span>
                    <img src={origPreview} alt="Original" className={styles.preview} />
                  </div>
                  <div className={compStyles.previewBox}>
                    <span className={compStyles.previewTag}>
                      {FORMAT_LABELS[selectedResult.format]} · {formatBytes(selectedResult.bytes)}
                      <span className={`${compStyles.candidateSavings} ${selectedResult.bytes < origBytes ? compStyles.savingsGood : compStyles.savingsBad}`}>
                        {' '}({savings(origBytes, selectedResult.bytes)})
                      </span>
                    </span>
                    <img src={selectedResult.dataUrl} alt={`${selectedResult.format} output`} className={styles.preview} />
                  </div>
                </div>
                <a
                  href={selectedResult.dataUrl}
                  download={`${baseName}_compressed.${EXT[selectedResult.format]}`}
                  className={compStyles.downloadBtn}
                >
                  ⬇ Download {EXT[selectedResult.format].toUpperCase()} ({formatBytes(selectedResult.bytes)})
                </a>
              </div>
            )}

            {/* All downloads */}
            <div className={compStyles.allDownloads}>
              <span className={compStyles.settingsLabel}>Download All</span>
              <div className={compStyles.downloadRow}>
                {results.map(r => (
                  <a
                    key={r.format}
                    href={r.dataUrl}
                    download={`${baseName}_compressed.${EXT[r.format]}`}
                    className={compStyles.downloadSmall}
                  >
                    {EXT[r.format].toUpperCase()}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ConverterShell>
  );
}
