import react from "@vitejs/plugin-react-swc";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ["lib"],
            rollupTypes: false,
            tsconfigPath: "./tsconfig-build.json",
            insertTypesEntry: true, // Crea un entry para los tipos
        }),
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "lib/index.ts"),
            formats: ["es"],
            fileName: "library-trial",
            name: "library-trial",
        },
        copyPublicDir: false,
        rollupOptions: {
            external: ["react", "react/jsx-runtime"],
            input: Object.fromEntries(
                glob
                    .sync("lib/**/*.{ts,tsx}", {
                        ignore: ["lib/**/*.d.ts"],
                    })
                    .map((file) => [
                        // The name of the entry point
                        // lib/nested/foo.ts becomes nested/foo
                        relative(
                            "lib",
                            file.slice(0, file.length - extname(file).length)
                        ),
                        // The absolute path to the entry file
                        // lib/nested/foo.ts becomes /project/lib/nested/foo.ts
                        fileURLToPath(new URL(file, import.meta.url)),
                    ])
            ),
            output: {
                assetFileNames: "assets/[name][extname]",
                entryFileNames: "[name].js",
                preserveModules: true,
                preserveModulesRoot: "lib"
            },
        },
    },
});
