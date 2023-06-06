<!--suppress ALL -->
<h1 align="center">Welcome to Pages Vite Early Hints Plugin 👋</h1>

[![Test](https://github.com/SirCremefresh/pages-vite-early-hints-plugin/actions/workflows/test.js.yml/badge.svg)](https://github.com/SirCremefresh/pages-vite-early-hints-plugin/actions/workflows/test.js.yml)
![npm](https://img.shields.io/npm/v/pages-vite-early-hints-plugin?style=flat-square)

> A vite plugin to generate the _headers file with early hints for Cloudflare Pages

## Install

```sh
npm install pages-vite-early-hints-plugin
```

## Usage

For a vite, react and typescript project you can use the following config:
In this case it will take the Editor.js chuck and add it as early hint for the path `/edit/*` and the index.css chuck
for the path `/*`.

```typescript
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import {earlyHints} from "pages-vite-early-hints-plugin";

export default defineConfig({
    plugins: [
        tsconfigPaths(),
        react(),
        earlyHints({
            hints: [
                {
                    name: "Editor",
                    type: "js",
                    path: "/edit/*",
                },
                {
                    name: "index",
                    type: "css",
                    path: "/*",
                },
            ]
        }),
    ],
});
```

The Generated _headers file will be in the dist folder and look like this:

```text
/edit/*
  Link: </assets/Editor-6141d1aa.js>; rel=preload; as=script
/*
  Link: </assets/index-48eeb833.css>; rel=preload; as=style
```

## Features

Generate the _headers file with early hints for Cloudflare Pages with the correct hashes on vite build.

## API

```typescript
type earlyHints = (
    options: Options
) => Plugin;

type Options = {
    hints: { type: FileEnding; name: string; path: string }[];
};

type FileEnding = "css" | "js";
```

## Run tests

```sh
npm test
```

## Me

👤 **Donato Wolfisberg (donato@wolfibserg.dev) [@SirCremefresh](https://github.com/SirCremefresh)**
