import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { generateChartImage } from "./generateChartImage";

export async function toBase64Image(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export async function exportReportPDF({
  title,
  headers,
  rows,
  chartData = null,
  chartOptions = null,
  filename,
  rolePermissions,
  branding = {
    logoUrl: "/assets/images/Spectra-Logo_192x192.png",
    companyName: "Spectra",
    companyAddress:
      "Plot No. 21-22, Phase-IV, Udyog Vihar, Gurugram, Haryana, India - 122015",
  },
}) {
  if (!rolePermissions.canViewReports) {
    alert("You do not have permission to export reports.");
    return;
  }

  const doc = new jsPDF("p", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor("#5B8AC3");
  doc.rect(0, 0, pageWidth, 85, "F");

  let logoBase64 = null;
  if (branding.logoUrl) {
    try {
      logoBase64 = await toBase64Image(branding.logoUrl);
    } catch (e) {
      console.warn("Logo load failed", e);
    }
  }

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 40, 20, 50, 50);
  }

  doc.setTextColor("#fff");
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(branding.companyName, 100, 50);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(branding.companyAddress, 100, 65);

  doc.setTextColor("#000");
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title || "", pageWidth / 2, 110, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 130, {
    align: "center",
  });

  let tableStartY = 160;


if (chartData && chartOptions) {
  try {
    const base64Image = await generateChartImage(chartData, chartOptions);
    const chartWidth = pageWidth - 80;
    const chartHeight = chartWidth / 2;
    // Remove the additional setTimeout here, directly add image
    try {
      doc.addImage(base64Image, "PNG", 40, 145, chartWidth, chartHeight);
      tableStartY = 145 + chartHeight + 20;
    } catch (imageError) {
      console.error("Failed to embed chart image into PDF:", imageError);
      alert("Chart image embedding failed, exporting data only.");
    }
  } catch (e) {
    alert("Chart image generation failed, exporting data only.");
  }
}


  autoTable(doc, {
    startY: tableStartY,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: {
      fillColor: "#5B8AC3",
      fontStyle: "bold",
      textColor: "#FFF",
      fontSize: 12,
    },
    bodyStyles: { textColor: "#2A2A2A", fontSize: 11 },
    styles: { halign: "center", valign: "middle" },
    margin: { left: 40, right: 40 },
    didDrawPage: () => {
      const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
      doc.setFontSize(8);
      doc.setTextColor("#444");
      doc.text("Spectra Wi-Fi Management Portal | Confidential", 40, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Page ${pageNumber}`, pageWidth - 60, doc.internal.pageSize.getHeight() - 10);
    },
  });

  doc.save(filename);
}
