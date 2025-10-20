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

onMounted(async () => {
  // Definir dimensões iniciais
  const updateDimensions = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    // Ajustar vídeo
    video.value.width = width
    video.value.height = height

    // Ajustar canvas
    canvas.value.width = width
    canvas.value.height = height
  }

  // Iniciar câmera
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: window.innerWidth, height: window.innerHeight }
  })
  video.value.srcObject = stream

  // Atualizar dimensões inicialmente e ao redimensionar
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

  // Limpar evento de redimensionamento ao desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })
})

// Desenhar pontos e esqueletos
function drawPose(pose) {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  // Escalar coordenadas para corresponder às dimensões do canvas
  const videoWidth = video.value.videoWidth
  const videoHeight = video.value.videoHeight
  const canvasWidth = canvas.value.width
  const canvasHeight = canvas.value.height

  const scaleX = canvasWidth / videoWidth
  const scaleY = canvasHeight / videoHeight

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
  object-fit: cover; /* Garante que o vídeo preencha o espaço */
}
</style>
