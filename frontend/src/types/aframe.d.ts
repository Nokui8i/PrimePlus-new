declare module 'aframe' {
  const AFRAME: any;
  export default AFRAME;
}

declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': any;
    'a-entity': any;
    'a-camera': any;
    'a-cursor': any;
    'a-sky': any;
    'a-sphere': any;
    'a-text': any;
    'a-videosphere': any;
    'a-light': any;
  }
}

interface Window {
  AFRAME: {
    registerComponent: (name: string, config: any) => void;
  }
} 