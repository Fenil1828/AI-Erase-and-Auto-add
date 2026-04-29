// Background image functions - Load images from public/backgrounds folder

// Image cache to store loaded images
const imageCache = {};
const imageLoadingPromises = {};

// Preload images at startup
function preloadImage(imageSrc) {
  if (imageCache[imageSrc] || imageLoadingPromises[imageSrc]) {
    return imageLoadingPromises[imageSrc];
  }

  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache[imageSrc] = img;
      resolve(img);
    };
    img.onerror = (err) => {
      console.error('Failed to load image:', imageSrc, err);
      reject(err);
    };
    img.src = imageSrc;
  });

  imageLoadingPromises[imageSrc] = promise;
  return promise;
}

// Get cached image synchronously (call preloadImage first to ensure it's loaded)
function getCachedImage(imageSrc) {
  return imageCache[imageSrc] || null;
}

// Export preload function for external use
export function preloadAllBackgrounds() {
  return Promise.all([
    preloadImage('/backgrounds/WhatsApp Image 2026-04-29 at 7.05.22 PM.jpeg'),
    preloadImage('/backgrounds/WhatsApp Image 2026-04-29 at 7.05.54 PM.jpeg'),
    preloadImage('/backgrounds/WhatsApp Image 2026-04-29 at 7.06.25 PM.jpeg'),
    preloadImage('/backgrounds/WhatsApp Image 2026-04-29 at 7.07.13 PM.jpeg'),
    preloadImage('/backgrounds/WhatsApp Image 2026-04-29 at 7.07.16 PM.jpeg'),
  ]).catch(err => {
    console.error('Error preloading images:', err);
    return [];
  });
}

// Initialize - preload all 5 images at startup
if (typeof window !== 'undefined') {
  preloadAllBackgrounds();
}

export function drawMarbleStudio(ctx, width, height) {
  const imageSrc = '/backgrounds/WhatsApp Image 2026-04-29 at 7.05.22 PM.jpeg';
  const img = getCachedImage(imageSrc);
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    // Fallback while loading
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);
    // Try to load and redraw
    preloadImage(imageSrc).then(() => {
      const loadedImg = getCachedImage(imageSrc);
      if (loadedImg) {
        ctx.drawImage(loadedImg, 0, 0, width, height);
      }
    });
  }
}

export function drawSandyBeach(ctx, width, height) {
  const imageSrc = '/backgrounds/WhatsApp Image 2026-04-29 at 7.05.54 PM.jpeg';
  const img = getCachedImage(imageSrc);
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(0, 0, width, height);
    preloadImage(imageSrc).then(() => {
      const loadedImg = getCachedImage(imageSrc);
      if (loadedImg) {
        ctx.drawImage(loadedImg, 0, 0, width, height);
      }
    });
  }
}

export function drawAutumnLeaves(ctx, width, height) {
  const imageSrc = '/backgrounds/WhatsApp Image 2026-04-29 at 7.06.25 PM.jpeg';
  const img = getCachedImage(imageSrc);
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, 0, width, height);
    preloadImage(imageSrc).then(() => {
      const loadedImg = getCachedImage(imageSrc);
      if (loadedImg) {
        ctx.drawImage(loadedImg, 0, 0, width, height);
      }
    });
  }
}

export function drawLakeDock(ctx, width, height) {
  const imageSrc = '/backgrounds/WhatsApp Image 2026-04-29 at 7.07.13 PM.jpeg';
  const img = getCachedImage(imageSrc);
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, width, height);
    preloadImage(imageSrc).then(() => {
      const loadedImg = getCachedImage(imageSrc);
      if (loadedImg) {
        ctx.drawImage(loadedImg, 0, 0, width, height);
      }
    });
  }
}

export function drawAutumnForest(ctx, width, height) {
  const imageSrc = '/backgrounds/WhatsApp Image 2026-04-29 at 7.07.16 PM.jpeg';
  const img = getCachedImage(imageSrc);
  if (img) {
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(0, 0, width, height);
    preloadImage(imageSrc).then(() => {
      const loadedImg = getCachedImage(imageSrc);
      if (loadedImg) {
        ctx.drawImage(loadedImg, 0, 0, width, height);
      }
    });
  }
}

