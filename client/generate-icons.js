const fs = require('fs');
const path = require('path');

// Simple function to create a colored square PNG icon
function createIcon(size, outputPath) {
    // Create a simple PNG data URL for a colored square
    const canvas = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.15}"/>
      <g transform="translate(${size / 2}, ${size / 2})">
        <circle r="${size * 0.25}" fill="#ffffff" opacity="0.9"/>
        <path d="M ${-size * 0.15} ${-size * 0.1} L ${-size * 0.15} ${size * 0.1} M ${size * 0.15} ${-size * 0.1} L ${size * 0.15} ${size * 0.1} M ${-size * 0.1} ${-size * 0.15} L ${size * 0.1} ${-size * 0.15} M ${-size * 0.1} ${size * 0.15} L ${size * 0.1} ${size * 0.15}" 
              stroke="#0f172a" stroke-width="${size * 0.02}" stroke-linecap="round"/>
      </g>
    </svg>
  `;

    fs.writeFileSync(outputPath, canvas);
    console.log(`Created ${outputPath}`);
}

// Create icons
const publicDir = path.join(__dirname, 'public');
createIcon(192, path.join(publicDir, 'icon-192x192.svg'));
createIcon(512, path.join(publicDir, 'icon-512x512.svg'));

console.log('Icons created successfully!');
