import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import TableMenuDesignerClientPage from './TableMenuDesignerClientPage';

export default async function TableMenuDesignerPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin/login');

  const resolvedSearchParams = await searchParams;
  const initialLeadId = resolvedSearchParams?.leadId || '';

  // Fetch all leads with proposals to let staff choose any saved party
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      proposals: {
        orderBy: { version: 'desc' },
        take: 1
      }
    }
  });

  const formattedLeads = leads.map(l => ({
    id: l.id,
    code: l.code,
    name: l.name,
    brideGroomNames: l.brideGroomNames || l.name,
    eventDate: l.proposals[0]?.eventDate 
      ? new Date(l.proposals[0].eventDate).toLocaleDateString('vi-VN')
      : ''
  }));

  return (
    <TableMenuDesignerClientPage 
      leads={formattedLeads} 
      initialLeadId={initialLeadId} 
    />
  );
}