export function drawGoldenHour(ctx, width, height) {
  // Sky gradient - warm golden sunset
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGrad.addColorStop(0, '#ff8c42');
  skyGrad.addColorStop(0.5, '#ffaa66');
  skyGrad.addColorStop(1, '#ffc400');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.6);

  // Ground - warm sandy
  ctx.fillStyle = '#d4a574';
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  // Sun glow
  ctx.fillStyle = 'rgba(255, 200, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.3, 120, 0, Math.PI * 2);
  ctx.fill();

  // Sun
  ctx.fillStyle = '#ffa500';
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.3, 60, 0, Math.PI * 2);
  ctx.fill();

  // Silhouette trees
  ctx.fillStyle = '#3d2817';
  for (let i = 0; i < 3; i++) {
    const x = width * (0.15 + i * 0.35);
    const h = 120 + Math.random() * 50;
    ctx.fillRect(x, height * 0.5 - h, 25, h);
  }
}

export function drawGardenBloom(ctx, width, height) {
  // Sky - soft blue
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGrad.addColorStop(0, '#87ceeb');
  skyGrad.addColorStop(1, '#e0f6ff');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.6);

  // Garden ground - green grass
  ctx.fillStyle = '#90ee90';
  ctx.fillRect(0, height * 0.6, width, height * 0.4);

  // Flower positions and colors
  const flowers = [
    { x: width * 0.15, y: height * 0.55, colors: ['#ff69b4', '#ff1493'] },
    { x: width * 0.35, y: height * 0.5, colors: ['#ffd700', '#ffaa00'] },
    { x: width * 0.55, y: height * 0.55, colors: ['#ff6b9d', '#ff69b4'] },
    { x: width * 0.75, y: height * 0.52, colors: ['#ff7f50', '#ff6347'] },
    { x: width * 0.9, y: height * 0.55, colors: ['#ffa500', '#ff8c00'] },
  ];

  flowers.forEach(flower => {
    // Petals
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const petalX = flower.x + Math.cos(angle) * 20;
      const petalY = flower.y + Math.sin(angle) * 20;
      ctx.fillStyle = flower.colors[0];
      ctx.beginPath();
      ctx.ellipse(petalX, petalY, 12, 8, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    // Center
    ctx.fillStyle = flower.colors[1];
    ctx.beginPath();
    ctx.arc(flower.x, flower.y, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  // Green stems
  ctx.strokeStyle = '#228b22';
  ctx.lineWidth = 3;
  flowers.forEach(flower => {
    ctx.beginPath();
    ctx.moveTo(flower.x, flower.y);
    ctx.lineTo(flower.x, height * 0.75);
    ctx.stroke();
  });
}

export function drawNightCity(ctx, width, height) {
  // Dark sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0a0a1a');
  skyGrad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Buildings
  const buildings = [
    { x: width * 0.1, y: height * 0.4, w: 80, h: 200 },
    { x: width * 0.3, y: height * 0.2, w: 100, h: 280 },
    { x: width * 0.55, y: height * 0.35, w: 90, h: 220 },
    { x: width * 0.75, y: height * 0.3, w: 85, h: 250 },
  ];

  buildings.forEach(b => {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    
    // Windows with lights
    for (let row = 0; row < b.h / 30; row++) {
      for (let col = 0; col < b.w / 25; col++) {
        if (Math.random() > 0.3) {
          ctx.fillStyle = '#ffff99';
          ctx.fillRect(b.x + col * 25 + 5, b.y + row * 30 + 5, 12, 12);
        }
      }
    }
  });

  // Moon
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.15, 40, 0, Math.PI * 2);
  ctx.fill();

  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.3;
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawMountainView(ctx, width, height) {
  // Sky gradient - misty mountains
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
  skyGrad.addColorStop(0, '#1e90ff');
  skyGrad.addColorStop(1, '#87ceeb');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height * 0.5);

  // Snow ground
  ctx.fillStyle = '#f0f8ff';
  ctx.fillRect(0, height * 0.5, width, height * 0.5);

  // Mountains (layered)
  const mountains = [
    { x: width * 0.1, y: height * 0.5, size: 180, color: '#4a4a4a' },
    { x: width * 0.4, y: height * 0.45, size: 220, color: '#5a5a5a' },
    { x: width * 0.7, y: height * 0.5, size: 190, color: '#4a4a4a' },
  ];

  mountains.forEach(m => {
    // Mountain base
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.moveTo(m.x - m.size / 2, m.y);
    ctx.lineTo(m.x, m.y - m.size);
    ctx.lineTo(m.x + m.size / 2, m.y);
    ctx.closePath();
    ctx.fill();

    // Snow cap
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(m.x, m.y - m.size);
    ctx.lineTo(m.x - m.size / 6, m.y - m.size / 3);
    ctx.lineTo(m.x + m.size / 6, m.y - m.size / 3);
    ctx.closePath();
    ctx.fill();
  });
}

export function drawLuxuryInterior(ctx, width, height) {
  // Wall gradient - dark wood
  const wallGrad = ctx.createLinearGradient(0, 0, width, 0);
  wallGrad.addColorStop(0, '#3d2817');
  wallGrad.addColorStop(0.5, '#4a3728');
  wallGrad.addColorStop(1, '#3d2817');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, width, height);

  // Wood grain texture
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 25; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 40);
    ctx.quadraticCurveTo(width * 0.5, i * 40 + 10, width, i * 40);
    ctx.stroke();
  }

  // Accent lighting - warm glow
  const lightGrad = ctx.createRadialGradient(width * 0.85, height * 0.7, 20, width * 0.85, height * 0.7, 200);
  lightGrad.addColorStop(0, 'rgba(255, 200, 0, 0.6)');
  lightGrad.addColorStop(1, 'rgba(255, 200, 0, 0)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative elements
  ctx.strokeStyle = '#ffc800';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.4;
  for (let i = 0; i < 5; i++) {
    ctx.strokeRect(width * 0.15 + i * 0.15, height * 0.2 + Math.sin(i) * 20, 40, 50);
  }
  ctx.globalAlpha = 1.0;
}

