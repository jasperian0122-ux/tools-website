/* ============================
   Font Preview Logic
   ============================ */

// DOM Elements
const fontText = document.getElementById('font-text');
const fontSelect = document.getElementById('font-select');
const fontSizeSlider = document.getElementById('font-size-slider');
const fontSizeDisplay = document.getElementById('font-size');
const fontPreview = document.getElementById('font-preview');
const cssCode = document.getElementById('css-code');
const copyCssBtn = document.getElementById('copy-css');

// Initialize
fontSizeDisplay.textContent = fontSizeSlider.value;
updateFontPreview();

// Font size slider
fontSizeSlider.addEventListener('input', () => {
  const size = fontSizeSlider.value;
  fontSizeDisplay.textContent = size;
  updateFontPreview();
});

// Text input - debounced update
let timeoutId;
fontText.addEventListener('input', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(updateFontPreview, 300);
});

// Font family selector
fontSelect.addEventListener('change', updateFontPreview);

// Update font preview
function updateFontPreview() {
  const text = fontText.value || 'WorkBuddy';
  const family = fontSelect.value;
  const size = parseInt(fontSizeSlider.value);
  
  // Update preview text
  fontPreview.textContent = text;
  fontPreview.style.fontFamily = family;
  fontPreview.style.fontSize = size + 'px';
  
  // Generate CSS code
  const css = `font-family: "${family}";\nfont-size: ${size}px;`;
  cssCode.textContent = css;
}

// Copy CSS to clipboard
copyCssBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(cssCode.textContent).then(() => {
    const originalText = copyCssBtn.textContent;
    copyCssBtn.textContent = '已复制!';
    setTimeout(() => {
      copyCssBtn.textContent = originalText;
    }, 2000);
  });
});