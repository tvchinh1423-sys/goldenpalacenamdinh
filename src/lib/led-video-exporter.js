// LED Stage Screen Video Exporter — 100% Cross-Platform (Windows, macOS, iOS, Android) & Seamless Video Loop
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

      // 1. Setup Canvas resolution (2560px Ultra 2K QHD scale)
      const canvas = document.createElement('canvas');
      const targetWidth = 2560;
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

      // Cross-platform Font Mapping (Windows, macOS, iOS, Android fallback fonts)
      const fontNameMap = {
        ballet: '"Ballet", "Great Vibes", cursive',
        greatvibes: '"Great Vibes", cursive',
        alexbrush: '"Alex Brush", cursive',
        playfair: '"Playfair Display", "Times New Roman", Didot, serif'
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

        // Top-Left Logo
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const logoH = Math.round(canvas.height * 0.14);
          const logoW = Math.round(logoImg.naturalWidth * (logoH / logoImg.naturalHeight));
          ctx.save();
          ctx.shadowColor = 'rgba(227, 166, 56, 0.85)';
          ctx.shadowBlur = 20;
          ctx.drawImage(logoImg, 75, 60, logoW, logoH);
          ctx.restore();
        }

        // --- FOREGROUND CONTENT LAYER ---
        const normTitle = (partyTitle || 'LỄ THÀNH HÔN').normalize('NFC').toUpperCase();
        const groomNorm = (groomName || 'Đức Hoàng').normalize('NFC');
        const brideNorm = (brideName || 'Thu Hương').normalize('NFC');
        const dateStr = formatDateDot(eventDate);

        // 1. Party Title Header (e.g. LỄ VU QUY)
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

        // 2. Bride & Groom Names (e.g. Đình Minh & Thu Thảo)
        const groomPx = Math.round(groomFontSize * 3.7);
        const coupleY = canvas.height * 0.44;

        ctx.save();
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
        ctx.shadowBlur = 32;
        ctx.shadowOffsetY = 7;

        // Measure Groom Text Width in Script Font
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        const groomWidth = ctx.measureText(groomNorm).width;

        // Measure Bride Text Width in Script Font
        const brideWidth = ctx.measureText(brideNorm).width;

        // Measure Ampersand Width in Playfair Display Italic Serif Font
        const ampPx = Math.round(groomPx * 0.72);
        ctx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", serif`;
        const ampText = '   &   ';
        const ampWidth = ctx.measureText(ampText).width;

        const totalWidth = groomWidth + ampWidth + brideWidth;
        let startX = (canvas.width - totalWidth) / 2;

        // Draw Groom Name
        ctx.textAlign = 'left';
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(groomNorm, startX, coupleY);
        startX += groomWidth;

        // Draw Ampersand '&'
        ctx.font = `italic 300 ${ampPx}px "Playfair Display", "Times New Roman", serif`;
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(ampText, startX, coupleY);
        startX += ampWidth;

        // Draw Bride Name
        ctx.font = `400 ${groomPx}px ${canvasScriptFont}`;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(brideNorm, startX, coupleY);
        ctx.restore();

        // 3. Wedding Date (e.g. 19.09.2026)
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

        // Hardware-adaptive Bitrate Selection for maximum cross-platform compatibility
        let targetBitrate = 35000000;
        let mediaRecorder = null;

        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: targetBitrate });
        } catch (e) {
          try {
            targetBitrate = 15000000;
            mediaRecorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: targetBitrate });
          } catch (e2) {
            mediaRecorder = new MediaRecorder(stream, { mimeType });
          }
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

          // Detect iOS Safari / iPadOS
          const isIOS = typeof navigator !== 'undefined' && (
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
          );

          if (isIOS) {
            // Mobile Safari fallback trigger
            const newWin = window.open(url, '_blank');
            if (!newWin) window.location.href = url;
          } else {
            // Desktop (Windows, macOS) & Android cross-browser trigger
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

          if (videoEl) {
            videoEl.pause();
            videoEl.src = '';
          }
          resolve({ success: true, url, fileName });
        };

        mediaRecorder.start(100);
      };

      const prepareAndStart = async () => {
        if (videoEl) {
          try {
            videoEl.currentTime = 0;
            await videoEl.play();
          } catch (e) {}

          // Poll until video decoder has actually loaded and decoded the first valid frame
          let retry = 0;
          while ((videoEl.readyState < 2 || videoEl.currentTime < 0.08) && retry < 40) {
            await new Promise(r => setTimeout(r, 40));
            retry++;
          }
        }

        // Render 5 initial warm-up frames to ensure background, spotlight, logo, and overlay text are 100% active on Frame 0
        for (let i = 0; i < 5; i++) {
          renderFrame();
          await new Promise(r => setTimeout(r, 16));
        }

        // Now start recording with frame 0 already fully rendered & warm!
        startRecording();
      };

      if (videoEl) {
        let started = false;
        videoEl.oncanplaythrough = async () => {
          if (!started) {
            started = true;
            await prepareAndStart();
          }
        };
        videoEl.onerror = async () => {
          if (!started) {
            started = true;
            await prepareAndStart();
          }
        };
        videoEl.load();
        setTimeout(async () => {
          if (!started) {
            started = true;
            await prepareAndStart();
          }
        }, 1500);
      } else {
        await prepareAndStart();
      }
    } catch (err) {
      reject(err);
    }
  });
}
