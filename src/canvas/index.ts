let canvas: HTMLCanvasElement;

export default function createCanvas(
	container: HTMLElement
): HTMLCanvasElement {
	canvas = document.createElement("canvas");
	window.addEventListener("resize", resizeCanvas);
	resizeCanvas();
	container.appendChild(canvas);
	return canvas;
}

export function paint(
	code: string,
	ctx: CanvasRenderingContext2D,
	dataArray: Uint8Array
) {
	const func = new Function("ctx", "dataArray", code);
	func(ctx, dataArray);
}

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const context = canvas.getContext("2d", { alpha: false });
	context!.fillStyle = "rgb(0,0,0)";
	context!.fillRect(0, 0, canvas.width, canvas.height);
}
