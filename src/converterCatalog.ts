import type { Category, ConverterMeta } from './types';

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'units',     label: 'Units & Measurement', icon: '📏' },
  { id: 'time',      label: 'Time & Date',          icon: '🕐' },
  { id: 'numbers',   label: 'Numbers & Math',       icon: '🔢' },
  { id: 'text',      label: 'Text & Encoding',      icon: '📝' },
  { id: 'color',     label: 'Color',                icon: '🎨' },
  { id: 'finance',   label: 'Finance',              icon: '💰' },
  { id: 'developer', label: 'Developer Tools',      icon: '💻' },
  { id: 'image',     label: 'Image & File',         icon: '🖼️' },
  { id: 'pdf',       label: 'PDF Tools',             icon: '📄' },
];

export const CONVERTERS: ConverterMeta[] = [
  // Units & Measurement
  { slug: 'length',       name: 'Length Converter',         description: 'Convert mm, cm, m, km, in, ft, yd, mi',       category: 'units',     path: '/units/length',       keywords: ['length', 'distance', 'meter', 'feet', 'inch', 'mile', 'kilometer', 'yard'] },
  { slug: 'weight',       name: 'Weight & Mass',            description: 'Convert mg, g, kg, lb, oz, ton',              category: 'units',     path: '/units/weight',       keywords: ['weight', 'mass', 'gram', 'kilogram', 'pound', 'ounce', 'ton'] },
  { slug: 'temperature',  name: 'Temperature',              description: 'Convert Celsius, Fahrenheit, Kelvin',         category: 'units',     path: '/units/temperature',  keywords: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'heat', 'cold'] },
  { slug: 'area',         name: 'Area',                     description: 'Convert m², km², ft², acres, hectares',       category: 'units',     path: '/units/area',         keywords: ['area', 'square', 'meter', 'feet', 'acre', 'hectare'] },
  { slug: 'volume',       name: 'Volume',                   description: 'Convert ml, L, fl oz, cups, pints, gallons',  category: 'units',     path: '/units/volume',       keywords: ['volume', 'liter', 'gallon', 'cup', 'fluid ounce', 'pint'] },
  { slug: 'speed',        name: 'Speed',                    description: 'Convert mph, km/h, m/s, knots',               category: 'units',     path: '/units/speed',        keywords: ['speed', 'velocity', 'mph', 'kmh', 'knot', 'meter per second'] },
  { slug: 'data-storage', name: 'Data Storage',             description: 'Convert bits, bytes, KB, MB, GB, TB',         category: 'units',     path: '/units/data-storage', keywords: ['data', 'storage', 'bytes', 'kilobytes', 'megabytes', 'gigabytes', 'terabytes', 'bits'] },

  // Time & Date
  { slug: 'timezone',       name: 'Time Zone Converter',  description: 'Convert times between time zones worldwide',    category: 'time', path: '/time/timezone',       keywords: ['timezone', 'time zone', 'utc', 'gmt', 'est', 'pst', 'convert'] },
  { slug: 'unix-timestamp', name: 'Unix Timestamp',       description: 'Convert epoch seconds ↔ human-readable date',  category: 'time', path: '/time/unix-timestamp', keywords: ['unix', 'timestamp', 'epoch', 'date', 'time', 'seconds', 'posix'] },
  { slug: 'duration',       name: 'Duration Converter',   description: 'Convert between seconds and HH:MM:SS',         category: 'time', path: '/time/duration',       keywords: ['duration', 'time', 'seconds', 'minutes', 'hours', 'hms', 'stopwatch'] },

  // Numbers & Math
  { slug: 'base',               name: 'Number Base Converter',  description: 'Convert between binary, octal, decimal, hex',   category: 'numbers', path: '/numbers/base',               keywords: ['binary', 'octal', 'decimal', 'hexadecimal', 'hex', 'base', 'number', 'convert'] },
  { slug: 'roman-numerals',     name: 'Roman Numerals',         description: 'Convert between numbers and Roman numerals',    category: 'numbers', path: '/numbers/roman-numerals',     keywords: ['roman', 'numeral', 'number', 'i', 'v', 'x', 'l', 'c', 'd', 'm'] },
  { slug: 'scientific-notation',name: 'Scientific Notation',    description: 'Convert to/from scientific notation',           category: 'numbers', path: '/numbers/scientific-notation', keywords: ['scientific', 'notation', 'exponent', 'power', 'e', 'engineering'] },
  { slug: 'fraction-decimal',   name: 'Fraction ↔ Decimal',     description: 'Convert fractions to decimals and back',        category: 'numbers', path: '/numbers/fraction-decimal',   keywords: ['fraction', 'decimal', 'ratio', '1/2', '0.5', 'simplify'] },

  // Text & Encoding
  { slug: 'base64',        name: 'Base64 Encode/Decode',      description: 'Encode and decode Base64 text',               category: 'text', path: '/text/base64',        keywords: ['base64', 'encode', 'decode', 'encoding', 'atob', 'btoa'] },
  { slug: 'url-encode',    name: 'URL Encode/Decode',         description: 'Encode and decode URL components',            category: 'text', path: '/text/url-encode',    keywords: ['url', 'encode', 'decode', 'percent', 'uri', 'query string'] },
  { slug: 'html-entities', name: 'HTML Entities',             description: 'Encode/decode HTML special characters',       category: 'text', path: '/text/html-entities', keywords: ['html', 'entity', 'encode', 'decode', 'escape', 'ampersand', 'lt', 'gt'] },
  { slug: 'case-converter', name: 'Case Converter',           description: 'Convert camelCase, snake_case, kebab-case…',  category: 'text', path: '/text/case-converter', keywords: ['case', 'camel', 'snake', 'pascal', 'kebab', 'upper', 'lower', 'title'] },
  { slug: 'word-count',    name: 'Word & Character Count',    description: 'Count words, characters, lines',              category: 'text', path: '/text/word-count',    keywords: ['word', 'count', 'character', 'letter', 'line', 'paragraph', 'reading time'] },
  { slug: 'lorem-ipsum',   name: 'Lorem Ipsum Generator',     description: 'Generate placeholder Latin text',             category: 'text', path: '/text/lorem-ipsum',   keywords: ['lorem', 'ipsum', 'placeholder', 'dummy', 'text', 'generator', 'latin'] },

  // Color
  { slug: 'format',   name: 'Color Format Converter',  description: 'Convert HEX ↔ RGB ↔ HSL ↔ HSV',           category: 'color', path: '/color/format',   keywords: ['color', 'hex', 'rgb', 'hsl', 'hsv', 'format', 'picker', 'convert'] },
  { slug: 'contrast', name: 'Color Contrast Checker',  description: 'Check WCAG AA/AAA color contrast ratio',  category: 'color', path: '/color/contrast', keywords: ['color', 'contrast', 'wcag', 'accessibility', 'a11y', 'ratio'] },

  // Finance
  { slug: 'currency',   name: 'Currency Converter',      description: 'Convert between world currencies (live rates)', category: 'finance', path: '/finance/currency',   keywords: ['currency', 'money', 'exchange', 'forex', 'usd', 'eur', 'gbp', 'rate'] },
  { slug: 'percentage', name: 'Percentage Calculator',   description: 'Calculate percentages and ratios',              category: 'finance', path: '/finance/percentage', keywords: ['percentage', 'percent', 'ratio', 'calculate', '%', 'of'] },
  { slug: 'tip',        name: 'Tip Calculator',          description: 'Calculate tip and split bills',                 category: 'finance', path: '/finance/tip',        keywords: ['tip', 'gratuity', 'bill', 'split', 'restaurant', 'service'] },
  { slug: 'loan',       name: 'Loan Calculator',         description: 'Calculate loan payments and interest',          category: 'finance', path: '/finance/loan',       keywords: ['loan', 'interest', 'mortgage', 'payment', 'amortization', 'apr', 'rate'] },

  // Developer Tools
  { slug: 'json',     name: 'JSON Formatter',           description: 'Format, minify, and validate JSON',                    category: 'developer', path: '/developer/json',     keywords: ['json', 'format', 'minify', 'validate', 'pretty', 'print', 'beautify'] },
  { slug: 'jwt',      name: 'JWT Decoder',              description: 'Decode and inspect JSON Web Tokens',                   category: 'developer', path: '/developer/jwt',      keywords: ['jwt', 'token', 'json web token', 'decode', 'bearer', 'auth', 'payload'] },
  { slug: 'regex',    name: 'Regex Tester',             description: 'Test regular expressions against text',                category: 'developer', path: '/developer/regex',    keywords: ['regex', 'regular expression', 'pattern', 'match', 'test', 'flags'] },
  { slug: 'markdown', name: 'Markdown Preview',         description: 'Write Markdown and see a live HTML preview',           category: 'developer', path: '/developer/markdown', keywords: ['markdown', 'md', 'html', 'preview', 'render', 'preview'] },
  { slug: 'hash',     name: 'Hash Generator',           description: 'Generate SHA-1, SHA-256, SHA-512 hashes',              category: 'developer', path: '/developer/hash',     keywords: ['hash', 'sha', 'sha256', 'sha1', 'sha512', 'checksum', 'digest', 'crypto'] },
  { slug: 'csv-json', name: 'CSV ↔ JSON Converter',     description: 'Convert between CSV and JSON formats',                 category: 'developer', path: '/developer/csv-json', keywords: ['csv', 'json', 'convert', 'spreadsheet', 'data', 'table'] },
  { slug: 'uuid',     name: 'UUID Generator',           description: 'Generate random UUIDs (v4)',                           category: 'developer', path: '/developer/uuid',     keywords: ['uuid', 'guid', 'random', 'id', 'identifier', 'generate', 'v4'] },

  // Image & File
  { slug: 'resize',       name: 'Image Resize',             description: 'Resize images in your browser',                                      category: 'image', path: '/image/resize',       keywords: ['image', 'resize', 'scale', 'png', 'jpg', 'jpeg', 'width', 'height'] },
  { slug: 'image-format', name: 'Image Format Converter',   description: 'Convert PNG, JPEG, WebP in browser',                                category: 'image', path: '/image/image-format', keywords: ['image', 'convert', 'png', 'jpeg', 'jpg', 'webp', 'format'] },
  { slug: 'qr-code',      name: 'QR Code Generator',        description: 'Generate QR codes from text or URLs',                               category: 'image', path: '/image/qr-code',      keywords: ['qr', 'qr code', 'barcode', 'url', 'generate', 'scan', 'text'] },
  { slug: 'compress',     name: 'Image Compressor',         description: 'Compress JPEG, PNG, WebP, AVIF with MozJPEG, OxiPNG, libwebp, libavif', category: 'image', path: '/image/compress',     keywords: ['image', 'compress', 'optimize', 'jpg', 'jpeg', 'png', 'webp', 'avif', 'mozjpeg', 'oxipng', 'squoosh', 'reduce', 'size'] },

  // PDF Tools
  { slug: 'pdf-merge',        name: 'PDF Merge',              description: 'Combine multiple PDF files into one',                     category: 'pdf', path: '/pdf/merge',         keywords: ['pdf', 'merge', 'combine', 'join', 'concatenate'] },
  { slug: 'pdf-split',        name: 'PDF Split',              description: 'Split a PDF into individual pages or ranges',             category: 'pdf', path: '/pdf/split',         keywords: ['pdf', 'split', 'extract', 'pages', 'separate'] },
  { slug: 'pdf-rotate',       name: 'PDF Rotate',             description: 'Rotate pages in a PDF file',                             category: 'pdf', path: '/pdf/rotate',        keywords: ['pdf', 'rotate', 'turn', 'orientation', 'pages'] },
  { slug: 'pdf-reorder',      name: 'PDF Reorder Pages',      description: 'Drag and drop to reorder PDF pages',                     category: 'pdf', path: '/pdf/reorder',       keywords: ['pdf', 'reorder', 'rearrange', 'sort', 'pages', 'order'] },
  { slug: 'pdf-remove-pages', name: 'PDF Remove Pages',       description: 'Remove unwanted pages from a PDF',                       category: 'pdf', path: '/pdf/remove-pages',  keywords: ['pdf', 'remove', 'delete', 'pages', 'trim'] },
  { slug: 'pdf-watermark',    name: 'PDF Watermark',          description: 'Add a text watermark to every page of a PDF',            category: 'pdf', path: '/pdf/watermark',     keywords: ['pdf', 'watermark', 'stamp', 'text', 'overlay'] },
  { slug: 'pdf-page-numbers', name: 'PDF Page Numbers',       description: 'Add page numbers to a PDF',                              category: 'pdf', path: '/pdf/page-numbers',  keywords: ['pdf', 'page', 'numbers', 'numbering', 'footer', 'header'] },
  { slug: 'image-to-pdf',     name: 'Image → PDF',            description: 'Convert one or more images to a single PDF',             category: 'pdf', path: '/pdf/image-to-pdf',  keywords: ['image', 'pdf', 'convert', 'jpg', 'png', 'photo'] },
  { slug: 'pdf-to-images',    name: 'PDF → Images',           description: 'Render each PDF page as a PNG image',                    category: 'pdf', path: '/pdf/pdf-to-images',  keywords: ['pdf', 'image', 'png', 'render', 'extract', 'pages'] },
  { slug: 'pdf-word-count',   name: 'PDF Word Count',         description: 'Count words, characters, and pages in a PDF',            category: 'pdf', path: '/pdf/word-count',    keywords: ['pdf', 'word', 'count', 'characters', 'pages', 'text'] },
];
