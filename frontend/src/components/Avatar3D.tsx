import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Avatar3DProps {
  userProfile: {
    skinTone?: string;
    bodyType?: string;
    preferredStyle?: string;
  };
  outfitItems: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  }>;
  pose?: 'standing' | 'walking' | 'sitting';
  lighting?: 'studio' | 'natural' | 'dramatic';
}

// Advanced skin tone mapping with realistic colors
const getSkinToneColors = (skinTone: string) => {
  const tones = {
    'Very Fair': {
      base: '#fef7f0',
      shadow: '#f4e6d7',
      highlight: '#ffffff',
      undertone: '#ffeee6'
    },
    'Fair': {
      base: '#fde2d3',
      shadow: '#f0d0b8',
      highlight: '#fef7f0',
      undertone: '#fdd5c4'
    },
    'Light': {
      base: '#f7d7c4',
      shadow: '#e8c4a0',
      highlight: '#fde2d3',
      undertone: '#f2c9a8'
    },
    'Medium': {
      base: '#deb887',
      shadow: '#cd9575',
      highlight: '#f0d0b8',
      undertone: '#d4a574'
    },
    'Tan': {
      base: '#d2b48c',
      shadow: '#b8956f',
      highlight: '#e8c4a0',
      undertone: '#c8a882'
    },
    'Deep': {
      base: '#8b7355',
      shadow: '#6b5635',
      highlight: '#a0845c',
      undertone: '#7d6b4f'
    },
    'Very Deep': {
      base: '#654321',
      shadow: '#4a2c17',
      highlight: '#7d5a2f',
      undertone: '#5c3e2a'
    }
  };
  return tones[skinTone as keyof typeof tones] || tones['Medium'];
};

// Body type measurements for realistic proportions
const getBodyMeasurements = (bodyType: string) => {
  const measurements = {
    'Pear': {
      shoulders: 0.9,
      bust: 0.95,
      waist: 0.75,
      hips: 1.1,
      height: 1.0
    },
    'Apple': {
      shoulders: 1.05,
      bust: 1.1,
      waist: 1.05,
      hips: 0.95,
      height: 1.0
    },
    'Hourglass': {
      shoulders: 1.0,
      bust: 1.05,
      waist: 0.7,
      hips: 1.05,
      height: 1.0
    },
    'Rectangle': {
      shoulders: 0.95,
      bust: 0.95,
      waist: 0.9,
      hips: 0.95,
      height: 1.0
    },
    'Inverted Triangle': {
      shoulders: 1.15,
      bust: 1.1,
      waist: 0.85,
      hips: 0.85,
      height: 1.0
    }
  };
  return measurements[bodyType as keyof typeof measurements] || measurements['Rectangle'];
};

