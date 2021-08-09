import {useMicrophone} from './audio'
import createCanvas, {paint} from './canvas'
import createEditor from './editor'

const container: HTMLElement = document.querySelector('#app')!
const canvas = createCanvas(container)
const editor = createEditor(container)
let analyser: AnalyserNode
let dataArray: Uint8Array

window.addEventListener('load', init)

async function init() {
	const micTools = await useMicrophone()
	analyser = micTools.analyser
	dataArray = micTools.dataArray
	main()
}

function main() {
	requestAnimationFrame(main)
	analyser.getByteFrequencyData(dataArray)
	const ctx = canvas.getContext('2d', {alpha: false})!
	ctx.fillStyle = 'rgb(0, 0, 0)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	paint(editor.getValue(), ctx, dataArray)
}
