<script setup lang="ts">
import * as THREE from 'three'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const containerRef = ref<HTMLDivElement | null>(null)
let renderer: THREE.WebGLRenderer
let animationFrameId: number
let handleResize: () => void
let clock: THREE.Clock

onMounted(() => {
  if (!containerRef.value) return

  // Setup Scene and Camera
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    60,
    containerRef.value.clientWidth / containerRef.value.clientHeight,
    0.1,
    100,
  )
  camera.position.z = 15

  clock = new THREE.Clock()

  // Setup WebGL Renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true, 
  })
  renderer.setSize(containerRef.value.clientWidth, containerRef.value.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  containerRef.value.appendChild(renderer.domElement)

  // Generate Minecraft-style glass texture programmatically
  const createGlassTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 16
    canvas.height = 16
    const ctx = canvas.getContext('2d')!

    // Inner transparent glass
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, 16, 16)

    // Solid white border
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.fillRect(0, 0, 16, 1)
    ctx.fillRect(0, 15, 16, 1)
    ctx.fillRect(0, 0, 1, 16)
    ctx.fillRect(15, 0, 1, 16)

    // Minecraft-like diagonal streaks
    ctx.fillRect(3, 3, 2, 2)
    ctx.fillRect(5, 5, 3, 2)

    const texture = new THREE.CanvasTexture(canvas)
    texture.magFilter = THREE.NearestFilter // Pixelated blocky look
    texture.minFilter = THREE.NearestFilter
    return texture
  }

  const material = new THREE.MeshBasicMaterial({
    map: createGlassTexture(),
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  })

  // Perfect cubes for the Minecraft block feel
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const shardCount = 80
  const instancedMesh = new THREE.InstancedMesh(geometry, material, shardCount)
  const tempColor = new THREE.Color()

  const dummy = new THREE.Object3D()
  const shardsData: any[] = []

  for (let i = 0; i < shardCount; i++) {
    const x = (Math.random() - 0.5) * 40
    const y = (Math.random() - 0.5) * 40
    const z = (Math.random() - 0.5) * 20
    
    const rx = Math.random() * Math.PI * 2
    const ry = Math.random() * Math.PI * 2
    const rz = Math.random() * Math.PI * 2

    // Uniform scaling for blocks to simulate depth
    const scale = 0.5 + Math.random() * 1.5

    // Keep everything pure white
    tempColor.setHex(0xffffff)
    instancedMesh.setColorAt(i, tempColor)

    shardsData.push({
      x,
      y,
      z,
      rx,
      ry,
      rz,
      scale,
      vy: -0.005 - Math.random() * 0.015, // Slower, dreamier fall
      rvx: (Math.random() - 0.5) * 0.005, // Elegant 3D tumbling
      rvy: (Math.random() - 0.5) * 0.005, 
      rvz: (Math.random() - 0.5) * 0.005,
      swaySpeed: 0.5 + Math.random() * 1.5,
      swayPhase: Math.random() * Math.PI * 2,
      swayAmount: 0.01 + Math.random() * 0.03, // Harmonic drift amount
    })
  }

  instancedMesh.instanceColor!.needsUpdate = true
  scene.add(instancedMesh)

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)
    const time = clock.getElapsedTime()

    for (let i = 0; i < shardCount; i++) {
      const data = shardsData[i]

      data.y += data.vy
      data.rx += data.rvx
      data.ry += data.rvy
      data.rz += data.rvz

      // Apply a smooth sine-wave drift for an organic, floating feel
      const currentX = data.x + Math.sin(time * data.swaySpeed + data.swayPhase) * data.swayAmount * 100
      const currentZ = data.z + Math.cos(time * data.swaySpeed * 0.8 + data.swayPhase) * data.swayAmount * 50

      // Loop shards back to the top when they fall past the screen bounds
      if (data.y < -20) {
        data.y = 20
        data.x = (Math.random() - 0.5) * 40
        data.swayPhase = Math.random() * Math.PI * 2 // Give a new trajectory
      }

      dummy.position.set(currentX, data.y, currentZ)
      dummy.rotation.set(data.rx, data.ry, data.rz)
      dummy.scale.set(data.scale, data.scale, data.scale)
      dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, dummy.matrix)
    }

    instancedMesh.instanceMatrix.needsUpdate = true
    renderer.render(scene, camera)
  }

  animate()

  handleResize = () => {
    if (!containerRef.value || !renderer) return
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  if (handleResize) window.removeEventListener('resize', handleResize)
  if (renderer) renderer.dispose()
})
</script>

<template>
  <div 
    ref="containerRef" 
    class="absolute inset-0 w-full h-full pointer-events-none" 
    style="-webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); mask-image: linear-gradient(to right, black 80%, transparent 100%);"
  />
</template>
