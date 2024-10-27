document.addEventListener('DOMContentLoaded', function() {
  const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const transcriptionDiv = document.getElementById('transcription');
const translationDiv = document.getElementById('translation');

let recognition;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function (event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        transcriptionDiv.textContent = transcript;

        // Después de obtener la transcripción, enviamos el texto para traducir
        translateText(transcript, 'es');  // Traducir al español
    };

    recognition.onerror = function (event) {
        console.error(event.error);
    };
}

startRecordingBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.start();
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
    }
});

stopRecordingBtn.addEventListener('click', () => {
    if (recognition) {
        recognition.stop();
        startRecordingBtn.disabled = false;
        stopRecordingBtn.disabled = true;
    }
});

// Función para traducir la transcripción usando la API MyMemory
async function translateText(text, targetLang) {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const translatedText = data.responseData.translatedText;
        translationDiv.textContent = translatedText;
    } catch (error) {
        console.error('Error con la traducción:', error);
    }
}

});


