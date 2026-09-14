// LED Stage Screen Video Exporter — Renders background video + text overlay + logo onto Canvas & records to HD WebM/MP4
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

      // 1. Setup Canvas resolution (1920px Full HD scale)
      const canvas = document.createElement('canvas');
      const targetWidth = 1920;
      let ratioMultiplier = 384 / 704; // default 1.83:1 (Tầng 3)
      if (aspectRatio.includes('336')) ratioMultiplier = 336 / 704; // Tầng 2
      if (aspectRatio.includes('272')) ratioMultiplier = 272 / 512; // Tầng 1/4
      
      const targetHeight = Math.round(targetWidth * ratioMultiplier);
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      // 2. Load Logo Image
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/logo-icon.png';

      // 3. Load Static Background Image fallback
      const bgImg = new Image();
      if (imageUrl && !videoUrl) {
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = imageUrl;
      }

      // 4. Create Video element if videoUrl exists
      let videoEl = null;
      if (videoUrl) {
        videoEl = document.createElement('video');
        videoEl.crossOrigin = 'anonymous';
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;
        videoEl.src = videoUrl;
      }

      // Font mapping for Canvas ctx.font
      const fontNameMap = {
        ballet: '"Ballet", "Great Vibes", cursive',
        greatvibes: '"Great Vibes", cursive',
        alexbrush: '"Alex Brush", cursive',
        playfair: '"Playfair Display", Didot, serif'
      };
      const canvasScriptFont = fontNameMap[fontKey] || fontNameMap.ballet;

      // Formatting date dot strictly xx.xx.xxxx
      const formatDateDot = (dStr) => {
        if (!dStr) return '20.11.2026';
        if (dStr.includes('-')) {
          const parts = dStr.split('-');
          if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dStr;
      };

      const renderFrame = () => {
        // Draw background (Video or Image)
        if (videoEl && videoEl.readyState >= 2) {
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        } else if (bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#050508';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Overlay black tint (25%)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Vertical Spotlight Beam
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, 0, 10,
          canvas.width / 2, canvas.height / 2, canvas.height
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
        gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.08)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Top-Left Logo (Matching h-14 / top-5 left-6 on Web)
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const logoH = Math.round(canvas.height * 0.14);
          const logoW = Math.round(logoImg.naturalWidth * (logoH / logoImg.naturalHeight));
          ctx.save();
          ctx.shadowColor = 'rgba(227, 166, 56, 0.85)';
          ctx.shadowBlur = 15;
          ctx.drawImage(logoImg, 55, 45, logoW, logoH);
          ctx.restore();
        }

        // --- FOREGROUND CONTENT LAYER ---
        // Normalized Strings
        const normTitle = (partyTitle || 'LỄ THÀNH HÔN').normalize('NFC').toUpperCase();
        const groomNorm = (groomName || 'Đức Hoàng').normalize('NFC');
        const brideNorm = (brideName || 'Thu Hương').normalize('NFC');
        const dateStr = formatDateDot(eventDate);

        // 1. Party Title Header (e.g. LỄ VU QUY)
        // Scaled to match web preview (titleFontSize * 2.8px on 1920 width)
        const titlePx = Math.round(titleFontSize * 2.8);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 4;
        ctx.font = `900 ${titlePx}px "Playfair Display", "Cormorant Garamond", Didot, serif`;
        ctx.fillText(normTitle, canvas.width / 2, canvas.height * 0.20);
        ctx.restore();

        // 2. Bride & Groom Names (e.g. Đình Minh & Thu Thảo)
        // Scaled to match web preview (groomFontSize * 2.8px on 1920 width)
        const groomPx = Math.round(groomFontSize * 2.8);
        const coupleY = canvas.height * 0.44;

        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetY = 5;

        // Measure Groom Text Width in Script Font
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        const groomWidth = ctx.measureText(groomNorm).width;

        // Measure Bride Text Width in Script Font
        const brideWidth = ctx.measureText(brideNorm).width;

        // Measure Ampersand Width in Playfair Display Italic Serif Font
        const ampPx = Math.round(groomPx * 0.72);
        ctx.font = `italic 300 ${ampPx}px "Playfair Display", Didot, serif`;
        const ampText = '   &   ';
        const ampWidth = ctx.measureText(ampText).width;

        const totalWidth = groomWidth + ampWidth + brideWidth;
        let startX = (canvas.width - totalWidth) / 2;

        // Draw Groom Name (Script Font)
        ctx.textAlign = 'left';
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(groomNorm, startX, coupleY);
        startX += groomWidth;

        // Draw Ampersand '&' (Playfair Display Italic Serif Font)
        ctx.font = `italic 300 ${ampPx}px "Playfair Display", Didot, serif`;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(ampText, startX, coupleY);
        startX += ampWidth;

        // Draw Bride Name (Script Font)
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(brideNorm, startX, coupleY);
        ctx.restore();

        // 3. Wedding Date (e.g. 19.09.2026)
        // Scaled to match web preview (dateFontSize * 2.6px on 1920 width)
        const datePx = Math.round(dateFontSize * 2.6);
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f8fafc';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 22;
        ctx.shadowOffsetY = 4;
        ctx.font = `bold ${datePx}px "Playfair Display", Didot, serif`;
        ctx.fillText(dateStr, canvas.width / 2, canvas.height * 0.68);
        ctx.restore();
      };

      const startRecording = () => {
        const stream = canvas.captureStream(30);
        
        let mimeType = 'video/webm;codecs=vp9';
        if (typeof MediaRecorder !== 'undefined') {
          if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
          if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';
        }

        // Set Ultra HD 15 Mbps video bitrate for high clarity
        const mediaRecorder = new MediaRecorder(stream, { 
          mimeType,
          videoBitsPerSecond: 15000000 
        });
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
        }, 1000 / 30);

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          const url = URL.createObjectURL(blob);

          const link = document.createElement('a');
          const groomClean = (groomName || 'chinh').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          const brideClean = (brideName || 'ha').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
          
          const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
          link.download = `video-phong-led-da-ghep-chu-${groomClean}-${brideClean}.${ext}`;
          link.href = url;
          link.click();
          
          if (videoEl) {
            videoEl.pause();
            videoEl.src = '';
          }
          resolve({ success: true, url, ext });
        };

        mediaRecorder.start(100);
      };

      if (videoEl) {
        let started = false;
        videoEl.oncanplaythrough = () => {
          if (!started) {
            started = true;
            videoEl.play().catch(() => {});
            startRecording();
          }
        };
        videoEl.onerror = () => {
          if (!started) {
            started = true;
            startRecording();
          }
        };
        videoEl.load();
        // Safety fallback if video takes long to trigger canplaythrough
        setTimeout(() => {
          if (!started) {
            started = true;
            videoEl.play().catch(() => {});
            startRecording();
          }
        }, 1500);
      } else {
        startRecording();
      }
    } catch (err) {
      reject(err);
    }
  });
}
