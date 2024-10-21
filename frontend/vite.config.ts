import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../static",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
            manualChunks: {
                "react": ["react", "react-dom"],
                "react-router": ["react-router", "react-router-dom"],
                "remix-router": ["@remix-run/router"],
                "react-websocket": ["react-use-websocket"],
                "tanstack": ["@tanstack/react-query"],
                "date-fns": ["date-fns"],
                "lodash": ["lodash-es"],
                "fluentui-react": ["@fluentui/react"],
                "parse5": [
                    "parse5/lib/parser",
                    "parse5/lib/tokenizer"
                ],
                "micromark-core": [
                    "micromark",
                    "micromark-core-commonmark"
                ]
            }
        }
    },
    server: {
        proxy: {
            "/ask": "http://127.0.0.1:5000",
            "/chat": "http://127.0.0.1:5000",
            "^/api/.*": {
                target: "http://127.0.0.1:5000"
            },
            "/notifier": {
                target: "ws://127.0.0.1:5000",
                ws: true
            }
        }
    }
});
