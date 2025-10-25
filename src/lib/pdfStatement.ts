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
  transactions: Array<{
    date: string;
    time: string;
    description: string;
    merchant: string;
    category: string;
    amount: number;
    status: string;
  }>;
}

export const generateBankStatementPDF = (data: StatementData): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = [255, 140, 0]; // Amber
  const secondaryColor = [51, 65, 85]; // Slate
  const lightGray = [248, 250, 252]; // Slate 50
  
  // Header Section
  doc.setFillColor(...primaryColor);
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
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCOUNT STATEMENT', pageWidth - 20, 18, { align: 'right' });
  
  // Account Information Section
  doc.setFillColor(...lightGray);
  doc.rect(20, 35, pageWidth - 40, 40, 'F');
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Account Holder:', 25, 45);
  doc.text('Account Number:', 25, 52);
  doc.text('Statement Period:', 25, 59);
  doc.text('Statement Date:', 25, 66);
  
  doc.setFont('helvetica', 'normal');
  doc.text(data.accountHolder, 80, 45);
  doc.text(data.accountNumber, 80, 52);
  doc.text(data.statementPeriod, 80, 59);
  doc.text(data.statementDate, 80, 66);
  
  // Summary Section
  const summaryY = 85;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, summaryY, pageWidth - 40, 30, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, summaryY, pageWidth - 40, 30, 'S');
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCOUNT SUMMARY', 25, summaryY + 10);
  
  // Summary details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Opening Balance:', 25, summaryY + 20);
  doc.text('Total Income:', 25, summaryY + 25);
  doc.text('Total Expenses:', 25, summaryY + 30);
  
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.openingBalance.toFixed(2)}`, 80, summaryY + 20);
  doc.text(`${data.totalIncome.toFixed(2)}`, 80, summaryY + 25);
  doc.text(`${data.totalExpenses.toFixed(2)}`, 80, summaryY + 30);
  
  // Note about pending transactions
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('* Totals exclude pending transactions', 25, summaryY + 35);
  
  // Closing Balance
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Closing Balance:', pageWidth - 80, summaryY + 20);
  doc.text(`${data.closingBalance.toFixed(2)}`, pageWidth - 25, summaryY + 20, { align: 'right' });
  
  // Transactions Section
  const transactionsY = summaryY + 40;
  doc.setFillColor(...lightGray);
  doc.rect(20, transactionsY, pageWidth - 40, 15, 'F');
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS', 25, transactionsY + 10);
  
  // Transaction Headers
  const headerY = transactionsY + 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Date', 25, headerY);
  doc.text('Description', 60, headerY);
  doc.text('Merchant', 100, headerY);
  doc.text('Status', 140, headerY);
  doc.text('Amount', pageWidth - 25, headerY, { align: 'right' });
  
  // Transaction rows
  let currentY = headerY + 8;
  
  data.transactions.forEach((transaction, index) => {
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    
    // Calculate how many lines each field will need
    const descLines = doc.splitTextToSize(transaction.description, 50);
    const merchantLines = doc.splitTextToSize(transaction.merchant, 35);
    const maxLines = Math.max(descLines.length, merchantLines.length, 1);
    const rowHeight = maxLines * 3.5; // Height per line
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    
    // Draw background rectangle
    doc.rect(20, currentY - 2, pageWidth - 40, rowHeight, 'F');
    
    // Date (single line, top aligned)
    doc.text(transaction.date, 25, currentY);
    
    // Description (multi-line support)
    doc.text(descLines, 60, currentY);
    
    // Merchant (multi-line support)
    doc.text(merchantLines, 100, currentY);
    
    // Status (single line, top aligned) - highlight pending
    if (transaction.status === 'Pending') {
      doc.setTextColor(255, 140, 0); // Amber color for pending
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setTextColor(...secondaryColor);
      doc.setFont('helvetica', 'normal');
    }
    doc.text(transaction.status, 140, currentY);
    
    // Amount (single line, top aligned)
    const amountColor = transaction.amount > 0 ? [34, 197, 94] : [239, 68, 68]; // Green or Red
    doc.setTextColor(...amountColor);
    doc.text(`$${Math.abs(transaction.amount).toFixed(2)}`, pageWidth - 25, currentY, { align: 'right' });
    
    currentY += rowHeight + 1;
  });
  
  // Footer
  const footerY = pageHeight - 30;
  doc.setTextColor(...secondaryColor);
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
