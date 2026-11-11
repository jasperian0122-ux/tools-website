/* ============================
   Video Subtitle Extractor Logic
   ============================ */

// DOM Elements
const videoUrl = document.getElementById('video-url');
const extractBtn = document.getElementById('extract-btn');
const statusText = document.getElementById('status-text');
const subtitleText = document.getElementById('subtitle-text');
const platformTabs = document.querySelectorAll('.platform-tab');

// Platform detection and handling
platformTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active platform
    platformTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Clear previous results
    clearResults();
  });
});

// Extract subtitles
extractBtn.addEventListener('click', async () => {
  const url = videoUrl.value.trim();
  
  if (!url) {
    alert('请粘贴视频网址');
    return;
  }
  
  // Show status
  statusText.textContent = '正在分析网址...';
  extractBtn.disabled = true;
  
  try {
    // Detect platform and extract subtitles
    const platform = detectPlatform(url);
    
    if (platform === 'bilibili') {
      await extractBilibiliSubtitles(url);
    } else if (platform === 'youtube') {
      await extractYouTubeSubtitles(url);
    } else if (platform === 'twitter') {
      // Twitter video subtitle extraction (limited)
      showStatus('Twitter 视频字幕提取功能有限', 'error');
    } else {
      showStatus('不支持的视频平台', 'error');
    }
  } catch (error) {
    console.error(error);
    showStatus('提取过程中出现错误', 'error');
  } finally {
    extractBtn.disabled = false;
  }
});

// Detect platform from URL
function detectPlatform(url) {
  if (url.includes('bilibili.com') || url.includes('b23.tv')) return 'bilibili';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  return 'unknown';
}

// Extract Bilibili subtitles
async function extractBilibiliSubtitles(url) {
  showStatus('检测到 Bilibili，正在提取字幕...', 'loading');
  
  try {
    // Bilibili video ID extraction
    const videoId = extractBiliVideoId(url);
    if (!videoId) {
      showStatus('无法获取 Bilibili 视频 ID', 'error');
      return;
    }
    
    // Try to fetch subtitles using Bilibili API
    // This is a simplified example - real implementation would use
    // the proper Bilibili subtitle API
    const apiUrl = `https://api.bilibili.com/x/v1/video/playurl?bvid=${videoId}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Referer': 'https://www.bilibili.com/'
      }
    });
    
    if (!response.ok) {
      throw new Error('Bilibili API 请求失败');
    }
    
    const data = await response.json();
    
    if (data.code !== 0) {
      showStatus('Bilibili API 返回错误: ' + data.message, 'error');
      return;
    }
    
    // Extract subtitle track from response
    // In real implementation, would parse available subtitle tracks
    const subtitleData = extractSubtitleFromBiliResponse(data);
    
    if (subtitleData) {
      displaySubtitle(subtitleData.text, subtitleData.format);
    } else {
      // Fallback: show info that subtitles are available but need manual selection
      showStatus('视频有字幕，但需通过 API 具体获取', 'info');
      displayAvailableSubtitles(data.data?.subtitle?.subtitles || []);
    }
    
  } catch (error) {
    console.error('Bilibili subtitle error:', error);
    showStatus('Bilibili 字幕提取失败: ' + error.message, 'error');
  }
}

// Extract YouTube subtitles
async function extractYouTubeSubtitles(url) {
  showStatus('检测到 YouTube，正在提取字幕...', 'loading');
  
  try {
    // YouTube video ID extraction
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      showStatus('无法获取 YouTube 视频 ID', 'error');
      return;
    }
    
    // YouTube subtitle API (using the YouTube Transcript API concept)
    // Note: This may have limitations based on YouTube's terms of service
    const transcriptUrl = `https://yt.adsabs.harvard.edu/api/v1/transcripts?video_id=${videoId}`;
    
    const response = await fetch(transcriptUrl);
    
    if (!response.ok) {
      throw new Error('YouTube 字幕 API 请求失败');
    }
    
    const data = await response.json();
    
    // Process transcript data
    if (data.available captions) {
      const captionTracks = data.available captions;
      // Get the first available caption track
      const track = captionTracks[0];
      
      if (track) {
        // Fetch the actual caption track
        const trackResponse = await fetch(track.baseUrl);
        const trackData = await trackResponse.json();
        
        // Convert to SRT format
        const srtContent = convertToSRT(trackData.events || []);
        
        displaySubtitle(srtContent, 'SRT');
      }
    } else {
      showStatus('该视频没有可用的字幕', 'info');
    }
    
  } catch (error) {
    console.error('YouTube subtitle error:', error);
    // Even if API fails, show helpful message
    showStatus('YouTube 字幕提取 - 查看说明', 'info');
    showFallbackYouTubeInfo();
  }
}

// Extract video ID from Bilibili URL
function extractBiliVideoId(url) {
  // Handle various Bilibili URL formats
  const patterns = [
    /b23\.tv\/([a-zA-Z0-9]+)/,
    /bilibili\.com\/video\/([a-zA-Z0-9]+)/,
    /cid\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1] || match[2];
  }
  
  return null;
}

// Extract video ID from YouTube URL
function extractYouTubeVideoId(url) {
  const patterns = [
    /v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Convert events to SRT format
function convertToSRT(events) {
  if (!events || events.length === 0) return '';
  
  return events.map((event, index) => {
    const startTime = formatSRTTime(event.start);
    const endTime = formatSRTTime(event.end || event.start + 3000); // Default 3s if no end
    const text = stripHtml(event.text || '');
    
    return `${index + 1}\n${startTime} --> ${endTime}\n${text}\n`;
  }).join('\n');
}

// Format time to SRT format (HH:MM:SS,mmm)
function formatSRTTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(milliseconds, 3)}`;
}

function pad(num, digits = 2) {
  return String(num).padStart(digits, '0');
}

// Strip HTML tags from text
function stripHtml(text) {
  return text.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
}

// Display subtitle results
function displaySubtitle(text, format) {
  // Hide results area initially, then show
  const resultsArea = document.querySelector('.results-area');
  const subtitleInfo = document.getElementById('subtitle-info');
  
  subtitleInfo.innerHTML = `<p>成功提取字幕 (格式: ${format})</p>`;
  
  subtitleText.value = text;
  
  resultsArea.style.display = 'block';
  statusText.textContent = '字幕提取完成';
}

// Display available subtitles (Bilibili fallback)
function displayAvailableSubtitles(subtitles) {
  const subtitleInfo = document.getElementById('subtitle-info');
  
  if (subtitles && subtitles.length > 0) {
    subtitleInfo.innerHTML = `<p>检测到 ${subtitles.length} 条字幕轨道，请手动选择</p>`;
    // In a full UI, would show a dropdown to select subtitle track
  } else {
    subtitleInfo.innerHTML = '<p>该视频没有内置字幕</p>';
  }
}

// Show status message
function showStatus(message, type = 'default') {
  statusText.textContent = message;
  statusText.className = `status-${type}`;
}

// Clear previous results
function clearResults() {
  const resultsArea = document.querySelector('.results-area');
  const subtitleText = document.getElementById('subtitle-text');
  
  subtitleText.value = '';
  resultsArea.style.display = 'none';
  statusText.textContent = '粘贴视频网址开始提取';
}

// Initialize - enter key to extract
videoUrl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    extractBtn.click();
  }
});