import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed, but standard ones are often fine
// Font.register({ family: 'Helvetica', src: '...' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155', // Slate 700
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#f59e0b', // Amber 500
        paddingBottom: 10,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#b45309', // Amber 700
    },
    logoSub: {
        fontSize: 10,
        color: '#64748b', // Slate 500
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b', // Slate 800
        textAlign: 'right',
    },
    infoSection: {
        backgroundColor: '#f8fafc', // Slate 50
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    infoLabel: {
        width: 100,
        fontWeight: 'bold',
        color: '#475569', // Slate 600
    },
    infoValue: {
        flex: 1,
        color: '#1e293b', // Slate 800
    },
    section: {
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0', // Slate 200
        borderRadius: 4,
    },
    summaryTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1e293b',
    },
    summaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryCol: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 8,
        color: '#64748b',
        marginBottom: 2,
    },
    summaryValue: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    table: {
        width: 'auto',
        marginTop: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    tableHeader: {
        backgroundColor: '#f8fafc',
        fontWeight: 'bold',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 5,
    },
    tableCell: {
        fontSize: 8,
        textAlign: 'left',
    },
    amountPos: {
        color: '#15803d', // Green 700
        fontWeight: 'bold',
    },
    amountNeg: {
        color: '#b91c1c', // Red 700
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
    watermark: {
        position: 'absolute',
        top: '40%',
        left: '20%',
        fontSize: 60,
        color: '#e2e8f0', // Very light gray (Slate 200)
        opacity: 0.3,
        transform: 'rotate(-45deg)',
        zIndex: -1,
    }
});

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

const BankStatementPDF = ({ data }: { data: StatementData }) => {
    // Calculate running balance for each transaction
    // Assuming transactions are sorted correctly (oldest to newest would be best for running balance, 
    // but usually they are delivered newest to oldest)

    // Let's sort them oldest to newest to calculate running balance correctly
    const sortedTransactions = [...data.transactions].sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    let currentBalance = Number(data.openingBalance || 0);
    const transactionsWithBalance = sortedTransactions.map(t => {
        // Enforce deduction for withdrawals and addition for deposits regardless of sign in data
        const amount = Math.abs(Number(t.amount || 0));
        if (t.type === 'withdrawal') {
            currentBalance = Number(currentBalance) - amount;
        } else {
            currentBalance = Number(currentBalance) + amount;
        }
        return { ...t, runningBalance: currentBalance };
    });

    // Now reverse back to newest first for display if desired, 
    // or keep oldest first. Bank statements usually go chronological or reverse chronological.
    // We'll stick to chronological for the table.
    const currencySymbol = data.currencySymbol || (data.currency === 'GHS' ? 'GH₵' : data.currency === 'EUR' ? '€' : data.currency === 'GBP' ? '£' : '$');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Watermark */}
                <Text style={styles.watermark} fixed>RORY BANK</Text>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View>
                            <Text style={styles.logo}>RORY BANK</Text>
                            <Text style={styles.logoSub}>Modern Banking Solutions</Text>
                            <Text style={[styles.logoSub, { fontSize: 8 }]}>42 Hopetoun St, Bathgate EH48 4EU, Scotland</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>ACCOUNT STATEMENT</Text>
                </View>

                {/* Account Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Account Number:</Text>
                        <Text style={styles.infoValue}>{data.accountNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>SWIFT Code:</Text>
                        <Text style={styles.infoValue}>{data.swiftCode || "SBGAKACC"}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>IBAN:</Text>
                        <Text style={styles.infoValue}>GB29N2BK601613319</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Statement Period:</Text>
                        <Text style={styles.infoValue}>{data.statementPeriod}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Statement Date:</Text>
                        <Text style={styles.infoValue}>{data.statementDate}</Text>
                    </View>
                </View>

                {/* Account Summary */}
                <View style={styles.section}>
                    <Text style={styles.summaryTitle}>ACCOUNT SUMMARY ({data.currency})</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryCol}>
                            <Text style={styles.summaryLabel}>Opening Balance</Text>
                            <Text style={styles.summaryValue}>{data.openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                        </View>
                        <View style={styles.summaryCol}>
                            <Text style={styles.summaryLabel}>Total Income</Text>
                            <Text style={styles.summaryValue}>{data.totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                        </View>
                        <View style={styles.summaryCol}>
                            <Text style={styles.summaryLabel}>Total Expenses</Text>
                            <Text style={styles.summaryValue}>{data.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                        </View>
                        <View style={styles.summaryCol}>
                            <Text style={styles.summaryLabel}>Closing Balance</Text>
                            <Text style={styles.summaryValue}>{data.closingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                        </View>
                    </View>
                </View>

                {/* Transactions Table */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Date</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Details</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Credit ({data.currency})</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Debit ({data.currency})</Text></View>
                        <View style={styles.tableCol}><Text style={styles.tableCell}>Balance ({data.currency})</Text></View>
                    </View>

                    {transactionsWithBalance.map((t, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{t.date}</Text>
                                <Text style={[styles.tableCell, { fontSize: 6, color: '#64748b' }]}>{t.time}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={styles.tableCell}>{t.description}</Text>
                                <Text style={[styles.tableCell, { fontSize: 6, color: '#64748b' }]}>{t.merchant}</Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={[styles.tableCell, styles.amountPos]}>
                                    {t.amount > 0 ? t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : ''}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={[styles.tableCell, styles.amountNeg]}>
                                    {t.amount < 0 ? `-${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : ''}
                                </Text>
                            </View>
                            <View style={styles.tableCol}>
                                <Text style={[styles.tableCell, { fontWeight: 'bold' }]}>{t.runningBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text>This statement was generated electronically and does not require a signature.</Text>
                    <Text>Rory Bank - Modern Banking Solutions | c 2025 Rory Bank. All rights reserved.</Text>
                </View>
            </Page>
        </Document>
    );
};

export default BankStatementPDF;
