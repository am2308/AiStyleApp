import React, { useEffect, useRef, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, DirectionalLight, Vector3, MeshBuilder, StandardMaterial, Color3, Texture, PBRMaterial, CubeTexture, EnvironmentHelper, SceneLoader, AbstractMesh, Mesh, Animation, AnimationGroup, TransformNode } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import { AdvancedDynamicTexture, StackPanel, TextBlock, Control } from '@babylonjs/gui';

interface BabylonAvatarProps {
  userProfile: {
    skinTone?: string;
    bodyType?: string;
    preferredStyle?: string;
    gender?: 'male' | 'female' | 'unisex';
  };
  outfitItems: Array<{
    id: string;
    name: string;
    category: string;
    color: string;
    imageUrl: string;
  }>;
  pose?: 'standing' | 'walking' | 'casual' | 'formal';
  lighting?: 'studio' | 'natural' | 'dramatic';
  onLoadingChange?: (loading: boolean) => void;
  useRealClothingTextures?: boolean;
}

const BabylonAvatar: React.FC<BabylonAvatarProps> = ({
  userProfile,
  outfitItems,
  pose = 'standing',
  lighting = 'studio',
  onLoadingChange,
  useRealClothingTextures = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const avatarRef = useRef<AbstractMesh | null>(null);
  const textureRefs = useRef<{[key: string]: Texture}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Advanced skin tone mapping with realistic PBR values
  const getSkinTonePBR = (skinTone: string) => {
    const tones = {
      'Very Fair': {
        baseColor: new Color3(0.95, 0.87, 0.80),
        subsurface: new Color3(0.98, 0.92, 0.88),
        roughness: 0.7,
        metallic: 0.0,
        specular: 0.04
      },
      'Fair': {
        baseColor: new Color3(0.92, 0.83, 0.75),
        subsurface: new Color3(0.95, 0.88, 0.82),
        roughness: 0.72,
        metallic: 0.0,
        specular: 0.04
      },
      'Light': {
        baseColor: new Color3(0.88, 0.78, 0.68),
        subsurface: new Color3(0.92, 0.83, 0.75),
        roughness: 0.74,
        metallic: 0.0,
        specular: 0.04
      },
      'Medium': {
        baseColor: new Color3(0.76, 0.65, 0.52),
        subsurface: new Color3(0.82, 0.72, 0.60),
        roughness: 0.76,
        metallic: 0.0,
        specular: 0.04
      },
      'Tan': {
        baseColor: new Color3(0.68, 0.55, 0.42),
        subsurface: new Color3(0.75, 0.63, 0.50),
        roughness: 0.78,
        metallic: 0.0,
        specular: 0.04
      },
      'Deep': {
        baseColor: new Color3(0.45, 0.35, 0.25),
        subsurface: new Color3(0.52, 0.42, 0.32),
        roughness: 0.80,
        metallic: 0.0,
        specular: 0.04
      },
      'Very Deep': {
        baseColor: new Color3(0.25, 0.18, 0.12),
        subsurface: new Color3(0.32, 0.25, 0.18),
        roughness: 0.82,
        metallic: 0.0,
        specular: 0.04
      }
    };
    return tones[skinTone as keyof typeof tones] || tones['Medium'];
  };

  // Body type measurements for realistic proportions
  const getBodyMeasurements = (bodyType: string, gender: string = 'unisex') => {
    const baseMeasurements = {
      'Pear': {
        shoulders: 0.85,
        bust: 0.90,
        waist: 0.70,
        hips: 1.15,
        height: 1.0
      },
      'Apple': {
        shoulders: 1.05,
        bust: 1.15,
        waist: 1.10,
        hips: 0.95,
        height: 1.0
      },
      'Hourglass': {
        shoulders: 1.0,
        bust: 1.05,
        waist: 0.65,
        hips: 1.05,
        height: 1.0
      },
      'Rectangle': {
        shoulders: 0.95,
        bust: 0.95,
        waist: 0.90,
        hips: 0.95,
        height: 1.0
      },
      'Inverted Triangle': {
        shoulders: 1.20,
        bust: 1.15,
        waist: 0.85,
        hips: 0.80,
        height: 1.0
      }
    };

    const measurements = baseMeasurements[bodyType as keyof typeof baseMeasurements] || baseMeasurements['Rectangle'];
    
    // Adjust for gender
    if (gender === 'male') {
      measurements.shoulders *= 1.1;
      measurements.bust *= 0.95;
      measurements.waist *= 1.05;
      measurements.hips *= 0.95;
    } else if (gender === 'female') {
      measurements.shoulders *= 0.95;
      measurements.bust *= 1.05;
      measurements.waist *= 0.95;
      measurements.hips *= 1.05;
    }

    return measurements;
  };

  // Create realistic fabric materials for clothing
  const createFabricMaterial = (scene: Scene, item: any) => {
    // If using real clothing textures and the item has an imageUrl
    if (useRealClothingTextures && item.imageUrl) {
      // Check if we already have this texture loaded
      if (!textureRefs.current[item.id]) {
        // Create a new texture
        const texture = new Texture(item.imageUrl, scene, false, false);
        texture.hasAlpha = true;
        texture.wrapU = Texture.WRAP_ADDRESSMODE;
        texture.wrapV = Texture.WRAP_ADDRESSMODE;
        
        // Store the texture for reuse
        textureRefs.current[item.id] = texture;
      }
      
      // Create material with the texture
      const material = new PBRMaterial(`fabric_${item.id}`, scene);
      material.albedoTexture = textureRefs.current[item.id];
      material.useAlphaFromAlbedoTexture = true;
      
      // Adjust material properties based on clothing type
      if (item.category === 'Dresses' || item.name.toLowerCase().includes('silk')) {
        material.roughness = 0.1;
        material.metallic = 0.0;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 0.3;
      } else if (item.name.toLowerCase().includes('denim') || item.name.toLowerCase().includes('jean')) {
        material.roughness = 0.9;
        material.metallic = 0.0;
        material.bumpTexture = new Texture('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZGVuaW0iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZGVuaW0pIi8+PC9zdmc+', scene);
        material.bumpTexture.level = 0.3;
      } else if (item.name.toLowerCase().includes('leather')) {
        material.roughness = 0.3;
        material.metallic = 0.1;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 0.5;
        material.clearCoat.roughness = 0.2;
      } else {
        material.roughness = 0.7;
        material.metallic = 0.0;
      }
      
      return material;
    } else {
      // Fallback to color-based material
      const colorMap: { [key: string]: Color3 } = {
        'Black': new Color3(0.05, 0.05, 0.05),
        'White': new Color3(0.95, 0.95, 0.95),
        'Blue': new Color3(0.15, 0.35, 0.75),
        'Red': new Color3(0.75, 0.15, 0.15),
        'Green': new Color3(0.15, 0.65, 0.25),
        'Gray': new Color3(0.45, 0.45, 0.45),
        'Brown': new Color3(0.45, 0.25, 0.15),
        'Purple': new Color3(0.55, 0.25, 0.75),
        'Pink': new Color3(0.85, 0.45, 0.65),
        'Yellow': new Color3(0.85, 0.75, 0.15),
        'Orange': new Color3(0.85, 0.45, 0.15),
        'Multi': new Color3(0.45, 0.45, 0.45)
      };

      const material = new PBRMaterial(`fabric_${item.id}`, scene);
      material.albedoColor = colorMap[item.color] || colorMap['Gray'];
      
      // Different fabric properties based on clothing type
      if (item.category === 'Dresses' || item.name.toLowerCase().includes('silk')) {
        // Silk-like material
        material.roughness = 0.1;
        material.metallic = 0.0;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 0.3;
      } else if (item.name.toLowerCase().includes('denim') || item.name.toLowerCase().includes('jean')) {
        // Denim material
        material.roughness = 0.9;
        material.metallic = 0.0;
        material.bumpTexture = new Texture('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZGVuaW0iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZGVuaW0pIi8+PC9zdmc+', scene);
        material.bumpTexture.level = 0.3;
      } else if (item.name.toLowerCase().includes('leather')) {
        // Leather material
        material.roughness = 0.3;
        material.metallic = 0.1;
        material.clearCoat.isEnabled = true;
        material.clearCoat.intensity = 0.5;
        material.clearCoat.roughness = 0.2;
      } else {
        // Default fabric material (cotton-like)
        material.roughness = 0.7;
        material.metallic = 0.0;
      }
      
      return material;
    }
  };

  // Create skin material with subsurface scattering effect
  const createSkinMaterial = (scene: Scene, skinTone: string) => {
    const skinPBR = getSkinTonePBR(skinTone || 'Medium');
    
    const material = new PBRMaterial("skinMaterial", scene);
    material.albedoColor = skinPBR.baseColor;
    material.roughness = skinPBR.roughness;
    material.metallic = skinPBR.metallic;
    material.subSurface.isTranslucencyEnabled = true;
    material.subSurface.translucencyIntensity = 0.8;
    material.subSurface.tintColor = skinPBR.subsurface;
    
    return material;
  };

  // Set up animation based on pose
  const setupAnimation = (scene: Scene, avatar: AbstractMesh, pose: string) => {
    // Create animation groups for different poses
    const idleAnimation = new AnimationGroup("idle", scene);
    const walkingAnimation = new AnimationGroup("walking", scene);
    
    // Idle animation (subtle breathing)
    const breathingAnimation = new Animation(
      "breathingAnimation",
      "scaling.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const breathingKeys = [];
    breathingKeys.push({ frame: 0, value: 1.0 });
    breathingKeys.push({ frame: 30, value: 1.02 });
    breathingKeys.push({ frame: 60, value: 1.0 });
    
    breathingAnimation.setKeys(breathingKeys);
    idleAnimation.addTargetedAnimation(breathingAnimation, avatar);
    
    // Walking animation
    const walkingRotationAnimation = new Animation(
      "walkingRotationAnimation",
      "rotation.y",
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
    
    const walkingKeys = [];
    walkingKeys.push({ frame: 0, value: -0.1 });
    walkingKeys.push({ frame: 15, value: 0.1 });
    walkingKeys.push({ frame: 30, value: -0.1 });
    
    walkingRotationAnimation.setKeys(walkingKeys);
    walkingAnimation.addTargetedAnimation(walkingRotationAnimation, avatar);
    
    // Play the appropriate animation based on pose
    if (pose === 'walking') {
      walkingAnimation.play(true);
    } else {
      idleAnimation.play(true);
    }
    
    return { idleAnimation, walkingAnimation };
  };

  // Set up lighting based on environment
  const setupLighting = (scene: Scene, lightingType: string) => {
    // Remove existing lights
    scene.lights.slice().forEach(light => light.dispose());
    
    // Add ambient light
    const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), scene);
    
    switch (lightingType) {
      case 'studio':
        // Studio lighting setup (3-point lighting)
        ambientLight.intensity = 0.3;
        
        // Key light (main light)
        const keyLight = new DirectionalLight("keyLight", new Vector3(-0.5, -0.5, -1), scene);
        keyLight.intensity = 0.8;
        keyLight.diffuse = new Color3(1, 0.95, 0.85);
        
        // Fill light (softer, fills shadows)
        const fillLight = new DirectionalLight("fillLight", new Vector3(1, -0.5, -0.5), scene);
        fillLight.intensity = 0.5;
        fillLight.diffuse = new Color3(0.85, 0.85, 1);
        
        // Back light (rim light)
        const backLight = new DirectionalLight("backLight", new Vector3(0, -0.25, 1), scene);
        backLight.intensity = 0.3;
        backLight.diffuse = new Color3(1, 1, 1);
        
        break;
        
      case 'natural':
        // Natural outdoor lighting
        ambientLight.intensity = 0.6;
        ambientLight.diffuse = new Color3(0.9, 0.9, 1);
        ambientLight.groundColor = new Color3(0.5, 0.5, 0.5);
        
        // Sun light
        const sunLight = new DirectionalLight("sunLight", new Vector3(0.2, -0.8, -0.5), scene);
        sunLight.intensity = 0.7;
        sunLight.diffuse = new Color3(1, 0.95, 0.8);
        
        break;
        
      case 'dramatic':
        // Dramatic lighting with high contrast
        ambientLight.intensity = 0.2;
        
        // Main dramatic light
        const dramaticLight = new DirectionalLight("dramaticLight", new Vector3(-0.7, -0.5, -0.5), scene);
        dramaticLight.intensity = 0.9;
        dramaticLight.diffuse = new Color3(1, 0.9, 0.8);
        
        // Accent light
        const accentLight = new DirectionalLight("accentLight", new Vector3(0.5, -0.2, 0.5), scene);
        accentLight.intensity = 0.4;
        accentLight.diffuse = new Color3(0.2, 0.4, 0.8);
        
        break;
        
      default:
        // Default balanced lighting
        ambientLight.intensity = 0.4;
        
        const defaultLight = new DirectionalLight("defaultLight", new Vector3(-0.5, -0.5, -0.5), scene);
        defaultLight.intensity = 0.6;
    }
    
    return scene.lights;
  };

  // Create environment
  const setupEnvironment = (scene: Scene, lightingType: string) => {
    // Create environment helper with skybox
    let envHelper: EnvironmentHelper | null = null;
    
    switch (lightingType) {
      case 'studio':
        // Studio environment (neutral, controlled)
        envHelper = new EnvironmentHelper({
          skyboxSize: 100,
          groundColor: new Color3(0.85, 0.85, 0.85),
          createGround: true,
          groundSize: 100,
          enableGroundShadow: true,
          groundShadowLevel: 0.6,
        }, scene);
        break;
        
      case 'natural':
        // Natural outdoor environment
        envHelper = new EnvironmentHelper({
          skyboxSize: 100,
          groundColor: new Color3(0.5, 0.6, 0.4), // Grass-like
          createGround: true,
          groundSize: 100,
          enableGroundShadow: true,
          groundShadowLevel: 0.7,
        }, scene);
        break;
        
      case 'dramatic':
        // Dramatic environment (darker, more contrast)
        envHelper = new EnvironmentHelper({
          skyboxSize: 100,
          groundColor: new Color3(0.2, 0.2, 0.3), // Dark floor
          createGround: true,
          groundSize: 100,
          enableGroundShadow: true,
          groundShadowLevel: 0.9,
        }, scene);
        break;
        
      default:
        // Default neutral environment
        envHelper = new EnvironmentHelper({
          skyboxSize: 100,
          groundColor: new Color3(0.75, 0.75, 0.75),
          createGround: true,
          groundSize: 100,
          enableGroundShadow: true,
        }, scene);
    }
    
    if (envHelper && envHelper.ground) {
      envHelper.ground.position.y = -1; // Position ground below avatar
    }
    
    return envHelper;
  };

  // Create loading UI
  const createLoadingUI = (scene: Scene) => {
    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    
    const panel = new StackPanel();
    panel.width = "400px";
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel);
    
    const loadingText = new TextBlock();
    loadingText.text = "Creating your personalized avatar...";
    loadingText.color = "white";
    loadingText.fontSize = 24;
    loadingText.height = "40px";
    panel.addControl(loadingText);
    
    return { advancedTexture, loadingText };
  };

  // Create avatar with clothing
  const createAvatar = (scene: Scene, userProfile: any, outfitItems: any[]) => {
    const bodyMeasurements = getBodyMeasurements(
      userProfile.bodyType || 'Rectangle', 
      userProfile.gender || 'unisex'
    );
    
    // Create avatar root node
    const avatarRoot = new TransformNode("avatarRoot", scene);
    
    // Create skin material
    const skinMaterial = createSkinMaterial(scene, userProfile.skinTone || 'Medium');
    
    // Create head
    const head = MeshBuilder.CreateSphere("head", { diameter: 0.24, segments: 32 }, scene);
    head.position.y = 1.7;
    head.material = skinMaterial;
    head.parent = avatarRoot;
    
    // Create neck
    const neck = MeshBuilder.CreateCylinder("neck", { height: 0.1, diameter: 0.1 }, scene);
    neck.position.y = 1.55;
    neck.material = skinMaterial;
    neck.parent = avatarRoot;
    
    // Find clothing items by category
    const topItem = outfitItems.find(item => item.category === 'Tops');
    const bottomItem = outfitItems.find(item => item.category === 'Bottoms');
    const dressItem = outfitItems.find(item => item.category === 'Dresses');
    const outerwearItem = outfitItems.find(item => item.category === 'Outerwear');
    const footwearItem = outfitItems.find(item => item.category === 'Footwear');
    
    // Create torso
    const torsoHeight = 0.6;
    const torsoWidth = 0.35 * bodyMeasurements.bust;
    const torsoDepth = 0.2;
    
    const torso = MeshBuilder.CreateBox("torso", { 
      width: torsoWidth, 
      height: torsoHeight, 
      depth: torsoDepth 
    }, scene);
    torso.position.y = 1.25;
    
    // Apply clothing material to torso
    if (dressItem) {
      torso.material = createFabricMaterial(scene, dressItem);
    } else if (topItem) {
      torso.material = createFabricMaterial(scene, topItem);
    } else {
      torso.material = skinMaterial;
    }
    torso.parent = avatarRoot;
    
    // Create arms
    const createArm = (side: string, shoulderWidth: number) => {
      const armGroup = new TransformNode(`${side}ArmGroup`, scene);
      armGroup.parent = avatarRoot;
      
      const upperArmLength = 0.3;
      const upperArm = MeshBuilder.CreateCylinder(`${side}UpperArm`, { 
        height: upperArmLength, 
        diameter: 0.08 * bodyMeasurements.shoulders
      }, scene);
      upperArm.rotation.z = side === 'left' ? Math.PI / 8 : -Math.PI / 8;
      upperArm.position.x = side === 'left' ? -shoulderWidth/2 : shoulderWidth/2;
      upperArm.position.y = 1.4;
      upperArm.material = dressItem || topItem ? createFabricMaterial(scene, dressItem || topItem) : skinMaterial;
      upperArm.parent = armGroup;
      
      const lowerArmLength = 0.3;
      const lowerArm = MeshBuilder.CreateCylinder(`${side}LowerArm`, { 
        height: lowerArmLength, 
        diameter: 0.07 * bodyMeasurements.shoulders
      }, scene);
      lowerArm.rotation.z = side === 'left' ? Math.PI / 6 : -Math.PI / 6;
      lowerArm.position.x = side === 'left' ? -shoulderWidth/2 - 0.15 : shoulderWidth/2 + 0.15;
      lowerArm.position.y = 1.15;
      lowerArm.material = dressItem || topItem ? createFabricMaterial(scene, dressItem || topItem) : skinMaterial;
      lowerArm.parent = armGroup;
      
      // Hand
      const hand = MeshBuilder.CreateSphere(`${side}Hand`, { 
        diameter: 0.08, 
        segments: 16 
      }, scene);
      hand.position.x = side === 'left' ? -shoulderWidth/2 - 0.25 : shoulderWidth/2 + 0.25;
      hand.position.y = 1.0;
      hand.material = skinMaterial;
      hand.parent = armGroup;
      
      return armGroup;
    };
    
    const shoulderWidth = torsoWidth * 1.1 * bodyMeasurements.shoulders;
    createArm('left', shoulderWidth);
    createArm('right', shoulderWidth);
    
    // Create waist/hips
    const waistWidth = torsoWidth * 0.9 * bodyMeasurements.waist;
    const waist = MeshBuilder.CreateCylinder("waist", { 
      height: 0.2, 
      diameterTop: torsoWidth * 0.9, 
      diameterBottom: waistWidth
    }, scene);
    waist.position.y = 0.95;
    waist.material = dressItem ? createFabricMaterial(scene, dressItem) : 
                    bottomItem ? createFabricMaterial(scene, bottomItem) : skinMaterial;
    waist.parent = avatarRoot;
    
    // Create hips
    const hipWidth = waistWidth * 1.1 * bodyMeasurements.hips;
    const hips = MeshBuilder.CreateCylinder("hips", { 
      height: 0.2, 
      diameterTop: waistWidth, 
      diameterBottom: hipWidth
    }, scene);
    hips.position.y = 0.8;
    hips.material = dressItem ? createFabricMaterial(scene, dressItem) : 
                   bottomItem ? createFabricMaterial(scene, bottomItem) : skinMaterial;
    hips.parent = avatarRoot;
    
    // Create legs if not wearing a dress
    if (!dressItem) {
      const createLeg = (side: string) => {
        const legGroup = new TransformNode(`${side}LegGroup`, scene);
        legGroup.parent = avatarRoot;
        
        const upperLegLength = 0.4;
        const upperLeg = MeshBuilder.CreateCylinder(`${side}UpperLeg`, { 
          height: upperLegLength, 
          diameter: 0.12
        }, scene);
        upperLeg.position.x = side === 'left' ? -0.1 : 0.1;
        upperLeg.position.y = 0.6;
        upperLeg.material = bottomItem ? createFabricMaterial(scene, bottomItem) : skinMaterial;
        upperLeg.parent = legGroup;
        
        const lowerLegLength = 0.4;
        const lowerLeg = MeshBuilder.CreateCylinder(`${side}LowerLeg`, { 
          height: lowerLegLength, 
          diameter: 0.1
        }, scene);
        lowerLeg.position.x = side === 'left' ? -0.1 : 0.1;
        lowerLeg.position.y = 0.2;
        lowerLeg.material = bottomItem ? createFabricMaterial(scene, bottomItem) : skinMaterial;
        lowerLeg.parent = legGroup;
        
        // Foot
        if (footwearItem) {
          const foot = MeshBuilder.CreateBox(`${side}Foot`, { 
            width: 0.1, 
            height: 0.05, 
            depth: 0.2
          }, scene);
          foot.position.x = side === 'left' ? -0.1 : 0.1;
          foot.position.y = -0.05;
          foot.position.z = 0.05;
          foot.material = createFabricMaterial(scene, footwearItem);
          foot.parent = legGroup;
        }
        
        return legGroup;
      };
      
      createLeg('left');
      createLeg('right');
    } else {
      // Create dress extension
      const dressLength = 0.6;
      const dress = MeshBuilder.CreateCylinder("dress", { 
        height: dressLength, 
        diameterTop: hipWidth, 
        diameterBottom: hipWidth * 1.2
      }, scene);
      dress.position.y = 0.4;
      dress.material = createFabricMaterial(scene, dressItem);
      dress.parent = avatarRoot;
      
      // Create feet if footwear is present
      if (footwearItem) {
        const leftFoot = MeshBuilder.CreateBox("leftFoot", { 
          width: 0.1, 
          height: 0.05, 
          depth: 0.2
        }, scene);
        leftFoot.position.x = -0.1;
        leftFoot.position.y = -0.05;
        leftFoot.position.z = 0.05;
        leftFoot.material = createFabricMaterial(scene, footwearItem);
        leftFoot.parent = avatarRoot;
        
        const rightFoot = MeshBuilder.CreateBox("rightFoot", { 
          width: 0.1, 
          height: 0.05, 
          depth: 0.2
        }, scene);
        rightFoot.position.x = 0.1;
        rightFoot.position.y = -0.05;
        rightFoot.position.z = 0.05;
        rightFoot.material = createFabricMaterial(scene, footwearItem);
        rightFoot.parent = avatarRoot;
      }
    }
    
    // Add outerwear if present
    if (outerwearItem) {
      const outerTorso = MeshBuilder.CreateBox("outerTorso", { 
        width: torsoWidth * 1.2, 
        height: torsoHeight * 1.1, 
        depth: torsoDepth * 1.2
      }, scene);
      outerTorso.position.y = 1.25;
      outerTorso.material = createFabricMaterial(scene, outerwearItem);
      outerTorso.parent = avatarRoot;
    }
    
    return avatarRoot;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Notify parent about loading state
    setIsLoading(true);
    if (onLoadingChange) onLoadingChange(true);
    
    // Create engine
    const engine = new Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
    engineRef.current = engine;
    
    // Create scene
    const scene = new Scene(engine);
    sceneRef.current = scene;
    
    try {
      // Create camera
      const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 3, new Vector3(0, 0.8, 0), scene);
      camera.lowerRadiusLimit = 2;
      camera.upperRadiusLimit = 5;
      camera.wheelDeltaPercentage = 0.01;
      camera.attachControl(canvasRef.current, true);
      
      // Set up lighting based on environment
      setupLighting(scene, lighting);
      
      // Set up environment
      const envHelper = setupEnvironment(scene, lighting);
      
      // Create loading UI
      const { advancedTexture, loadingText } = createLoadingUI(scene);
      
      // Create avatar with clothing
      const avatar = createAvatar(scene, userProfile, outfitItems);
      avatarRef.current = avatar;
      
      // Set up animation based on pose
      const animations = setupAnimation(scene, avatar, pose);
      
      // Hide loading UI when ready
      scene.executeWhenReady(() => {
        advancedTexture.dispose();
        setIsLoading(false);
        if (onLoadingChange) onLoadingChange(false);
      });
      
      // Start rendering loop
      engine.runRenderLoop(() => {
        scene.render();
      });
      
      // Handle window resize
      const handleResize = () => {
        engine.resize();
      };
      
      window.addEventListener('resize', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        animations.idleAnimation.dispose();
        animations.walkingAnimation.dispose();
        if (envHelper) {
          envHelper.dispose();
        }
        
        // Dispose textures
        Object.values(textureRefs.current).forEach(texture => {
          texture.dispose();
        });
        
        scene.dispose();
        engine.dispose();
      };
    } catch (err) {
      console.error('Error creating 3D avatar:', err);
      setError('Failed to create 3D avatar');
      setIsLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  }, [userProfile, outfitItems, pose, lighting, useRealClothingTextures]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-700">Creating your personalized avatar...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/20 backdrop-blur-sm rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg text-center max-w-xs">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-700 font-medium">{error}</p>
            <p className="text-sm text-gray-500 mt-1">Please try again or contact support</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BabylonAvatar;
