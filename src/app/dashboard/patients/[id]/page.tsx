import PatientDetailClient from './patient-detail-client';

export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <PatientDetailClient />;
}
