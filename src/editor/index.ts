import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

(<any>self).MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === "json") {
			return new jsonWorker();
		}
		if (label === "typescript" || label === "javascript") {
			return new tsWorker();
		}
		return new editorWorker();
	},
};

export default function createEditor(
	container: HTMLElement
): monaco.editor.IStandaloneCodeEditor {
	const editorContainer = document.createElement("div");
	editorContainer.id = "editor";
	container.appendChild(editorContainer);
	monaco.languages.typescript.javascriptDefaults.addExtraLib(
		`
		declare const ctx: CanvasRenderingContext2D
		declare const dataArray: UInt8Array
`,
		"global.d.ts"
	);
	const editor = monaco.editor.create(editorContainer, {
		value: [
			"const bassAmount = Math.max(",
			"\t50,",
			"\tdataArray.reduce(",
			"\t\t(acc, curr, i) => (i >= Math.floor(dataArray.length / 4) ? acc : acc + curr),",
			"\t\t0",
			"\t) /",
			"\t\t(dataArray.length / 4)",
			");",
			"ctx.fillStyle = `rgb(${bassAmount + 100},50,50)`;",
			"var circle = new Path2D();",
			"circle.arc(bassAmount * 1.5, bassAmount * 1.25, bassAmount, 0, 2 * Math.PI);",
			"ctx.fill(circle);",
		].join("\n"),
		language: "javascript",
		minimap: {
			enabled: false,
		},
		tabSize: 2,
	});
	return editor;
}
