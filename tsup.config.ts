import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	name: "haiku",
	target: "es2020",
	format: ["esm"],
	splitting: false,
	dts: true,
	sourcemap: true,
	clean: true,
	minify: true,
	external: ["typescript"],
});
