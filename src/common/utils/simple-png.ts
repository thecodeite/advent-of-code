import { writeFileSync } from "fs";

export function encodePng(
  pixels: Uint8Array,
  width: number,
  height: number,
  palette?: PaletteEntry[],
): Uint8Array {
  const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

  const colorType = palette ? ColorType.INDEXED_COLOR : ColorType.GRAYSCALE;

  const ihdrChunk = createIHDRChunk(width, height, colorType);
  const plteChunk = palette ? createPLTEChunk(palette) : new Uint8Array(0);
  const idatChunk = createIDATChunk(pixels, width, height);
  const iendChunk = createIENDChunk();
  return concatenateUint8Arrays(
    pngSignature,
    ihdrChunk,
    plteChunk,
    idatChunk,
    iendChunk,
  );
}

export function writePng(
  filename: string,
  pixels: Uint8Array,
  width: number,
  height: number,
  palette?: PaletteEntry[],
) {
  const pngData = encodePng(pixels, width, height, palette);
  writeFileSync(filename, pngData);
}

enum ColorType {
  GRAYSCALE = 0,
  TRUECOLOR = 2,
  INDEXED_COLOR = 3,
  GRAYSCALE_ALPHA = 4,
  TRUECOLOR_ALPHA = 6,
}

function createIHDRChunk(
  width: number,
  height: number,
  colorType: ColorType,
): Uint8Array {
  const chunkData = new Uint8Array(13);
  const view = new DataView(chunkData.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  chunkData[8] = 8; // Bit depth
  chunkData[9] = colorType; // Color type
  chunkData[10] = 0; // Compression method
  chunkData[11] = 0; // Filter method
  chunkData[12] = 0; // Interlace method
  return createChunk("IHDR", chunkData);
}

function wrapWithDeflate(pixels: Uint8Array): Uint8Array {
  // This is a very naive implementation of the DEFLATE algorithm.
  // It does not actually compress the data, but it wraps it in the necessary headers and footers.

  const header = new Uint8Array([0x78, 0x01]); // No compression

  const blockHeader = new Uint8Array(5);
  blockHeader[0] = 0x01; // Final block, no compression
  const len = pixels.length;
  blockHeader[1] = len & 0xff; // Length (little-endian)
  blockHeader[2] = (len >> 8) & 0xff; // Length (little-endian)
  const nLen = ~len & 0xffff;
  blockHeader[3] = nLen & 0xff; // One's complement of length (little-endian)
  blockHeader[4] = (nLen >> 8) & 0xff; // One's complement of length (little-endian)

  const adler32 = calculateAdler32(pixels);
  const footer = new Uint8Array(4);
  const view = new DataView(footer.buffer);
  view.setUint32(0, adler32);
  return concatenateUint8Arrays(header, blockHeader, pixels, footer);
}

function calculateAdler32(data: Uint8Array): number {
  let a = 1;
  let b = 0;
  for (const byte of data) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  return (b << 16) | a;
}

function createIDATChunk(
  pixels: Uint8Array,
  width: number,
  height: number,
): Uint8Array {
  // For simplicity, we won't actually compress the data here.
  // In a real implementation, you would need to compress the pixel data using zlib.
  const wrappedPixels = wrapWithDeflate(wrapWithFilter(pixels, width, height));
  return createChunk("IDAT", wrappedPixels);
}

function wrapWithFilter(
  pixels: Uint8Array,
  width: number,
  height: number,
): Uint8Array {
  // This is a very naive implementation of PNG filtering.
  // It simply adds a filter byte (0) at the beginning of each scan line.
  const result = new Uint8Array((width + 1) * height);
  for (let y = 0; y < height; y++) {
    result[y * (width + 1)] = 0; // No filter
    for (let x = 0; x < width; x++) {
      result[y * (width + 1) + x + 1] = pixels[y * width + x];
    }
  }
  return result;
}

function createIENDChunk(): Uint8Array {
  return createChunk("IEND", new Uint8Array(0));
}

function createChunk(type: string, data: Uint8Array): Uint8Array {
  const chunkType = new TextEncoder().encode(type);
  const length = new Uint8Array(4);
  const view = new DataView(length.buffer);
  view.setUint32(0, data.length);
  const crc = calculateCRC(chunkType, data);
  return concatenateUint8Arrays(length, chunkType, data, crc);
}

function calculateCRC(type: Uint8Array, data: Uint8Array): Uint8Array {
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  let crc = 0xffffffff;
  for (const byte of type) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  crc ^= 0xffffffff;
  const result = new Uint8Array(4);
  const view = new DataView(result.buffer);
  view.setUint32(0, crc);
  return result;
}

function concatenateUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function createPLTEChunk(palette: PaletteEntry[]): Uint8Array {
  const paletteSize = 8;

  const chunkData = new Uint8Array(paletteSize * 3);
  for (let i = 0; i < paletteSize; i++) {
    const entry = palette[i] || { r: 0, g: 0, b: 0 };
    chunkData[i * 3] = entry.r;
    chunkData[i * 3 + 1] = entry.g;
    chunkData[i * 3 + 2] = entry.b;
  }
  return createChunk("PLTE", chunkData);
}

export interface PaletteEntry {
  r: number;
  g: number;
  b: number;
}
