import { VertFile } from "$lib/types";
import { Converter, FormatInfo } from "./converter.svelte";
import { browser } from "$app/environment";
import PandocWorker from "$lib/workers/pandoc?worker&url";

export class PandocConverter extends Converter {
	public name = "pandoc";
	public ready = $state(false);
	public wasm: ArrayBuffer = null!;

	constructor() {
		super();
		if (!browser) return;
		(async () => {
			this.wasm = await fetch("https://asset.my-converter.com/pandoc.wasm").then((r) =>
				r.arrayBuffer(),
			);
			this.ready = true;
		})();
	}

	public async convert(input: VertFile, to: string): Promise<VertFile> {
		const worker = new Worker(PandocWorker, {
			type: "module",
		});
		worker.postMessage({ type: "load", wasm: this.wasm });
		await waitForMessage(worker, "loaded");
		worker.postMessage({
			type: "convert",
			to,
			file: input.file,
		});
		const result = await waitForMessage(worker);
		if (result.type === "error") {
			worker.terminate();
			// throw new Error(result.error);
			switch (result.errorKind) {
				case "PandocUnknownReaderError": {
					throw new Error(
						`${input.from} is not a supported input format for documents.`,
					);
				}

				case "PandocUnknownWriterError": {
					throw new Error(
						`${to} is not a supported output format for documents.`,
					);
				}

				default:
					if (result.errorKind)
						throw new Error(
							`[${result.errorKind}] ${result.error}`,
						);
					else throw new Error(result.error);
			}
		}
		worker.terminate();
		if (!to.startsWith(".")) to = `.${to}`;
		return new VertFile(
			new File([result.output], input.name),
			result.isZip ? ".zip" : to,
		);
	}

	public supportedFormats = [
		new FormatInfo("docx", true, true),
		new FormatInfo("xml", true, true),
		new FormatInfo("doc", true, true),
		new FormatInfo("md", true, true),
		new FormatInfo("html", true, true),
		new FormatInfo("rtf", true, true),
		new FormatInfo("csv", true, true),
		new FormatInfo("tsv", true, true),
		new FormatInfo("json", true, true),
		new FormatInfo("rst", true, true),
		new FormatInfo("epub", true, true),
		new FormatInfo("odt", true, true),
		new FormatInfo("docbook", true, true),
	];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function waitForMessage(worker: Worker, type?: string): Promise<any> {
	return new Promise((resolve) => {
		const onMessage = (e: MessageEvent) => {
			if (type && e.data.type === type) {
				worker.removeEventListener("message", onMessage);
				resolve(e.data);
			} else {
				worker.removeEventListener("message", onMessage);
				resolve(e.data);
			}
		};
		worker.addEventListener("message", onMessage);
	});
}
