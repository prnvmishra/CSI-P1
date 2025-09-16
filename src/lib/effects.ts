export function applyCommands(commands: string[]): { classes: string[], effects: { name: string, options: any }[] } {
  const classes: string[] = [];
  const effects: { name:string, options: any }[] = [];

  commands.forEach(command => {
    const [type, value] = command.split(':');
    switch (type) {
      case 'apply-theme':
        classes.push(`theme-${value}`);
        // Automatically add corresponding effects for themes
        switch (value) {
          case 'zero-gravity':
            effects.push({ name: 'zero-gravity', options: {} });
            break;
          case 'jungle':
            effects.push({ name: 'jungle-floating', options: {} });
            break;
          case 'rain':
            effects.push({ name: 'rain-drops', options: {} });
            break;
          case 'matrix':
            effects.push({ name: 'matrix-code', options: {} });
            break;
          case 'fireball':
            effects.push({ name: 'fire-animation', options: {} });
            break;
          case 'underwater':
            effects.push({ name: 'underwater-bubbles', options: {} });
            break;
          case 'cyberpunk':
            effects.push({ name: 'cyberpunk-glitch', options: {} });
            break;
          case 'retro':
            effects.push({ name: 'retro-scanlines', options: {} });
            break;
          case 'dystopian':
            effects.push({ name: 'dystopian-fog', options: {} });
            break;
          case 'snow':
            effects.push({ name: 'snow-flakes', options: {} });
            break;
        }
        break;
      case 'apply-style':
        classes.push(value);
        break;
      case 'run-effect':
        effects.push({ name: value, options: {} });
        break;
      case 'change-bg-color':
        // This would require dynamic style injection, simplified for now
        break;
    }
  });

  return { classes, effects };
}

// A map to store active intervals for cleanup
const activeEffects = new Map<string, any>();

export function runEffect(name: string, options: { cleanup?: boolean } = {}) {
  switch (name) {
    case 'zero-gravity':
      handleZeroGravity(options.cleanup);
      break;
    case 'float-elements':
      handleFloatElements(options.cleanup);
      break;
    case 'flicker':
      handleFlicker(options.cleanup);
      break;
    case 'sway':
      handleSway(options.cleanup);
      break;
    case 'jungle-floating':
      handleJungleFloating(options.cleanup);
      break;
    case 'rain-drops':
      handleRainDrops(options.cleanup);
      break;
    case 'matrix-code':
      handleMatrixCode(options.cleanup);
      break;
    case 'fire-animation':
      handleFireAnimation(options.cleanup);
      break;
    case 'underwater-bubbles':
      handleUnderwaterBubbles(options.cleanup);
      break;
    case 'cyberpunk-glitch':
      handleCyberpunkGlitch(options.cleanup);
      break;
    case 'retro-scanlines':
      handleRetroScanlines(options.cleanup);
      break;
    case 'dystopian-fog':
      handleDystopianFog(options.cleanup);
      break;
    case 'floating-particles':
      handleFloatingParticles(options.cleanup);
      break;
    case 'neon-glow':
      handleNeonGlow(options.cleanup);
      break;
    case 'color-shift':
      handleColorShift(options.cleanup);
      break;
    case 'wave-effect':
      handleWaveEffect(options.cleanup);
      break;
    case 'sparkle-effect':
      handleSparkleEffect(options.cleanup);
      break;
    case 'snow-flakes':
      handleSnowFlakes(options.cleanup);
      break;
    // Add other effects here
  }
}

