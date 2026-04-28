import type { ComponentType } from 'react';
import { createElement } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';

/** test */

function lazyRoute(factory: () => Promise<{ default: ComponentType }>) {
  return async () => {
    const m = await factory();
    return { Component: m.default };
  };
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: createElement(Layout),
    children: [
      { index: true, lazy: lazyRoute(() => import('./pages/Home/Home')) },

      // Units & Measurement
      { path: 'units/length',       lazy: lazyRoute(() => import('./pages/units/LengthConverter')) },
      { path: 'units/weight',       lazy: lazyRoute(() => import('./pages/units/WeightConverter')) },
      { path: 'units/temperature',  lazy: lazyRoute(() => import('./pages/units/TemperatureConverter')) },
      { path: 'units/area',         lazy: lazyRoute(() => import('./pages/units/AreaConverter')) },
      { path: 'units/volume',       lazy: lazyRoute(() => import('./pages/units/VolumeConverter')) },
      { path: 'units/speed',        lazy: lazyRoute(() => import('./pages/units/SpeedConverter')) },
      { path: 'units/data-storage', lazy: lazyRoute(() => import('./pages/units/DataStorageConverter')) },

      // Time & Date
      { path: 'time/timezone',       lazy: lazyRoute(() => import('./pages/time/TimezoneConverter')) },
      { path: 'time/unix-timestamp', lazy: lazyRoute(() => import('./pages/time/UnixTimestampConverter')) },
      { path: 'time/duration',       lazy: lazyRoute(() => import('./pages/time/DurationConverter')) },

      // Numbers & Math
      { path: 'numbers/base',                lazy: lazyRoute(() => import('./pages/numbers/NumberBaseConverter')) },
      { path: 'numbers/roman-numerals',      lazy: lazyRoute(() => import('./pages/numbers/RomanNumeralsConverter')) },
      { path: 'numbers/scientific-notation', lazy: lazyRoute(() => import('./pages/numbers/ScientificNotationConverter')) },
      { path: 'numbers/fraction-decimal',    lazy: lazyRoute(() => import('./pages/numbers/FractionDecimalConverter')) },

      // Text & Encoding
      { path: 'text/base64',        lazy: lazyRoute(() => import('./pages/text/Base64Converter')) },
      { path: 'text/url-encode',    lazy: lazyRoute(() => import('./pages/text/UrlEncodeConverter')) },
      { path: 'text/html-entities', lazy: lazyRoute(() => import('./pages/text/HtmlEntitiesConverter')) },
      { path: 'text/case-converter',lazy: lazyRoute(() => import('./pages/text/CaseConverter')) },
      { path: 'text/word-count',    lazy: lazyRoute(() => import('./pages/text/WordCount')) },
      { path: 'text/lorem-ipsum',   lazy: lazyRoute(() => import('./pages/text/LoremIpsum')) },

      // Color
      { path: 'color/format',   lazy: lazyRoute(() => import('./pages/color/ColorFormat')) },
      { path: 'color/contrast', lazy: lazyRoute(() => import('./pages/color/ColorContrast')) },

      // Finance
      { path: 'finance/currency',   lazy: lazyRoute(() => import('./pages/finance/CurrencyConverter')) },
      { path: 'finance/percentage', lazy: lazyRoute(() => import('./pages/finance/PercentageCalculator')) },
      { path: 'finance/tip',        lazy: lazyRoute(() => import('./pages/finance/TipCalculator')) },
      { path: 'finance/loan',       lazy: lazyRoute(() => import('./pages/finance/LoanCalculator')) },

      // Developer Tools
      { path: 'developer/json',     lazy: lazyRoute(() => import('./pages/developer/JsonFormatter')) },
      { path: 'developer/jwt',      lazy: lazyRoute(() => import('./pages/developer/JwtDecoder')) },
      { path: 'developer/regex',    lazy: lazyRoute(() => import('./pages/developer/RegexTester')) },
      { path: 'developer/markdown', lazy: lazyRoute(() => import('./pages/developer/MarkdownPreview')) },
      { path: 'developer/hash',     lazy: lazyRoute(() => import('./pages/developer/HashGenerator')) },
      { path: 'developer/csv-json', lazy: lazyRoute(() => import('./pages/developer/CsvJsonConverter')) },
      { path: 'developer/uuid',     lazy: lazyRoute(() => import('./pages/developer/UuidGenerator')) },

      // Image & File
      { path: 'image/resize',        lazy: lazyRoute(() => import('./pages/image/ImageResize')) },
      { path: 'image/image-format',  lazy: lazyRoute(() => import('./pages/image/ImageFormat')) },
      { path: 'image/qr-code',       lazy: lazyRoute(() => import('./pages/image/QrCode')) },
      { path: 'image/compress',      lazy: lazyRoute(() => import('./pages/image/ImageCompress')) },
    ],
  },
]);
