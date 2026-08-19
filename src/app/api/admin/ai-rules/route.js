import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

const INITIAL_TRAINED_RULES = [
  {
    keywords: "gửi xe, đỗ xe, bãi xe, chỗ đỗ ô tô, gửi xe ô tô, đỗ xe máy",
    answer: "Dạ Golden Palace có bãi đỗ xe ô tô và xe máy rộng rãi ngay tại khuôn viên nhà hàng hoàn toàn miễn phí ạ.",
    category: "TIEN_ICH",
    displayOrder: 1
  },
  {
    keywords: "giờ mở cửa, tham quan sảnh, giờ đón khách, địa chỉ nhà hàng, đến xem sảnh",
    answer: "Dạ Golden Palace tọa lạc tại 98 Đông A, KĐT Hòa Vượng, TP Nam Định. Giờ đón khách tham quan sảnh trực tiếp từ 8h00 – 21h00 tất cả các ngày trong tuần ạ.",
    category: "CHUNG",
    displayOrder: 2
  },
  {
    keywords: "tầng 4, 100 khách, 150 khách, 200 khách, 250 khách, 300 khách, tiệc quy mô vừa",
    answer: "Dạ Hội trường Tầng 4 có sức chứa 100 – 300 khách (10 – 30 mâm), không gian ấm cúng, sang trọng, trang bị màn hình LED sắc nét và âm thanh ánh sáng hiện đại. Phù hợp cho tiệc quy mô vừa & ấm cúng.",
    category: "SANH",
    displayOrder: 3
  },
  {
    keywords: "tầng 3, 350 khách, 400 khách, 500 khách, 600 khách, 650 khách",
    answer: "Dạ Hội trường Tầng 3 mang phong cách hoàng gia đẳng cấp, sức chứa 300 – 650 khách, trang bị màn hình LED 30m², giàn đèn bướm lộng lẫy và đường dẫn hoa lụa cao cấp.",
    category: "SANH",
    displayOrder: 4
  },
  {
    keywords: "tầng 2, 700 khách, 750 khách, tiệc lớn, hội trường lớn nhất, 500 khách trở lên",
    answer: "Dạ Hội trường Tầng 2 là đại cung điện lớn nhất và hoành tráng nhất tại Golden Palace với sức chứa 350 – 750 khách, màn hình LED cỡ lớn và giàn đèn pha lê hoàng gia.",
    category: "SANH",
    displayOrder: 5
  },
  {
    keywords: "quầy bar, tầng 1, lounge, sinh nhật, báo hỷ, cocktail, tiệc sinh nhật",
    answer: "Dạ Quầy Bar Tầng 1 có sức chứa 50 – 100 khách, thiết kế phong cách lounge hiện đại, rất phù hợp cho tiệc sinh nhật, báo hỷ, cocktail party và gặp mặt thân mật.",
    category: "SANH",
    displayOrder: 6
  },
  {
    keywords: "phòng vip, tiệc nhỏ gia đình, 10 khách, 20 khách, 30 khách, 40 khách, 50 khách, gặp đối tác",
    answer: "Dạ hệ thống Phòng VIP tại Golden Palace có sức chứa từ 10 – 50 khách, không gian riêng tư, sang trọng, rất phù hợp cho tiệc gia đình ấm cúng hoặc tiếp đón đối tác.",
    category: "SANH",
    displayOrder: 7
  },
  {
    keywords: "đồ uống, phí mang vào, mang rượu, mang bia, rượu ngâm, phí nút chai, mang đồ uống",
    answer: "Dạ tiền đồ uống tại Golden Palace được tính theo số lượng sử dụng thực tế sau tiệc. Quý khách được phép mang đồ uống/rượu từ bên ngoài vào (có tính phí dịch vụ phục vụ & ly cốc niêm yết).",
    category: "THUC_DON",
    displayOrder: 8
  },
  {
    keywords: "giá mâm cỗ, giá 1 mâm, mâm cỗ bao nhiêu, giá tiệc cưới, giá sảnh, bảng giá, chi phí tiệc",
    answer: "Dạ giá thực đơn tiệc và dịch vụ được tính toán linh hoạt tùy thuộc theo quy mô số lượng mâm và thời điểm tổ chức. Quý khách có thể tự tính chi phí trọn gói tự động tại trang [Dự toán Chi phí](/du-toan-chi-phi) hoặc gọi Hotline 0228 659 5959 ạ.",
    category: "DU_TOAN",
    displayOrder: 9
  },
  {
    keywords: "quy trình đặt tiệc, đặt cọc, cọc bao nhiêu, giữ ngày, giữ sảnh, hợp đồng đặt tiệc",
    answer: "Dạ quy trình đặt tiệc cưới tại Golden Palace gồm 3 giai đoạn: Giai đoạn 1 (3 tháng trước: Khảo sát & Đặt cọc giữ ngày đẹp) → Giai đoạn 2 (1 tháng trước: Ký hợp đồng & Chốt menu) → Giai đoạn 3 (1 ngày trước: Bàn giao thông tin & chốt tiệc).",
    category: "DU_TOAN",
    displayOrder: 10
  },
  {
    keywords: "cuối tuần, thứ 7, chủ nhật, ngày lễ, ngày đẹp, chọn ngày đẹp",
    answer: "Dạ Golden Palace phục vụ tất cả các ngày trong tuần, kể cả thứ 7, Chủ Nhật và ngày lễ. Tuy nhiên các ngày đẹp cuối tuần thường kín sảnh sớm, Quý khách nên liên hệ đặt sảnh trước 2 – 3 tháng ạ.",
    category: "TIEN_ICH",
    displayOrder: 11
  },
  {
    keywords: "thanh toán, chuyển khoản, tiền mặt, quẹt thẻ, trả tiền tiệc",
    answer: "Dạ nhà hàng chấp nhận thanh toán bằng Tiền mặt hoặc Chuyển khoản ngân hàng. Quý khách thanh toán đợt cuối sau khi kết thúc tiệc cưới.",
    category: "DU_TOAN",
    displayOrder: 12
  },
  {
    keywords: "ăn chay, thực đơn chay, món chay, dị ứng thực phẩm",
    answer: "Dạ Golden Palace có thiết kế thực đơn tiệc chay riêng biệt theo yêu cầu của Quý khách. Vui lòng trao đổi trực tiếp với chuyên viên tư vấn qua Hotline 0228 659 5959 để được chuẩn bị chu đáo ạ.",
    category: "THUC_DON",
    displayOrder: 13
  },
  {
    keywords: "decor bên ngoài, tự trang trí, mang hoa vào, đơn vị decor, trang trí riêng",
    answer: "Dạ Quý khách có thể tự mang đơn vị trang trí (decor) từ bên ngoài vào sảnh (nhà hàng có áp dụng phí mặt bằng & điện nước hỗ trợ). Vui lòng liên hệ Hotline 0228 659 5959 để trao đổi chi tiết.",
    category: "DICH_VU",
    displayOrder: 14
  }
];

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let rules = await prisma.aiRule.findMany({
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Auto-seed initial trained rules if table is empty
    if (rules.length === 0) {
      for (const item of INITIAL_TRAINED_RULES) {
        await prisma.aiRule.create({ data: item });
      }
      rules = await prisma.aiRule.findMany({
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      });
    }

    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error fetching AI rules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { keywords, answer, category = 'CHUNG', isActive = true } = body;

    if (!keywords || !answer) {
      return NextResponse.json({ error: 'Từ khóa và Câu trả lời là bắt buộc' }, { status: 400 });
    }

    const newRule = await prisma.aiRule.create({
      data: {
        keywords: keywords.trim(),
        answer: answer.trim(),
        category,
        isActive: Boolean(isActive)
      }
    });

    return NextResponse.json(newRule, { status: 201 });
  } catch (error) {
    console.error('Error creating AI rule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, keywords, answer, category, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updatedRule = await prisma.aiRule.update({
      where: { id },
      data: {
        ...(keywords !== undefined && { keywords: keywords.trim() }),
        ...(answer !== undefined && { answer: answer.trim() }),
        ...(category !== undefined && { category }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      }
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Error updating AI rule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.aiRule.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting AI rule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
