/* ============================
   URL Parser Logic
   ============================ */

// DOM Elements
const urlInput = document.getElementById('url-input');
const analyzeBtn = document.querySelector('.analyze-btn');
const clearBtn = document.querySelector('.clear-btn');
const paramsList = document.getElementById('params-list');

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Show corresponding panel
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

// Analyze URL
analyzeBtn.addEventListener('click', () => {
  const urlString = urlInput.value.trim();
  
  if (!urlString) {
    alert('请输入网址');
    return;
  }
  
  try {
    const url = new URL(urlString);
    
    // Update basic info
    document.getElementById('protocol').textContent = url.protocol.replace(':', '');
    document.getElementById('host').textContent = url.host;
    document.getElementById('path').textContent = url.pathname || '/';
    document.getElementById('port').textContent = url.port || (url.protocol === 'https:' ? '443' : '80');
    document.getElementById('fragment').textContent = url.hash.replace('#', '') || '无';
    
    // Update query textarea
    document.getElementById('query-textarea').value = url.search;
    
    // Generate params list
    generateParamsList(url.searchParams);
    
  } catch (e) {
    alert('无效的网址格式，请检查后重试');
    console.error(e);
  }
});

// Generate params list
function generateParamsList(searchParams) {
  const params = Array.from(searchParams.entries());
  
  if (params.length === 0) {
    paramsList.innerHTML = '<p>无查询参数</p>';
    return;
  }
  
  let html = '';
  params.forEach(([key, value]) => {
    html += `
      <div class="param-row">
        <span class="param-key">${escapeHtml(key)}</span>
        <span class="param-value">${escapeHtml(value)}</span>
      </div>
    `;
  });
  
  paramsList.innerHTML = html;
}

// Clear input
clearBtn.addEventListener('click', () => {
  urlInput.value = '';
  // Reset UI
  document.getElementById('protocol').textContent = '';
  document.getElementById('host').textContent = '';
  document.getElementById('path').textContent = '';
  document.getElementById('port').textContent = '';
  document.getElementById('fragment').textContent = '';
  document.getElementById('query-textarea').value = '';
  generateParamsList(new URLSearchParams(''));
}

// Helper: escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Enter key to analyze
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    analyzeBtn.click();
  }
});