// <reference types="vite" />

import * as fs from "node:fs/promises";
import * as path from "node:path";
import {PluginOption} from "vite";
import {NormalizedOutputOptions, OutputBundle} from "rollup";
import {FileEnding, fileEndingToType} from "./file.js";

export type Options = {
    hints: { type: FileEnding; name: string; path: string }[];
    fileWriter?: (fileName: string, content: string) => Promise<void>;
};

export type Plugin = Exclude<PluginOption, null | undefined | false | Promise<unknown> | Array<unknown>>;

export function earlyHints(
    options: Options
): Plugin {
    const fileWriter = options.fileWriter ?? fs.writeFile;
    return {
        name: "early-hints",
        apply: "build",

        async writeBundle(
            outputOptions: NormalizedOutputOptions,
            bundle: OutputBundle
        ): Promise<void> {
            const files = Object.keys(bundle);
            let out = "";
            for (const option of options.hints) {
                const fileName = files.find(
                    (file) =>
                        file.startsWith(path.join("assets", option.name)) &&
                        file.endsWith(option.type)
                );
                if (!fileName) {
                    throw new Error(
                        `File not found. name: ${option.name}, type: ${
                            option.type
                        }, availableFiles: ${JSON.stringify(files)}`
                    );
                }
                out += `${option.path}
  Link: </${fileName}>; rel=preload; as=${fileEndingToType(option.type)}\n`;
            }
            if (outputOptions.dir === undefined) {
                throw new Error("outputOptions.dir is undefined");
            }
            const headersFileName = path.join(outputOptions.dir, "_headers");
            await fileWriter(headersFileName, out);
        },
    };
}
