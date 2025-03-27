/**
 * WebXR Manager - Handles WebXR API interactions
 */
class WebXRManager {
    constructor() {
      this.device = null;
      this.session = null;
      this.referenceSpace = null;
      this.xrCanvas = null;
      this.gl = null;
      this.frameOfRef = null;
      this.animationFrame = null;
      this.isPresenting = false;
      this.controllers = [];
      this.eventListeners = {};
      this.isAvailable = false;
      
      // Check if WebXR is available in this browser
      this._checkAvailability();
    }
    
    /**
     * Check if WebXR is available in the browser
     */
    async _checkAvailability() {
      this.isAvailable = ('xr' in navigator);
      
      if (this.isAvailable) {
        try {
          // Check if immersive-vr mode is supported
          this.isAvailable = await navigator.xr.isSessionSupported('immersive-vr');
        } catch (err) {
          console.error('Error checking WebXR availability:', err);
          this.isAvailable = false;
        }
      }
      
      // Trigger event if listeners are set
      if (this.eventListeners.availabilitychange) {
        this.eventListeners.availabilitychange.forEach(callback => {
          callback(this.isAvailable);
        });
      }
    }
    
    /**
     * Initialize WebXR with a canvas element
     * @param {HTMLCanvasElement} canvas - The canvas element to use for WebXR
     * @param {Object} options - Additional options for initialization
     */
    async initialize(canvas, options = {}) {
      if (!this.isAvailable) {
        throw new Error('WebXR is not available in this browser');
      }
      
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error('A valid canvas element is required');
      }
      
      this.xrCanvas = canvas;
      
      // Get WebGL context
      const glAttributes = {
        alpha: true,
        antialias: true,
        xrCompatible: true,
        ...options.glAttributes
      };
      
      // Try to get WebGL2 first, then fall back to WebGL
      this.gl = canvas.getContext('webgl2', glAttributes) ||
                canvas.getContext('webgl', glAttributes);
      
      if (!this.gl) {
        throw new Error('WebGL is not supported or enabled in this browser');
      }
      
      // Make it compatible with WebXR
      await this.gl.makeXRCompatible();
      
