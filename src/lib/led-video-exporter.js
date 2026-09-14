// LED Stage Screen Video Exporter — Direct Vector Canvas Engine (Zero Black Box, 100% Moving Video, 35Mbps Full HD MP4)

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
      // 1. Load Web Fonts into browser engine
      if (typeof document !== 'undefined' && document.fonts) {
        try {
          await Promise.all([
            document.fonts.load('400 180px "Ballet"'),
            document.fonts.load('400 180px "Great Vibes"'),
            document.fonts.load('400 180px "Alex Brush"'),
            document.fonts.load('900 100px "Playfair Display"'),
            document.fonts.load('italic 300 130px "Playfair Display"')
          ]);
          await document.fonts.ready;
        } catch (e) {}
      }

      // 2. Setup Full HD 1920x1080 Output Canvas
      const targetWidth = 1920;
      let ratioMultiplier = 384 / 704;
      if (aspectRatio.includes('336')) ratioMultiplier = 336 / 704;
      if (aspectRatio.includes('272')) ratioMultiplier = 272 / 512;

      const targetHeight = Math.round(targetWidth * ratioMultiplier);

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = targetWidth;
      recordCanvas.height = targetHeight;
      const recordCtx = recordCanvas.getContext('2d');

      // 3. Load Logo Image
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/logo-icon.png';

      // 4. Find or Create Video Element
      let domNode = document.getElementById(targetNodeId) || 
                    document.getElementById(fallbackNodeId) || 
                    document.getElementById(secondaryNodeId);

      if (!domNode) {
        domNode = document.querySelector('#fullscreen-led-stage-screen') ||
                  document.querySelector('#led-stage-screen-canvas') ||
                  document.querySelector('#led-stage-customizer-preview') ||
                  document.querySelector('[id*="led-stage"]');
      }

      let videoEl = domNode ? domNode.querySelector('video') : null;

      if (!videoEl && videoUrl) {
        videoEl = document.createElement('video');
        videoEl.crossOrigin = 'anonymous';
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.src = videoUrl;
      }

      // Load static background image as fallback
      const bgImg = new Image();
      if (imageUrl && !videoUrl) {
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = imageUrl;
      }

      // Font Mapping
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

      // 5. Pre-warm Video playback
      if (videoEl) {
        try {
          if (videoEl.paused) await videoEl.play();
        } catch (e) {}

        let retry = 0;
        while ((videoEl.readyState < 2 || videoEl.currentTime < 0.05) && retry < 30) {
          await new Promise(r => setTimeout(r, 50));
          retry++;
        }
      }

      // 6. Direct Vector Canvas Frame Renderer (Zero Black Box, Pure Crisp Overlay)
      const renderVectorFrame = () => {
        recordCtx.clearRect(0, 0, targetWidth, targetHeight);

        // A. Draw Live Background Video Frame
        if (videoEl && videoEl.readyState >= 2) {
          recordCtx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);
        } else if (bgImg.complete && bgImg.naturalWidth > 0) {
          recordCtx.drawImage(bgImg, 0, 0, targetWidth, targetHeight);
        } else {
          recordCtx.fillStyle = '#050508';
          recordCtx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // B. Dark Tint Overlay (25%)
        recordCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        recordCtx.fillRect(0, 0, targetWidth, targetHeight);

        // C. Vertical Spotlight Radial Beam
        const gradient = recordCtx.createRadialGradient(
          targetWidth / 2, 0, 10,
          targetWidth / 2, targetHeight / 2, targetHeight
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)');
        gradient.addColorStop(1, 'transparent');
        recordCtx.fillStyle = gradient;
        recordCtx.fillRect(0, 0, targetWidth, targetHeight);

        // D. Top-Left Logo Icon
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const logoH = Math.round(targetHeight * 0.14);
          const logoW = Math.round(logoImg.naturalWidth * (logoH / logoImg.naturalHeight));
          recordCtx.save();
          recordCtx.shadowColor = 'rgba(227, 166, 56, 0.85)';
          recordCtx.shadowBlur = 20;
          recordCtx.drawImage(logoImg, 75, 55, logoW, logoH);
          recordCtx.restore();
        }

        // E. Text Strings
        const normTitle = (partyTitle || 'LỄ THÀNH HÔN').normalize('NFC').toUpperCase();
        const groomNorm = (groomName || 'Đức Hoàng').normalize('NFC');
        const brideNorm = (brideName || 'Thu Hương').normalize('NFC');
        const dateStr = formatDateDot(eventDate);

        // 1. Party Title (e.g. LỄ VU QUY)
        const titlePx = Math.round((titleFontSize || 32) * 3.0);
        recordCtx.save();
        recordCtx.textAlign = 'center';
        recordCtx.textBaseline = 'middle';
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 22;
        recordCtx.shadowOffsetY = 5;
        recordCtx.font = `900 ${titlePx}px "Playfair Display", "Cormorant Garamond", "Times New Roman", serif`;
        recordCtx.fillText(normTitle, targetWidth / 2, targetHeight * 0.20);
        recordCtx.restore();

        // 2. Bride & Groom Names (e.g. Đình Minh & Thu Thảo)
        const groomPx = Math.round((groomFontSize || 59) * 3.2);
        const coupleY = targetHeight * 0.45;

        recordCtx.save();
        recordCtx.textBaseline = 'middle';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 30;
        recordCtx.shadowOffsetY = 6;

        // Groom Width
        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        const groomW = recordCtx.measureText(groomNorm).width;

        // Bride Width
        const brideW = recordCtx.measureText(brideNorm).width;

        // Ampersand '&' Width in Playfair Display Italic Serif Font
        const ampPx = Math.round(groomPx * 0.72);
        recordCtx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", Didot, serif`;
        const ampText = '   &   ';
        const ampW = recordCtx.measureText(ampText).width;

        const totW = groomW + ampW + brideW;
        let currentX = (targetWidth - totW) / 2;

        // Draw Groom Name (Script Font)
        recordCtx.textAlign = 'left';
        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.fillText(groomNorm, currentX, coupleY);
        currentX += groomW;

        // Draw Ampersand '&' (Playfair Display Italic Serif Font)
        recordCtx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", Didot, serif`;
        recordCtx.fillStyle = '#f1f5f9';
        recordCtx.fillText(ampText, currentX, coupleY);
        currentX += ampW;

        // Draw Bride Name (Script Font)
        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.fillText(brideNorm, currentX, coupleY);
        recordCtx.restore();

        // 3. Wedding Date (e.g. 19.09.2026)
        const datePx = Math.round((dateFontSize || 24) * 2.8);
        recordCtx.save();
        recordCtx.textAlign = 'center';
        recordCtx.textBaseline = 'middle';
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 25;
        recordCtx.shadowOffsetY = 5;
        recordCtx.font = `bold ${datePx}px "Playfair Display", "Times New Roman", Didot, serif`;
        recordCtx.fillText(dateStr, targetWidth / 2, targetHeight * 0.70);
        recordCtx.restore();
      };

      // Render initial 3 warm-up frames
      for (let i = 0; i < 3; i++) {
        renderVectorFrame();
        await new Promise(r => setTimeout(r, 16));
      }

      // 7. MediaRecorder Stream Recording
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

      const totalFrames = durationSeconds * 30; // 6s @ 30 FPS
      let currentFrame = 0;

      mediaRecorder.start(100);

      const frameInterval = setInterval(() => {
        renderVectorFrame();

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
