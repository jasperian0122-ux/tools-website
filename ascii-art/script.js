/* ============================
   ASCII Art Generator Logic
   ============================ */

// DOM Elements
const imageInput = document.getElementById('image-input');
const asciiOutput = document.getElementById('ascii-output');
const densitySelect = document.getElementById('density-select');
const charsetSelect = document.getElementById('charset-select');
const sizeInput = document.getElementById('size-input');
const copyBtn = document.querySelector('.copy-btn');
const downloadBtn = document.querySelector('.download-btn');

// Character sets for different densities
const charSets = {
  dense: '@WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`\' .',
  normal: '@%#*+=-:. ',
  sparse: ' .:-=#*+'
};

// Current charset
let currentChars = charSets.dense;

// Image to ASCII conversion
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Set canvas size
      const size = parseInt(sizeInput.value);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate dimensions maintaining aspect ratio
      // ASCII characters are roughly 2:1 width:height ratio
      const aspectRatio = img.height / img.width;
      canvas.width = size * 2;  // Width adjusted for ASCII ratio
      canvas.height = size * aspectRatio * 2;  // Height adjusted
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Get pixel data and convert to ASCII
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      let asciiArt = '';
      
      for (let y = 0; y < pixels.height; y++) {
        for (let x = 0; x < pixels.width; x++) {
          const i = (y * pixels.width + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          // Calculate grayscale (only if opaque enough)
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          
          if (a < 128) {
            // Transparent - use space
            asciiArt += ' ';
          } else {
            // Map brightness to character
            const charIndex = Math.floor((brightness / 255) * (currentChars.length - 1));
            asciiArt += currentChars.charAt(charIndex);
          }
        }
        // Add newline at end of each row
        asciiArt += '\n';
      }
      
      // Display result
      asciiOutput.textContent = asciiArt;
    };
    
    img.src = e.target.result;
  };
  
  reader.readAsDataURL(file);
});

// Density selector
densitySelect.addEventListener('change', (e) => {
  currentChars = charSets[e.target.value];
  if (asciiOutput.textContent) {
    // Reconvert with new density - for simplicity, just update the chars
    // In a full implementation, would re-run the conversion
    asciiOutput.style.fontSize = '12px';
  }
});

// Charset selector
charsetSelect.addEventListener('change', (e) => {
  // Could customize character set
  console.log('Charset changed to:', e.target.value);
});

// Size input
sizeInput.addEventListener('input', () => {
  // Will trigger reconversion on next image upload
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
  if (!asciiOutput.textContent) {
    alert('没有可复制的ASCII艺术');
    return;
  }
  
  navigator.clipboard.writeText(asciiOutput.textContent).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '已复制!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
});

// Download functionality
downloadBtn.addEventListener('click', () => {
  if (!asciiOutput.textContent) {
    alert('没有可下载的内容');
    return;
  }
  
  const blob = new Blob([asciiOutput.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ascii-art.txt';
  a.click();
  URL.revokeObjectURL(url);
});