      return this;
    }
    
    /**
     * Start a WebXR session
     * @param {Object} options - Session options
     */
    async startSession(options = {}) {
      if (!this.isAvailable || !this.gl) {
        throw new Error('WebXR not available or not initialized');
      }
      
      try {
        const sessionOptions = {
          requiredFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
          optionalFeatures: ['dom-overlay'],
          ...options
        };
        
        // If DOM overlay is requested, set the HTML element
        if (options.domOverlay && sessionOptions.optionalFeatures.includes('dom-overlay')) {
          sessionOptions.domOverlay = { root: options.domOverlay };
        }
        
        // Request a new XR session
        this.session = await navigator.xr.requestSession('immersive-vr', sessionOptions);
        
        // Configure the WebGL layer
        const xrLayer = new XRWebGLLayer(this.session, this.gl);
        await this.session.updateRenderState({
          baseLayer: xrLayer,
          depthFar: options.depthFar || 1000,
          depthNear: options.depthNear || 0.1,
        });
        
        // Get a reference space
        this.referenceSpace = await this.session.requestReferenceSpace('local-floor');
        
        // Setup controllers
        await this._setupControllers();
        
        // Begin the render loop
        this.isPresenting = true;
        this.session.addEventListener('end', () => {
          this._onSessionEnded();
        });
        
        this._startRenderLoop();
        
        // Trigger event
        if (this.eventListeners.sessionstart) {
          this.eventListeners.sessionstart.forEach(callback => {
            callback(this.session);
          });
        }
        
        return true;
      } catch (err) {
        console.error('Error starting WebXR session:', err);
        throw err;
      }
    }
    
    /**
     * End the current WebXR session
     */
    async endSession() {
      if (this.session) {
        await this.session.end();
      }
    }
    
    /**
     * Handle session end
     */
    _onSessionEnded() {
      this.isPresenting = false;
      if (this.animationFrame) {
        this.session.cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
      
      this.session = null;
      this.referenceSpace = null;
      this.controllers = [];
      
      // Trigger event
      if (this.eventListeners.sessionend) {
        this.eventListeners.sessionend.forEach(callback => {
          callback();
        });
      }
    }
    
    /**
     * Set up controllers for WebXR
     */
    async _setupControllers() {
      if (!this.session) return;
      
      // Check if controllers are available
      try {
        const inputSources = this.session.inputSources;
        
        // Create controller for each input source
        for (let i = 0; i < inputSources.length; i++) {
          const inputSource = inputSources[i];
          this.controllers.push({
            inputSource,
            gamepad: inputSource.gamepad,
            handedness: inputSource.handedness, // 'left' or 'right'
            targetRaySpace: inputSource.targetRaySpace,
            gripSpace: inputSource.gripSpace,
            targetRayPose: null,
            gripPose: null
          });
        }
        
        // Listen for controller-related events
        this.session.addEventListener('inputsourceschange', (event) => {
          this._onInputSourcesChange(event);
        });
      } catch (e) {
        console.warn('Error setting up controllers:', e);
      }
    }
    
    /**
     * Handle changes to input sources (controllers)
     */
    _onInputSourcesChange(event) {
      // Handle added input sources
      for (const inputSource of event.added) {
        this.controllers.push({
          inputSource,
          gamepad: inputSource.gamepad,
          handedness: inputSource.handedness,
          targetRaySpace: inputSource.targetRaySpace,
          gripSpace: inputSource.gripSpace,
          targetRayPose: null,
          gripPose: null
        });
        
        // Trigger event
        if (this.eventListeners.controlleradded) {
          this.eventListeners.controlleradded.forEach(callback => {
            callback(inputSource);
          });
        }
      }
      
      // Handle removed input sources
      for (const inputSource of event.removed) {
        const index = this.controllers.findIndex(
          controller => controller.inputSource === inputSource
        );
        
        if (index !== -1) {
          const removedController = this.controllers[index];
          this.controllers.splice(index, 1);
          
          // Trigger event
          if (this.eventListeners.controllerremoved) {
            this.eventListeners.controllerremoved.forEach(callback => {
              callback(removedController.inputSource);
            });
          }
        }
      }
    }
    
    /**
     * Start the render loop
     */
    _startRenderLoop() {
      if (!this.session) return;
      
      const onFrame = (timestamp, frame) => {
        if (!this.isPresenting) return;
        
        const pose = frame.getViewerPose(this.referenceSpace);
        
        // Update controller poses
        this._updateControllerPoses(frame);
        
        // Trigger render event
        if (this.eventListeners.render) {
          this.eventListeners.render.forEach(callback => {
            callback(timestamp, frame, pose, this.controllers);
          });
        }
        
        // Queue the next frame
        this.animationFrame = this.session.requestAnimationFrame(onFrame);
      };
      
      this.animationFrame = this.session.requestAnimationFrame(onFrame);
    }
    
    /**
     * Update controller poses for the current frame
     */
    _updateControllerPoses(frame) {
      if (!this.controllers.length) return;
      
      for (const controller of this.controllers) {
        // Get target ray pose (pointer)
        if (controller.targetRaySpace) {
          controller.targetRayPose = frame.getPose(
            controller.targetRaySpace,
            this.referenceSpace
          );
        }
        
        // Get grip pose (hand)
        if (controller.gripSpace) {
          controller.gripPose = frame.getPose(
            controller.gripSpace,
            this.referenceSpace
          );
        }
        
        // Update gamepad state if available
        controller.gamepad = controller.inputSource.gamepad;
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
     * Check if WebXR is available
     * @returns {boolean} - Whether WebXR is available
     */
    isWebXRAvailable() {
      return this.isAvailable;
    }
    
    /**
     * Get controller data
     * @param {string} handedness - Which hand ('left' or 'right')
     * @returns {Object|null} - Controller data
     */
    getController(handedness) {
      return this.controllers.find(c => c.handedness === handedness) || null;
    }
  }
  
  // Create singleton instance
  const webXRManager = new WebXRManager();
  
  export default webXRManager;