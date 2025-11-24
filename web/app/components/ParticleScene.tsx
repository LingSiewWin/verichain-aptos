'use client'

import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface ParticleSceneProps {
  state: 'idle' | 'processing' | 'verified'
}

function Particles({ state }: ParticleSceneProps) {
  const ref = useRef<THREE.Points>(null)
  const { mouse } = useThree()

  useEffect(() => {
    if (ref.current) {
      const count = 500
      const positions = new Float32Array(count * 3)

      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10
        positions[i + 1] = (Math.random() - 0.5) * 10
        positions[i + 2] = (Math.random() - 0.5) * 10
      }

      ref.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )
    }
  }, [])

  useFrame(() => {
    if (!ref.current) return

    const positions = ref.current.geometry.attributes.position
      .array as Float32Array

    if (state === 'idle') {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.0001 + i) * 0.001
        positions[i + 1] += Math.cos(Date.now() * 0.0001 + i) * 0.001
      }
    } else if (state === 'processing') {
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.05
        positions[i + 1] += (Math.random() - 0.5) * 0.05
        positions[i + 2] += (Math.random() - 0.5) * 0.05
      }
    } else if (state === 'verified') {
      ref.current.rotation.x += 0.001
      ref.current.rotation.y += 0.002
    }

    ref.current.geometry.attributes.position.needsUpdate = true
  })

  const color =
    state === 'idle'
      ? '#2DD8A7'
      : state === 'processing'
        ? '#7B61FF'
        : '#2DD8A7'

  return (
    <Points ref={ref} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export function ParticleBackground({ state }: ParticleSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 75 }}
      className="fixed inset-0"
    >
      <Particles state={state} />
    </Canvas>
  )
}
