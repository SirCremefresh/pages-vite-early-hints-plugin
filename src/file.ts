export type FileEnding = "css" | "js";
export type FileType = "style" | "script";

export function fileEndingToType(fileEnding: FileEnding): FileType {
    switch (fileEnding) {
        case "css":
            return "style";
        case "js":
            return "script";
    }
}
