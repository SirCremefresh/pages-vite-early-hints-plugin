import {strict as assert} from 'node:assert';
import test from 'node:test';
import * as path from 'node:path';
import {earlyHints, Options, Plugin} from './plugin.js';
import {FileEnding} from './file.js';
import {NormalizedOutputOptions, OutputAsset, OutputBundle} from "rollup";

let latestWrite: { fileName: string, content: string } | null = null;
const mockFileWriter = async (fileName: string, content: string) => {
    latestWrite = {fileName, content};
};

type WriteBundleFunction = (
    options: NormalizedOutputOptions,
    bundle: OutputBundle
) => Promise<void>;

function getWriteBundleFunction(plugin: Plugin): WriteBundleFunction {
    return plugin.writeBundle as WriteBundleFunction;
}

const TEST_BUNDLE: OutputAsset = {
    fileName: "some",
    needsCodeReference: false,
    name: undefined,
    source: "some",
    type: 'asset',
}

await test(`earlyHints should create a plugin with the correct options`, async () => {
    const options: Options = {
        hints: [
            {type: "css" as FileEnding, name: "styles", path: "/styles"},
            {type: "js" as FileEnding, name: "scripts", path: "/scripts"},
        ],
        fileWriter: mockFileWriter,
    };

    const plugin = earlyHints(options);

    assert.equal(plugin.name, 'early-hints');
    assert.equal(plugin.apply, 'build');
    assert.equal(typeof plugin.writeBundle, 'function');
});

await test(`writeBundle should throw error if no files match the hints`, async () => {
    const options: Options = {
        hints: [
            {type: "css" as FileEnding, name: "styles", path: "/styles"},
            {type: "js" as FileEnding, name: "scripts", path: "/scripts"},
        ],
        fileWriter: mockFileWriter,
    };

    const plugin = earlyHints(options);

    const bundle = {};

    const outputOptions = {dir: ''} as NormalizedOutputOptions;

    await assert.rejects(
        getWriteBundleFunction(plugin)(outputOptions, bundle),
        new Error("File not found. name: styles, type: css, availableFiles: []")
    );
});

await test(`writeBundle should throw error if outputOptions.dir is undefined`, async () => {
    const options: Options = {
        hints: [
            {type: "css" as FileEnding, name: "styles", path: "/styles"},
            {type: "js" as FileEnding, name: "scripts", path: "/scripts"},
        ],
        fileWriter: mockFileWriter,
    };

    const plugin = earlyHints(options);

    const bundle = {
        "assets/styles.css": TEST_BUNDLE,
        "assets/scripts.js": TEST_BUNDLE
    };

    const outputOptions = {} as NormalizedOutputOptions;

    await assert.rejects(
        getWriteBundleFunction(plugin)(outputOptions, bundle),
        new Error("outputOptions.dir is undefined")
    );
});


await test(`writeBundle should write the correct content to file`, async () => {
    const options: Options = {
        hints: [
            {type: "css" as FileEnding, name: "styles", path: "/styles"},
            {type: "js" as FileEnding, name: "scripts", path: "/scripts"},
        ],
        fileWriter: mockFileWriter,
    };

    const plugin = earlyHints(options);

    const bundle = {
        "assets/styles.css": TEST_BUNDLE,
        "assets/scripts.js": TEST_BUNDLE,
    };

    const outputOptions = {dir: 'dist'} as NormalizedOutputOptions;

    await getWriteBundleFunction(plugin)(outputOptions, bundle);

    assert.deepEqual(latestWrite, {
        fileName: path.join(outputOptions.dir!!, "_headers"),
        content: "/styles\n  Link: </assets/styles.css>; rel=preload; as=style\n/scripts\n  Link: </assets/scripts.js>; rel=preload; as=script\n"
    });
});
