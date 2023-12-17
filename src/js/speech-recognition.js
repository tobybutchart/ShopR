var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const sRInput = document.getElementById('inp-list-item');
const sRButton = document.getElementById('btn-record-speech');
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function(event) {
    let res = event.results[0][0].transcript;
    console.log('Result received: ' + res, 'Confidence: ' + event.results[0][0].confidence);
    sRInput.value = res;
}

recognition.onspeechend = function() {
    recognition.stop();
    toggleBtnColour(false);
}

recognition.onnomatch = function(event) {
    showMsg('warning', 'Phrase not recognised');
    toggleBtnColour(false);
}

recognition.onerror = function(event) {
    showMsg('error', 'Error occurred in recognition: ' + event.error);
    toggleBtnColour(false);
}

function toggleBtnColour(isRecording) {
    sRButton.style.backgroundColor = isRecording ? '#b90000' : MSG_SUCCESS_COLOUR;
}

function speechToInput() {
    toggleBtnColour(true);
    recognition.start();
}
