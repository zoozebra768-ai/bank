import jsPDF from 'jspdf';

export interface StatementData {
  accountHolder: string;
  accountNumber: string;
  statementPeriod: string;
  statementDate: string;
  openingBalance: number;
  totalIncome: number;
  totalExpenses: number;
  closingBalance: number;
  currency?: string;
  currencySymbol?: string;
  swiftCode?: string;
  transactions: Array<{
    date: string;
    time: string;
    description: string;
    merchant: string;
    category: string;
    amount: number;
    status: string;
    type: "deposit" | "withdrawal";
  }>;
}

export const generateBankStatementPDF = (data: StatementData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor = [255, 140, 0] as const; // Amber
  const secondaryColor = [71, 85, 105];
  const currencySymbol = data.currencySymbol || '$';
  const lightGray = [248, 250, 252] as const; // Slate 50

  // Header Section
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 25, 'F');

  // Bank Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RORY BANK', 20, 18);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Modern Banking Solutions', 20, 22);

  // Statement Title
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCOUNT STATEMENT', pageWidth - 20, 18, { align: 'right' });

  // Account Information Section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, 35, pageWidth - 40, 45, 'F');

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Account Holder:', 25, 45);
  doc.text('Account Number:', 25, 52);
  doc.text('SWIFT Code:', 25, 59);
  doc.text('Statement Period:', 25, 66);
  doc.text('Statement Date:', 25, 73);

  doc.setFont('helvetica', 'normal');
  doc.text(data.accountHolder, 80, 45);
  doc.text(data.accountNumber, 80, 52);
  doc.text(data.swiftCode || "SBGAKACC", 80, 59);
  doc.text(data.statementPeriod, 80, 66);
  doc.text(data.statementDate, 80, 73);

  // Summary Section
  const summaryY = 90;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, summaryY, pageWidth - 40, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, summaryY, pageWidth - 40, 30, 'S');

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`ACCOUNT SUMMARY (${data.currency})`, 25, summaryY + 10);

  // Summary details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Opening Balance:', 25, summaryY + 20);
  doc.text('Total Income:', 25, summaryY + 25);
  doc.text('Total Expenses:', 25, summaryY + 30);

  const middle = pageWidth / 2; // Define middle for the new layout
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.openingBalance.toFixed(2)}`, middle - 20, summaryY + 15, { align: 'right' });
  doc.text(`${data.totalIncome.toFixed(2)}`, middle + 20, summaryY + 15);
  doc.text(`${data.totalExpenses.toFixed(2)}`, pageWidth - 20, summaryY + 15, { align: 'right' });
  doc.text(`${data.closingBalance.toFixed(2)}`, 20, summaryY + 35);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('* Totals exclude pending transactions', 25, summaryY + 35);

  // Closing Balance
  doc.setFont('helvetica', 'bold');
  doc.text('Closing Balance:', pageWidth - 80, summaryY + 20);
  doc.text(`${data.closingBalance.toFixed(2)}`, pageWidth - 25, summaryY + 20, { align: 'right' });

  // Transactions Section
  const transactionsY = summaryY + 40;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(20, transactionsY, pageWidth - 40, 15, 'F');

  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS', 25, transactionsY + 10);

  // Transaction Headers
  const headerY = transactionsY + 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', 25, headerY);
  doc.text('Description', 55, headerY);
  doc.text(`Credit (${data.currency})`, 110, headerY, { align: 'right' });
  doc.text(`Debit (${data.currency})`, 145, headerY, { align: 'right' });
  doc.text(`Balance (${data.currency})`, pageWidth - 25, headerY, { align: 'right' });

  // Transaction rows
  let currentY = headerY + 8;
  let runningBalance = Number(data.openingBalance || 0);

  data.transactions.forEach((transaction, index) => {
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
    }

    // Update running balance
    const amount = Math.abs(Number(transaction.amount || 0));
    if (transaction.type === 'withdrawal') {
      runningBalance = Number(runningBalance) - amount;
    } else {
      runningBalance = Number(runningBalance) + amount;
    }

    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Calculate how many lines each field will need
    const descLines = doc.splitTextToSize(transaction.description + (transaction.merchant ? ` - ${transaction.merchant}` : ''), 45);
    const maxLines = Math.max(descLines.length, 1);
    const rowHeight = maxLines * 4;

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }

    // Draw background rectangle
    doc.rect(20, currentY - 3, pageWidth - 40, rowHeight, 'F');

    // Date
    doc.text(transaction.date, 25, currentY);

    // Description
    doc.text(descLines, 55, currentY);

    // Credit (positive amounts)
    if (transaction.amount > 0) {
      doc.setTextColor(34, 197, 94); // Green
      doc.text(`${transaction.amount.toFixed(2)}`, 110, currentY, { align: 'right' });
    }

    // Debit (negative amounts)
    if (transaction.amount < 0) {
      doc.setTextColor(239, 68, 68); // Red
      doc.text(`-${Math.abs(transaction.amount).toFixed(2)}`, 145, currentY, { align: 'right' });
    }

    // Balance
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`${runningBalance.toFixed(2)}`, pageWidth - 25, currentY, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    currentY += rowHeight + 1;
  });

  // Footer
  const footerY = pageHeight - 30;
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This statement was generated electronically and does not require a signature.', 20, footerY);
  doc.text('For any questions regarding this statement, please contact customer service.', 20, footerY + 5);
  doc.text('Rory Bank - Modern Banking Solutions', pageWidth - 20, footerY + 5, { align: 'right' });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  }

  // Download the PDF
  const fileName = `RoryBank_Statement_${data.statementDate.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
