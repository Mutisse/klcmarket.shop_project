<template>
  <div class="page-container">
    <div class="flex w-full h-full flex-col items-center">
      <video ref="video" autoplay playsinline />
      <canvas ref="canvas" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as posenet from '@tensorflow-models/posenet'
import '@tensorflow/tfjs'

const video = ref(null)
const canvas = ref(null)

// Lista de roupas (imagens PNG com fundo transparente)
const clothes = [
  { src: '/src/assets/fotod de js realidade virtual/t1.png' },
  { src: '/src/assets/fotod de js realidade virtual/Botões na frente Simples ocasional Camisa Masculina.jpg' },
]
const loadedClothes = ref([]) // Armazenar imagens carregadas
let currentClothingIndex = ref(0) // Controlar qual roupa exibir

// Carregar imagens de roupas
const loadClothingImages = async () => {
  for (const cloth of clothes) {
    const img = new Image()
    img.src = cloth.src
    await new Promise(resolve => {
      img.onload = () => resolve()
    })
    loadedClothes.value.push(img)
  }
}

onMounted(async () => {
  // Definir dimensões iniciais
  const updateDimensions = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    video.value.width = width
    video.value.height = height
    canvas.value.width = width
    canvas.value.height = height
  }

  // Iniciar câmera
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: window.innerWidth, height: window.innerHeight }
  })
  video.value.srcObject = stream

  // Carregar imagens de roupas
  await loadClothingImages()

  // Atualizar dimensões
  updateDimensions()
  window.addEventListener('resize', updateDimensions)

  // Carregar modelo
  const net = await posenet.load()

  // Detectar poses em loop
  const detectPose = async () => {
    const pose = await net.estimateSinglePose(video.value, {
      flipHorizontal: false
    })
    drawPose(pose)
    requestAnimationFrame(detectPose)
  }

  detectPose()

  // Limpar eventos e stream ao desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
  })
})

// Desenhar pontos e roupas
function drawPose(pose) {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Escalar coordenadas
  const videoWidth = video.value.videoWidth
  const videoHeight = video.value.videoHeight
  const canvasWidth = canvas.value.width
  const canvasHeight = canvas.value.height

  const scaleX = canvasWidth / videoWidth
  const scaleY = canvasHeight / videoHeight

  // Obter keypoints para ombros e quadris
  const leftShoulder = pose.keypoints.find(k => k.part === 'leftShoulder')
  const rightShoulder = pose.keypoints.find(k => k.part === 'rightShoulder')
  const leftHip = pose.keypoints.find(k => k.part === 'leftHip')
  const rightHip = pose.keypoints.find(k => k.part === 'rightHip')

  // Verificar se os keypoints necessários estão disponíveis e confiáveis
  if (
    leftShoulder?.score > 0.5 &&
    rightShoulder?.score > 0.5 &&
    leftHip?.score > 0.5 &&
    rightHip?.score > 0.5
  ) {
    // Calcular posição e escala da roupa
    const shoulderWidth = Math.abs(
      (rightShoulder.position.x - leftShoulder.position.x) * scaleX
    )
    const torsoHeight = Math.abs(
      ((leftShoulder.position.y + rightShoulder.position.y) / 2 -
        (leftHip.position.y + rightHip.position.y) / 2) *
        scaleY
    )

    // Posição central para a roupa (meio dos ombros)
    const centerX =
      ((leftShoulder.position.x + rightShoulder.position.x) / 2) * scaleX
    const centerY =
      ((leftShoulder.position.y + rightShoulder.position.y) / 2) * scaleY

    // Escalar a imagem da roupa
    const clothImg = loadedClothes.value[currentClothingIndex.value]
    if (clothImg) {
      const clothWidth = shoulderWidth * 1.5 // Ajustar largura da roupa
      const clothHeight = torsoHeight * 2 // Ajustar altura da roupa
      const clothX = centerX - clothWidth / 2
      const clothY = centerY - clothHeight * 0.1 // Ajustado para alinhar com os ombros

      // Desenhar a roupa
      ctx.drawImage(clothImg, clothX, clothY, clothWidth, clothHeight)
    }
  }

  // Desenhar pontos (opcional, mantido para depuração)
  pose.keypoints.forEach(k => {
    if (k.score > 0.5) {
      ctx.beginPath()
      ctx.arc(k.position.x * scaleX, k.position.y * scaleY, 5, 0, 2 * Math.PI)
      ctx.fillStyle = 'red'
      ctx.fill()
    }
  })
}
</script>

<style scoped>
.page-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
}
video,
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
