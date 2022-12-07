export type FileEntry = {
  name: string;
  size: number;
};
export type DirEntry = {
  name: string;
};

export type Command =
  | {
      exe: "cd";
      arg: string;
    }
  | {
      exe: "ls";
      fileEntries: FileEntry[];
      dirEntries: DirEntry[];
    };

export interface Input {
  commands: Command[];
}

export function parse(file: string): Input {
  const lines = file.split("\n");
  const commands: Command[] = [];
  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    if (line.startsWith("$ cd ")) {
      const arg = line.substring("$ cd ".length);
      commands.push({ exe: "cd", arg });
    } else if (line.startsWith("$ ls")) {
      const fileEntries: FileEntry[] = [];
      const dirEntries: DirEntry[] = [];
      while (
        lineNum + 1 < lines.length &&
        !lines[lineNum + 1].startsWith("$ ")
      ) {
        lineNum++;
        let entryLine = lines[lineNum];
        if (entryLine.startsWith("dir ")) {
          dirEntries.push({ name: entryLine.substring("dir ".length) });
        } else {
          const [size, name] = entryLine.split(" ");
          fileEntries.push({ name, size: parseInt(size) });
        }
      }
      commands.push({ exe: "ls", dirEntries, fileEntries });
    }
  }

  return { commands };
}
