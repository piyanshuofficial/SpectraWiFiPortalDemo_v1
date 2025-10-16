// src/utils/exportElementToPDF.js

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportElementToPDF = async (elementId, filename = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Element for PDF export not found');
    return;
  }
  const canvas = await html2canvas(element, { scale: 2 });
  const imageData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};
