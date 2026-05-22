<script setup lang="ts">
import * as THREE from 'three'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const wrapperRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
let renderer: THREE.WebGLRenderer
let animationFrameId: number
let handleResize: () => void
let timer: THREE.Timer
const isReady = ref(false)

onMounted(() => {
  if (!wrapperRef.value || !containerRef.value) return

  
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    60,
    wrapperRef.value.clientWidth / wrapperRef.value.clientHeight,
    0.1,
    100,
  )
  camera.position.z = 15

  timer = new THREE.Timer()
  timer.connect(document)

  
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true, 
  })
  renderer.setSize(wrapperRef.value.clientWidth, wrapperRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  containerRef.value.appendChild(renderer.domElement)

  
  const createGlassTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')!

    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, 16, 16)

    
    ctx.fillStyle = 'rgba(255, 255, 255, 1.0)'
    ctx.fillRect(0, 0, 16, 1)
    ctx.fillRect(0, 15, 16, 1)
    ctx.fillRect(0, 0, 1, 16)
    ctx.fillRect(15, 0, 1, 16)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter 
    texture.minFilter = THREE.NearestFilter
    return texture
  }

  const material = new THREE.MeshBasicMaterial({
    map: createGlassTexture(),
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const shardCount = 80
  const instancedMesh = new THREE.InstancedMesh(geometry, material, shardCount)
  const tempColor = new THREE.Color()

  const dummy = new THREE.Object3D()
  const shardsData: any[] = []

  for (let i = 0; i < shardCount; i++) {
    const radius = 2 + Math.random() * 10
    const angle = Math.random() * Math.PI * 2
    const y = (Math.random() - 0.5) * 40

    
    const scale = 0.5 + Math.random() * 1.5

    tempColor.setHex(0xffffff)
    instancedMesh.setColorAt(i, tempColor)

    shardsData.push({
      radius,
      angle,
      y,
      scale,
      vy: -0.01 - Math.random() * 0.02,
      
      angularSpeed: 0.002 + (1 / radius) * 0.01,
    })
  }

  instancedMesh.instanceColor!.needsUpdate = true
  scene.add(instancedMesh)

  let firstFrameRendered = false

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    timer.update()

    for (let i = 0; i < shardCount; i++) {
      const data = shardsData[i]

      data.y += data.vy
      data.angle += data.angularSpeed

      
      if (data.y < -20) {
        data.y = 20
        data.radius = 2 + Math.random() * 10
        data.angle = Math.random() * Math.PI * 2
        data.angularSpeed = 0.002 + (1 / data.radius) * 0.01
      }

      const x = data.radius * Math.cos(data.angle)
      const z = data.radius * Math.sin(data.angle)

      dummy.position.set(x, data.y, z)
      dummy.rotation.set(0, 0, 0)
      dummy.scale.set(data.scale, data.scale, data.scale)
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, dummy.matrix)
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    renderer.render(scene, camera)

    
    if (!firstFrameRendered) {
      firstFrameRendered = true
      setTimeout(
        () => {
          isReady.value = true
        }, 
        50,
      )
    }
  }

  animate()

  handleResize = () => {
    if (!wrapperRef.value || !renderer) return
    const width = wrapperRef.value.clientWidth
    const height = wrapperRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (timer) timer.dispose()
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div 
    ref="wrapperRef" 
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="-webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); mask-image: linear-gradient(to right, black 80%, transparent 100%);"
  >
    <transition
      enter-active-class="transition-all duration-1000 ease-out"
      enter-from-class="opacity-0 blur-md"
      enter-to-class="opacity-100 blur-none"
    >
      <div 
        v-show="isReady"
        ref="containerRef" 
        class="w-full h-full"
      />
    </transition>
  </div>
</template>
