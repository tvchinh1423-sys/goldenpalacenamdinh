// LED Stage Screen Video Exporter — Robust Cross-Platform Live Video + Clean Transparent Overlay (35Mbps Full HD MP4)
import { toCanvas } from 'html-to-image';

export async function exportLedVideoWithOverlay({
  videoUrl,
  imageUrl,
  partyTitle = 'LỄ THÀNH HÔN',
  groomName = 'Đức Hoàng',
  brideName = 'Thu Hương',
  eventDate = '2026-11-20',
  fontKey = 'ballet',
  titleFontSize = 32,
  groomFontSize = 59,
  dateFontSize = 24,
  aspectRatio = '704/384',
  durationSeconds = 6,
  targetNodeId = 'fullscreen-led-stage-screen',
  fallbackNodeId = 'led-stage-screen-canvas',
  secondaryNodeId = 'led-stage-customizer-preview',
  onProgress
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure web fonts are loaded into browser engine
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {}
      }

      // 1. Locate live DOM preview node on screen
      let domNode = document.getElementById(targetNodeId) || 
                    document.getElementById(fallbackNodeId) || 
                    document.getElementById(secondaryNodeId);

      if (!domNode) {
        domNode = document.querySelector('#fullscreen-led-stage-screen') ||
                  document.querySelector('#led-stage-screen-canvas') ||
                  document.querySelector('#led-stage-customizer-preview') ||
                  document.querySelector('[id*="led-stage"]');
      }

      // Output resolution setup (Full HD 1920x1080 scale matching stage aspect ratio)
      const targetWidth = 1920;
      let ratioMultiplier = 384 / 704;
      if (aspectRatio.includes('336')) ratioMultiplier = 336 / 704;
      if (aspectRatio.includes('272')) ratioMultiplier = 272 / 512;

      const targetHeight = Math.round(targetWidth * ratioMultiplier);

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = targetWidth;
      recordCanvas.height = targetHeight;
      const recordCtx = recordCanvas.getContext('2d');

      let overlayCanvas = null;

      // 2. Capture Transparent DOM Overlay by filtering out the <video> tag cleanly (Zero DOM mutations, 100% reliable)
      if (domNode) {
        try {
          overlayCanvas = await toCanvas(domNode, {
            quality: 1.0,
            pixelRatio: 2,
            backgroundColor: null,
            cacheBust: false,
            filter: (node) => {
              // Exclude background <video> and fallback background image divs so overlay is 100% transparent!
              if (node.tagName === 'VIDEO') return false;
              if (node.classList && (node.classList.contains('bg-cover') || node.className?.includes?.('bg-cover'))) {
                return false;
              }
              return true;
            }
          });
        } catch (e) {
          console.warn('DOM Snapshot warning, using clean overlay canvas fallback:', e);
        }
      }

      const videoEl = domNode ? domNode.querySelector('video') : null;

      // Fallback font setup if overlayCanvas is null
      const fontNameMap = {
        ballet: '"Ballet", "Great Vibes", cursive',
        greatvibes: '"Great Vibes", cursive',
        alexbrush: '"Alex Brush", cursive',
        playfair: '"Playfair Display", "Times New Roman", Didot, serif'
      };
      const canvasScriptFont = fontNameMap[fontKey] || fontNameMap.ballet;

      const formatDateDot = (dStr) => {
        if (!dStr) return '20.11.2026';
        if (dStr.includes('-')) {
          const parts = dStr.split('-');
          if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dStr;
      };

      const renderFallbackOverlay = () => {
        // Vertical Spotlight Beam
        const gradient = recordCtx.createRadialGradient(
          targetWidth / 2, 0, 10,
          targetWidth / 2, targetHeight / 2, targetHeight
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)');
        gradient.addColorStop(1, 'transparent');
        recordCtx.fillStyle = gradient;
        recordCtx.fillRect(0, 0, targetWidth, targetHeight);

        // Content
        const normTitle = (partyTitle || 'LỄ THÀNH HÔN').normalize('NFC').toUpperCase();
        const groomNorm = (groomName || 'Đức Hoàng').normalize('NFC');
        const brideNorm = (brideName || 'Thu Hương').normalize('NFC');
        const dateStr = formatDateDot(eventDate);

        // Title
        const titlePx = Math.round(titleFontSize * 2.8);
        recordCtx.save();
        recordCtx.textAlign = 'center';
        recordCtx.textBaseline = 'middle';
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 20;
        recordCtx.shadowOffsetY = 4;
        recordCtx.font = `900 ${titlePx}px "Playfair Display", "Cormorant Garamond", "Times New Roman", serif`;
        recordCtx.fillText(normTitle, targetWidth / 2, targetHeight * 0.20);
        recordCtx.restore();

        // Names
        const groomPx = Math.round(groomFontSize * 2.8);
        const coupleY = targetHeight * 0.44;

        recordCtx.save();
        recordCtx.textBaseline = 'middle';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 25;

        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        const groomW = recordCtx.measureText(groomNorm).width;
        const brideW = recordCtx.measureText(brideNorm).width;

        const ampPx = Math.round(groomPx * 0.72);
        recordCtx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", serif`;
        const ampText = '   &   ';
        const ampW = recordCtx.measureText(ampText).width;

        const totW = groomW + ampW + brideW;
        let sX = (targetWidth - totW) / 2;

        recordCtx.textAlign = 'left';
        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.fillText(groomNorm, sX, coupleY);
        sX += groomW;

        recordCtx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", serif`;
        recordCtx.fillStyle = '#f1f5f9';
        recordCtx.fillText(ampText, sX, coupleY);
        sX += ampW;

        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.fillText(brideNorm, sX, coupleY);
        recordCtx.restore();

        // Date
        const datePx = Math.round(dateFontSize * 2.6);
        recordCtx.save();
        recordCtx.textAlign = 'center';
        recordCtx.textBaseline = 'middle';
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 22;
        recordCtx.font = `bold ${datePx}px "Playfair Display", "Times New Roman", serif`;
        recordCtx.fillText(dateStr, targetWidth / 2, targetHeight * 0.68);
        recordCtx.restore();
      };

      // 3. MediaRecorder stream setup
      const stream = recordCanvas.captureStream(30);

      let mimeType = 'video/mp4';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1.42E01E')) {
          mimeType = 'video/mp4;codecs=avc1.42E01E';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          mimeType = 'video/webm;codecs=vp9';
        } else {
          mimeType = 'video/webm';
        }
      }

      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 35000000 });
      } catch (e) {
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 15000000 });
        } catch (e2) {
          mediaRecorder = new MediaRecorder(stream, { mimeType });
        }
      }

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const totalFrames = durationSeconds * 30; // 6s @ 30 FPS = 180 frames
      let currentFrame = 0;

      // Ensure video is playing live
      if (videoEl) {
        try {
          if (videoEl.paused) await videoEl.play();
        } catch (e) {}
      }

      mediaRecorder.start(100);

      // Frame compositor loop: Live Video + Pure Transparent Text Overlay
      const frameInterval = setInterval(() => {
        recordCtx.clearRect(0, 0, targetWidth, targetHeight);

        // A. Draw live moving background video frame
        if (videoEl && videoEl.readyState >= 2) {
          recordCtx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);
          // Dark tint layer over background video
          recordCtx.fillStyle = 'rgba(0, 0, 0, 0.22)';
          recordCtx.fillRect(0, 0, targetWidth, targetHeight);
        } else {
          recordCtx.fillStyle = '#050508';
          recordCtx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // B. Draw transparent text & logo overlay on top
        if (overlayCanvas) {
          recordCtx.drawImage(overlayCanvas, 0, 0, targetWidth, targetHeight);
        } else {
          renderFallbackOverlay();
        }

        currentFrame++;
        if (onProgress) onProgress(Math.min(100, Math.round((currentFrame / totalFrames) * 100)));

        if (currentFrame >= totalFrames) {
          clearInterval(frameInterval);
          mediaRecorder.stop();
        }
      }, 1000 / 30);

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        const groomClean = (groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
        const brideClean = (brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
        const fileName = `phong-led-san-khau-${groomClean}-${brideClean}.mp4`;

        const isIOS = typeof navigator !== 'undefined' && (
          /iPad|iPhone|iPod/.test(navigator.userAgent) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
        );

        if (isIOS) {
          const newWin = window.open(url, '_blank');
          if (!newWin) window.location.href = url;
        } else {
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 3000);
        }

        resolve({ success: true, url, fileName });
      };
    } catch (err) {
      console.error('Video Export Exception:', err);
      reject(err);
    }
  });
}
