import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InvoiceDocument } from '@/types';

export function generatePDF(doc: InvoiceDocument) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Header
  pdf.setFillColor(20, 50, 90);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KunTechnologies', 14, 20);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Innovation • Technology • Solutions', 14, 28);

  // Document type badge
  const typeLabel = doc.type.charAt(0).toUpperCase() + doc.type.slice(1);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(typeLabel, pageWidth - 14, 20, { align: 'right' });
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`#${doc.documentNumber}`, pageWidth - 14, 28, { align: 'right' });

  // Reset text color
  pdf.setTextColor(30, 30, 30);

  // Company info
  let y = 52;
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('KunTechnologies Ltd.', 14, y);
  pdf.text('info@kuntechnologies.com | +254 700 000 000', 14, y + 5);
  pdf.text('Nairobi, Kenya', 14, y + 10);

  // Customer info
  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', pageWidth - 80, y);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(doc.customer.name, pageWidth - 80, y + 6);
  if (doc.customer.company) pdf.text(doc.customer.company, pageWidth - 80, y + 12);
  pdf.text(doc.customer.email, pageWidth - 80, y + (doc.customer.company ? 18 : 12));
  pdf.text(doc.customer.phone, pageWidth - 80, y + (doc.customer.company ? 24 : 18));

  // Dates
  y = 90;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Date: ${new Date(doc.createdAt).toLocaleDateString()}`, 14, y);
  if (doc.dueDate) pdf.text(`Due: ${new Date(doc.dueDate).toLocaleDateString()}`, 14, y + 5);
  if (doc.validUntil) pdf.text(`Valid Until: ${new Date(doc.validUntil).toLocaleDateString()}`, 14, y + 5);
  if (doc.paymentStatus) {
    pdf.text(`Status: ${doc.paymentStatus.toUpperCase()}`, pageWidth - 80, y);
  }

  // Items table
  y = doc.dueDate || doc.validUntil ? 102 : 97;
  autoTable(pdf, {
    startY: y,
    head: [['#', 'Service/Product', 'Description', 'Qty', 'Price', 'Total']],
    body: doc.items.map((item, i) => [
      i + 1,
      item.name,
      item.description,
      item.quantity,
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [20, 50, 90], fontSize: 9, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right' },
    },
  });

  // Totals
  const finalY = (pdf as any).lastAutoTable.finalY + 10;
  const totalsX = pageWidth - 80;

  pdf.setFontSize(9);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Subtotal:', totalsX, finalY);
  pdf.text(`$${doc.subtotal.toFixed(2)}`, pageWidth - 14, finalY, { align: 'right' });

  if (doc.discount > 0) {
    pdf.text('Discount:', totalsX, finalY + 7);
    pdf.text(`-$${doc.discount.toFixed(2)}`, pageWidth - 14, finalY + 7, { align: 'right' });
  }
  if (doc.tax > 0) {
    const taxY = doc.discount > 0 ? finalY + 14 : finalY + 7;
    pdf.text(`Tax (${doc.taxRate}%):`, totalsX, taxY);
    pdf.text(`$${doc.tax.toFixed(2)}`, pageWidth - 14, taxY, { align: 'right' });
  }

  const totalY = finalY + (doc.discount > 0 ? 7 : 0) + (doc.tax > 0 ? 7 : 0) + 7;
  pdf.setDrawColor(20, 50, 90);
  pdf.line(totalsX, totalY - 3, pageWidth - 14, totalY - 3);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(20, 50, 90);
  pdf.text('Total:', totalsX, totalY + 3);
  pdf.text(`$${doc.total.toFixed(2)}`, pageWidth - 14, totalY + 3, { align: 'right' });

  // Payment info for receipts
  if (doc.type === 'receipt' && doc.paymentMethod) {
    const py = totalY + 15;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Payment Method: ${doc.paymentMethod.replace('_', ' ').toUpperCase()}`, 14, py);
    if (doc.amountPaid !== undefined) pdf.text(`Amount Paid: $${doc.amountPaid.toFixed(2)}`, 14, py + 6);
    if (doc.balance !== undefined && doc.balance > 0) pdf.text(`Balance: $${doc.balance.toFixed(2)}`, 14, py + 12);
  }

  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 15;
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  pdf.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
  pdf.text('KunTechnologies — Empowering Business Through Technology', pageWidth / 2, footerY + 4, { align: 'center' });

  return pdf;
}

export function downloadPDF(doc: InvoiceDocument) {
  const pdf = generatePDF(doc);
  pdf.save(`${doc.documentNumber}.pdf`);
}

export function printPDF(doc: InvoiceDocument) {
  const pdf = generatePDF(doc);
  pdf.autoPrint();
  window.open(pdf.output('bloburl'), '_blank');
}
