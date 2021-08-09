import './styles.scss'
import createMicSource from './microphone'
export { default as useMicrophone } from './microphone'

const audioTypes = [{ type: 'microphone', name: 'Microphone' }]
let audioContainer: HTMLDivElement
let sourceForm: HTMLFormElement
let destForm: HTMLFormElement
let audioCtx: AudioContext
let analyser: AnalyserNode
let audio: HTMLAudioElement

export default async function initialiseAudio(container: HTMLDivElement) {
	audio = new Audio()
	audioContainer = document.createElement('div')
	audioContainer.id = 'audio'
	sourceForm = createSourceForm()
	sourceForm.addEventListener('change', setAudioSource)
	audioContainer.appendChild(sourceForm)
	destForm = await createDestForm()
	destForm.addEventListener('change', setAudioDest)
	audioContainer.appendChild(destForm)
	container.appendChild(audioContainer)
	return audioContainer
}

function createAudioContext() {
	audioCtx = new (window.AudioContext || (<any>window).webkitAudioContext)()
	analyser = audioCtx.createAnalyser()
	analyser.fftSize = 8192
}

function createSourceForm() {
	const form = document.createElement('form')
	audioTypes.forEach(audioType => {
		const label = document.createElement('label')
		const input = document.createElement('input')
		input.type = 'radio'
		input.name = 'audio-type'
		input.value = audioType.type
		label.textContent = audioType.name
		label.appendChild(input)
		form.appendChild(label)
	})
	return form
}

async function createDestForm() {
	const form = document.createElement('form')
	const devices = (await navigator.mediaDevices.enumerateDevices()).filter(
		device => device.kind === 'audiooutput'
	)
	devices.forEach(device => {
		const label = document.createElement('label')
		label.textContent = device.label
		const input = document.createElement('input')
		input.type = 'radio'
		input.value = device.deviceId
		input.name = 'output'
		label.appendChild(input)
		form.appendChild(label)
	})
	return form
}

async function setAudioSource() {
	if (!audioCtx) createAudioContext()
	const checkedRadio: HTMLInputElement = sourceForm.querySelector(':checked')!
	switch (checkedRadio.value) {
		case 'microphone': {
			const source = await createMicSource(audioCtx)
			source.connect(analyser)
			const output = audioCtx.createMediaStreamDestination()
			analyser.connect(output)
			audio.srcObject = output.stream
			audio.play()
			const e = new CustomEvent('source-change', {
				detail: {
					analyser,
				},
			})
			audioContainer.dispatchEvent(e)
		}
	}
}

async function setAudioDest() {
	const checkedRadio: HTMLInputElement = destForm.querySelector(':checked')!
	//@ts-expect-error: setSinkId is an experimental feature, not yet put into the TS DOM library
	audio.setSinkId(checkedRadio.value)
}
