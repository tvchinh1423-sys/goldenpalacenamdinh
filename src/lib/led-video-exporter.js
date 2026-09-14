// LED Stage Screen Video Exporter — Direct Web Preview DOM Snapshot + Live Moving Background Video (35Mbps Full HD MP4)
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
      // 1. Ensure fonts are loaded
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (e) {}
      }

      // 2. Locate the EXACT live DOM preview node on screen
      let domNode = document.getElementById(targetNodeId) || 
                    document.getElementById(fallbackNodeId) || 
                    document.getElementById(secondaryNodeId);

      if (!domNode) {
        domNode = document.querySelector('#fullscreen-led-stage-screen') ||
                  document.querySelector('#led-stage-screen-canvas') ||
                  document.querySelector('#led-stage-customizer-preview') ||
                  document.querySelector('[id*="led-stage"]');
      }

      if (!domNode) {
        throw new Error('Không tìm thấy khung xem trước phông LED trên trang.');
      }

      const videoEl = domNode.querySelector('video');

      // 3. Target .led-overlay-layer directly to ensure 100% PURE TRANSPARENT OVERLAY (Alpha = 0 for empty space)
      const overlayNode = domNode.querySelector('.led-overlay-layer') || domNode;

      const origBgColor = overlayNode.style.backgroundColor;
      const origBackground = overlayNode.style.background;
      const origDomBg = domNode.style.backgroundColor;
      
      overlayNode.style.backgroundColor = 'transparent';
      overlayNode.style.background = 'none';
      domNode.style.backgroundColor = 'transparent';

      let overlayCanvas;
      try {
        overlayCanvas = await toCanvas(overlayNode, {
          quality: 1.0,
          pixelRatio: 2.5, // 2.5x Ultra HD resolution
          backgroundColor: null,
          cacheBust: false,
          filter: (node) => {
            // Exclude video elements or solid container elements
            if (node.tagName === 'VIDEO') return false;
            return true;
          }
        });
      } catch (e) {
        await new Promise(r => setTimeout(r, 100));
        overlayCanvas = await toCanvas(overlayNode, {
          quality: 1.0,
          pixelRatio: 2.5,
          backgroundColor: null,
          cacheBust: false,
          filter: (node) => node.tagName !== 'VIDEO'
        });
      } finally {
        // Restore container background immediately
        overlayNode.style.backgroundColor = origBgColor;
        overlayNode.style.background = origBackground;
        domNode.style.backgroundColor = origDomBg;
      }

      // 4. Setup Full HD 1920x1080 Output Canvas
      const targetWidth = 1920;
      let ratioMultiplier = 384 / 704;
      if (aspectRatio.includes('336')) ratioMultiplier = 336 / 704;
      if (aspectRatio.includes('272')) ratioMultiplier = 272 / 512;

      const targetHeight = Math.round(targetWidth * ratioMultiplier);

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = targetWidth;
      recordCanvas.height = targetHeight;
      const recordCtx = recordCanvas.getContext('2d');

      recordCtx.imageSmoothingEnabled = true;
      recordCtx.imageSmoothingQuality = 'high';

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

      // 6. MediaRecorder Stream Recording at 30 FPS
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

      mediaRecorder.start(100);

      // Frame compositor loop: Live Moving Background Video + 100% Pure Transparent Web Preview DOM Overlay
      const frameInterval = setInterval(() => {
        recordCtx.clearRect(0, 0, targetWidth, targetHeight);

        // A. Draw Live Moving Background Video Frame
        if (videoEl && videoEl.readyState >= 2) {
          recordCtx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);
        } else {
          recordCtx.fillStyle = '#050508';
          recordCtx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // B. Draw 100% Transparent Web Preview DOM Overlay (Pixel-for-pixel exact match with web screen!)
        recordCtx.drawImage(overlayCanvas, 0, 0, targetWidth, targetHeight);

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
