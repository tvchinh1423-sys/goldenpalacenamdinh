const http = require('http');
const { exec } = require('child_process');

const PORT = 4000;
const ZALO_GROUP_LINK = 'https://zalo.me/g/xlvgxc877';

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/dispatch') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('⚡ Received Lead Dispatch Request:', data.customerName, data.phone);

        const messageText = `🔔 THÔNG BÁO KHÁCH YÊU CẦU TƯ VẤN TIỆC CƯỚI
📌 Mã yêu cầu: ${data.leadCode || 'N/A'}
👤 Họ và tên: ${data.customerName || 'N/A'}
📞 Số điện thoại: ${data.phone || 'N/A'}
👥 Quy mô: ${data.guestCount || 0} khách
💰 Tổng dự toán: ${data.estimatedTotal ? data.estimatedTotal.toLocaleString('vi-VN') + ' VNĐ' : 'Chưa tính'}
🔗 Link dự toán: ${data.zaloChatUrl || ZALO_GROUP_LINK}`;

        console.log('====================================');
        console.log('FORMATED ZALO MESSAGE:');
        console.log(messageText);
        console.log('====================================');

        // Copy message to macOS Clipboard automatically
        const escapedMsg = messageText.replace(/"/g, '\\"');
        exec(`echo "${escapedMsg}" | pbcopy`, (err) => {
          if (err) console.error('pbcopy error:', err);
          else console.log('✅ Message copied to macOS Clipboard!');
        });

        // Open Zalo Group link directly on Mac
        exec(`open "${ZALO_GROUP_LINK}"`, (err) => {
          if (err) console.error('Open Zalo error:', err);
          else console.log('✅ Zalo Group opened automatically!');
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Dispatched to Zalo Bot!' }));
      } catch (e) {
        console.error('Dispatch parse error:', e);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Golden Palace Zalo Bot Local Service Running');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Zalo Bot Local Service running at http://localhost:${PORT}/dispatch`);
});
