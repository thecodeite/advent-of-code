export interface Lens {
  label: string;
  value: number;
}

export interface Load {
  op: "=";
  lens: Lens;
}

export interface Unload {
  op: "-";
  label: string;
}

export interface Input {
  blocks: string[];
  ops: (Load | Unload)[];
}

export function parse(file: string): Input {
  const blocks = file.split(",");
  const ops = blocks.map(block => {
    const x = /(\w+)(-|=(\d+))/g.exec(block);
    //console.log("x:", x);
    const [, label, op, value] = x!;
    if (op === "-") return { op: "-", label } as Unload;
    if (op.startsWith("="))
      return { op: "=", lens: { label, value: Number(value) } } as Load;
    throw new Error("Invalid op");
    //if (op === "=") return { op, label, value: Number(value) };
    //return { op, label };
  });
  return { blocks, ops };
}
