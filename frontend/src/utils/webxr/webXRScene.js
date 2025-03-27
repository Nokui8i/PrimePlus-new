import * as THREE from 'three';
import webXRManager from './webXRManager';

/**
 * WebXR Scene - Handles Three.js scene creation and management for WebXR
 */
class WebXRScene {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;
    this.initialized = false;
    this.controllers = [];
    this.avatars = new Map(); // Map of user ID to avatar mesh
    this.eventListeners = {};
    this.userHeight = 1.6; // Default user height in meters
    this.additionalObjects = [];
    this.isXRSession = false;
  }
  
  /**
   * Initialize the Three.js scene
   * @param {HTMLCanvasElement} canvas - Canvas element for rendering
   * @param {Object} options - Scene options
   */
  initialize(canvas, options = {}) {
    if (this.initialized) return this;
    
    this.canvas = canvas;
    
    // Create scene
    this.scene = new THREE.Scene();
    if (options.sceneBackground) {
      this.scene.background = new THREE.Color(options.sceneBackground);
    }
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      options.fov || 75,
      options.aspect || canvas.clientWidth / canvas.clientHeight,
      options.near || 0.1,
      options.far || 1000
    );
    this.camera.position.set(0, this.userHeight, 0);
    this.scene.add(this.camera);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: options.antialias !== false,
      alpha: options.alpha !== false,
    });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.xr.enabled = true;
    
    // Add basic lighting
    this._setupLighting();
    
    // Add floor
    this._setupFloor();
    
    // Initialize WebXR Manager
    this._initWebXR();
    
    // Set up animation loop
    this.renderer.setAnimationLoop(this._animate.bind(this));
    
    // Add window resize handler
    window.addEventListener('resize', this._onWindowResize.bind(this));
    
    this.initialized = true;
    return this;
  }
  
  /**
   * Setup basic lighting for the scene
   */
  _setupLighting() {
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    // Add directional light (sun-like)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    this.scene.add(dirLight);
    
    // Add hemisphere light (sky/ground)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);
    this.scene.add(hemiLight);
  }
  
  /**
   * Setup floor grid
   */
  _setupFloor() {
    // Grid helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0x444444);
    this.scene.add(gridHelper);
    
    // Floor plane
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Make it horizontal
    floor.receiveShadow = true;
    this.scene.add(floor);
  }
  
  /**
   * Initialize WebXR
   */
  async _initWebXR() {
    try {
      await webXRManager.initialize(this.canvas);
      
      // Add VR button to the canvas container
      this._addVRButton();
      
      // Create controller models
      this._createControllers();
      
      // Add WebXR event listeners
      webXRManager.addEventListener('sessionstart', () => {
        this.isXRSession = true;
        this._onXRSessionStarted();
      });
      
      webXRManager.addEventListener('sessionend', () => {
        this.isXRSession = false;
        this._onXRSessionEnded();
      });
      
      webXRManager.addEventListener('render', (timestamp, frame, pose, controllers) => {
        this._onXRFrame(timestamp, frame, pose, controllers);
      });
      
      webXRManager.addEventListener('controlleradded', (inputSource) => {
        this._onControllerAdded(inputSource);
      });
      
      webXRManager.addEventListener('controllerremoved', (inputSource) => {
        this._onControllerRemoved(inputSource);
      });
    } catch (err) {
      console.error('Failed to initialize WebXR:', err);
    }
  }
  
  /**
   * Add VR button to enter VR
   */
  _addVRButton() {
    const VRButton = document.createElement('button');
    VRButton.style.position = 'absolute';
    VRButton.style.bottom = '20px';
    VRButton.style.right = '20px';
    VRButton.style.padding = '12px 24px';
    VRButton.style.border = 'none';
    VRButton.style.borderRadius = '4px';
    VRButton.style.background = '#2196f3';
    VRButton.style.color = 'white';
    VRButton.style.font = 'normal 13px sans-serif';
    VRButton.style.textAlign = 'center';
    VRButton.style.opacity = '0.9';
    VRButton.style.outline = 'none';
    VRButton.style.zIndex = '999';
    VRButton.style.cursor = 'pointer';
    
    if (webXRManager.isWebXRAvailable()) {
      VRButton.textContent = 'ENTER VR';
      VRButton.addEventListener('click', () => this.enterVR());
    } else {
      VRButton.textContent = 'VR NOT AVAILABLE';
      VRButton.disabled = true;
      VRButton.style.opacity = '0.5';
      VRButton.style.background = '#888';
    }
    
    this.canvas.parentNode.appendChild(VRButton);
    this.vrButton = VRButton;
  }
  
  /**
   * Create controller models
   */
  _createControllers() {
    // Controller meshes will be created when controllers are added
    this.controllerModelFactory = new THREE.XRControllerModelFactory();
  }
  
  /**
   * Handle XR session start
   */
  _onXRSessionStarted() {
    // Update camera and other settings for VR
    this.camera.position.set(0, this.userHeight, 0);
    
    // Adjust rendering settings for VR
    if (this.renderer.xr.isPresenting) {
      this.renderer.xr.setReferenceSpaceType('local-floor');
    }
    
    // Trigger event
    if (this.eventListeners.xrsessionstart) {
      this.eventListeners.xrsessionstart.forEach(callback => {
        callback();
      });
    }
  }
  
  /**
   * Handle XR session end
   */
  _onXRSessionEnded() {
    // Restore non-VR camera settings
    this.camera.position.set(0, this.userHeight, 0);
    
    // Trigger event
    if (this.eventListeners.xrsessionend) {
      this.eventListeners.xrsessionend.forEach(callback => {
        callback();
      });
    }
  }
  
  /**
   * Handle XR animation frame
   */
  _onXRFrame(timestamp, frame, pose, controllers) {
    if (!pose) return;
    
    // Update camera from pose
    const views = pose.views;
    const viewerPose = pose;
    
    // Update controllers
    controllers.forEach((controller, index) => {
      const controllerObj = this.controllers[index];
      if (controllerObj && controller.targetRayPose) {
        controllerObj.position.copy(controller.targetRayPose.transform.position);
        controllerObj.quaternion.copy(controller.targetRayPose.transform.orientation);
        controllerObj.visible = true;
      }
    });
    
    // Trigger event
    if (this.eventListeners.xrframe) {
      this.eventListeners.xrframe.forEach(callback => {
        callback(timestamp, frame, pose, controllers);
      });
    }
  }
  
  /**
   * Handle controller added
   */
  _onControllerAdded(inputSource) {
    const controllerIndex = this.controllers.length;
    
    // Create controller body
    const controllerGrip = this.renderer.xr.getControllerGrip(controllerIndex);
    const controllerModel = this.controllerModelFactory.createControllerModel(controllerGrip);
    controllerGrip.add(controllerModel);
    
    // Create controller rays
    const controllerRay = this.renderer.xr.getController(controllerIndex);
    
    // Add controller parts to scene
    this.scene.add(controllerGrip);
    this.scene.add(controllerRay);
    
    // Store controller
    this.controllers.push(controllerRay);
    
    // Trigger event
    if (this.eventListeners.controlleradded) {
      this.eventListeners.controlleradded.forEach(callback => {
        callback(inputSource, controllerRay, controllerGrip);
      });
    }
  }
  
  /**
   * Handle controller removed
   */
  _onControllerRemoved(inputSource) {
    // Find controller by input source
    const index = this.controllers.findIndex(
      controller => controller.inputSource === inputSource
    );
    
    if (index !== -1) {
      const controller = this.controllers[index];
      
      // Remove from scene
      if (controller.parent) {
        controller.parent.remove(controller);
      }
      
      // Remove grip
      const grip = this.renderer.xr.getControllerGrip(index);
      if (grip && grip.parent) {
        grip.parent.remove(grip);
      }
      
      // Remove from controllers array
      this.controllers.splice(index, 1);
      
      // Trigger event
      if (this.eventListeners.controllerremoved) {
        this.eventListeners.controllerremoved.forEach(callback => {
          callback(inputSource);
        });
      }
    }
  }
  
  /**
   * Animation loop
   */
  _animate(timestamp) {
    if (!this.initialized) return;
    
    // If we're not in XR mode, use standard rendering
    if (!this.isXRSession) {
      this.renderer.render(this.scene, this.camera);
    }
    
    // Update any additional objects
    this.additionalObjects.forEach(obj => {
      if (obj.update) obj.update(timestamp);
    });
    
    // Trigger animation event
    if (this.eventListeners.animate) {
      this.eventListeners.animate.forEach(callback => {
        callback(timestamp);
      });
    }
  }
  
  /**
   * Window resize handler
   */
  _onWindowResize() {
    if (!this.canvas) return;
    
    // Update camera aspect ratio
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    
    // Update renderer size
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }
  
  /**
   * Enter VR mode
   */
  async enterVR() {
    try {
      if (!webXRManager.isWebXRAvailable()) {
        throw new Error('WebXR not available in this browser');
      }
      
      const success = await webXRManager.startSession({
        depthFar: 1000,
        depthNear: 0.1
      });
      
      if (success) {
        this.vrButton.textContent = 'EXIT VR';
        this.vrButton.removeEventListener('click', () => this.enterVR());
        this.vrButton.addEventListener('click', () => this.exitVR());
      }
    } catch (err) {
      console.error('Error entering VR mode:', err);
      alert('Failed to enter VR mode: ' + err.message);
    }
  }
  
  /**
   * Exit VR mode
   */
  async exitVR() {
    try {
      await webXRManager.endSession();
      
      this.vrButton.textContent = 'ENTER VR';
      this.vrButton.removeEventListener('click', () => this.exitVR());
      this.vrButton.addEventListener('click', () => this.enterVR());
    } catch (err) {
      console.error('Error exiting VR mode:', err);
    }
  }
  
  /**
   * Add a user avatar to the scene
   * @param {string} userId - User ID
   * @param {Object} position - 3D position {x, y, z}
   * @param {Object} rotation - 3D rotation {x, y, z}
   * @param {Object} options - Avatar options
   */
  addUserAvatar(userId, position, rotation, options = {}) {
    // Check if avatar already exists
    if (this.avatars.has(userId)) {
      this.updateUserAvatar(userId, position, rotation);
      return;
    }
    
    // Create avatar group
    const avatarGroup = new THREE.Group();
    
    // Create avatar body
    const bodyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: options.color || Math.random() * 0xffffff,
      roughness: 0.7,
      metalness: 0.3
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    avatarGroup.add(body);
    
    // Create avatar head
    const headGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
      color: options.headColor || bodyMaterial.color.getHex(),
      roughness: 0.7,
      metalness: 0.3
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    avatarGroup.add(head);
    
    // Create name tag
    if (options.username) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 64;
      context.fillStyle = '#000000';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = 'Bold 24px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#ffffff';
      context.fillText(options.username, canvas.width / 2, canvas.height / 2 + 8);
      
      const nameTexture = new THREE.CanvasTexture(canvas);
      const nameMaterial = new THREE.MeshBasicMaterial({
        map: nameTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      const nameGeometry = new THREE.PlaneGeometry(0.8, 0.2);
      const nameTag = new THREE.Mesh(nameGeometry, nameMaterial);
      nameTag.position.y = 1.5;
      
      // Make name tag always face camera
      nameTag.onBeforeRender = function() {
        if (!this.parent) return;
        
        this.rotation.copy(this.parent.rotation);
        this.rotation.x = 0;
        this.rotation.z = 0;
      };
      
      avatarGroup.add(nameTag);
    }
    
    // Set position and rotation
    if (position) {
      avatarGroup.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 0
      );
    }
    
    if (rotation) {
      avatarGroup.rotation.set(
        rotation.x || 0,
        rotation.y || 0,
        rotation.z || 0
      );
    }
    
    // Add to scene
    this.scene.add(avatarGroup);
    
    // Store avatar
    this.avatars.set(userId, {
      group: avatarGroup,
      body: body,
      head: head,
      position: { ...avatarGroup.position },
      rotation: { ...avatarGroup.rotation }
    });
    
    // Trigger event
    if (this.eventListeners.avataradded) {
      this.eventListeners.avataradded.forEach(callback => {
        callback(userId, avatarGroup);
      });
    }
  }
  
  /**
   * Update a user avatar position and rotation
   * @param {string} userId - User ID
   * @param {Object} position - 3D position {x, y, z}
   * @param {Object} rotation - 3D rotation {x, y, z}
   */
  updateUserAvatar(userId, position, rotation) {
    const avatar = this.avatars.get(userId);
    if (!avatar) return;
    
    // Update position
    if (position) {
      avatar.group.position.set(
        position.x !== undefined ? position.x : avatar.group.position.x,
        position.y !== undefined ? position.y : avatar.group.position.y,
        position.z !== undefined ? position.z : avatar.group.position.z
      );
      
      // Store updated position
      avatar.position = { ...avatar.group.position };
    }
    
    // Update rotation
    if (rotation) {
      avatar.group.rotation.set(
        rotation.x !== undefined ? rotation.x : avatar.group.rotation.x,
        rotation.y !== undefined ? rotation.y : avatar.group.rotation.y,
        rotation.z !== undefined ? rotation.z : avatar.group.rotation.z
      );
      
      // Store updated rotation
      avatar.rotation = { ...avatar.group.rotation };
    }
  }
  
  /**
   * Remove a user avatar from the scene
   * @param {string} userId - User ID
   */
  removeUserAvatar(userId) {
    const avatar = this.avatars.get(userId);
    if (!avatar) return;
    
    // Remove from scene
    this.scene.remove(avatar.group);
    
    // Remove from avatars map
    this.avatars.delete(userId);
    
    // Trigger event
    if (this.eventListeners.avatarremoved) {
      this.eventListeners.avatarremoved.forEach(callback => {
        callback(userId);
      });
    }
  }
  
  /**
   * Add a 3D object to the scene
   * @param {Object} object - THREE.js object
   * @param {Object} position - Position {x, y, z}
   * @param {Object} rotation - Rotation {x, y, z}
   */
  addObject(object, position, rotation) {
    if (!object) return;
    
    // Set position and rotation if provided
    if (position) {
      object.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 0
      );
    }
    
    if (rotation) {
      object.rotation.set(
        rotation.x || 0,
        rotation.y || 0,
        rotation.z || 0
      );
    }
    
    // Add to scene
    this.scene.add(object);
    
    // Add to additional objects array for updates
    if (object.update && typeof object.update === 'function') {
      this.additionalObjects.push(object);
    }
    
    return object;
  }
  
  /**
   * Add a 3D model to the scene
   * @param {string} url - Model URL (GLTF/GLB)
   * @param {Object} position - Position {x, y, z}
   * @param {Object} rotation - Rotation {x, y, z}
   * @param {Object} options - Model options
   */
  async addModel(url, position, rotation, options = {}) {
    // Import GLTF loader dynamically
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    
    // Create loader
    const loader = new GLTFLoader();
    
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          
          // Apply scale if provided
          if (options.scale) {
            model.scale.set(options.scale, options.scale, options.scale);
          }
          
          // Add to scene
          this.addObject(model, position, rotation);
          
          // Apply any custom setup
          if (options.setup && typeof options.setup === 'function') {
            options.setup(model, gltf);
          }
          
          resolve(model);
        },
        (progress) => {
          // Handle loading progress
          if (options.onProgress && typeof options.onProgress === 'function') {
            options.onProgress(progress);
          }
        },
        (error) => {
          console.error('Error loading 3D model:', error);
          reject(error);
        }
      );
    });
  }
  
  /**
   * Load a VR asset from the asset library
   * @param {string} assetId - ID of the asset in the VR asset library
   * @param {Object} position - Position {x, y, z}
   * @param {Object} rotation - Rotation {x, y, z}
   * @param {Object} scale - Scale {x, y, z}
   * @param {Object} options - Additional options
   */
  async loadVRAsset(assetId, position, rotation, scale, options = {}) {
    if (!this.initialized) {
      console.error('WebXR scene not initialized');
      return null;
    }
    
    try {
      // Fetch asset details (in a real application, would use your API)
      // This is a stub - in a real app you'd get this from your VR asset API
      const assetDetails = await options.getAssetDetails?.(assetId) || {
        fileUrl: options.fileUrl || '',
        name: options.name || 'Unknown Asset'
      };
      
      // Get the asset URL
      const assetUrl = assetDetails.fileUrl;
      
      if (!assetUrl) {
        throw new Error('Asset URL not found');
      }
      
      // Convert to full URL if needed
      const fullUrl = assetUrl.startsWith('http') ? 
        assetUrl : 
        `${process.env.NEXT_PUBLIC_API_URL || ''}${assetUrl}`;
      
      // Load the model
      const model = await this.addModel(fullUrl, position, rotation, {
        scale: scale?.x || scale || 1,
        onProgress: options.onProgress,
        setup: (model) => {
          // Set custom properties for the asset
          model.userData = {
            ...model.userData,
            assetId,
            isVRAsset: true,
            assetType: assetDetails.assetType || 'model',
            isInteractive: options.isInteractive || false,
            interactionType: options.interactionType || null,
            interactionData: options.interactionData || null
          };
          
          // Apply scale if provided specifically
          if (scale) {
            if (typeof scale === 'object') {
              model.scale.set(scale.x || 1, scale.y || 1, scale.z || 1);
            } else if (typeof scale === 'number') {
              model.scale.set(scale, scale, scale);
            }
          }
          
          // Apply any custom setup function provided
          if (options.setup && typeof options.setup === 'function') {
            options.setup(model, assetDetails);
          }
        }
      });
      
      // Add interaction handlers if interactive
      if (options.isInteractive && model) {
        this._setupInteractiveObject(model, options.interactionType, options.interactionData, options.onInteract);
      }
      
      // Add to scene
      this.additionalObjects.push(model);
      
      return model;
    } catch (error) {
      console.error('Error loading VR asset:', error);
      return null;
    }
  }
  
  /**
   * Setup interactive behavior for objects
   * @private
   */
  _setupInteractiveObject(object, interactionType, interactionData, onInteract) {
    // Mark object as interactive
    object.userData.isInteractive = true;
    object.userData.interactionType = interactionType || 'default';
    object.userData.interactionData = interactionData || {};
    
    // Add hover effect
    const originalMaterials = new Map();
    
    // Store original materials for reset
    if (object.material) {
      originalMaterials.set(object, object.material.clone());
    } else if (object.children) {
      object.traverse(child => {
        if (child.material) {
          originalMaterials.set(child, child.material.clone());
        }
      });
    }
    
    // Add userData for interactions
    object.userData.originalMaterials = originalMaterials;
    object.userData.isHovered = false;
    object.userData.isSelected = false;
    
    // Define the interaction handler
    object.userData.interact = (controller) => {
      if (onInteract && typeof onInteract === 'function') {
        onInteract(object, controller);
      }
      
      // Handle different interaction types
      switch (interactionType) {
        case 'toggle':
          object.visible = !object.visible;
          break;
        case 'animate':
          // Basic animation example - in a real app you'd do something more sophisticated
          object.rotation.y += Math.PI / 2;
          break;
        case 'scale':
          const currentScale = object.scale.x;
          object.scale.set(currentScale * 1.2, currentScale * 1.2, currentScale * 1.2);
          break;
        default:
          // Default behavior is to highlight
          object.userData.isSelected = !object.userData.isSelected;
          this._updateObjectAppearance(object);
      }
    };
    
    return object;
  }
  
  /**
   * Update appearance of interactive objects
   * @private
   */
  _updateObjectAppearance(object) {
    if (!object.userData.isInteractive) return;
    
    const applyHighlight = (obj, intensity) => {
      if (!obj.material) return;
      
      // For multi-material objects
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => {
          mat.emissive && (mat.emissive.set(0x3333ff).multiplyScalar(intensity));
        });
      } else {
        // For single material objects
        obj.material.emissive && obj.material.emissive.set(0x3333ff).multiplyScalar(intensity);
      }
    };
    
    const resetMaterial = (obj) => {
      if (!obj.material) return;
      
      const originalMaterial = object.userData.originalMaterials.get(obj);
      if (originalMaterial) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat, index) => {
            mat.copy(Array.isArray(originalMaterial) ? originalMaterial[index] : originalMaterial);
          });
        } else {
          obj.material.copy(originalMaterial);
        }
      }
    };
    
    if (object.userData.isSelected) {
      // Apply selection highlight
      if (object.material) {
        applyHighlight(object, 0.5);
      } else if (object.children) {
        object.traverse(child => {
          if (child.material) {
            applyHighlight(child, 0.5);
          }
        });
      }
    } else if (object.userData.isHovered) {
      // Apply hover highlight
      if (object.material) {
        applyHighlight(object, 0.2);
      } else if (object.children) {
        object.traverse(child => {
          if (child.material) {
            applyHighlight(child, 0.2);
          }
        });
      }
    } else {
      // Reset to original
      if (object.material) {
        resetMaterial(object);
      } else if (object.children) {
        object.traverse(child => {
          if (child.material) {
            resetMaterial(child);
          }
        });
      }
    }
  }
  
  /**
   * Add an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    
    this.eventListeners[event].push(callback);
  }
  
  /**
   * Remove an event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback to remove
   */
  removeEventListener(event, callback) {
    if (!this.eventListeners[event]) return;
    
    this.eventListeners[event] = this.eventListeners[event]
      .filter(cb => cb !== callback);
  }
  
  /**
   * Dispose of all resources
   */
  dispose() {
    // Remove window resize handler
    window.removeEventListener('resize', this._onWindowResize.bind(this));
    
    // Remove VR button
    if (this.vrButton && this.vrButton.parentNode) {
      this.vrButton.parentNode.removeChild(this.vrButton);
    }
    
    // Stop animation loop
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
    }
    
    // End VR session if active
    if (this.isXRSession) {
      webXRManager.endSession();
    }
    
    // Clear scene
    if (this.scene) {
      this._disposeNode(this.scene);
      this.scene = null;
    }
    
    // Dispose of renderer
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    // Clear all event listeners
    this.eventListeners = {};
    
    // Clear additional objects
    this.additionalObjects = [];
    
    // Clear avatars
    this.avatars.clear();
    
    // Clear controllers
    this.controllers = [];
    
    // Mark as not initialized
    this.initialized = false;
  }
  
  /**
   * Dispose of scene node and all children
   * @param {Object} node - Scene node to dispose
   */
  _disposeNode(node) {
    if (!node) return;
    
    if (node.geometry) {
      node.geometry.dispose();
    }
    
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach(material => material.dispose());
      } else {
        node.material.dispose();
      }
    }
    
    if (node.children) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        this._disposeNode(node.children[i]);
        node.remove(node.children[i]);
      }
    }
  }
}

// Create singleton instance
const webXRScene = new WebXRScene();

export default webXRScene;