function handleZeroGravity(cleanup = false) {
  const key = 'zero-gravity';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Reset all elements
    const allElements = document.querySelectorAll<HTMLElement>('*');
    allElements.forEach(el => {
      el.style.transition = 'transform 0.5s ease';
      el.style.transform = '';
      el.style.position = '';
      el.style.left = '';
      el.style.top = '';
    });
    return;
  }

  if (activeEffects.has(key)) return; // Already running

  // Target ALL elements on the page - like the original working code
  const elements = document.querySelectorAll<HTMLElement>('*');
  
  console.log(`Starting zero-gravity effect on ${elements.length} elements`);

  elements.forEach(el => {
    el.style.position = 'relative';
    el.style.transition = 'transform 1s ease-out';
  });

  const interval = setInterval(() => {
    elements.forEach(el => {
      const newX = Math.random() * 200 - 100; // -100 to 100 (like original)
      const newY = Math.random() * 200 - 100;
      const newRotate = Math.random() * 20 - 10; // -10 to 10 (like original)
      el.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotate}deg)`;
    });
  }, 2000);
  activeEffects.set(key, interval);
}

function handleFloatElements(cleanup = false) {
  const elements = document.querySelectorAll<HTMLElement>('.float-target');
  
  if (cleanup) {
    elements.forEach(el => el.classList.remove('animate-float'));
    return;
  }
  
  elements.forEach(el => el.classList.add('animate-float'));
}

function handleFlicker(cleanup = false) {
    const elements = document.querySelectorAll<HTMLElement>('.z-g-target, h2, button');
    if (cleanup) {
        elements.forEach(el => el.classList.remove('animate-flicker'));
        return;
    }
    elements.forEach(el => el.classList.add('animate-flicker'));
}

function handleSway(cleanup = false) {
    const elements = document.querySelectorAll<HTMLElement>('.float-target');
    if (cleanup) {
        elements.forEach(el => el.classList.remove('animate-sway'));
        return;
    }
    elements.forEach(el => el.classList.add('animate-sway'));
}

function handleJungleFloating(cleanup = false) {
  const key = 'jungle-floating';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Reset all elements
    const allElements = document.querySelectorAll<HTMLElement>('*');
    allElements.forEach(el => {
      el.style.transition = 'transform 0.5s ease';
      el.style.transform = '';
      el.style.position = '';
      el.classList.remove('animate-jungle-float');
    });
    return;
  }

  if (activeEffects.has(key)) return; // Already running

  // Target ALL elements on the page
  const elements = document.querySelectorAll<HTMLElement>('*');

  console.log(`Starting jungle floating effect on ${elements.length} elements`);

  elements.forEach(el => {
    el.style.position = 'relative';
    el.style.transition = 'transform 3s ease-in-out';
    el.classList.add('animate-jungle-float');
  });

  const interval = setInterval(() => {
    elements.forEach(el => {
      // More subtle, natural movement than zero-gravity
      const newX = Math.random() * 60 - 30; // -30 to 30px
      const newY = Math.random() * 40 - 20; // -20 to 20px
      const newRotate = Math.random() * 8 - 4; // -4 to 4 degrees
      el.style.transform = `translate(${newX}px, ${newY}px) rotate(${newRotate}deg)`;
    });
  }, 3000); // Slower interval for more natural movement
  activeEffects.set(key, interval);
}

function handleRainDrops(cleanup = false) {
  console.log('🌧️ handleRainDrops called with cleanup:', cleanup);
  const key = 'rain-drops';
  
  if (cleanup) {
    console.log('🧹 Cleaning up rain drops');
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove rain container
    const rainContainer = document.getElementById('rain-container');
    if (rainContainer) {
      document.body.removeChild(rainContainer);
    }
    return;
  }

  if (activeEffects.has(key)) {
    console.log('⚠️ Rain drops already running');
    return;
  }

  console.log('🚀 Starting rain drops effect'); // Already running

  // Create rain container
  const rainContainer = document.createElement('div');
  rainContainer.id = 'rain-container';
  rainContainer.style.position = 'fixed';
  rainContainer.style.top = '0';
  rainContainer.style.left = '0';
  rainContainer.style.width = '100%';
  rainContainer.style.height = '100%';
  rainContainer.style.pointerEvents = 'none';
  rainContainer.style.zIndex = '1';
  rainContainer.style.overflow = 'hidden';
  
  document.body.appendChild(rainContainer);

  // Create continuous rain drops
  const interval = setInterval(() => {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    
    // Random position and properties
    drop.style.position = 'absolute';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.top = '-10px';
    drop.style.width = '2px';
    drop.style.height = `${20 + Math.random() * 30}px`;
    drop.style.backgroundColor = 'rgba(173, 216, 230, 0.6)';
    drop.style.borderRadius = '1px';
    
    rainContainer.appendChild(drop);
    
    // Animate drop falling
    const fallDuration = 1000 + Math.random() * 2000;
    drop.style.transition = `transform ${fallDuration}ms linear`;
    drop.style.transform = `translateY(calc(100vh + 50px))`;
    
    // Remove after animation
    setTimeout(() => {
      if (drop.parentNode) {
        rainContainer.removeChild(drop);
      }
    }, fallDuration);
    
    // Add splash effect occasionally
    if (Math.random() < 0.3) {
      setTimeout(() => {
        const splash = document.createElement('div');
        splash.className = 'rain-splash';
        splash.style.position = 'absolute';
        splash.style.left = drop.style.left;
        splash.style.top = 'calc(100vh - 20px)';
        splash.style.width = '8px';
        splash.style.height = '8px';
        splash.style.borderRadius = '50%';
        splash.style.backgroundColor = 'rgba(173, 216, 230, 0.4)';
        splash.style.transform = 'scale(0)';
        splash.style.transition = 'transform 0.3s ease-out';
        
        rainContainer.appendChild(splash);
        
        setTimeout(() => {
          splash.style.transform = 'scale(2)';
      splash.style.opacity = '0';
      
      setTimeout(() => {
            if (splash.parentNode) {
              rainContainer.removeChild(splash);
            }
          }, 300);
        }, 50);
      }, fallDuration - 200);
    }
  }, 50); // Create new drops every 50ms
  
  activeEffects.set(key, interval);
}

function handleMatrixCode(cleanup = false) {
  const key = 'matrix-code';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove matrix container
    const matrixContainer = document.getElementById('matrix-container');
    if (matrixContainer) {
      document.body.removeChild(matrixContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return; // Already running

  // Create matrix container
  const matrixContainer = document.createElement('div');
  matrixContainer.id = 'matrix-container';
  matrixContainer.style.position = 'fixed';
  matrixContainer.style.top = '0';
  matrixContainer.style.left = '0';
  matrixContainer.style.width = '100%';
  matrixContainer.style.height = '100%';
  matrixContainer.style.pointerEvents = 'none';
  matrixContainer.style.zIndex = '1';
  matrixContainer.style.overflow = 'hidden';
  matrixContainer.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)';
  
  document.body.appendChild(matrixContainer);

  // Create matrix code columns
  const columns = 30;
  const matrixColumns = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
  
  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-code-column';
    column.style.position = 'absolute';
    column.style.top = '0';
    column.style.left = `${(i / columns) * 100}%`;
    column.style.width = `${100 / columns}%`;
    column.style.height = '100%';
    column.style.color = 'rgba(0, 255, 0, 0.8)';
    column.style.fontSize = '12px';
    column.style.fontFamily = 'monospace';
    column.style.whiteSpace = 'pre';
    column.style.lineHeight = '1.2';
    column.style.textShadow = '0 0 5px rgba(0, 255, 0, 0.5)';
    
    matrixContainer.appendChild(column);
    matrixColumns.push({
      element: column,
      chars: '',
      speed: 30 + Math.random() * 70,
      lastUpdate: 0,
      fadeSpeed: 0.05 + Math.random() * 0.05
    });
  }
  
  // Animation loop
  const interval = setInterval(() => {
    const now = Date.now();
    
    matrixColumns.forEach(col => {
      if (now - col.lastUpdate > col.speed) {
        // Add a new character at the top
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        col.chars = randomChar + '\n' + col.chars.slice(0, 50); // Limit length
        
        // Create gradient effect by varying opacity
        let gradientText = '';
        const lines = col.chars.split('\n');
        lines.forEach((line, index) => {
          const opacity = Math.max(0, 1 - (index * col.fadeSpeed));
          const color = `rgba(0, 255, 0, ${opacity})`;
          gradientText += `<span style="color: ${color}">${line}</span>\n`;
        });
        
        col.element.innerHTML = gradientText;
        col.lastUpdate = now;
      }
    });
  }, 30);
  
  activeEffects.set(key, interval);
}

function handleFireAnimation(cleanup = false) {
  const key = 'fire-animation';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove fire container
    const fireContainer = document.getElementById('fire-container');
    if (fireContainer) {
      document.body.removeChild(fireContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return; // Already running

  // Create fire container
  const fireContainer = document.createElement('div');
  fireContainer.id = 'fire-container';
  fireContainer.style.position = 'fixed';
  fireContainer.style.bottom = '0';
  fireContainer.style.left = '0';
  fireContainer.style.width = '100%';
  fireContainer.style.height = '100%';
  fireContainer.style.pointerEvents = 'none';
  fireContainer.style.zIndex = '1';
  fireContainer.style.overflow = 'hidden';
  
  document.body.appendChild(fireContainer);

  // Create fire particles
  const interval = setInterval(() => {
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    
    // Position at bottom of screen with some randomness
    particle.style.position = 'absolute';
    particle.style.bottom = '0';
    particle.style.left = `${Math.random() * 100}%`;
    
    // Size and appearance
    const size = 8 + Math.random() * 15;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    
    // Color - orange/red gradient with more variation
    const hue = 5 + Math.random() * 35; // 5-40 (red to orange)
    const saturation = 85 + Math.random() * 15; // 85-100%
    const lightness = 45 + Math.random() * 25; // 45-70%
    particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    particle.style.boxShadow = `0 0 ${size/2}px hsl(${hue}, ${saturation}%, ${lightness+15}%)`;
    
    // Other styles
    particle.style.opacity = '0.9';
    
    fireContainer.appendChild(particle);
    
    // Animate upward with swaying motion
    const duration = 1200 + Math.random() * 1800;
    const distance = 150 + Math.random() * 400;
    const swayAmount = 20 + Math.random() * 40;
    
    particle.style.transition = `all ${duration/1000}s ease-out`;
    particle.style.transform = `translateY(-${distance}px) translateX(${Math.random() * swayAmount - swayAmount/2}px) scale(0.1)`;
    particle.style.opacity = '0';
    
    // Remove after animation
    setTimeout(() => {
      if (particle.parentNode) {
        fireContainer.removeChild(particle);
      }
    }, duration);
    
  }, 80); // Create a new particle every 80ms
  
  activeEffects.set(key, interval);
}

function handleUnderwaterBubbles(cleanup = false) {
  const key = 'underwater-bubbles';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    const bubbleContainer = document.getElementById('bubble-container');
    if (bubbleContainer) {
      document.body.removeChild(bubbleContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  const bubbleContainer = document.createElement('div');
  bubbleContainer.id = 'bubble-container';
  bubbleContainer.style.position = 'fixed';
  bubbleContainer.style.bottom = '0';
  bubbleContainer.style.left = '0';
  bubbleContainer.style.width = '100%';
  bubbleContainer.style.height = '100%';
  bubbleContainer.style.pointerEvents = 'none';
  bubbleContainer.style.zIndex = '1';
  bubbleContainer.style.overflow = 'hidden';
  
  document.body.appendChild(bubbleContainer);

  const interval = setInterval(() => {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    bubble.style.position = 'absolute';
    bubble.style.bottom = '0';
    bubble.style.left = `${Math.random() * 100}%`;
    
    const size = 5 + Math.random() * 20;
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.borderRadius = '50%';
    bubble.style.backgroundColor = 'rgba(173, 216, 230, 0.3)';
    bubble.style.border = '1px solid rgba(173, 216, 230, 0.5)';
    
    bubbleContainer.appendChild(bubble);
    
    const duration = 2000 + Math.random() * 3000;
    const distance = 200 + Math.random() * 400;
    const swayAmount = 30 + Math.random() * 50;
    
    bubble.style.transition = `all ${duration/1000}s ease-out`;
    bubble.style.transform = `translateY(-${distance}px) translateX(${Math.random() * swayAmount - swayAmount/2}px) scale(0.2)`;
    bubble.style.opacity = '0';
    
    setTimeout(() => {
      if (bubble.parentNode) {
        bubbleContainer.removeChild(bubble);
      }
    }, duration);
    
  }, 200);
  
  activeEffects.set(key, interval);
}

function handleCyberpunkGlitch(cleanup = false) {
  const key = 'cyberpunk-glitch';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    const glitchContainer = document.getElementById('glitch-container');
    if (glitchContainer) {
      document.body.removeChild(glitchContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  const glitchContainer = document.createElement('div');
  glitchContainer.id = 'glitch-container';
  glitchContainer.style.position = 'fixed';
  glitchContainer.style.top = '0';
  glitchContainer.style.left = '0';
  glitchContainer.style.width = '100%';
  glitchContainer.style.height = '100%';
  glitchContainer.style.pointerEvents = 'none';
  glitchContainer.style.zIndex = '1';
  glitchContainer.style.overflow = 'hidden';
  
  document.body.appendChild(glitchContainer);

  const interval = setInterval(() => {
    const glitch = document.createElement('div');
    glitch.className = 'glitch-line';
    
    glitch.style.position = 'absolute';
    glitch.style.top = `${Math.random() * 100}%`;
    glitch.style.left = '0';
    glitch.style.width = '100%';
    glitch.style.height = '2px';
    glitch.style.background = 'linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent)';
    glitch.style.opacity = '0.8';
    
    glitchContainer.appendChild(glitch);
    
    setTimeout(() => {
      glitch.style.transition = 'opacity 0.1s ease-out';
      glitch.style.opacity = '0';
      
      setTimeout(() => {
        if (glitch.parentNode) {
          glitchContainer.removeChild(glitch);
        }
      }, 100);
    }, 50);
    
  }, 300);
  
  activeEffects.set(key, interval);
}

function handleRetroScanlines(cleanup = false) {
  const key = 'retro-scanlines';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    const scanlineContainer = document.getElementById('scanline-container');
    if (scanlineContainer) {
      document.body.removeChild(scanlineContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  const scanlineContainer = document.createElement('div');
  scanlineContainer.id = 'scanline-container';
  scanlineContainer.style.position = 'fixed';
  scanlineContainer.style.top = '0';
  scanlineContainer.style.left = '0';
  scanlineContainer.style.width = '100%';
  scanlineContainer.style.height = '100%';
  scanlineContainer.style.pointerEvents = 'none';
  scanlineContainer.style.zIndex = '1';
  scanlineContainer.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)';
  
  document.body.appendChild(scanlineContainer);

  const interval = setInterval(() => {
    const scanline = document.createElement('div');
    scanline.className = 'scanline';
    
    scanline.style.position = 'absolute';
    scanline.style.top = '0';
    scanline.style.left = '0';
    scanline.style.width = '100%';
    scanline.style.height = '2px';
    scanline.style.background = 'linear-gradient(90deg, transparent, rgba(0,255,0,0.8), transparent)';
    scanline.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';
    
    scanlineContainer.appendChild(scanline);
    
    scanline.style.transition = 'transform 0.1s linear';
    scanline.style.transform = 'translateY(100vh)';
    
    setTimeout(() => {
      if (scanline.parentNode) {
        scanlineContainer.removeChild(scanline);
      }
    }, 100);
    
  }, 100);
  
  activeEffects.set(key, interval);
}

function handleDystopianFog(cleanup = false) {
  const key = 'dystopian-fog';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    const fogContainer = document.getElementById('fog-container');
    if (fogContainer) {
      document.body.removeChild(fogContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  const fogContainer = document.createElement('div');
  fogContainer.id = 'fog-container';
  fogContainer.style.position = 'fixed';
  fogContainer.style.top = '0';
  fogContainer.style.left = '0';
  fogContainer.style.width = '100%';
  fogContainer.style.height = '100%';
  fogContainer.style.pointerEvents = 'none';
  fogContainer.style.zIndex = '1';
  fogContainer.style.overflow = 'hidden';
  
  document.body.appendChild(fogContainer);

  const interval = setInterval(() => {
    const fog = document.createElement('div');
    fog.className = 'fog-particle';
    
    fog.style.position = 'absolute';
    fog.style.bottom = '0';
    fog.style.left = `${Math.random() * 100}%`;
    
    const size = 50 + Math.random() * 100;
    fog.style.width = `${size}px`;
    fog.style.height = `${size}px`;
    fog.style.borderRadius = '50%';
    fog.style.backgroundColor = 'rgba(128, 128, 128, 0.1)';
    fog.style.filter = 'blur(20px)';
    
    fogContainer.appendChild(fog);
    
    const duration = 3000 + Math.random() * 4000;
    const distance = 100 + Math.random() * 200;
    
    fog.style.transition = `all ${duration/1000}s ease-out`;
    fog.style.transform = `translateY(-${distance}px) scale(2)`;
    fog.style.opacity = '0';
    
    setTimeout(() => {
      if (fog.parentNode) {
        fogContainer.removeChild(fog);
      }
    }, duration);
    
  }, 500);
  
  activeEffects.set(key, interval);
}

function handleFloatingParticles(cleanup = false) {
  console.log('🎯 handleFloatingParticles called with cleanup:', cleanup);
  const key = 'floating-particles';
  
  if (cleanup) {
    console.log('🧹 Cleaning up bounce animation');
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove bounce animation from all elements
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.animation = '';
        el.classList.remove('bounce-animation');
      }
    });
    return;
  }

  if (activeEffects.has(key)) {
    console.log('⚠️ Bounce effect already running');
    return;
  }

  console.log('🚀 Adding bounce animation to all elements');
  // Add bounce animation to all elements
  const elements = document.querySelectorAll('*');
  console.log('📊 Found', elements.length, 'elements to animate');
  elements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.classList.add('bounce-animation');
    }
  });

  // Store the effect
  activeEffects.set(key, true);
  console.log('✅ Bounce effect applied successfully');
}

function handleNeonGlow(cleanup = false) {
  const key = 'neon-glow';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove glow effects from elements
    document.querySelectorAll('.neon-glow').forEach(el => {
      el.classList.remove('neon-glow');
    });
    return;
  }

  if (activeEffects.has(key)) return;

  // Add neon glow to various elements
  const elements = document.querySelectorAll('h1, h2, h3, button, .card');
  elements.forEach(el => {
    el.classList.add('neon-glow');
  });

  // Add CSS for neon glow effect
  if (!document.getElementById('neon-glow-styles')) {
    const style = document.createElement('style');
    style.id = 'neon-glow-styles';
    style.textContent = `
      .neon-glow {
        text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff;
        box-shadow: 0 0 10px #00ffff, inset 0 0 10px #00ffff;
        animation: neon-flicker 2s infinite alternate;
      }
      
      @keyframes neon-flicker {
        0%, 18%, 22%, 25%, 53%, 57%, 100% {
          text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff, 0 0 20px #00ffff;
          box-shadow: 0 0 10px #00ffff, inset 0 0 10px #00ffff;
        }
        20%, 24%, 55% {
          text-shadow: none;
          box-shadow: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  activeEffects.set(key, true);
}

function handleColorShift(cleanup = false) {
  const key = 'color-shift';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove color shift styles
    const style = document.getElementById('color-shift-styles');
    if (style) {
      document.head.removeChild(style);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  // Add CSS for color shift effect
  const style = document.createElement('style');
  style.id = 'color-shift-styles';
  style.textContent = `
    body {
      animation: color-shift 3s ease-in-out infinite;
    }
    
    @keyframes color-shift {
      0% { filter: hue-rotate(0deg); }
      25% { filter: hue-rotate(90deg); }
      50% { filter: hue-rotate(180deg); }
      75% { filter: hue-rotate(270deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  activeEffects.set(key, true);
}

function handleWaveEffect(cleanup = false) {
  const key = 'wave-effect';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    const waveContainer = document.getElementById('wave-container');
    if (waveContainer) {
      document.body.removeChild(waveContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  const waveContainer = document.createElement('div');
  waveContainer.id = 'wave-container';
  waveContainer.style.position = 'fixed';
  waveContainer.style.bottom = '0';
  waveContainer.style.left = '0';
  waveContainer.style.width = '100%';
  waveContainer.style.height = '100px';
  waveContainer.style.pointerEvents = 'none';
  waveContainer.style.zIndex = '1';
  waveContainer.style.overflow = 'hidden';
  
  document.body.appendChild(waveContainer);

  const interval = setInterval(() => {
    const wave = document.createElement('div');
    wave.className = 'wave';
    
    wave.style.position = 'absolute';
    wave.style.bottom = '0';
    wave.style.left = '0';
    wave.style.width = '200%';
    wave.style.height = '100px';
    wave.style.background = 'linear-gradient(45deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3))';
    wave.style.borderRadius = '50%';
    wave.style.transform = 'translateX(-50%)';
    
    waveContainer.appendChild(wave);
    
    wave.style.transition = 'transform 2s ease-out';
    wave.style.transform = 'translateX(-50%) translateY(-50px) scale(1.5)';
    wave.style.opacity = '0';
    
    setTimeout(() => {
      if (wave.parentNode) {
        waveContainer.removeChild(wave);
      }
    }, 2000);
    
  }, 1000);
  
  activeEffects.set(key, interval);
}

function handleSparkleEffect(cleanup = false) {
  const key = 'sparkle-effect';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    const sparkleContainer = document.getElementById('sparkle-container');
    if (sparkleContainer) {
      document.body.removeChild(sparkleContainer);
    }
    return;
  }

  if (activeEffects.has(key)) return;

  const sparkleContainer = document.createElement('div');
  sparkleContainer.id = 'sparkle-container';
  sparkleContainer.style.position = 'fixed';
  sparkleContainer.style.top = '0';
  sparkleContainer.style.left = '0';
  sparkleContainer.style.width = '100%';
  sparkleContainer.style.height = '100%';
  sparkleContainer.style.pointerEvents = 'none';
  sparkleContainer.style.zIndex = '1';
  sparkleContainer.style.overflow = 'hidden';
  
  document.body.appendChild(sparkleContainer);

  const interval = setInterval(() => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    sparkle.style.position = 'absolute';
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    
    const size = 4 + Math.random() * 8;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.backgroundColor = '#ffff00';
    sparkle.style.borderRadius = '50%';
    sparkle.style.boxShadow = '0 0 10px #ffff00';
    sparkle.style.opacity = '1';
    
    sparkleContainer.appendChild(sparkle);
    
    const duration = 1000 + Math.random() * 2000;
    sparkle.style.transition = `all ${duration/1000}s ease-out`;
    sparkle.style.transform = 'scale(0) rotate(360deg)';
    sparkle.style.opacity = '0';
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkleContainer.removeChild(sparkle);
      }
    }, duration);
    
  }, 300);
  
  activeEffects.set(key, interval);
}

function handleSnowFlakes(cleanup = false) {
  const key = 'snow-flakes';
  
  if (cleanup) {
    if (activeEffects.has(key)) {
      clearInterval(activeEffects.get(key));
      activeEffects.delete(key);
    }
    // Remove snow container
    const existingContainer = document.getElementById('snow-container');
    if (existingContainer) {
      existingContainer.remove();
    }
    return;
  }

  if (activeEffects.has(key)) return; // Already running

  // Create snow container
  let snowContainer = document.getElementById('snow-container');
  if (!snowContainer) {
    snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    snowContainer.style.position = 'fixed';
    snowContainer.style.top = '0';
    snowContainer.style.left = '0';
    snowContainer.style.width = '100%';
    snowContainer.style.height = '100%';
    snowContainer.style.pointerEvents = 'none';
    snowContainer.style.zIndex = '1000';
    document.body.appendChild(snowContainer);
  }

  const createSnowFlake = () => {
    const snowflake = document.createElement('div');
    snowflake.style.position = 'absolute';
    snowflake.style.width = Math.random() * 10 + 5 + 'px';
    snowflake.style.height = snowflake.style.width;
    snowflake.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    snowflake.style.borderRadius = '50%';
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    snowflake.style.top = '-10px';
    snowflake.style.pointerEvents = 'none';
    
    // Add subtle shadow
    snowflake.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.5)';
    
    snowContainer.appendChild(snowflake);

    const fallSpeed = Math.random() * 3 + 2; // 2-5 seconds
    const driftAmount = Math.random() * 100 - 50; // -50px to 50px drift
    
    snowflake.style.transition = `transform ${fallSpeed}s linear, opacity ${fallSpeed}s ease-out`;
    
    setTimeout(() => {
      snowflake.style.transform = `translate(${driftAmount}px, ${window.innerHeight + 20}px)`;
      snowflake.style.opacity = '0';
    }, 100);

    setTimeout(() => {
      if (snowflake.parentNode) {
        snowContainer.removeChild(snowflake);
      }
    }, fallSpeed * 1000 + 1000);
  };

  // Create snowflakes periodically
  const interval = setInterval(createSnowFlake, 200);
  activeEffects.set(key, interval);
}

