export interface Input {
  springRecords: SpringRecord[];
  unfoldedSpringRecords: SpringRecord[];
}

export interface SpringRecord {
  data: string;
  check: number[];
}

export function parse(file: string): Input {
  const springRecords = file.split("\n").map(line => {
    const [data, checkStr] = line.split(" ");
    const check = checkStr.split(",").map(num => parseInt(num, 10));
    return { data, check };
  });
  const unfoldedSpringRecords = springRecords.map(springRecord => {
    const { data, check } = springRecord;
    const unfoldedData = `${data}?${data}?${data}?${data}?${data}`;
    const unfoldedSpringRecords = [
      ...check,
      ...check,
      ...check,
      ...check,
      ...check,
    ];
    return { data: unfoldedData, check: unfoldedSpringRecords };
  });
  return { springRecords, unfoldedSpringRecords };
}
