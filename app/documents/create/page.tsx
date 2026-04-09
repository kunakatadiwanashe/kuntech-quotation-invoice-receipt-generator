"use client";

import CreateDocument from '@/pages/CreateDocument';
import { useSearchParams } from 'next/navigation';

export default function CreateDocumentPage() {
  const searchParams = useSearchParams();
  const type = searchParams ? searchParams.get('type') ?? 'quotation' : 'quotation';
  // CreateDocument uses useSearchParams internally
  return <CreateDocument />;
}
