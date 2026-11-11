/* ============================
   UUID/Random String Generator Logic
   ============================ */

// Mode elements
const modeBtns = document.querySelectorAll('.tab-btn');
const uuidMode = document.getElementById('uuid-mode');
const randomMode = document.getElementById('random-mode');
const batchMode = document.getElementById('batch-mode');

// Initialize first mode
modeBtns[0].classList.add('active');

// Mode switching
modeBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    // Update active state
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Show/hide modes
    uuidMode.classList.toggle('active', index === 0);
    randomMode.classList.toggle('active', index === 1);
    batchMode.classList.toggle('active', index === 2);
  });
});

// Generate UUID v4
document.getElementById('generate-uuid').addEventListener('click', () => {
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  
  const output = document.getElementById('batch-output');
  if (document.getElementById('batch-mode').classList.contains('active')) {
    output.value = uuid;
  } else {
    alert('生成的 UUID: ' + uuid);
  }
});

// Generate random string
function generateRandomString(length, includeNumbers, includeUppercase, includeLowercase) {
  const chars = [];
  if (includeLowercase) chars.push('abcdefghijklmnopqrstuvwxyz');
  if (includeUppercase) chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (includeNumbers) chars.push('0123456789');
  
  const allChars = chars.join('');
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return result;
}

// Random string generator - single
document.getElementById('random-mode').querySelector('.generate-btn').addEventListener('click', () => {
  const length = parseInt(document.getElementById('length-slider').value);
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeUppercase = document.getElementById('include-uppercase').checked;
  const includeLowercase = document.getElementById('include-lowercase').checked;
  
  if (!includeNumbers && !includeUppercase && !includeLowercase) {
    alert('至少勾选一种字符类型');
    return;
  }
  
  const randomStr = generateRandomString(length, includeNumbers, includeUppercase, includeLowercase);
  
  const output = document.getElementById('batch-output');
  if (document.getElementById('batch-mode').classList.contains('active')) {
    output.value = randomStr;
  } else {
    alert('生成的随机字符串: ' + randomStr);
  }
});

// Batch generate
document.getElementById('generate-batch').addEventListener('click', () => {
  const count = parseInt(document.getElementById('batch-count').value);
  const length = parseInt(document.getElementById('length-slider').value);
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeUppercase = document.getElementById('include-uppercase').checked;
  const includeLowercase = document.getElementById('include-lowercase').checked;
  
  if (!includeNumbers && !includeUppercase && !includeLowercase) {
    alert('至少勾选一种字符类型');
    return;
  }
  
  let output = '';
  for (let i = 0; i < count; i++) {
    const randomStr = generateRandomString(length, includeNumbers, includeUppercase, includeLowercase);
    output += randomStr + '\n';
  }
  
  document.getElementById('batch-output').value = output;
});

// Slider + value display
const lengthSlider = document.getElementById('length-slider');
const lengthValue = document.getElementById('length-value');

lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
});

// Copy to clipboard
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const output = btn.previousElementSibling || btn.parentElement.querySelector('textarea');
    if (!output.value) return;
    
    navigator.clipboard.writeText(output.value).then(() => {
      const originalText = btn.textContent;
      btn.textContent = '已复制!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    });
  });
});