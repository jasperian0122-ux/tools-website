/* ============================
   Code Formatter/Minifier Logic
   ============================ */

// DOM Elements
const languageSelect = document.getElementById('language-select');
const codeInput = document.getElementById('code-input');
const formatButtons = document.querySelectorAll('.format-btn');
const outputTabs = document.querySelectorAll('.output-tab');
const panels = document.querySelectorAll('.panel');
const codeOriginal = document.getElementById('code-original');
const codeResult = document.getElementById('code-result');
const copyBtns = document.querySelectorAll('.panel .copy-btn');
const downloadBtns = document.querySelectorAll('.panel .download-btn');

// Initialize
languageSelect.value = 'html';
updateCode('');

// Format button handling
formatButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const format = btn.dataset.format;
    const language = languageSelect.value;
    const inputCode = codeInput.value;
    
    let result;
    
    switch (format) {
      case 'prettify':
        result = prettyPrintCode(inputCode, language);
        break;
      case 'minify':
        result = minifyCode(inputCode, language);
        break;
      case 'pretty-quick':
        result = prettyQuickCode(inputCode, language);
        break;
      default:
        result = inputCode;
    }
    
    // Display result
    codeResult.textContent = result;
    
    // Switch to result panel
    outputTabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector('.output-tab[data-output="result"]').classList.add('active');
    
    panels.forEach(panel => panel.classList.remove('active'));
    document.getElementById('panel-result').classList.add('active');
  });
}

// Tab switching
outputTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    outputTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tab.dataset.output).classList.add('active');
  });
});

// Copy functionality
copyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const codeEl = btn.previousElementSibling || btn.parentElement.parentElement.querySelector('code');
    if (!codeEl) return;
    
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      const originalText = btn.textContent;
      btn.textContent = '已复制!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });
});

// Download functionality
downloadBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const codeEl = btn.previousElementSibling || btn.parentElement.parentElement.querySelector('code');
    if (!codeEl) return;
    
    const blob = new Blob([codeEl.textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${languageSelect.value}-output-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Code formatting functions

function prettyPrintCode(code, language) {
  // Basic HTML formatting
  if (language === 'html') {
    // Simple HTML pretty print
    return code
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>');
  }
  
  // CSS formatting - add indentation
  if (language === 'css') {
    // Basic CSS pretty print
    let result = code;
    // Add newlines around braces and semicolons
    result = result
      .replace(/;/g, ';\n')
      .replace(/{/g, '{\n')
      .replace(/}/g, '}\n');
    return result;
  }
  
  // JavaScript formatting
  if (language === 'javascript') {
    let result = code;
    result = result
      .replace(/;/g, ';\n')
      .replace(/{/g, '{\n')
      .replace(/}/g, '}\n');
    return result;
  }
  
  return code;
}

function minifyCode(code, language) {
  // HTML minification - remove whitespace
  if (language === 'html') {
    // Remove extra whitespace
    let result = code
      .replace(/\s+</g, '<')  // Remove spaces before <
      .replace(/\s+>/g, '>')  // Remove spaces after >
      .replace(/>\s+</g, '><'); // Remove spaces between tags
    return result;
  }
  
  // CSS minification - remove comments and extra whitespace
  if (language === 'css') {
    let result = code
      /* Remove comments */
      .replace(/\/\*[\s\S]*?\*\//g, '')
      /* Remove trailing whitespace */
      .replace(/\s+\}/g, '}')
      .replace(/\s+\;/g, ';')
      .replace(/\{ /g, '{')
      .replace(/ \}/g, '}')
      /* Collapse multiple whitespaces */
      .replace(/\s+/g, ' ');
    return result;
  }
  
  // JavaScript minification
  if (language === 'javascript') {
    let result = code
      /* Remove single-line comments */
      .replace(/\/\/.*$/gm, '')
      /* Remove multi-line comments */
      .replace(/\/\*[\s\S]*?\*\//g, '')
      /* Remove whitespace around operators */
      .replace(/\s+/g, ' ')
      /* Remove whitespace after { and before } */
      .replace(/\{/g, '{')
      .replace(/\}/g, '}');
    return result;
  }
  
  return code;
}

function prettyQuickCode(code, language) {
  // Middle ground between format and minify
  if (language === 'html' || language === 'css' || language === 'javascript') {
    return code
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  }
  return code;
}

// Update displayed code
function updateCode() {
  const language = languageSelect.value;
  codeOriginal.textContent = codeInput.value;
  codeResult.textContent = codeInput.value;
}

// Event listeners
languageSelect.addEventListener('change', updateCode);
codeInput.addEventListener('input', updateCode);

// Initialize
updateCode();