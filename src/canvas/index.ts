let canvas: HTMLCanvasElement

export default function createCanvas(
	container: HTMLElement
): HTMLCanvasElement {
	const canvasContainer = document.createElement('div')
	canvasContainer.id = 'canvas'
	container.appendChild(canvasContainer)
	canvas = document.createElement('canvas')
	window.addEventListener('resize', resizeCanvas)
	canvasContainer.appendChild(canvas)
	resizeCanvas()
	return canvas
}

export function paint(
	code: string,
	ctx: CanvasRenderingContext2D,
	buffer: Uint8Array
) {
	const func = new Function('ctx', 'buffer', code)
	func(ctx, buffer)
}

function resizeCanvas() {
	canvas.width = canvas.parentElement!.offsetWidth
	canvas.height = canvas.parentElement!.offsetHeight
	const context = canvas.getContext('2d', { alpha: false })
	context!.fillStyle = 'rgb(0,0,0)'
	context!.fillRect(0, 0, canvas.width, canvas.height)
}
