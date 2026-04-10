"use client";

import CreateDocument from '@/pages/CreateDocument';
import Documents from '@/pages/Documents';
import { notFound } from 'next/navigation';

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isCreate = params.slug?.[0] === 'create';
  if (isCreate) {
    return <CreateDocument />;
  }
  return <Documents />;
}
