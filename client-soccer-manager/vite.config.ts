import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		tsconfigPaths(),
		react(),
		federation({
			name: "soccer-app",
			filename: "remoteEntry.js",
			exposes: {
				"./soccerApp": "./src/main",
			},

			shared: ["react", "react-dom"],
		}),
	],
	server: {
		port: 3011,
	},
	build: {
		plugins: [
			federation({
				remotes: {
					webpack_remote: "webpack_remote",
				},
			}),
		],
	},
});
