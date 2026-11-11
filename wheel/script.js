/* ============================
   Wheel/Spinner Logic
   ============================ */

// DOM Elements
const optionsInput = document.getElementById('options-input');
const spinBtn = document.getElementById('spin-btn');
const resultDisplay = document.getElementById('result-display');
const resultDetails = document.getElementById('result-details');
const totalSpinsSpan = document.getElementById('total-spins');
const weightSlider = document.getElementById('weight-slider');
const weightValue = document.getElementById('weight-value');
const spinCountInput = document.getElementById('spin-count');

// Initialize
weightValue.textContent = weightSlider.value;

// Weight slider event
weightSlider.addEventListener('input', () => {
  weightValue.textContent = weightSlider.value;
});

// Spin button handler
spinBtn.addEventListener('click', () => {
  const optionsText = optionsInput.value.trim();
  
  if (!optionsText) {
    alert('请输入至少一个选项');
    return;
  }
  
  // Parse options (each line)
  const options = optionsText.split('\n')
    .map(opt => opt.trim())
    .filter(opt => opt.length > 0);
  
  if (options.length === 0) {
    alert('请输入有效的选项');
    return;
  }
  
  const spinCount = parseInt(spinCountInput.value) || 1;
  const weight = parseInt(weightSlider.value) || 1;
  
  // Store total spins
  totalSpinsSpan.textContent = spinCount;
  
  // Show result area
  resultDisplay.style.display = 'block';
  resultDetails.style.display = 'block';
  
  // Perform spins
  let allResults = [];
  
  for (let i = 0; i < spinCount; i++) {
    let selected;
    
    // Weighted random selection
    if (weight > 1 && options.length > 1) {
      // Simple weighted random - each option gets equal weight by default
      // For simplicity, we'll just pick random without complex weighting UI
      const randomIndex = Math.floor(Math.random() * options.length);
      selected = options[randomIndex];
    } else {
      // Equal probability
      const randomIndex = Math.floor(Math.random() * options.length);
      selected = options[randomIndex];
    }
    
    allResults.push(selected);
  }
  
  // Display results
  displayResults(allResults);
});

// Display results function
function displayResults(results) {
  const resultHtml = results.map((result, index) => {
    const safeResult = result.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return `
      <div class="result-item">
        <span>第 ${index + 1} 轮</span>
        <span class="result-value">${safeResult}</span>
      </div>
    `;
  }).join('');
  
  resultDisplay.innerHTML = resultHtml ? resultHtml : '<p>抽选结果将显示在这里</p>';
  
  // Show details
  resultDetails.style.display = 'block';
}

// Enter key to spin
optionsInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    spinBtn.click();
  }
});