// public/js/speechEngine.js
// Speech Recognition (STT) and Text-to-Speech (TTS) Engine

window.recognition = null;
window.isRecording = false;

// Initialize Web Speech Recognition API
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  window.recognition = new SpeechRecognition();
  window.recognition.continuous = true;
  window.recognition.interimResults = true;
  window.recognition.lang = 'en-AU';

  window.recognition.onresult = (event) => {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript + ' ';
      }
    }
    if (finalTranscript) {
      const inputEl = document.getElementById('transcript-input');
      if (inputEl) {
        inputEl.value = (inputEl.value ? inputEl.value.trim() + ' ' : '') + finalTranscript.trim();
      }
    }
  };

  window.recognition.onerror = () => window.stopMicrophone();
}

window.toggleMicrophone = function() {
  if (!window.recognition) {
    alert("Speech recognition is not supported in this browser. You can type manually.");
    return;
  }
  window.isRecording ? window.stopMicrophone() : window.startMicrophone();
};

window.startMicrophone = function() {
  try {
    window.recognition.start();
    window.isRecording = true;
    const label = document.getElementById('mic-btn-label');
    const btn = document.getElementById('mic-toggle-btn');
    const status = document.getElementById('mic-status-indicator');

    if (label) label.innerText = "Pause Microphone";
    if (btn) btn.classList.replace('bg-[#9C27B0]', 'bg-red-600');
    if (status) status.innerText = "🔴 Listening... Speak naturally";
  } catch(e) { 
    console.warn("Microphone start exception:", e); 
  }
};

window.stopMicrophone = function() {
  if (window.recognition && window.isRecording) {
    window.recognition.stop();
    window.isRecording = false;
    const label = document.getElementById('mic-btn-label');
    const btn = document.getElementById('mic-toggle-btn');
    const status = document.getElementById('mic-status-indicator');

    if (label) label.innerText = "Start Answering";
    if (btn) btn.classList.replace('bg-red-600', 'bg-[#9C27B0]');
    if (status) status.innerText = "Microphone idle";
  }
};

window.readQuestionTTS = function() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const activeText = document.getElementById('active-question-text');
    if (!activeText) return;
    
    const text = activeText.innerText;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const auVoice = voices.find(v => v.lang === 'en-AU') || voices[0];
    
    if (auVoice) utterance.voice = auVoice;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};