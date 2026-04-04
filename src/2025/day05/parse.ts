export interface FreshRangeLine {
  text: string;
  freshRange: FreshRange;
}

export interface ProductLine {
  text: string;
  productId: number;
}

export interface FreshRange {
  min: number;
  max: number;
}

export interface Input {
  freshRangeLines: FreshRangeLine[];
  productLines: ProductLine[];
}

export function parse(file: string): Input {
  const [partA, partB] = file.split("\n\n");
  const freshRangeLines = partA.split("\n").map(parseFreshRangeLine);
  const productLines = partB.split("\n").map(parseProductLine);
  return { freshRangeLines, productLines };
}

function parseFreshRangeLine(text: string): FreshRangeLine {
  const [min, max] = text.split("-").map(Number);
  return {
    text,
    freshRange: { min, max },
  };
}

function parseProductLine(text: string): ProductLine {
  const productId = Number(text);
  return {
    text,
    productId,
  };
}
