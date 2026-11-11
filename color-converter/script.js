/* ============================
   Color Converter Logic
   ============================ */

// DOM Elements
const tabs = document.querySelectorAll('.tab');
const inputSections = document.querySelectorAll('.input-section');
const inputR = document.getElementById('input-r');
const inputG = document.getElementById('input-g');
const inputB = document.getElementById('input-b');
const inputHex = document.getElementById('input-hex');
const inputH = document.getElementById('input-h');
const inputS = document.getElementById('input-s');
const inputL = document.getElementById('input-l');
const inputHSV = document.getElementById('input-hsv');
const inputSat = document.getElementById('input-sat');
const inputVal = document.getElementById('input-val');
const colorSquare = document.getElementById('color-square');
const colorHex = document.getElementById('color-hex');
const displayHex = document.getElementById('display-hex');
const copyHexBtn = document.getElementById('copy-hex');
const copyRgbBtn = document.getElementById('copy-rgb');

// Initialize
tabs[0].classList.add('active');
updateColorDisplay();

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding input section
    const mode = tab.dataset.mode;
    inputSections.forEach(section => {
      section.style.display = 'none';
    });
    // We'll handle visibility via the input update functions
    
    updateColorDisplay();
  });
});

// Update color display based on inputs
function updateColorDisplay() {
  // Get current mode
  const activeTab = document.querySelector('.tab.active');
  const mode = activeTab ? activeTab.dataset.mode : 'rgb';
  
  let r, g, b, hex, h, s, l, hsvH, hsvS, hsvV;
  
  // Convert based on active mode
  if (mode === 'rgb') {
    r = parseInt(inputR.value) || 0;
    g = parseInt(inputG.value) || 0;
    b = parseInt(inputB.value) || 0;
    hex = rgbToHex(r, g, b);
    [h, s, l] = rgbToHsl(r, g, b);
    [hsvH, hsvS, hsvV] = rgbToHsv(r, g, b);
  } else if (mode === 'hex') {
    const hexVal = inputHex.value.replace('#', '') || 'FF0000';
    if (hexVal.length === 6) {
      r = parseInt(hexVal.substring(0, 2), 16);
      g = parseInt(hexVal.substring(2, 4), 16);
      b = parseInt(hexVal.substring(4, 6), 16);
    } else {
      r = g = b = 0;
    }
    hex = '#' + hexVal.toUpperCase();
    [h, s, l] = rgbToHsl(r, g, b);
    [hsvH, hsvS, hsvV] = rgbToHsv(r, g, b);
  } else if (mode === 'hsl') {
    [r, g, b] = hslToRgb(parseInt(inputH.value) || 0, parseFloat(inputS.value) || 0, parseFloat(inputL.value) || 0);
    hex = rgbToHex(r, g, b);
    [hsvH, hsvS, hsvV] = rgbToHsv(r, g, b);
  } else if (mode === 'hsv') {
    [r, g, b] = hsvToRgb(parseInt(inputHSV.value) || 0, parseFloat(inputSat.value) || 0, parseFloat(inputVal.value) || 0);
    hex = rgbToHex(r, g, b);
    [h, s, l] = rgbToHsl(r, g, b);
  }
  
  // Update DOM
  // RGB inputs
  inputR.value = r;
  inputG.value = g;
  inputB.value = b;
  
  // HEX
  inputHex.value = hex;
  displayHex.textContent = hex.toUpperCase();
  
  // HSL inputs
  inputH.value = h;
  inputS.value = (s * 100).toFixed(2);
  inputL.value = (l * 100).toFixed(2);
  
  // HSV inputs
  inputHSV.value = hsvH;
  inputSat.value = (hsvS * 100).toFixed(2);
  inputVal.value = (hsvV * 100).toFixed(2);
  
  // Color display
  colorSquare.style.backgroundColor = hex;
  colorHex.textContent = hex.toUpperCase();
}

// Helper functions

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [Math.round(h * 360), s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  
  h /= 360; s /= 100; l /= 100;
  
  const hue2rgb = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  
  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [Math.round(h * 360), s, v];
}

function hsvToRgb(h, s, v) {
  h /= 360; s /= 100; v /= 100;
  
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  
  let r, g, b;
  
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Input event listeners - RGB
[inputR, inputG, inputB].forEach(input => {
  input.addEventListener('change', updateColorDisplay);
  input.addEventListener('input', updateColorDisplay);
});

// HEX input
inputHex.addEventListener('change', updateColorDisplay);
inputHex.addEventListener('input', updateColorDisplay);

// HSL inputs
[inputH, inputS, inputL].forEach(input => {
  input.addEventListener('change', updateColorDisplay);
  input.addEventListener('input', updateColorDisplay);
});

// HSV inputs
[inputHSV, inputSat, inputVal].forEach(input => {
  input.addEventListener('change', updateColorDisplay);
  input.addEventListener('input', updateColorDisplay);
});

// Copy to clipboard
copyHexBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(displayHex.textContent).then(() => {
    const originalText = copyHexBtn.textContent;
    copyHexBtn.textContent = '已复制!';
    setTimeout(() => {
      copyHexBtn.textContent = originalText;
    }, 2000);
  });
});

copyRgbBtn.addEventListener('click', () => {
  const rgbText = `${inputR.value}, ${inputG.value}, ${inputB.value}`;
  navigator.clipboard.writeText(rgbText).then(() => {
    const originalText = copyRgbBtn.textContent;
    copyRgbBtn.textContent = '已复制!';
    setTimeout(() => {
      copyRgbBtn.textContent = originalText;
    }, 2000);
  });
});

// Enter key handling
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      updateColorDisplay();
    }
  });
});