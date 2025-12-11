import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "."),
        },
    },
    test: {
        environment: "jsdom",
        root: ".",
        include: [
            "tests/**/*.test.ts",
            "tests/**/*.test.tsx",
            "components/**/*.test.tsx",
            "components/**/__tests__/**/*.test.tsx",
            "hooks/**/__tests__/**/*.test.ts",
            "hooks/**/__tests__/**/*.test.tsx",
        ],
    },
});