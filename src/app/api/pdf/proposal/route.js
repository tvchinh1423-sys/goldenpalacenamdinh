import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import puppeteer from 'puppeteer';
import { format } from 'date-fns';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.findUnique({
      where: { linkToken: token },
      include: {
        proposals: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            venues: true,
            addOns: true,
            package: true
          }
        }
      }
    });

    if (!lead || lead.proposals.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const proposal = lead.proposals[0];
    const preferredVenue = proposal.venues.find(v => v.isPreferred) || proposal.venues[0];

    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));

    // Generate HTML for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Báo giá - Golden Palace</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 40px; }
        .header h1 { color: #D4AF37; margin: 0; font-size: 32px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; color: #666; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .info-grid div { width: 48%; }
        .info-grid p { margin: 5px 0; }
        .info-grid .title { color: #999; font-size: 14px; font-weight: bold; text-transform: uppercase; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th, .table td { padding: 15px; border-bottom: 1px solid #eee; text-align: left; }
        .table th { background-color: #fcfcfc; color: #666; font-weight: bold; }
        .table .right { text-align: right; }
        .table .price { font-weight: bold; color: #D4AF37; }
        .total-section { border-top: 2px dashed #D4AF37; padding-top: 20px; text-align: right; }
        .total-section h2 { margin: 0; font-size: 28px; color: #D4AF37; }
        .total-section p { margin: 5px 0 0 0; color: #666; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #999; }
        .disclaimer { background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 40px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>GOLDEN PALACE</h1>
        <p>BẢNG DỰ TRÙ CHI PHÍ TIỆC CƯỚI</p>
        <p style="font-size: 12px;">Mã KH: ${lead.code} | Phiên bản: ${proposal.version}</p>
      </div>

      <div class="info-grid">
        <div>
          <p class="title">Khách hàng</p>
          <p><strong>${lead.name}</strong></p>
          <p>${lead.phone}</p>
        </div>
        <div style="text-align: right;">
          <p class="title">Thông tin sự kiện</p>
          <p><strong>Ngày: ${format(new Date(proposal.eventDate), 'dd/MM/yyyy')} (${proposal.eventSession})</strong></p>
          <p>Quy mô: ${proposal.guestCount} khách (${proposal.mainTables} mâm)</p>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Hạng mục</th>
            <th>Diễn giải</th>
            <th class="right">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${preferredVenue ? `
          <tr>
            <td><strong>Hội trường</strong></td>
            <td>Sảnh ${preferredVenue.venueName}</td>
            <td class="right price">${formatCurrency(preferredVenue.venueFee)}</td>
          </tr>
          ` : ''}
          <tr>
            <td><strong>Thực đơn (Dự kiến)</strong></td>
            <td>${proposal.mainTables} mâm × ${formatCurrency(proposal.budgetPerTable)}</td>
            <td class="right price">${formatCurrency(Number(proposal.budgetPerTable) * proposal.mainTables)}</td>
          </tr>
          ${proposal.package ? `
          <tr>
            <td><strong>Gói dịch vụ</strong></td>
            <td>${proposal.package.name}</td>
            <td class="right price">${formatCurrency(proposal.packagePrice)}</td>
          </tr>
          ` : ''}
          ${proposal.addOns.length > 0 ? `
          <tr>
            <td><strong>Dịch vụ bổ sung</strong></td>
            <td>${proposal.addOns.map(a => a.addOnName).join(', ')}</td>
            <td class="right price">${formatCurrency(proposal.addOns.reduce((sum, a) => sum + Number(a.price), 0))}</td>
          </tr>
          ` : ''}
        </tbody>
      </table>

      <div class="total-section">
        <p>TỔNG CHI PHÍ DỰ TRÙ (VNĐ)</p>
        <h2>${formatCurrency(proposal.totalBase)}</h2>
        ${proposal.reserveTables > 0 ? `<p>Tối đa (nếu dùng hết mâm dự phòng): ${formatCurrency(proposal.totalMax)}</p>` : ''}
      </div>

      <div class="disclaimer">
        <strong>Lưu ý:</strong>
        <ul style="margin: 5px 0 0 0; padding-left: 20px;">
          <li>Bảng báo giá chưa bao gồm 8% VAT và chi phí đồ uống tiêu thụ thực tế.</li>
          <li>Báo giá có giá trị trong vòng 7 ngày.</li>
          <li>Để được hỗ trợ chi tiết, quý khách vui lòng liên hệ chuyên viên tư vấn.</li>
        </ul>
      </div>

      <div class="footer">
        Golden Palace Wedding & Convention Center<br>
        Hotline: 0900.xxx.xxx | Website: www.goldenpalace.vn<br>
        Tài liệu được tạo tự động vào ${format(new Date(), 'dd/MM/yyyy HH:mm')}
      </div>
    </body>
    </html>
    `;

    // Initialize Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="Bao_Gia_${lead.code}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
