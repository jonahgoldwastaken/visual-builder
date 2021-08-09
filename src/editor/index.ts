import './styles.scss'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { createEditorLayout } from './layout'
;(<any>self).MonacoEnvironment = {
	getWorker(_: any, label: string) {
		if (label === 'json') {
			return new jsonWorker()
		}
		if (label === 'typescript' || label === 'javascript') {
			return new tsWorker()
		}
		return new editorWorker()
	},
}

export default function createEditor(
	container: HTMLElement,
	initialValue: string
): HTMLDivElement {
	const editorContainer = createEditorLayout()
	container.appendChild(editorContainer)
	monaco.languages.typescript.javascriptDefaults.addExtraLib(
		`
		declare const buffer: Uint8Array;
		declare const ctx: CanvasRenderingContext2D;
`,
		'global.d.ts'
	)
	const editor = monaco.editor.create(
		editorContainer.querySelector('div:first-child')!,
		{
			value: initialValue,
			language: 'javascript',
			minimap: {
				enabled: false,
			},
			tabSize: 2,
			lineNumbers: 'on',
			wrappingIndent: 'same',
		}
	)
	registerListeners(editorContainer, editor)
	return editorContainer
}

function registerListeners(
	container: HTMLDivElement,
	editor: monaco.editor.IStandaloneCodeEditor
) {
	const saveButton = container.querySelector('#save-button')!
	saveButton.addEventListener('click', () => {
		editor.getAction('editor.action.formatDocument').run()
		const e = new CustomEvent('save', {
			detail: {
				code: editor.getValue(),
			},
		})
		container.dispatchEvent(e)
	})
}
