const units = {
  0: "zero",
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "eleven",
  12: "twelve",
  13: "thirteen",
  14: "fourteen",
  15: "fifteen",
  16: "sixteen",
  17: "seventeen",
  18: "eighteen",
  19: "nineteen",
};

const tens = {
  20: "twenty",
  30: "thirty",
  40: "forty",
  50: "fifty",
  60: "sixty",
  70: "seventy",
  80: "eighty",
  90: "ninety",
};

const scales = {
  1e3: "thousand",
  1e6: "million",
  1e9: "billion",
  1e12: "trillion",
  1e15: "quadrillion",
};

export function digitToWords(
  num: number,
  fractionalPartCarried?: string,
): string {
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    throw new Error(
      `unsupported number ${num}, must be between ${Number.MIN_SAFE_INTEGER} and ${Number.MAX_SAFE_INTEGER}`,
    );
  }

  let str = "";
  let number = num;
  if (number < 0) {
    str += "minus ";
    number = -number;
  }

  const wholeNumber = Math.floor(number);
  const fractionalPart =
    fractionalPartCarried ||
    (String(number).includes(".")
      ? `${String(number).split(".")[1]}`
      : undefined);

  if (wholeNumber < 100) {
    if (wholeNumber < 20) {
      str += units[wholeNumber as keyof typeof units];
    } else {
      const tensPart = Math.floor(wholeNumber / 10) * 10;
      const unitsPart = wholeNumber % 10;
      str += tens[tensPart as keyof typeof tens];
      if (unitsPart > 0) {
        str += `-${units[unitsPart as keyof typeof units]}`;
      }
    }
    if (fractionalPart !== undefined) {
      str += ` point ${fractionalPart
        .split("")
        .map(digit => units[Number(digit) as keyof typeof units])
        .join(" ")}`;
    }
  } else if (wholeNumber < 1000) {
    const hundredsPart = Math.floor(wholeNumber / 100);
    const remainder = wholeNumber % 100;
    str += `${units[hundredsPart as keyof typeof units]} hundred`;
    if (remainder > 0) {
      str += ` and ${digitToWords(remainder, fractionalPart)}`;
    }
  } else if (wholeNumber < Number.MAX_SAFE_INTEGER) {
    const scalesKeys = Object.keys(scales)
      .map(Number)
      .filter(key => key <= wholeNumber)
      .sort((a, b) => b - a);
    let remainder = wholeNumber;
    const scaleKey = scalesKeys[0];

    const scalePart = Math.floor(remainder / scaleKey);
    const scaleKeyName = scales[scaleKey as keyof typeof scales];

    str += `${digitToWords(scalePart)} ${scaleKeyName} `;
    remainder -= scalePart * scaleKey;

    if (remainder > 0) {
      if (remainder < 100) {
        str += "and ";
      }
      str += digitToWords(remainder, fractionalPart);
    }
  } else {
    throw new Error(`unsupported number ${num}`);
  }

  return str;
}

export function digitToAdverbial(num: number) {
  if (num === 0) {
    return "zero times";
  } else if (num === 1) {
    return "once";
  } else if (num === 2) {
    return "twice";
  } else {
    return `${digitToWords(num)} times`;
  }
}

function test() {
  const range = Array.from({ length: 10 }, (_, i) => i);
  for (const num of range) {
    console.log(`${String(num).padStart(4, " ")} ${digitToAdverbial(num)}`);
  }
  return 0;
}