// Helper drawing functions
export function drawTree(ctx, x, y, width, height) {
  ctx.fillStyle = '#228b22';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - width / 2, y + height);
  ctx.lineTo(x + width / 2, y + height);
  ctx.closePath();
  ctx.fill();
}

export function drawFlower(ctx, x, y, size) {
  const colors = ['#ff69b4', '#ff1493', '#ff69b4', '#ffb6c1', '#ffc0cb'];
  
  colors.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    const angle = (i / colors.length) * Math.PI * 2;
    ctx.arc(x + Math.cos(angle) * size, y + Math.sin(angle) * size, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBuilding(ctx, x, y, width, height) {
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(x, y, width, height);
}

export function drawBuildingLights(ctx, x, y, width, height) {
  ctx.fillStyle = '#ffff00';
  const windowWidth = 8;
  const windowHeight = 12;
  const gap = 4;

  for (let i = 0; i < Math.floor(width / (windowWidth + gap)); i++) {
    for (let j = 0; j < Math.floor(height / (windowHeight + gap)); j++) {
      if (Math.random() > 0.3) {
        ctx.fillRect(x + i * (windowWidth + gap) + 2, y + j * (windowHeight + gap) + 2, windowWidth, windowHeight);
      }
    }
  }
}

export function drawMountain(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size, y + size);
  ctx.lineTo(x + size, y + size);
  ctx.closePath();
  ctx.fill();
}

export function drawSnowCap(ctx, x, y, size) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size * 0.4, y + size * 0.5);
  ctx.lineTo(x + size * 0.4, y + size * 0.5);
  ctx.closePath();
  ctx.fill();
}
