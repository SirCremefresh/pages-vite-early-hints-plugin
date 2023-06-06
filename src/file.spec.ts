import {strict as assert} from 'node:assert';
import test from 'node:test';
import { fileEndingToType, FileEnding, FileType } from './file.js';

// We will add tests for each possible input and expect the correct output
await test(`fileEndingToType should correctly convert css to style`, async () => {
    const fileEnding: FileEnding = "css";
    const expectedFileType: FileType = "style";

    const actualFileType = fileEndingToType(fileEnding);

    assert.equal(actualFileType, expectedFileType);
});

await test(`fileEndingToType should correctly convert js to script`, async () => {
    const fileEnding: FileEnding = "js";
    const expectedFileType: FileType = "script";

    const actualFileType = fileEndingToType(fileEnding);

    assert.equal(actualFileType, expectedFileType);
});
