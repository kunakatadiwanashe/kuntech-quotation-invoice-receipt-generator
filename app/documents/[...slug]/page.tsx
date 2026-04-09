"use client";

import CreateDocument from '@/pages/CreateDocument';
import Documents from '@/pages/Documents';
import { notFound } from 'next/navigation';

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simple slug-based routing: if params.slug exists and startsWith 'create', show CreateDocument with type
  // else show Documents list
  const isCreate = params.slug?.[0] === 'create';
  if (isCreate) {
    return <CreateDocument />;
  }
  return <Documents />;
}
