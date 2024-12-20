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

//sound master
document.addEventListener('DOMContentLoaded', function () {
    const tabsList = document.getElementById('tabsList');
    const volumeRange = document.getElementById('volumeRange');
    const applyVolumeButton = document.getElementById('applyVolume');
    const muteTabButton = document.getElementById('muteTab');
    const savePresetButton = document.getElementById('savePreset');
    const applyPresetButton = document.getElementById('applyPreset');
    const presetNameInput = document.getElementById('presetName');
    const presetList = document.getElementById('presetList');

    // Mock data: list of tabs with their current volume and mute status
    const tabs = [
        { id: 1, title: 'YouTube', volume: 100, muted: false },
        { id: 2, title: 'Spotify', volume: 100, muted: false },
        { id: 3, title: 'Netflix', volume: 100, muted: false }
    ];

    // Presets storage with predefined presets
    const presets = {
        default: 100,
        voiceBoost: 150,
        bassBoost: 200
    };

    // Function to render the list of tabs
    function renderTabs() {
        tabsList.innerHTML = '';
        tabs.forEach(tab => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = `${tab.title} (Current Volume: ${tab.volume}%, Muted: ${tab.muted ? 'Yes' : 'No'})`;
            li.dataset.tabId = tab.id;
            tabsList.appendChild(li);
        });
    }

    // Function to render the list of presets
    function renderPresets() {
        const userPresets = Object.keys(presets).filter(preset => !['default', 'voiceBoost', 'bassBoost'].includes(preset));
        userPresets.forEach(presetName => {
            const option = document.createElement('option');
            option.value = presetName;
            option.textContent = presetName;
            presetList.appendChild(option);
        });
    }

    // Function to apply volume to a tab
    function applyVolume(tabId, volume) {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            tab.volume = volume;
            renderTabs();
            console.log(`Applied volume ${volume}% to tab ${tab.title}`);
        }
    }

    // Function to mute/unmute a tab
    function toggleMuteTab(tabId) {
        const tab = tabs.find(t => t.id === tabId);
        if (tab) {
            tab.muted = !tab.muted;
            renderTabs();
            console.log(`${tab.muted ? 'Muted' : 'Unmuted'} tab ${tab.title}`);
        }
    }

    // Function to save a volume preset
    function savePreset(name, volume) {
        presets[name] = volume;
        renderPresets();
        console.log(`Saved preset "${name}" with volume ${volume}%`);
    }

    // Function to apply a preset to the selected tab
    function applyPreset(tabId, presetName) {
        const volume = presets[presetName];
        if (volume !== undefined) {
            applyVolume(tabId, volume);
        } else {
            alert('Preset not found.');
        }
    }

    // Event listener for the Apply Volume button
    applyVolumeButton.addEventListener('click', function () {
        const selectedTabId = Number(tabsList.querySelector('.list-group-item.active')?.dataset.tabId);
        const volume = volumeRange.value;
        if (selectedTabId) {
            applyVolume(selectedTabId, volume);
        } else {
            alert('Please select a tab to apply the volume.');
        }
    });

    // Event listener for the Mute/Unmute Tab button
    muteTabButton.addEventListener('click', function () {
        const selectedTabId = Number(tabsList.querySelector('.list-group-item.active')?.dataset.tabId);
        if (selectedTabId) {
            toggleMuteTab(selectedTabId);
        } else {
            alert('Please select a tab to mute/unmute.');
        }
    });

    // Event listener for the Save Preset button
    savePresetButton.addEventListener('click', function () {
        const presetName = presetNameInput.value.trim();
        const volume = volumeRange.value;
        if (presetName) {
            savePreset(presetName, volume);
        } else {
            alert('Please enter a preset name.');
        }
    });

    // Event listener for the Apply Preset button
    applyPresetButton.addEventListener('click', function () {
        const selectedTabId = Number(tabsList.querySelector('.list-group-item.active')?.dataset.tabId);
        const presetName = presetList.value;
        if (selectedTabId && presetName) {
            applyPreset(selectedTabId, presetName);
        } else {
            alert('Please select a tab and a preset to apply.');
        }
    });

    // Event listener to select a tab from the list
    tabsList.addEventListener('click', function (event) {
        if (event.target && event.target.nodeName === 'LI') {
            const items = tabsList.querySelectorAll('.list-group-item');
            items.forEach(item => item.classList.remove('active'));
            event.target.classList.add('active');
        }
    });

    // Initial rendering of tabs and presets
    renderTabs();
    renderPresets();
});

//end sound master
/**codigo de loader para diccionario */
document.getElementById('dictionary-link').addEventListener('click', function(event) {
    event.preventDefault(); // Evita la acción predeterminada

    // Mostrar el loader
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    // Simula la apertura del enlace (abre en una nueva ventana tras un breve delay)
    setTimeout(() => {
        window.location.href = this.href;
    }, 500); // Cambia el delay según sea necesario
});

/**loader 2 footer */
document.getElementById('dictionary-link1').addEventListener('click', function(event) {
    event.preventDefault(); // Evita la acción predeterminada

    // Mostrar el loader
    const loader = document.getElementById('loader1');
    loader.style.display = 'block';

    // Simula la apertura del enlace (abre en una nueva ventana tras un breve delay)
    setTimeout(() => {
        window.location.href = this.href;
    }, 500); // Cambia el delay según sea necesario
});

/**fin de codigo de loader de diccionario */