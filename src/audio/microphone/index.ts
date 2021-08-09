export default async function createMicSource(audioCtx: AudioContext) {
	const stream = await navigator.mediaDevices.getUserMedia({
		audio: {
			noiseSuppression: false,
			echoCancellation: false,
		},
		video: false,
	})
	return audioCtx.createMediaStreamSource(stream)
}
