var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

const input = document.getElementById('inp-list-item');
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-GB';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function(event) {
    let res = event.results[0][0].transcript;
    console.log('Result received: ' + res, 'Confidence: ' + event.results[0][0].confidence);
    input.value = res;
}

recognition.onspeechend = function() {
    recognition.stop();
}

recognition.onnomatch = function(event) {
    console.log('Phrase not recognised');
}

recognition.onerror = function(event) {
    console.console.error('Error occurred in recognition: ' + event.error);
}

function speechToInput() {
    recognition.start();
}
