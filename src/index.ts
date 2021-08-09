import './styles.scss'
import initialiseAudio from './audio'
import createCanvas, { paint } from './canvas'
import createEditor from './editor'

let container: HTMLDivElement
let canvas: HTMLCanvasElement
let editorContainer: HTMLDivElement
let audioContainer: HTMLDivElement

let visualiserCode: string = [
	'const bassAmount = Math.max(',
	'\t50,',
	'\tbuffer.slice(0, 20).reduce(',
	'\t\t(acc, curr) => acc + curr,',
	'\t\t0',
	'\t) /',
	'\t20',
	');',
	'ctx.fillStyle = `rgb(${bassAmount + 100},50,50)`;',
	'const circle = new Path2D();',
	'circle.arc(bassAmount * 1.5, bassAmount * 1.25, bassAmount, 0, 2 * Math.PI);',
	'ctx.fill(circle);',
	'',
	'const barWidth = (ctx.canvas.width / buffer.length) * 2.5',
	'buffer.forEach((d, i) => {',
	'\tconst barHeight = d',
	'\tconst x = barWidth * i',
	'\tctx.fillStyle = `rgb(${barHeight + 100},50,50)`;',
	'\tctx.fillRect(x, ctx.canvas.height - barHeight / 2, barWidth, barHeight / 2)',
	'})',
	'',
].join('\n')
let analyser: AnalyserNode
let buffer: Uint8Array

window.addEventListener('load', init, { once: true })

async function init() {
	container = document.querySelector('#app')!
	canvas = createCanvas(container)
	editorContainer = createEditor(container, visualiserCode)
	audioContainer = await initialiseAudio(container)
	;(<any>audioContainer).addEventListener(
		'source-change',
		(e: CustomEvent<{ analyser: AnalyserNode }>) => {
			buffer = new Uint8Array(e.detail.analyser.frequencyBinCount)
			analyser = e.detail.analyser
		}
	)
	;(<any>editorContainer).addEventListener(
		'save',
		(e: CustomEvent<SaveEvent>) => {
			visualiserCode = e.detail.code
		}
	)
	main()
}

function main() {
	requestAnimationFrame(main)
	if (!analyser) return
	analyser.getByteFrequencyData(buffer)
	const ctx = canvas.getContext('2d', { alpha: false })!
	ctx.fillStyle = 'rgb(0, 0, 0)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	paint(visualiserCode, ctx, buffer)
}
