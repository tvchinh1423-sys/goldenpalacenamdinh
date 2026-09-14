// LED Stage Screen Video Exporter — Direct Live DOM Capture (100% Exact Web Preview Match)
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
  durationSeconds = 8,
  showRings = false,
  targetNodeId = 'fullscreen-led-stage-screen',
  fallbackNodeId = 'led-stage-screen-canvas',
  secondaryNodeId = 'led-stage-customizer-preview',
  onProgress
}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Ensure web fonts are completely loaded into browser font engine
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch (e) {}
      }

      // 1. Locate the EXACT live DOM preview container on screen
      let domNode = document.getElementById(targetNodeId) || 
                    document.getElementById(fallbackNodeId) || 
                    document.getElementById(secondaryNodeId);

      if (!domNode) {
        domNode = document.querySelector('#fullscreen-led-stage-screen') ||
                  document.querySelector('#led-stage-screen-canvas') ||
                  document.querySelector('#led-stage-customizer-preview') ||
                  document.querySelector('[id*="led-stage"]');
      }

      // MODE A: DIRECT LIVE DOM CAPTURE (100% PIXEL-PERFECT MATCH WITH WEB PREVIEW)
      if (domNode) {
        let initialCanvas;
        try {
          initialCanvas = await toCanvas(domNode, { quality: 1.0, pixelRatio: 2, cacheBust: false });
        } catch (e) {
          await new Promise(r => setTimeout(r, 150));
          initialCanvas = await toCanvas(domNode, { quality: 1.0, pixelRatio: 2, cacheBust: false });
        }

        const width = initialCanvas.width;
        const height = initialCanvas.height;

        const recordCanvas = document.createElement('canvas');
        recordCanvas.width = width;
        recordCanvas.height = height;
        const recordCtx = recordCanvas.getContext('2d');

        // Draw initial frame immediately (Zero black initial frame at 00:00!)
        recordCtx.drawImage(initialCanvas, 0, 0);

        const videoEl = domNode.querySelector('video');

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

        let mediaRecorder = null;
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 25000000 });
        } catch (e) {
          mediaRecorder = new MediaRecorder(stream, { mimeType });
        }

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        const totalFrames = durationSeconds * 30;
        let currentFrame = 0;

        mediaRecorder.start(100);

        const frameInterval = setInterval(async () => {
          try {
            // Capture live DOM element frame directly from web page
            const frameCanvas = await toCanvas(domNode, { quality: 1.0, pixelRatio: 2, cacheBust: false });
            recordCtx.clearRect(0, 0, width, height);

            if (videoEl && videoEl.readyState >= 2) {
              recordCtx.drawImage(videoEl, 0, 0, width, height);
            }
            recordCtx.drawImage(frameCanvas, 0, 0, width, height);

            currentFrame++;
            const pct = Math.min(100, Math.round((currentFrame / totalFrames) * 100));
            if (onProgress) onProgress(pct);

            if (currentFrame >= totalFrames) {
              clearInterval(frameInterval);
              mediaRecorder.stop();
            }
          } catch (err) {
            console.error('DOM Frame capture error:', err);
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
        return;
      }

      // MODE B: FALLBACK CANVAS RENDERER IF DOM NODE NOT MOUNTED
      const canvas = document.createElement('canvas');
      const targetWidth = 2560;
      let ratioMultiplier = 384 / 704;
      if (aspectRatio.includes('336')) ratioMultiplier = 336 / 704;
      if (aspectRatio.includes('272')) ratioMultiplier = 272 / 512;
      
      const targetHeight = Math.round(targetWidth * ratioMultiplier);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/logo-icon.png';

      const bgImg = new Image();
      if (imageUrl && !videoUrl) {
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = imageUrl;
      }

      let videoEl = null;
      if (videoUrl) {
        videoEl = document.createElement('video');
        videoEl.crossOrigin = 'anonymous';
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.src = videoUrl;
      }

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

      const renderFrame = () => {
        if (videoEl && videoEl.readyState >= 2) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        } else if (bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#050508';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gradient = ctx.createRadialGradient(
          canvas.width / 2, 0, 10,
          canvas.width / 2, canvas.height / 2, canvas.height
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const logoH = Math.round(canvas.height * 0.14);
          const logoW = Math.round(logoImg.naturalWidth * (logoH / logoImg.naturalHeight));
          ctx.save();
          ctx.shadowColor = 'rgba(227, 166, 56, 0.85)';
          ctx.shadowBlur = 20;
          ctx.drawImage(logoImg, 75, 60, logoW, logoH);
          ctx.restore();
        }

        const normTitle = (partyTitle || 'LỄ THÀNH HÔN').normalize('NFC').toUpperCase();
        const groomNorm = (groomName || 'Đức Hoàng').normalize('NFC');
        const brideNorm = (brideName || 'Thu Hương').normalize('NFC');
        const dateStr = formatDateDot(eventDate);

        const titlePx = Math.round(titleFontSize * 3.7);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 6;
        ctx.font = `900 ${titlePx}px "Playfair Display", "Cormorant Garamond", "Times New Roman", serif`;
        ctx.fillText(normTitle, canvas.width / 2, canvas.height * 0.20);
        ctx.restore();

        const groomPx = Math.round(groomFontSize * 3.7);
        const coupleY = canvas.height * 0.44;

        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 7;

        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        const groomWidth = ctx.measureText(groomNorm).width;
        const brideWidth = ctx.measureText(brideNorm).width;

        const ampPx = Math.round(groomPx * 0.72);
        ctx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", serif`;
        const ampText = '   &   ';
        const ampWidth = ctx.measureText(ampText).width;

        const totalWidth = groomWidth + ampWidth + brideWidth;
        let startX = (canvas.width - totalWidth) / 2;

        ctx.textAlign = 'left';
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(groomNorm, startX, coupleY);
        startX += groomWidth;

        ctx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", serif`;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(ampText, startX, coupleY);
        startX += ampWidth;

        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(brideNorm, startX, coupleY);
        ctx.restore();

        const datePx = Math.round(dateFontSize * 3.5);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 28;
        ctx.shadowOffsetY = 6;
        ctx.font = `bold ${datePx}px "Playfair Display", "Times New Roman", serif`;
        ctx.fillText(dateStr, canvas.width / 2, canvas.height * 0.68);
        ctx.restore();
      };

      const startRecording = () => {
        const stream = canvas.captureStream(60);
        
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

        let mediaRecorder = null;
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 25000000 });
        } catch (e) {
          mediaRecorder = new MediaRecorder(stream, { mimeType });
        }

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        const startTime = Date.now();
        const interval = setInterval(() => {
          renderFrame();
          const elapsed = (Date.now() - startTime) / 1000;
          if (onProgress) {
            const pct = Math.min(100, Math.round((elapsed / durationSeconds) * 100));
            onProgress(pct);
          }
          if (elapsed >= durationSeconds) {
            clearInterval(interval);
            mediaRecorder.stop();
          }
        }, 1000 / 60);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/mp4' });
          const url = URL.createObjectURL(blob);

          const groomClean = (groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          const brideClean = (brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          const fileName = `phong-led-san-khau-${groomClean}-${brideClean}.mp4`;

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

          resolve({ success: true, url, fileName });
        };

        mediaRecorder.start(100);
      };

      if (videoEl) {
        videoEl.currentTime = 0;
        await videoEl.play().catch(() => {});
        await new Promise(r => setTimeout(r, 200));
      }
      startRecording();
    } catch (err) {
      reject(err);
    }
  });
}