// 3D Avatar Component
const Avatar3DModel: React.FC<{
  skinColors: any;
  bodyMeasurements: any;
  outfitItems: any[];
  pose: string;
}> = ({ skinColors, bodyMeasurements, outfitItems, pose }) => {
  const groupRef = useRef<THREE.Group>(null);
  const textureRefs = useRef<{[key: string]: THREE.Texture | null}>({});
  const [texturesLoaded, setTexturesLoaded] = useState<{[key: string]: boolean}>({});

  // Load textures from wardrobe item images
  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    
    outfitItems.forEach(item => {
      if (item.imageUrl && !textureRefs.current[item.id]) {
        textureLoader.load(
          item.imageUrl,
          (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            textureRefs.current[item.id] = texture;
            setTexturesLoaded(prev => ({...prev, [item.id]: true}));
          },
          undefined,
          (error) => {
            console.error('Error loading texture:', error);
            setTexturesLoaded(prev => ({...prev, [item.id]: false}));
          }
        );
      }
    });
    
    return () => {
      // Dispose textures on cleanup
      Object.values(textureRefs.current).forEach(texture => {
        if (texture) texture.dispose();
      });
    };
  }, [outfitItems]);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.02;
      groupRef.current.scale.y = 1 + breathe;
      
      // Pose-based animations
      if (pose === 'walking') {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      }
    }
  });

  // Advanced material creation
  const createSkinMaterial = () => {
    return new THREE.MeshPhysicalMaterial({
      color: skinColors.base,
      roughness: 0.8,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.8,
      transmission: 0.05,
      thickness: 0.5,
    });
  };

  const createClothingMaterial = (item: any) => {
    // If texture is loaded for this item, use it
    if (textureRefs.current[item.id] && texturesLoaded[item.id]) {
      const material = new THREE.MeshStandardMaterial({
        map: textureRefs.current[item.id],
        roughness: 0.7,
        metalness: 0.0,
      });
      
      // Adjust texture based on clothing type
      if (item.category === 'Tops' || item.category === 'Dresses') {
        // For tops and dresses, we want to show the front of the garment
        textureRefs.current[item.id]!.repeat.set(1, 1);
        textureRefs.current[item.id]!.offset.set(0, 0);
      } else if (item.category === 'Bottoms') {
        // For bottoms, we might need different scaling
        textureRefs.current[item.id]!.repeat.set(1, 1);
        textureRefs.current[item.id]!.offset.set(0, 0);
      }
      
      return material;
    }
    
    // Fallback to color-based material if texture isn't loaded
    const colorMap: { [key: string]: string } = {
      'Black': '#1a1a1a',
      'White': '#f8f8f8',
      'Blue': '#2563eb',
      'Red': '#dc2626',
      'Green': '#16a34a',
      'Gray': '#6b7280',
      'Brown': '#92400e',
      'Purple': '#7c3aed',
      'Pink': '#ec4899',
      'Yellow': '#eab308',
      'Orange': '#ea580c',
      'Multi': '#6b7280'
    };

    const baseColor = colorMap[item.color] || '#6b7280';
    
    // Different materials for different clothing types
    if (item.category === 'Dresses' || item.name.toLowerCase().includes('silk')) {
      return new THREE.MeshPhysicalMaterial({
        color: baseColor,
        roughness: 0.1,
        metalness: 0.0,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transmission: 0.1,
      });
    } else if (item.name.toLowerCase().includes('denim') || item.name.toLowerCase().includes('jean')) {
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.9,
        metalness: 0.0,
        normalScale: new THREE.Vector2(0.5, 0.5),
      });
    } else if (item.name.toLowerCase().includes('leather')) {
      return new THREE.MeshPhysicalMaterial({
        color: baseColor,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.9,
        clearcoatRoughness: 0.1,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color: baseColor,
        roughness: 0.7,
        metalness: 0.0,
      });
    }
  };

  const skinMaterial = createSkinMaterial();
  
  // Get clothing items by category
  const topItem = outfitItems.find(item => item.category === 'Tops');
  const bottomItem = outfitItems.find(item => item.category === 'Bottoms');
  const dressItem = outfitItems.find(item => item.category === 'Dresses');
  const footwearItem = outfitItems.find(item => item.category === 'Footwear');
  const outerwearItem = outfitItems.find(item => item.category === 'Outerwear');

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.12, 32, 32]} />
        <primitive object={skinMaterial} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#4a2c17" roughness={0.8} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.1, 16]} />
        <primitive object={skinMaterial} />
      </mesh>

      {/* Torso */}
      <mesh 
        position={[0, 1.2, 0]} 
        scale={[bodyMeasurements.bust, 1, 0.3]}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[0.35, 0.6, 0.2]} />
        {dressItem ? (
          <primitive object={createClothingMaterial(dressItem)} />
        ) : topItem ? (
          <primitive object={createClothingMaterial(topItem)} />
        ) : (
          <primitive object={skinMaterial} />
        )}
      </mesh>

      {/* Arms */}
      <mesh position={[-0.25 * bodyMeasurements.shoulders, 1.3, 0]} rotation={[0, 0, 0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.5, 16]} />
        {topItem || dressItem ? (
          <primitive object={createClothingMaterial(topItem || dressItem)} />
        ) : (
          <primitive object={skinMaterial} />
        )}
      </mesh>
      <mesh position={[0.25 * bodyMeasurements.shoulders, 1.3, 0]} rotation={[0, 0, -0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.03, 0.5, 16]} />
        {topItem || dressItem ? (
          <primitive object={createClothingMaterial(topItem || dressItem)} />
        ) : (
          <primitive object={skinMaterial} />
        )}
      </mesh>

      {/* Hands */}
      <mesh position={[-0.35 * bodyMeasurements.shoulders, 1.0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <primitive object={skinMaterial} />
      </mesh>
      <mesh position={[0.35 * bodyMeasurements.shoulders, 1.0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 16, 16]} />
        <primitive object={skinMaterial} />
      </mesh>

      {/* Waist */}
      <mesh 
        position={[0, 0.8, 0]} 
        scale={[bodyMeasurements.waist, 1, 0.8]}
        castShadow 
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.18, 0.2, 16]} />
        {dressItem ? (
          <primitive object={createClothingMaterial(dressItem)} />
        ) : bottomItem ? (
          <primitive object={createClothingMaterial(bottomItem)} />
        ) : (
          <primitive object={skinMaterial} />
        )}
      </mesh>

      {/* Hips/Legs */}
      {!dressItem && (
        <>
          <mesh 
            position={[0, 0.6, 0]} 
            scale={[bodyMeasurements.hips, 1, 0.8]}
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[0.3, 0.25, 0.2]} />
            {bottomItem ? (
              <primitive object={createClothingMaterial(bottomItem)} />
            ) : (
              <primitive object={skinMaterial} />
            )}
          </mesh>

          {/* Legs */}
          <mesh position={[-0.08, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.7, 16]} />
            <primitive object={skinMaterial} />
          </mesh>
          <mesh position={[0.08, 0.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.7, 16]} />
            <primitive object={skinMaterial} />
          </mesh>
        </>
      )}

      {/* Dress extension */}
      {dressItem && (
        <mesh position={[0, 0.4, 0]} scale={[1.2, 1, 1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.15, 0.6, 16]} />
          <primitive object={createClothingMaterial(dressItem)} />
        </mesh>
      )}

      {/* Footwear */}
      {footwearItem && (
        <>
          <mesh position={[-0.08, -0.15, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.04, 0.15]} />
            <primitive object={createClothingMaterial(footwearItem)} />
          </mesh>
          <mesh position={[0.08, -0.15, 0.05]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.04, 0.15]} />
            <primitive object={createClothingMaterial(footwearItem)} />
          </mesh>
        </>
      )}

      {/* Outerwear */}
      {outerwearItem && (
        <mesh 
          position={[0, 1.2, 0]} 
          scale={[bodyMeasurements.shoulders * 1.1, 1.1, 1.2]}
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[0.4, 0.7, 0.25]} />
          <primitive object={createClothingMaterial(outerwearItem)} />
        </mesh>
      )}
    </group>
  );
};

// Loading component
const LoadingAvatar: React.FC = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-sm">Generating your 3D avatar...</p>
    </div>
  </Html>
);

const Avatar3D: React.FC<Avatar3DProps> = ({ 
  userProfile, 
  outfitItems, 
  pose = 'standing',
  lighting = 'studio'
}) => {
  const skinColors = getSkinToneColors(userProfile.skinTone || 'Medium');
  const bodyMeasurements = getBodyMeasurements(userProfile.bodyType || 'Rectangle');

  return (
    <div className="w-full h-96 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingAvatar />}>
          {/* Lighting setup */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-5, 5, 5]} intensity={0.5} />
          <spotLight
            position={[0, 10, 0]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            castShadow
          />

          {/* Environment */}
          <Environment preset={lighting === 'studio' ? 'studio' : 'city'} />
          
          {/* 3D Avatar */}
          <Avatar3DModel
            skinColors={skinColors}
            bodyMeasurements={bodyMeasurements}
            outfitItems={outfitItems}
            pose={pose}
          />

          {/* Ground */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.4}
            scale={3}
            blur={2}
            far={2}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI - Math.PI / 6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Avatar3D;
