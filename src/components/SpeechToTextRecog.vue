<template>
  <a
    class="microphone-logo-container"
    href="#"
    @click.prevent="startSpeechRecog"
  >
    <img
      src="@/assets/free-microphone-icon-342-thumb.png"
      alt="microphone-logo"
      width="20"
      height="20"
      class="microphone-logo"
      :class="{ listening: isListening }"
    />
    <span v-if="isListening" class="listening-indicator"></span>
  </a>
</template>

<script setup>
import { ref } from 'vue'

const isListening = ref(false)
const isSupported = ref(false)

const emit = defineEmits(['startSpeechRecog'])

function checkBrowserSupport() {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  isSupported.value = !!window.SpeechRecognition

  if (!isSupported.value) {
    console.warn('Speech Recognition API не поддерживается в этом браузере')
  }

  return isSupported.value
}

function startSpeechRecog() {
  if (isListening.value) {
    return
  }

  if (!checkBrowserSupport()) {
    alert(
      'Голосовой поиск не поддерживается в вашем браузере. Пожалуйста, используйте Chrome или Safari.'
    )
    return
  }

  initializeSpeechRecognition()
}

function initializeSpeechRecognition() {
  try {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recog = new SpeechRecognition()

    recog.continuous = false
    recog.interimResults = true
    recog.lang = 'ru-RU'
    recog.maxAlternatives = 1

    isListening.value = true

    recog.onstart = () => {
      console.log('Голосовое распознавание началось...')
    }

    recog.onresult = (event) => {
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        }
      }

      if (finalTranscript) {
        console.log('Финальный текст:', finalTranscript)

        emit('startSpeechRecog', {
          transcription: [finalTranscript],
          finalTranscript: finalTranscript
        })
      }
    }

    recog.onerror = (event) => {
      console.error('Ошибка распознавания:', event.error)
      isListening.value = false

      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          alert(
            'Доступ к микрофону запрещен. Пожалуйста, разрешите использование микрофона в настройках браузера.'
          )
          break
        case 'audio-capture':
          alert(
            'Микрофон не найден. Убедитесь, что микрофон подключен и разрешен для использования.'
          )
          break
        case 'network':
          alert('Ошибка сети при распознавании речи.')
          break
        default:
          console.log('Ошибка распознавания речи:', event.error)
      }
    }

    recog.onend = () => {
      console.log('Голосовое распознавание завершено')
      isListening.value = false
    }

    recog.start()

    setTimeout(() => {
      if (isListening.value) {
        recog.stop()
      }
    }, 8000)
  } catch (error) {
    console.error('Ошибка инициализации распознавания речи:', error)
    isListening.value = false
    alert(
      'Ошибка при инициализации голосового поиска. Пожалуйста, попробуйте еще раз.'
    )
  }
}
</script>

<style scoped>
.microphone-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  position: relative;
  text-decoration: none;
  cursor: pointer;
}

.microphone-logo-container:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.microphone-logo {
  display: flex;
  align-self: center;
  transition: opacity 0.3s;
}

.microphone-logo.listening {
  opacity: 0.7;
}

.listening-indicator {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
  100% {
    transform: scale(0.8);
    opacity: 1;
  }
}
</style>
