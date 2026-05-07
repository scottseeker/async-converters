import { useState } from 'react';
import styles from './JsonTreeViewer.module.css';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface JsonNodeProps {
  value: JsonValue;
  depth: number;
  comma?: boolean;
  keyName?: string;
}

function JsonNode({ value, depth, comma = false, keyName }: JsonNodeProps) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const key = keyName !== undefined ? (
    <><span className={styles.key}>"{keyName}"</span><span className={styles.colon}>: </span></>
  ) : null;

  const tail = comma ? <span className={styles.punct}>,</span> : null;

  if (value === null) {
    return (
      <div className={styles.line}>
        {key}<span className={styles.null}>null</span>{tail}
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className={styles.line}>
        {key}<span className={styles.bool}>{value.toString()}</span>{tail}
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className={styles.line}>
        {key}<span className={styles.number}>{value}</span>{tail}
      </div>
    );
  }

  if (typeof value === 'string') {
    return (
      <div className={styles.line}>
        {key}<span className={styles.string}>"{escapeString(value)}"</span>{tail}
      </div>
    );
  }

  if (Array.isArray(value)) {
    const count = value.length;
    if (collapsed) {
      return (
        <div className={styles.line}>
          {key}
          <button className={styles.toggle} onClick={() => setCollapsed(false)} title="Expand">
            ▶
          </button>
          <span className={styles.punct}>[</span>
          <span className={styles.preview}> {count} item{count !== 1 ? 's' : ''} </span>
          <span className={styles.punct}>]</span>
          {tail}
        </div>
      );
    }
    return (
      <div className={styles.node}>
        <div className={styles.line}>
          {key}
          <button className={styles.toggle} onClick={() => setCollapsed(true)} title="Collapse">
            ▼
          </button>
          <span className={styles.punct}>[</span>
        </div>
        <div className={styles.children}>
          {value.map((item, i) => (
            <JsonNode key={i} value={item} depth={depth + 1} comma={i < count - 1} />
          ))}
        </div>
        <div className={styles.line}>
          <span className={styles.punct}>]</span>{tail}
        </div>
      </div>
    );
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as { [key: string]: JsonValue });
    const count = entries.length;
    if (collapsed) {
      return (
        <div className={styles.line}>
          {key}
          <button className={styles.toggle} onClick={() => setCollapsed(false)} title="Expand">
            ▶
          </button>
          <span className={styles.punct}>{'{'}</span>
          <span className={styles.preview}> {count} key{count !== 1 ? 's' : ''} </span>
          <span className={styles.punct}>{'}'}</span>
          {tail}
        </div>
      );
    }
    return (
      <div className={styles.node}>
        <div className={styles.line}>
          {key}
          <button className={styles.toggle} onClick={() => setCollapsed(true)} title="Collapse">
            ▼
          </button>
          <span className={styles.punct}>{'{'}</span>
        </div>
        <div className={styles.children}>
          {entries.map(([k, v], i) => (
            <JsonNode key={k} value={v} depth={depth + 1} comma={i < count - 1} keyName={k} />
          ))}
        </div>
        <div className={styles.line}>
          <span className={styles.punct}>{'}'}</span>{tail}
        </div>
      </div>
    );
  }

  return null;
}

function escapeString(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

interface JsonTreeViewerProps {
  value: JsonValue;
}

export default function JsonTreeViewer({ value }: JsonTreeViewerProps) {
  return (
    <div className={styles.root}>
      <JsonNode value={value} depth={0} />
    </div>
  );
}
