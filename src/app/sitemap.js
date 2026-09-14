export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldenpalace.vn';

  // Danh sách các trang chính của website Golden Palace Nam Định
  const routes = [
    '',
    '/dich-vu',
    '/khong-gian',
    '/thuc-don',
    '/du-toan-chi-phi',
    '/ca-nhan-hoa',
    '/thiep',
  ];

  const currentDate = new Date().toISOString();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
