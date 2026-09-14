// LED Stage Screen Video Exporter — Fluid Moving Video + 100% Pure Transparent DOM Text Overlay (35Mbps Full HD MP4)
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
      // Ensure web fonts are loaded into font engine
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

      if (!domNode) {
        throw new Error('Không tìm thấy khung xem trước phông LED.');
      }

      const videoEl = domNode.querySelector('video');

      // 2. Hide video AND static background images/divs to capture 100% PURE TRANSPARENT OVERLAY (No background blocking video!)
      const bgEls = domNode.querySelectorAll('div[style*="background-image"], div[class*="bg-cover"], div[class*="bg-[#"]');
      const origDisplays = [];

      if (videoEl) {
        origDisplays.push({ el: videoEl, val: videoEl.style.display });
        videoEl.style.display = 'none';
      }

      bgEls.forEach(el => {
        origDisplays.push({ el, val: el.style.display });
        el.style.display = 'none';
      });

      const origBg = domNode.style.backgroundColor;
      domNode.style.backgroundColor = 'transparent';

      let overlayCanvas;
      try {
        overlayCanvas = await toCanvas(domNode, {
          quality: 1.0,
          pixelRatio: 3, // Ultra-sharp 3K render scale for text & logo crispness
          backgroundColor: null,
          cacheBust: false
        });
      } catch (e) {
        await new Promise(r => setTimeout(r, 100));
        overlayCanvas = await toCanvas(domNode, {
          quality: 1.0,
          pixelRatio: 3,
          backgroundColor: null,
          cacheBust: false
        });
      } finally {
        // Restore all background elements immediately!
        origDisplays.forEach(item => {
          item.el.style.display = item.val || '';
        });
        domNode.style.backgroundColor = origBg;
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

      // Stream setup at 30 FPS
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

      const totalFrames = durationSeconds * 30; // 6 seconds @ 30 FPS
      let currentFrame = 0;

      // Ensure video element is playing live
      if (videoEl) {
        try {
          videoEl.currentTime = 0;
          if (videoEl.paused) await videoEl.play();
        } catch (e) {}
      }

      mediaRecorder.start(100);

      // Frame compositor loop: Live Video + Pure Transparent DOM Text Overlay
      const frameInterval = setInterval(() => {
        recordCtx.clearRect(0, 0, targetWidth, targetHeight);

        // 1. Draw live moving video frame (fluid motion!)
        if (videoEl && videoEl.readyState >= 2) {
          recordCtx.drawImage(videoEl, 0, 0, targetWidth, targetHeight);
        } else {
          recordCtx.fillStyle = '#050508';
          recordCtx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // 2. Draw pure transparent text & logo overlay on top (No background blocking video!)
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
      reject(err);
    }
  });
}
