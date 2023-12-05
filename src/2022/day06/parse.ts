export interface Input {
  chars: string[];
}

export function parse(file: string): Input {
  return { chars: file.split("") };
}
