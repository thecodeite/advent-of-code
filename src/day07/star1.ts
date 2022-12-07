import { DirEntry, FileEntry, Input } from "./parse";

interface Folder {
  path: string[];
  files?: FileEntry[];
  dirs?: DirEntry[];
  size?: number;
}

const allFolders: Record<string, Folder> = {};

export function star1(input: Input) {
  const commands = [...input.commands];
  const isRoot = commands[0].exe === "cd" && commands[0].arg === "/";
  if (!isRoot) throw new Error("must start at root");
  commands.shift();
  const folders = new Set(["/"]);
  allFolders[""] = { path: [""] };
  let current = [""];

  for (let command of commands) {
    if (command.exe === "cd") {
      if (command.arg === "/") {
        current = ["/"];
      } else if (command.arg === "..") {
        current = current.slice(0, -1);
      } else {
        current = [...current, command.arg];
      }
      const path = current.join("/");
      folders.add(path);
      allFolders[path] = allFolders[path] ?? {
        path: current,
      };
    } else if (command.exe === "ls") {
      const path = current.join("/");

      const folder = allFolders[path];
      if (!folder) {
        throw new Error("folder missing: " + path);
      }
      folder.files = command.fileEntries;
      folder.dirs = command.dirEntries;
    }
  }

  setSize(allFolders[""]);

  const below100000 = Object.values(allFolders).filter(
    f => f.size && f.size < 100000,
  );

  //console.log("folders:", folders);
  console.log("below100000:", below100000);
  console.log("solution to star 1:", below100000.map(f => f.size ?? 0).sum());
}

function setSize(folder: Folder): number {
  const sizeOfFiles = folder.files?.reduce((p, c) => p + c.size, 0) ?? 0;
  const sizeOfFolders =
    folder.dirs?.reduce((p, c) => {
      const path = [...folder.path, c.name].join("/");
      const f = allFolders[path];
      return p + setSize(f);
    }, 0) ?? 0;
  folder.size = sizeOfFiles + sizeOfFolders;

  return folder.size;
}
