'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Lorenz Attractor equations
function lorenzAttractor(x: number, y: number, z: number) {
  const sigma = 10
  const rho = 28
  const beta = 8/3
  const dt = 0.01

  const dx = sigma * (y - x) * dt
  const dy = (x * (rho - z) - y) * dt
  const dz = (x * y - beta * z) * dt

  return {
    x: x + dx,
    y: y + dy,
    z: z + dz
  }
}

// Particle system component
function ParticleSystem({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport, camera } = useThree()

  // Generate Lorenz Attractor points
  const particleCount = 10000
  const trailLength = 100

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    // Generate multiple Lorenz attractors with slight variations
    const attractors = 5
    const pointsPerAttractor = particleCount / attractors

    for (let a = 0; a < attractors; a++) {
      // Start with slightly different initial conditions for each attractor
      let x = 0.1 + a * 0.01
      let y = 0
      let z = 0

      for (let i = 0; i < pointsPerAttractor; i++) {
        const idx = (a * pointsPerAttractor + i) * 3

        // Calculate next point in Lorenz attractor
        const next = lorenzAttractor(x, y, z)
        x = next.x
        y = next.y
        z = next.z

        // Scale and position the points
        positions[idx] = x * 0.3
        positions[idx + 1] = y * 0.3 - 5  // Center vertically
        positions[idx + 2] = z * 0.3 - 15

        // Color gradient from cyan to purple
        const t = i / pointsPerAttractor
        const hue = 180 + t * 90 // Cyan (180°) to Purple (270°)
        const color = new THREE.Color()
        color.setHSL(hue / 360, 0.8, 0.6)

        colors[idx] = color.r
        colors[idx + 1] = color.g
        colors[idx + 2] = color.b
      }
    }

    return [positions, colors]
  }, [])

  // Animation frame
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()

    // Slow rotation
    meshRef.current.rotation.y = time * 0.05
    meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1

    // Mouse parallax effect
    const targetX = mousePosition.x * 2
    const targetY = -mousePosition.y * 2

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02

    // Gentle pulsing
    const scale = 1 + Math.sin(time * 0.5) * 0.02
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Flow lines component for additional visual depth
function FlowLines() {
  const linesRef = useRef<THREE.LineSegments>(null)

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = []

    // Create flowing lines through the attractor
    for (let i = 0; i < 20; i++) {
      let x = (Math.random() - 0.5) * 0.2
      let y = (Math.random() - 0.5) * 0.2
      let z = (Math.random() - 0.5) * 0.2

      for (let j = 0; j < 50; j++) {
        const next = lorenzAttractor(x, y, z)
        points.push(new THREE.Vector3(x * 0.3, y * 0.3 - 5, z * 0.3 - 15))
        x = next.x
        y = next.y
        z = next.z
      }
    }

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  useFrame((state) => {
    if (!linesRef.current) return
    const time = state.clock.getElapsedTime()
    linesRef.current.material.opacity = 0.05 + Math.sin(time) * 0.02
  })

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        color="#0ea5e9"
        transparent
        opacity={0.05}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// Grid component for depth perception
function Grid() {
  return (
    <gridHelper
      args={[100, 50, '#0ea5e9', '#0ea5e9']}
      position={[0, -20, 0]}
      rotation={[0, 0, 0]}
      material-opacity={0.05}
      material-transparent={true}
    />
  )
}

export default function ParticleBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={60} />

        {/* Ambient light for base visibility */}
        <ambientLight intensity={0.2} />

        {/* Point lights for glow effect */}
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#0ea5e9" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

        {/* Main particle system */}
        <ParticleSystem mousePosition={mousePosition} />

        {/* Additional visual elements */}
        <FlowLines />
        <Grid />

        {/* Fog for depth */}
        <fog attach="fog" args={['#000000', 20, 60]} />
      </Canvas>

      {/* Gradient overlay for better readability */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/5 via-transparent to-purple-900/5" />
      </div>
    </div>
  )
}