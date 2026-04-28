/// <reference lib="webworker" />

import * as jpegCodec from '@jsquash/jpeg';
import * as pngCodec from '@jsquash/png';
import * as webpCodec from '@jsquash/webp';
import * as avifCodec from '@jsquash/avif';
import * as oxipng from '@jsquash/oxipng';

export type CompressFormat = 'jpeg' | 'png' | 'webp' | 'avif';

export interface CompressRequest {
  imageData: ImageData;
  formats: CompressFormat[];
  jpegQuality: number;   // 1-100
  webpQuality: number;   // 1-100
  avifQuality: number;   // 1-100 (lower = smaller)
  pngLevel: number;      // oxipng level 0-6
  stripMetadata: boolean;
}

export interface CompressResult {
  format: CompressFormat;
  blob: Blob;
  bytes: number;
  dataUrl: string;
}

export interface WorkerResponse {
  type: 'result' | 'progress' | 'error';
  format?: CompressFormat;
  result?: CompressResult;
  message?: string;
  done?: boolean;
}

async function encodeFormat(
  imageData: ImageData,
  format: CompressFormat,
  opts: CompressRequest
): Promise<CompressResult> {
  let bytes: ArrayBuffer;
  let mime: string;

  switch (format) {
    case 'jpeg': {
      mime = 'image/jpeg';
      bytes = await jpegCodec.encode(imageData, { quality: opts.jpegQuality });
      break;
    }
    case 'png': {
      mime = 'image/png';
      const rawPng = await pngCodec.encode(imageData);
      const optimised = await oxipng.optimise(rawPng, {
        level: opts.pngLevel,
        interlace: false,
      });
      bytes = optimised;
      break;
    }
    case 'webp': {
      mime = 'image/webp';
      bytes = await webpCodec.encode(imageData, { quality: opts.webpQuality });
      break;
    }
    case 'avif': {
      mime = 'image/avif';
      bytes = await avifCodec.encode(imageData, { quality: opts.avifQuality, qualityAlpha: opts.avifQuality });
      break;
    }
  }

  const uint8 = new Uint8Array(bytes as ArrayBuffer);
  const blob = new Blob([uint8.buffer as ArrayBuffer], { type: mime });
  const dataUrl = await new Promise<string>((resolve, reject) => {
    // Use FileReader in worker context (async)
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(blob);
  });

  return {
    format,
    blob,
    bytes: uint8.byteLength,
    dataUrl,
  };
}

self.onmessage = async (e: MessageEvent<CompressRequest>) => {
  const req = e.data;
  const formats = req.formats;

  for (const fmt of formats) {
    try {
      const result = await encodeFormat(req.imageData, fmt, req);
      const response: WorkerResponse = {
        type: 'result',
        format: fmt,
        result,
      };
      self.postMessage(response);
    } catch (err) {
      const response: WorkerResponse = {
        type: 'error',
        format: fmt,
        message: err instanceof Error ? err.message : String(err),
      };
      self.postMessage(response);
    }
  }

  const done: WorkerResponse = { type: 'progress', done: true };
  self.postMessage(done);
};
