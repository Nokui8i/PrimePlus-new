interface VRContentInput {
  title: string;
  description: string;
  type: string;
  isExclusive: boolean;
  price?: number;
  environment?: string;
  hotspots?: Array<{
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    type: string;
    content: string;
  }>;
}

export function validateVRContent(input: VRContentInput): string | null {
  // Validate title
  if (!input.title || input.title.trim().length < 3) {
    return 'Title must be at least 3 characters long';
  }

  // Validate description
  if (!input.description || input.description.trim().length < 10) {
    return 'Description must be at least 10 characters long';
  }

  // Validate type
  const validTypes = ['360-image', '360-video', 'vr-room'];
  if (!validTypes.includes(input.type)) {
    return 'Invalid content type';
  }

  // Validate price for exclusive content
  if (input.isExclusive && (!input.price || input.price <= 0)) {
    return 'Exclusive content must have a valid price';
  }

  // Validate environment for VR rooms
  if (input.type === 'vr-room' && !input.environment) {
    return 'VR rooms must have an environment specified';
  }

  // Validate hotspots
  if (input.hotspots) {
    for (const hotspot of input.hotspots) {
      // Validate position
      if (!hotspot.position || typeof hotspot.position.x !== 'number' ||
          typeof hotspot.position.y !== 'number' || typeof hotspot.position.z !== 'number') {
        return 'Invalid hotspot position';
      }

      // Validate rotation
      if (!hotspot.rotation || typeof hotspot.rotation.x !== 'number' ||
          typeof hotspot.rotation.y !== 'number' || typeof hotspot.rotation.z !== 'number') {
        return 'Invalid hotspot rotation';
      }

      // Validate type
      const validHotspotTypes = ['info', 'link', 'media'];
      if (!validHotspotTypes.includes(hotspot.type)) {
        return 'Invalid hotspot type';
      }

      // Validate content
      if (!hotspot.content || hotspot.content.trim().length === 0) {
        return 'Hotspot content cannot be empty';
      }
    }
  }

  return null;
} 