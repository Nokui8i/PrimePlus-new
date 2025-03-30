interface XRSystem {
  isSessionSupported(mode: 'immersive-vr' | 'immersive-ar'): Promise<boolean>;
}

interface Navigator {
  xr?: XRSystem;
} 