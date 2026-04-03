import BoardEditorPageClient from './board-editor-page-client';

export async function generateStaticParams() {
  return [{ id: 'placeholder' }];
}

export default async function BoardEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;
  return <BoardEditorPageClient />;
}
