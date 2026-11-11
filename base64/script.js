/* ============================
   Base64 Encoder/Decoder Logic
   ============================ */

// Initialize variables
let currentMode = 'encode'; // 'encode' or 'decode'
const fileInput = document.getElementById('file-input');
const downloadBtn = document.querySelector('.download-btn');

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Update mode
    currentMode = btn.dataset.mode === 'encode' ? 'encode' : 'decode';
    
    // Update placeholder
    const textarea = document.getElementById('input-text');
    if (currentMode === 'encode') {
      textarea.placeholder = '输入要编码的文本...';
    } else {
      textarea.placeholder = '输入 Base64 字符串进行解码...';
    }
    
    // Clear output
    document.getElementById('output-text').value = '';
  });
});

// Handle file selection
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    const text = e.target.result;
    document.getElementById('input-text').value = text;
  };
  
  reader.readAsText(file);
});

// Encode/decode function
function processText() {
  const input = document.getElementById('input-text').value;
  const output = document.getElementById('output-text');
  
  if (!input) {
    output.value = '';
    alert('请输入内容');
    return;
  }
  
  let result;
  
  if (currentMode === 'encode') {
    // Encode to Base64
    result = btoa(input);
  } else {
    // Decode from Base64
    try {
      result = atob(input);
    } catch (err) {
      output.value = '错误: 无效的 Base64 字符串';
      return;
    }
  }
  
  output.value = result;
  
  // Show download button for encoded results
  if (currentMode === 'encode') {
    downloadBtn.style.display = 'inline-block';
    downloadBtn.onclick = () => {
      const blob = new Blob([result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'base64-output.txt';
      a.click();
      URL.revokeObjectURL(url);
    };
  } else {
    downloadBtn.style.display = 'none';
  }
}

// Copy to clipboard
document.querySelector('.copy-btn').addEventListener('click', () => {
  const output = document.getElementById('output-text');
  if (!output.value) return;
  
  navigator.clipboard.writeText(output.value).then(() => {
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '已复制!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  });
});

// Enter key to process
document.getElementById('input-text').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    processText();
  }
});