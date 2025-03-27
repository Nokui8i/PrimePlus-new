const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Array of SVG icons to convert
const icons = [
  'file-icon.svg',
  'pdf-icon.svg'
];

// Convert SVG to PNG
async function convertToPng() {
  try {
    for (const icon of icons) {
      const svgPath = path.join(__dirname, icon);
      const pngPath = path.join(__dirname, icon.replace('.svg', '.png'));
      
      console.log(`Converting ${icon} to PNG...`);
      
      await sharp(svgPath)
        .resize(400, 300)
        .png()
        .toFile(pngPath);
      
      console.log(`Created ${pngPath}`);
    }
    
    console.log('All icons converted successfully!');
  } catch (error) {
    console.error('Error converting icons:', error);
  }
}

// Run the conversion
convertToPng();