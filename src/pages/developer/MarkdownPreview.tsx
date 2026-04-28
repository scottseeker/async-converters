import { marked } from 'marked';
import { useMemo, useState } from 'react';
import ConverterShell from '../../components/ConverterShell/ConverterShell';
import styles from './developer.module.css';

const SAMPLE = `# Markdown Preview

Write **bold**, *italic*, or \`inline code\`.

## Lists
- Item one
- Item two

## Code Block
\`\`\`js
console.log("Hello, world!");
\`\`\`

> Blockquote text here.

[Link example](https://example.com)
`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(SAMPLE);

  const html = useMemo(() => marked.parse(md) as string, [md]);

  return (
    <ConverterShell title="Markdown Preview" description="Write Markdown on the left and see the rendered HTML preview on the right." category="developer">
      <div className={styles.form}>
        <div className={styles.twoPane}>
          <div className={styles.field}>
            <label htmlFor="md-in">Markdown</label>
            <textarea id="md-in" className={styles.codeArea} style={{ minHeight: 400 }} value={md} onChange={e => setMd(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label>Preview</label>
            <div className={styles.preview} style={{ minHeight: 400 }} dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </ConverterShell>
  );
}
