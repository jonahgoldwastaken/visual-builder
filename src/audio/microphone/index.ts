export default async function useMicrophone() {
	const audioCtx = new (window.AudioContext ||
		(<any>window).webkitAudioContext)();
	const analyser = audioCtx.createAnalyser();
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: true,
		video: false,
	});
	const source = audioCtx.createMediaStreamSource(stream);
	source.connect(analyser);
	analyser.fftSize = 1024;
	const dataArray = new Uint8Array(analyser.frequencyBinCount);
	return { analyser, dataArray };
}
