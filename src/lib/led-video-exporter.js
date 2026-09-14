// LED Stage Screen Video Exporter — Direct Precision Vector Canvas Engine (100% Web Preview Typography & 40Mbps 60fps Full HD MP4)

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
      // 1. Ensure Google Web Fonts are completely loaded into browser font engine
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

      // 2. Setup Full HD Output Canvas (1920x1080 Scale)
      const targetWidth = 1920;
      let ratioMultiplier = 384 / 704;
      if (aspectRatio.includes('336')) ratioMultiplier = 336 / 704;
      if (aspectRatio.includes('272')) ratioMultiplier = 272 / 512;

      const targetHeight = Math.round(targetWidth * ratioMultiplier);

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = targetWidth;
      recordCanvas.height = targetHeight;
      const recordCtx = recordCanvas.getContext('2d');

      // Enable High-Quality Canvas Image Smoothing
      recordCtx.imageSmoothingEnabled = true;
      recordCtx.imageSmoothingQuality = 'high';

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

      // Load static background image fallback
      const bgImg = new Image();
      if (imageUrl && !videoUrl) {
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = imageUrl;
      }

      // Font Mapping matching Web Preview 100%
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
        while ((videoEl.readyState < 2 || videoEl.currentTime < 0.05) && retry < 35) {
          await new Promise(r => setTimeout(r, 40));
          retry++;
        }
      }

      // 6. Direct Vector Canvas Frame Renderer matching Web Preview CSS Typography 100.0%
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

        // D. Top-Left Logo Icon (Matching h-14 / top-5 left-6 on Web)
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const logoH = Math.round(targetHeight * 0.13);
          const logoW = Math.round(logoImg.naturalWidth * (logoH / logoImg.naturalHeight));
          recordCtx.save();
          recordCtx.shadowColor = 'rgba(227, 166, 56, 0.85)';
          recordCtx.shadowBlur = 18;
          recordCtx.drawImage(logoImg, 60, 42, logoW, logoH);
          recordCtx.restore();
        }

        // E. Text Strings
        const normTitle = (partyTitle || 'LỄ THÀNH HÔN').normalize('NFC').toUpperCase();
        const groomNorm = (groomName || 'Đức Hoàng').normalize('NFC');
        const brideNorm = (brideName || 'Thu Hương').normalize('NFC');
        const dateStr = formatDateDot(eventDate);

        // 1. Party Title (e.g. LỄ VU QUY) with 0.06em tracking
        const titlePx = Math.round((titleFontSize || 32) * 2.7);
        recordCtx.save();
        recordCtx.textBaseline = 'middle';
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 22;
        recordCtx.shadowOffsetY = 5;
        recordCtx.font = `900 ${titlePx}px "Playfair Display", "Cormorant Garamond", "Times New Roman", serif`;

        const titleSpacingPx = titlePx * 0.06;
        const titleChars = normTitle.split('');
        let titleTotalWidth = 0;
        const titleCharWidths = titleChars.map(ch => {
          const w = recordCtx.measureText(ch).width;
          titleTotalWidth += w + titleSpacingPx;
          return w;
        });
        titleTotalWidth -= titleSpacingPx;

        let titleStartX = (targetWidth - titleTotalWidth) / 2;
        recordCtx.textAlign = 'left';
        titleChars.forEach((ch, idx) => {
          recordCtx.fillText(ch, titleStartX, targetHeight * 0.20);
          titleStartX += titleCharWidths[idx] + titleSpacingPx;
        });
        recordCtx.restore();

        // 2. Bride & Groom Names (e.g. Đình Minh & Thu Thảo)
        const groomPx = Math.round((groomFontSize || 59) * 2.7);
        const coupleY = targetHeight * 0.44;

        recordCtx.save();
        recordCtx.textBaseline = 'middle';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 28;
        recordCtx.shadowOffsetY = 6;

        // Groom Width
        recordCtx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        const groomW = recordCtx.measureText(groomNorm).width;

        // Bride Width
        const brideW = recordCtx.measureText(brideNorm).width;

        // Ampersand '&' Width in Playfair Display Italic Serif Font
        const ampPx = Math.round(groomPx * 0.70);
        recordCtx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", Didot, serif`;
        const ampText = '  &  ';
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

        // 3. Wedding Date (e.g. 19.09.2026) with 0.14em tracking
        const datePx = Math.round((dateFontSize || 24) * 2.7);
        recordCtx.save();
        recordCtx.textBaseline = 'middle';
        recordCtx.fillStyle = '#f8fafc';
        recordCtx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        recordCtx.shadowBlur = 24;
        recordCtx.shadowOffsetY = 5;
        recordCtx.font = `bold ${datePx}px "Playfair Display", "Times New Roman", Didot, serif`;

        const dateSpacingPx = datePx * 0.14;
        const dateChars = dateStr.split('');
        let dateTotalWidth = 0;
        const dateCharWidths = dateChars.map(ch => {
          const w = recordCtx.measureText(ch).width;
          dateTotalWidth += w + dateSpacingPx;
          return w;
        });
        dateTotalWidth -= dateSpacingPx;

        let dateStartX = (targetWidth - dateTotalWidth) / 2;
        recordCtx.textAlign = 'left';
        dateChars.forEach((ch, idx) => {
          recordCtx.fillText(ch, dateStartX, targetHeight * 0.68);
          dateStartX += dateCharWidths[idx] + dateSpacingPx;
        });
        recordCtx.restore();
      };

      // Render 3 initial warm-up frames
      for (let i = 0; i < 3; i++) {
        renderVectorFrame();
        await new Promise(r => setTimeout(r, 16));
      }

      // 7. MediaRecorder Stream Recording at 60 FPS
      const stream = recordCanvas.captureStream(60);

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
        mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 40000000 });
      } catch (e) {
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 20000000 });
        } catch (e2) {
          mediaRecorder = new MediaRecorder(stream, { mimeType });
        }
      }

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      const totalFrames = durationSeconds * 60; // 6s @ 60 FPS = 360 frames
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
      }, 1000 / 60);

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
