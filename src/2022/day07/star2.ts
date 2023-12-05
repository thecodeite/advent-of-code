import { DirEntry, FileEntry, Input } from "./parse";

interface Folder {
  path: string[];
  files?: FileEntry[];
  dirs?: DirEntry[];
  size?: number;
}

const allFolders: Record<string, Folder> = {};

export function solve(input: Input) {
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

  const sizeOfRoot = allFolders[""].size ?? 0;
  console.log("sizeOfRoot:", sizeOfRoot.toLocaleString());
  const freeSpace = 70000000 - sizeOfRoot;
  console.log("freeSpace:", freeSpace.toLocaleString());
  const toFree = 30000000 - freeSpace;
  console.log("toFree:", toFree.toLocaleString());
  const candidates = Object.values(allFolders)
    .map(f => f.size ?? 0)
    .filter(s => s > toFree)
    .sort((a, b) => a - b);
  // console.log("candidates:", candidates.map(c => c.toLocaleString()).join(" "));
  console.log("solution to star 2:", candidates[0]);
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
