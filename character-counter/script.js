/* ============================
   Character Counter Logic
   ============================ */

// DOM Elements
const textInput = document.getElementById('text-input');
const charCount = document.getElementById('char-count');
const charCountNoSpace = document.getElementById('char-count-no-space');
const wordCount = document.getElementById('word-count');
const lineCount = document.getElementById('line-count');
const freqList = document.getElementById('freq-list');
const readTime = document.getElementById('read-time');

// Analyze tabs
const analyzeTabs = document.querySelectorAll('.analysis-tab');
const analysisPanels = document.querySelectorAll('.analysis-panel');

// Real-time counting
function updateCounts() {
  const text = textInput.value || '';
  
  // Character count (with spaces)
  charCount.textContent = text.length;
  
  // Character count (without spaces)
  const withoutSpaces = text.replace(/\s/g, '');
  charCountNoSpace.textContent = withoutSpaces.length;
  
  // Word count
  const words = text.trim() ? text.match(/\b[\u4e00-\u9fa5a-zA-Z0-9]+\b/g) || [] : [];
  wordCount.textContent = words.length;
  
  // Line count
  const lines = text.split('\n').filter(line => line.trim().length > 0).length;
  lineCount.textContent = lines;
  
  // Update freq and read time after slight delay
  debounceAnalysis();
}

// Frequency analysis
function analyzeFrequency(text) {
  // Extract words (including Chinese)
  const words = text.match(/\b[\u4e00-\u9fa5a-zA-Z0-9]+\b/g) || [];
  
  if (words.length === 0) {
    freqList.innerHTML = '<p>无可分析的词</p>';
    return;
  }
  
  // Count frequency
  const freqMap = {};
  words.forEach(word => {
    const key = word.toLowerCase();
    freqMap[key] = (freqMap[key] || 0) + 1;
  });
  
  // Sort by frequency
  const freqArray = Object.entries(freqMap).sort((a, b) => b[1] - a[1]);
  
  // Display top 20
  let html = '';
  freqArray.slice(0, 20).forEach(([word, count]) => {
    html += `
      <div class="freq-item">
        <span class="freq-word">${word}</span>
        <span class="freq-count">${count}</span>
      </div>
    `;
  });
  
  freqList.innerHTML = html;
}

// Read time calculation
function calculateReadTime(text) {
  // Remove HTML tags and count words
  const cleanText = text.replace(/<[^>]+>/g, ' ');
  const words = cleanText.match(/\b[\u4e00-\u9fa5a-zA-Z0-9]+\b/g) || [];
  const wordCount = words.length;
  
  // Assuming 200 words per minute
  const minutes = Math.ceil(wordCount / 200);
  readTime.textContent = minutes > 0 ? minutes : 0;
}

// Event listeners
textInput.addEventListener('input', updateCounts);

// Tab switching
analyzeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    analyzeTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    analysisPanels.forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tab.dataset.analyze).classList.add('active');
  });
});

// Debounce function
function debounceAnalysis() {
  clearTimeout(window.analysisTimeout);
  window.analysisTimeout = setTimeout(() => {
    const text = textInput.value;
    analyzeFrequency(text);
    calculateReadTime(text);
  }, 300);
}

// Initialize
updateCounts();