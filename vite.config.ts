import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type PluginOption } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import svg from "@poppanator/sveltekit-svg";
import wasm from "vite-plugin-wasm";

export default defineConfig(({ command }) => {
	const plugins: PluginOption[] = [
		sveltekit(),
		{
			name: "vips-request-middleware",
			configureServer(server) {
				server.middlewares.use((_req, res, next) => {
					res.setHeader(
						"Cross-Origin-Embedder-Policy",
						"require-corp",
					);
					res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
					next();
				});
			},
		},
		svg({
			includePaths: ["./src/lib/assets"],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: "preset-default",
						params: { overrides: { removeViewBox: false } },
					},
					{ name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
				],
			},
		}),
		viteStaticCopy({
			targets: [
				{
					src: "_headers",
					dest: "",
				},
				{
					src: "_routes.json",
					dest: "",
				},
				{
					src: "node_modules/wasm-vips/lib/vips-*.wasm",
					dest: "_app/immutable/workers",
				},
			],
		}),
	];

	if (command === "serve") {
		plugins.unshift(wasm());
	}

	return {
		base: '',
		plugins,
		worker: {
			plugins: () => [wasm()],
			format: "es",
		},
		optimizeDeps: {
			exclude: [
				"wasm-vips",
				"@ffmpeg/core-mt",
				"@ffmpeg/ffmpeg",
				"@ffmpeg/util",
			],
		},
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern",
				},
			},
		},
		build: {
			target: "esnext",
			rollupOptions: {
				output: {
					entryFileNames: "_app/immutable/[name]-[hash].js",
					chunkFileNames: "_app/immutable/[name]-[hash].js",
					assetFileNames: (assetInfo) => {
						const info = assetInfo.name?.split('.') || [];
						const ext = info[info.length - 1];
						if (/\.(css)$/.test(assetInfo.name || '')) {
							return `_app/immutable/[name]-[hash].${ext}`;
						}
						if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name || '')) {
							return `_app/immutable/assets/[name]-[hash].${ext}`;
						}
						if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
							return `_app/immutable/assets/[name]-[hash].${ext}`;
						}
						return `_app/immutable/[name]-[hash].${ext}`;
					},
				},
			},
		},
	};
});
