// 80mm thermal receipt generation: print (HTML) and save-as-PDF (jsPDF).
// AIDO Paper Bags uses the same contact details as AIDO Group.
import { jsPDF } from 'jspdf';

const BRANCH_PROFILES = {
  AIDO_GROUP: {
    name: 'AIDO GROUP',
    tagline: 'Building Materials Shop',
    phone: '+250 780 407 093',
    address: 'Kabuga near Kabuga Market',
    email: 'aimaniyori03@gmail.com',
  },
  AIDO_PAPER_BAGS: {
    name: 'AIDO PAPER BAGS',
    tagline: 'Paper Bag Shop',
    phone: '+250 780 407 093',
    address: 'Kabuga near Kabuga Market',
    email: 'aimaniyori03@gmail.com',
  },
};

export const getBranchProfile = (branch) => BRANCH_PROFILES[branch] || BRANCH_PROFILES.AIDO_GROUP;

const formatMoney = (value) => (Number(value) || 0).toLocaleString('en-US');

const pad = (n) => String(n).padStart(2, '0');

const formatDate = (dateValue) => {
  try {
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return 'N/A';
  }
};

export const receiptItems = (sale) =>
  (sale?.products || []).map((p) => ({
    name: p.productName || 'Item',
    qty: p.quantitySold ?? p.quantity ?? 0,
    price: p.unitPrice || 0,
    total: p.totalPrice || (p.unitPrice || 0) * (p.quantitySold ?? p.quantity ?? 0),
  }));

export const receiptTotal = (sale) => {
  if (sale?.totalAmount != null) return Number(sale.totalAmount) || 0;
  return receiptItems(sale).reduce((sum, i) => sum + i.total, 0);
};

const receiptNumber = (sale) => `#${String(sale?._id || '').substring(0, 8).toUpperCase()}`;

const SEP = '--------------------------------';
const SEP_HEAVY = '================================';

const buildReceiptHtml = (sale, branch = 'AIDO_GROUP') => {
  const profile = getBranchProfile(branch);
  const items = receiptItems(sale);
  const total = receiptTotal(sale);

  const rows = items
    .map((i) => {
      const name = (i.name || '').substring(0, 18);
      const qtyLine = `  ${i.qty} x ${formatMoney(i.price)}`;
      return `<div class="row"><span>${name}</span><span>${formatMoney(i.total)}</span></div>${qtyLine}`;
    })
    .join('<br/>');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Receipt ${receiptNumber(sale)}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Courier New', 'Courier', monospace;
    font-size: 12px;
    line-height: 1.35;
    width: 72mm;
    margin: 2mm auto;
    color: #000;
  }
  .center { text-align: center; }
  .bold { font-weight: bold; }
  .brand { font-size: 15px; font-weight: bold; letter-spacing: 1px; }
  .sep { text-align: center; white-space: pre; }
  .row { display: flex; justify-content: space-between; }
  .row span:first-child { max-width: 48mm; overflow-wrap: break-word; }
  .totals { margin-top: 2mm; }
  .footer { margin-top: 3mm; text-align: center; }
</style>
</head>
<body>
  <div class="center brand">${profile.name}</div>
  <div class="center">${profile.tagline}</div>
  <div class="center">${profile.phone}</div>
  <div class="center">${profile.address}</div>
  <div class="center">${profile.email}</div>
  <div class="sep">${SEP}</div>
  <div class="row"><span>Date</span><span>${formatDate(sale?.saleDate)}</span></div>
  <div class="row"><span>Receipt No.</span><span>${receiptNumber(sale)}</span></div>
  <div class="row"><span>Customer</span><span>${String(sale?.clientName || 'Walk-in')}</span></div>
  <div class="sep">${SEP}</div>
  <div class="bold row"><span>ITEM</span><span>AMOUNT</span></div>
  <div>${rows}</div>
  <div class="sep">${SEP}</div>
  <div class="row"><span>Payment</span><span>${String(sale?.paymentMethod || 'Cash')}</span></div>
  <div class="totals bold row"><span>TOTAL</span><span>${formatMoney(total)} Frw</span></div>
  <div class="sep">${SEP_HEAVY}</div>
  <div class="footer">Thank you for shopping with us!</div>
</body>
</html>`;
};

// Opens a print window sized for 80mm paper and triggers the browser print
// dialog (thermal printer if installed).
export const printReceipt = (sale, branch = 'AIDO_GROUP') => {
  const html = buildReceiptHtml(sale, branch);
  const win = window.open('', '_blank', 'width=420,height=700,resizable=yes');
  if (!win) {
    throw new Error('Popup blocked. Allow popups to print receipts.');
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 300);
  return true;
};

// Generates an 80mm-wide PDF receipt (courier monospace) and saves it.
export const downloadReceiptPdf = (sale, branch = 'AIDO_GROUP') => {
  const profile = getBranchProfile(branch);
  const items = receiptItems(sale);
  const total = receiptTotal(sale);

  const PDF_WIDTH = 80;
  const PDF_HEIGHT = 120;
  const MARGIN = 4;
  const contentRight = PDF_WIDTH - MARGIN;

  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: [PDF_WIDTH, PDF_HEIGHT] });
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  const lineH = 4.2;

  let y = 8;
  const ensure = (needed = 8) => {
    if (y > PDF_HEIGHT - needed) {
      doc.addPage([PDF_WIDTH, PDF_HEIGHT], 'p');
      y = 8;
    }
  };

  const center = (text, bold = false) => {
    ensure();
    doc.setFont('courier', bold ? 'bold' : 'normal');
    doc.text(String(text), PDF_WIDTH / 2, y, { align: 'center' });
    y += lineH;
  };

  const twoCol = (left, right, bold = false) => {
    ensure();
    doc.setFont('courier', bold ? 'bold' : 'normal');
    doc.text(String(left), MARGIN, y);
    doc.text(String(right), contentRight, y, { align: 'right' });
    y += lineH;
  };

  const sep = (heavy = false) => {
    ensure();
    doc.setFont('courier', 'normal');
    doc.text(heavy ? SEP_HEAVY : SEP, PDF_WIDTH / 2, y, { align: 'center' });
    y += lineH;
  };

  center(profile.name, true);
  center(profile.tagline);
  center(profile.phone);
  center(profile.address);
  center(profile.email);
  sep();

  twoCol('Date', formatDate(sale?.saleDate));
  twoCol('Receipt No.', receiptNumber(sale));
  twoCol('Customer', String(sale?.clientName || 'Walk-in'));
  sep();

  twoCol('ITEM', 'AMOUNT', true);
  items.forEach((i) => {
    ensure();
    doc.setFont('courier', 'normal');
    const name = String(i.name).substring(0, 20);
    const qtyLine = `  ${i.qty} x ${formatMoney(i.price)}`;
    doc.text(name, MARGIN, y);
    doc.text(formatMoney(i.total), contentRight, y, { align: 'right' });
    y += lineH;
    ensure();
    doc.text(qtyLine, MARGIN, y);
    y += lineH;
  });
  sep();

  twoCol('Payment', String(sale?.paymentMethod || 'Cash'));
  twoCol('TOTAL', `${formatMoney(total)} Frw`, true);
  sep(true);

  center('Thank you for shopping');
  center('with us!');

  const fileName = `receipt-${String(sale?._id || 'offline').substring(0, 8)}-${Date.now()}.pdf`;
  doc.save(fileName);
  return true;
};
