export function createEditorLayout() {
	const editorContainer = document.createElement('div')
	editorContainer.id = 'editor'
	const monacoContainer = document.createElement('div')
	editorContainer.appendChild(monacoContainer)
	const buttonContainer = document.createElement('div')
	const saveButton = document.createElement('button')
	saveButton.id = 'save-button'
	saveButton.textContent = 'Save'
	buttonContainer.appendChild(saveButton)
	editorContainer.appendChild(buttonContainer)
	return editorContainer
}
