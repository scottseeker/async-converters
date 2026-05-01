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

      // PDF Tools
      { path: 'pdf/merge',        lazy: lazyRoute(() => import('./pages/pdf/PdfMerge')) },
      { path: 'pdf/split',        lazy: lazyRoute(() => import('./pages/pdf/PdfSplit')) },
      { path: 'pdf/rotate',       lazy: lazyRoute(() => import('./pages/pdf/PdfRotate')) },
      { path: 'pdf/reorder',      lazy: lazyRoute(() => import('./pages/pdf/PdfReorder')) },
      { path: 'pdf/remove-pages', lazy: lazyRoute(() => import('./pages/pdf/PdfRemovePages')) },
      { path: 'pdf/watermark',    lazy: lazyRoute(() => import('./pages/pdf/PdfWatermark')) },
      { path: 'pdf/page-numbers', lazy: lazyRoute(() => import('./pages/pdf/PdfPageNumbers')) },
      { path: 'pdf/image-to-pdf', lazy: lazyRoute(() => import('./pages/pdf/ImageToPdf')) },
      { path: 'pdf/pdf-to-images',lazy: lazyRoute(() => import('./pages/pdf/PdfToImages')) },
      { path: 'pdf/word-count',   lazy: lazyRoute(() => import('./pages/pdf/PdfWordCount')) },
      { path: 'pdf/lock',              lazy: lazyRoute(() => import('./pages/pdf/PdfLock')) },
      { path: 'pdf/unlock',            lazy: lazyRoute(() => import('./pages/pdf/PdfUnlock')) },
      { path: 'pdf/metadata',          lazy: lazyRoute(() => import('./pages/pdf/PdfMetadata')) },
      { path: 'pdf/reverse',           lazy: lazyRoute(() => import('./pages/pdf/PdfReverse')) },
      { path: 'pdf/grayscale',         lazy: lazyRoute(() => import('./pages/pdf/PdfGrayscale')) },
      { path: 'pdf/header-footer',     lazy: lazyRoute(() => import('./pages/pdf/PdfHeaderFooter')) },
      { path: 'pdf/text-extract',      lazy: lazyRoute(() => import('./pages/pdf/PdfTextExtract')) },
      { path: 'pdf/crop',              lazy: lazyRoute(() => import('./pages/pdf/PdfCrop')) },
      { path: 'pdf/scale',             lazy: lazyRoute(() => import('./pages/pdf/PdfScale')) },

      // Image & File (new tools)
      { path: 'image/crop',                  lazy: lazyRoute(() => import('./pages/image/ImageCrop')) },
      { path: 'image/flip',                  lazy: lazyRoute(() => import('./pages/image/ImageFlip')) },
      { path: 'image/watermark',             lazy: lazyRoute(() => import('./pages/image/ImageWatermark')) },
      { path: 'image/meme-generator',        lazy: lazyRoute(() => import('./pages/image/MemeGenerator')) },
      { path: 'image/blur',                  lazy: lazyRoute(() => import('./pages/image/ImageBlur')) },
      { path: 'image/border',                lazy: lazyRoute(() => import('./pages/image/ImageBorder')) },
      { path: 'image/rounded-corners',       lazy: lazyRoute(() => import('./pages/image/ImageRoundedCorners')) },
      { path: 'image/collage',               lazy: lazyRoute(() => import('./pages/image/ImageCollage')) },
      { path: 'image/aspect-crop',           lazy: lazyRoute(() => import('./pages/image/ImageAspectCrop')) },
      { path: 'image/thumbnail-maker',       lazy: lazyRoute(() => import('./pages/image/ThumbnailMaker')) },
      { path: 'image/favicon-generator',     lazy: lazyRoute(() => import('./pages/image/FaviconGenerator')) },
      { path: 'image/color-palette',         lazy: lazyRoute(() => import('./pages/image/ColorPaletteExtractor')) },
      { path: 'image/gradient-generator',    lazy: lazyRoute(() => import('./pages/image/GradientGenerator')) },
      { path: 'image/css-box-shadow',        lazy: lazyRoute(() => import('./pages/image/CssBoxShadow')) },
      { path: 'image/css-glassmorphism',     lazy: lazyRoute(() => import('./pages/image/CssGlassmorphism')) },
      { path: 'image/svg-blob',              lazy: lazyRoute(() => import('./pages/image/SvgBlob')) },
      { path: 'image/svg-wave',              lazy: lazyRoute(() => import('./pages/image/SvgWave')) },
      { path: 'image/bg-pattern',            lazy: lazyRoute(() => import('./pages/image/BgPattern')) },
      { path: 'image/screenshot-mockup',     lazy: lazyRoute(() => import('./pages/image/ScreenshotMockup')) },
      { path: 'image/social-preview',        lazy: lazyRoute(() => import('./pages/image/SocialPreview')) },
      { path: 'image/compare',               lazy: lazyRoute(() => import('./pages/image/ImageCompare')) },
      { path: 'image/zip-viewer',            lazy: lazyRoute(() => import('./pages/image/ZipViewer')) },
      { path: 'image/exif-viewer',           lazy: lazyRoute(() => import('./pages/image/ExifViewer')) },
      { path: 'image/exif-remover',          lazy: lazyRoute(() => import('./pages/image/ExifRemover')) },
      { path: 'image/file-checksum',         lazy: lazyRoute(() => import('./pages/image/FileChecksum')) },
      { path: 'image/csv-column-extractor',  lazy: lazyRoute(() => import('./pages/image/CsvColumnExtractor')) },
      { path: 'image/csv-deduplicator',      lazy: lazyRoute(() => import('./pages/image/CsvDeduplicator')) },
      { path: 'image/csv-sorter',            lazy: lazyRoute(() => import('./pages/image/CsvSorter')) },
      { path: 'image/csv-splitter',          lazy: lazyRoute(() => import('./pages/image/CsvSplitter')) },

      // Text (new tools)
      { path: 'text/dedupe-lines',       lazy: lazyRoute(() => import('./pages/text/DedupeLines')) },
      { path: 'text/sort-lines',         lazy: lazyRoute(() => import('./pages/text/SortLines')) },
      { path: 'text/randomize-lines',    lazy: lazyRoute(() => import('./pages/text/RandomizeLines')) },
      { path: 'text/text-diff',          lazy: lazyRoute(() => import('./pages/text/TextDiff')) },
      { path: 'text/remove-spaces',      lazy: lazyRoute(() => import('./pages/text/RemoveSpaces')) },
      { path: 'text/keyword-density',    lazy: lazyRoute(() => import('./pages/text/KeywordDensity')) },
      { path: 'text/text-to-slug',       lazy: lazyRoute(() => import('./pages/text/TextToSlug')) },
      { path: 'text/reverse-text',       lazy: lazyRoute(() => import('./pages/text/ReverseText')) },
      { path: 'text/tiny-text',          lazy: lazyRoute(() => import('./pages/text/TinyText')) },
      { path: 'text/wide-text',          lazy: lazyRoute(() => import('./pages/text/WideText')) },
      { path: 'text/remove-line-breaks', lazy: lazyRoute(() => import('./pages/text/RemoveLineBreaks')) },
      { path: 'text/add-line-numbers',   lazy: lazyRoute(() => import('./pages/text/AddLineNumbers')) },
      { path: 'text/find-replace',       lazy: lazyRoute(() => import('./pages/text/FindReplace')) },
      { path: 'text/html-stripper',      lazy: lazyRoute(() => import('./pages/text/HtmlStripper')) },

      // Developer Tools (new tools)
      { path: 'developer/xml-formatter',       lazy: lazyRoute(() => import('./pages/developer/XmlFormatter')) },
      { path: 'developer/yaml-formatter',      lazy: lazyRoute(() => import('./pages/developer/YamlFormatter')) },
      { path: 'developer/sql-formatter',       lazy: lazyRoute(() => import('./pages/developer/SqlFormatter')) },
      { path: 'developer/js-beautifier',       lazy: lazyRoute(() => import('./pages/developer/JsBeautifier')) },
      { path: 'developer/css-beautifier',      lazy: lazyRoute(() => import('./pages/developer/CssBeautifier')) },
      { path: 'developer/html-beautifier',     lazy: lazyRoute(() => import('./pages/developer/HtmlBeautifier')) },
      { path: 'developer/diff-checker',        lazy: lazyRoute(() => import('./pages/developer/DiffChecker')) },
      { path: 'developer/cron-generator',      lazy: lazyRoute(() => import('./pages/developer/CronGenerator')) },
      { path: 'developer/cron-reader',         lazy: lazyRoute(() => import('./pages/developer/CronReader')) },
      { path: 'developer/timestamp-diff',      lazy: lazyRoute(() => import('./pages/developer/TimestampDiff')) },
      { path: 'developer/opengraph-preview',   lazy: lazyRoute(() => import('./pages/developer/OpengraphPreview')) },
      { path: 'developer/robots-generator',    lazy: lazyRoute(() => import('./pages/developer/RobotsGenerator')) },
      { path: 'developer/sitemap-generator',   lazy: lazyRoute(() => import('./pages/developer/SitemapGenerator')) },
      { path: 'developer/htaccess-generator',  lazy: lazyRoute(() => import('./pages/developer/HtaccessGenerator')) },
      { path: 'developer/password-generator',  lazy: lazyRoute(() => import('./pages/developer/PasswordGenerator')) },
      { path: 'developer/password-strength',   lazy: lazyRoute(() => import('./pages/developer/PasswordStrength')) },
      { path: 'developer/utm-builder',         lazy: lazyRoute(() => import('./pages/developer/UtmBuilder')) },
      { path: 'developer/dns-generator',       lazy: lazyRoute(() => import('./pages/developer/DnsGenerator')) },
      { path: 'developer/dummy-json',          lazy: lazyRoute(() => import('./pages/developer/DummyJson')) },

      // Social & Creator
      { path: 'social/fancy-text',           lazy: lazyRoute(() => import('./pages/social/FancyText')) },
      { path: 'social/instagram-bio',        lazy: lazyRoute(() => import('./pages/social/InstagramBio')) },
      { path: 'social/hashtag-generator',    lazy: lazyRoute(() => import('./pages/social/HashtagGenerator')) },
      { path: 'social/youtube-tags',         lazy: lazyRoute(() => import('./pages/social/YoutubeTags')) },
      { path: 'social/caption-line-break',   lazy: lazyRoute(() => import('./pages/social/CaptionLineBreak')) },
      { path: 'social/tweet-counter',        lazy: lazyRoute(() => import('./pages/social/TweetCounter')) },
      { path: 'social/username-generator',   lazy: lazyRoute(() => import('./pages/social/UsernameGenerator')) },
      { path: 'social/discord-formatter',    lazy: lazyRoute(() => import('./pages/social/DiscordFormatter')) },

      // Business & Seller
      { path: 'business/profit-margin',       lazy: lazyRoute(() => import('./pages/business/ProfitMargin')) },
      { path: 'business/roi-calculator',      lazy: lazyRoute(() => import('./pages/business/RoiCalculator')) },
      { path: 'business/break-even',          lazy: lazyRoute(() => import('./pages/business/BreakEven')) },
      { path: 'business/discount-calculator', lazy: lazyRoute(() => import('./pages/business/DiscountCalculator')) },
      { path: 'business/sales-tax',           lazy: lazyRoute(() => import('./pages/business/SalesTax')) },
      { path: 'business/commission',          lazy: lazyRoute(() => import('./pages/business/CommissionCalculator')) },
      { path: 'business/paypal-fee',          lazy: lazyRoute(() => import('./pages/business/PaypalFee')) },
      { path: 'business/ebay-fee',            lazy: lazyRoute(() => import('./pages/business/EbayFee')) },
      { path: 'business/etsy-fee',            lazy: lazyRoute(() => import('./pages/business/EtsyFee')) },
      { path: 'business/amazon-fee',          lazy: lazyRoute(() => import('./pages/business/AmazonFee')) },
      { path: 'business/markup-margin',       lazy: lazyRoute(() => import('./pages/business/MarkupMargin')) },
      { path: 'business/invoice-generator',   lazy: lazyRoute(() => import('./pages/business/InvoiceGenerator')) },
      { path: 'business/quote-generator',     lazy: lazyRoute(() => import('./pages/business/QuoteGenerator')) },
      { path: 'business/barcode-generator',   lazy: lazyRoute(() => import('./pages/business/BarcodeGenerator')) },

      // Gaming
      { path: 'gaming/dpi-calculator',      lazy: lazyRoute(() => import('./pages/gaming/DpiCalculator')) },
      { path: 'gaming/sensitivity',         lazy: lazyRoute(() => import('./pages/gaming/SensitivityConverter')) },
      { path: 'gaming/fov-calculator',      lazy: lazyRoute(() => import('./pages/gaming/FovCalculator')) },
      { path: 'gaming/gaming-name',         lazy: lazyRoute(() => import('./pages/gaming/GamingName')) },
      { path: 'gaming/random-team',         lazy: lazyRoute(() => import('./pages/gaming/RandomTeam')) },
      { path: 'gaming/minecraft-stack',     lazy: lazyRoute(() => import('./pages/gaming/MinecraftStack')) },
      { path: 'gaming/minecraft-beacon',    lazy: lazyRoute(() => import('./pages/gaming/MinecraftBeacon')) },
      { path: 'gaming/minecraft-enchant',   lazy: lazyRoute(() => import('./pages/gaming/MinecraftEnchant')) },
      { path: 'gaming/pokemon-type',        lazy: lazyRoute(() => import('./pages/gaming/PokemonType')) },
      { path: 'gaming/pokemon-iv',          lazy: lazyRoute(() => import('./pages/gaming/PokemonIv')) },
      { path: 'gaming/dnd-dice',            lazy: lazyRoute(() => import('./pages/gaming/DndDice')) },
      { path: 'gaming/dnd-name',            lazy: lazyRoute(() => import('./pages/gaming/DndName')) },

      // Student & School
      { path: 'student/gpa-calculator',      lazy: lazyRoute(() => import('./pages/student/GpaCalculator')) },
      { path: 'student/grade-percentage',    lazy: lazyRoute(() => import('./pages/student/GradePercentage')) },
      { path: 'student/citation-generator',  lazy: lazyRoute(() => import('./pages/student/CitationGenerator')) },
      { path: 'student/reading-time-est',    lazy: lazyRoute(() => import('./pages/student/ReadingTimeEst')) },
      { path: 'student/flashcard-picker',    lazy: lazyRoute(() => import('./pages/student/FlashcardPicker')) },
      { path: 'student/student-picker',      lazy: lazyRoute(() => import('./pages/student/StudentPicker')) },
      { path: 'student/study-timer',         lazy: lazyRoute(() => import('./pages/student/StudyTimer')) },
      { path: 'student/pomodoro',            lazy: lazyRoute(() => import('./pages/student/Pomodoro')) },
      { path: 'student/formula-sheet',       lazy: lazyRoute(() => import('./pages/student/FormulaSheet')) },
      { path: 'student/sig-figs',            lazy: lazyRoute(() => import('./pages/student/SigFigs')) },

      // Random & Fun
      { path: 'random/spin-wheel',          lazy: lazyRoute(() => import('./pages/random/SpinWheel')) },
      { path: 'random/yes-no',              lazy: lazyRoute(() => import('./pages/random/YesNo')) },
      { path: 'random/random-number',       lazy: lazyRoute(() => import('./pages/random/RandomNumber')) },
      { path: 'random/random-group',        lazy: lazyRoute(() => import('./pages/random/RandomGroup')) },
      { path: 'random/coin-flip',           lazy: lazyRoute(() => import('./pages/random/CoinFlip')) },
      { path: 'random/dice-roller',         lazy: lazyRoute(() => import('./pages/random/DiceRoller')) },
      { path: 'random/raffle-picker',       lazy: lazyRoute(() => import('./pages/random/RafflePicker')) },
      { path: 'random/secret-santa',        lazy: lazyRoute(() => import('./pages/random/SecretSanta')) },
    ],
  },
]);
