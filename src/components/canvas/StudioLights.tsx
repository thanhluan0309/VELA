'use client'

export function StudioLights() {
  return (
    <>
      {/* Ambient — warm base fill, enough for textures to read */}
      <ambientLight intensity={1.2} color="#FFF8F0" />

      {/* Key light — front-right, bright to show shoe textures */}
      <pointLight position={[3, 4, 5]}  intensity={80}  color="#FFFCF5" decay={2} />

      {/* Secondary key — top */}
      <pointLight position={[0, 6, 3]}  intensity={50}  color="#FFFFFF" decay={2} />

      {/* Fill light — left side */}
      <pointLight position={[-4, 2, 4]} intensity={30}  color="#F0F4FF" decay={2} />

      {/* Rim / back light — creates depth against cream background */}
      <pointLight position={[0, -1, -4]} intensity={20} color="#FFE8D6" decay={2} />
    </>
  )
}
