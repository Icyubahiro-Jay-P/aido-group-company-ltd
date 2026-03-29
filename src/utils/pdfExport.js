import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportTableToPDF = async (elementId, fileName = 'export.pdf', title = 'Report') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add title
    pdf.setFontSize(16);
    pdf.text(title, 15, 15);
    pdf.setFontSize(10);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 22);

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    let heightLeft = imgHeight;
    let position = 30;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
    heightLeft -= (pdf.internal.pageSize.getHeight() - position);

    // Add multiple pages if content is long
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth - 20, imgHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    // Save PDF
    pdf.save(`${fileName}-${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};

export const exportReceiptsToPDF = async (purchases, fileName = 'receipts') => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(16);
    pdf.text('Purchase Receipts Report', 15, yPosition);
    yPosition += 10;

    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 15, yPosition);
    yPosition += 10;

    // Summary
    const totalAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    pdf.setFontSize(11);
    pdf.text(`Total Receipts: ${purchases.length}`, 15, yPosition);
    yPosition += 6;
    pdf.text(`Total Amount: Fr${totalAmount.toLocaleString('en-RW')}`, 15, yPosition);
    yPosition += 10;

    // Table header
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(37, 99, 235); // Blue
    pdf.rect(10, yPosition - 6, pageWidth - 20, 8, 'F');
    pdf.text('Supplier', 15, yPosition);
    pdf.text('Invoice', 60, yPosition);
    pdf.text('Date', 100, yPosition);
    pdf.text('Items', 130, yPosition);
    pdf.text('Amount', 160, yPosition);
    yPosition += 10;

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Table rows
    purchases.forEach((purchase, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(9);
      const supplier = purchase.supplierName.substring(0, 20);
      const invoice = (purchase.invoiceNumber || '-').substring(0, 12);
      const date = new Date(purchase.purchaseDate).toLocaleDateString();
      const items = purchase.products.length;
      const amount = `Fr${purchase.totalAmount.toLocaleString('en-RW')}`;

      pdf.text(supplier, 15, yPosition);
      pdf.text(invoice, 60, yPosition);
      pdf.text(date, 100, yPosition);
      pdf.text(items.toString(), 130, yPosition);
      pdf.text(amount, 160, yPosition);

      yPosition += 7;
    });

    pdf.save(`${fileName}-${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};

export const exportInventoryToPDF = async (items, fileName = 'inventory') => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    pdf.setFontSize(16);
    pdf.text('Inventory Report', 15, yPosition);
    yPosition += 10;

    // Date
    pdf.setFontSize(10);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 15, yPosition);
    yPosition += 10;

    // Summary
    const totalValue = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    pdf.setFontSize(11);
    pdf.text(`Total Items: ${items.length}`, 15, yPosition);
    yPosition += 6;
    pdf.text(`Total Inventory Value: ${totalValue.toLocaleString()} Frw`, 15, yPosition);
    yPosition += 10;

    // Table header
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFillColor(37, 99, 235); // Blue
    pdf.rect(10, yPosition - 6, pageWidth - 20, 8, 'F');
    pdf.text('Product Name', 15, yPosition);
    pdf.text('SKU', 70, yPosition);
    pdf.text('Quantity', 110, yPosition);
    pdf.text('Unit Price', 140, yPosition);
    pdf.text('Total', 170, yPosition);
    yPosition += 10;

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Table rows
    items.forEach((item) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(9);
      const name = item.productName.substring(0, 30);
      const sku = item.sku.substring(0, 12);
      const quantity = item.quantity.toString();
      const unitPrice = item.unitPrice.toString();
      const total = (item.unitPrice * item.quantity).toString();

      pdf.text(name, 15, yPosition);
      pdf.text(sku, 70, yPosition);
      pdf.text(quantity, 110, yPosition);
      pdf.text(unitPrice, 140, yPosition);
      pdf.text(total, 170, yPosition);

      yPosition += 7;
    });

    pdf.save(`${fileName}-${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF: ' + error.message);
  }
};
