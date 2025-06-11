import { NextRequest, NextResponse } from "next/server";
// import { parseDateRange } from "@/lib/date";
import { searchParamsCache } from "@/lib/searchparams";
// import { ReceivableParcel } from "types/models";
import { ActionResponse, QueryParams } from "@/types";
// import { formatCurrency } from "@/lib/utils";
import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet, 
  renderToStream,
  Font,
  Image,
  Link
} from '@react-pdf/renderer';
import { Readable } from "stream";
import { format } from 'date-fns';
import { BusReport, getBusReports } from "@/app/actions/bus.action";
import { parseDateRange } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils";

// Register fonts for PDF
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 5,
    paddingBottom: 40,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF'
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#189176',
    fontWeight: 'bold',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  dateRange: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2, 
  },
  tableContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableRowHeader: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    backgroundColor: '#f2f2f2',
  },
  tableRowFooter: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    backgroundColor: '#EAEAEA',
    fontWeight: 'bold',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableCell: {
    margin: 5,
    fontSize: 8,
    paddingHorizontal: 5,
  },
  headerCell: {
    margin: 5,
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  footerCell: {
    margin: 5,
    fontSize: 9,
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  column10: {
    width: "10%",
  },
  column15: {
    width: '15%',
  },
  column20: {
    width: "20%"
  },
  column50: {
    width: '50%',
  },
  column55: {
    width: "55%"
  },
  amountCell: {
    width: '20%',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    fontSize: 10,
    textAlign: 'center',
    color: '#666',
  }
});

// Create Document Component
const GeneratePdf = ({ 
  data, 
  columnTotals, 
  startDate, 
  endDate, 
  aggregate 
}: {
  data: Partial<BusReport>[],
  columnTotals: Record<string, null | number>,
  startDate?: Date,
  endDate?: Date,
  aggregate?: string
}) => {
  const title = aggregate === 'route' ? 'Bus Report (By Route)' : 'Bus Report';
  console.log("Generating PDF with data:", startDate);
  console.log("Generating PDF with data:", endDate);

  const dateRangeText = startDate && endDate 
    ? `Date Range: ${format(new Date(startDate), 'dd MMM yyyy')} - ${format(new Date(endDate), 'dd MMM yyyy')}`
    : startDate 
      ? `From: ${format(new Date(startDate), 'dd MMM yyyy')}` 
      : endDate 
        ? `To: ${format(new Date(endDate), 'dd MMM yyyy')}` 
        : '';

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5, borderBottom: '1pt solid #CCCCCC', paddingBottom: 5 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.header}>New Subhan Accounts</Text>
            <Text style={{ fontSize: 14, color: '#444444', marginBottom: 5 }}>{title}</Text>
            {dateRangeText && (
              <Text style={styles.dateRange}>{dateRangeText}</Text>
            )}
          </View>
        </View>

        <View style={styles.tableContainer}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRowHeader}>
              <View style={[styles.tableCol, styles.column15]}>
                <Text style={styles.headerCell}>Bus #</Text>
              </View>
              <View style={[styles.tableCol, styles.column15]}>
                <Text style={styles.headerCell}>Bus Owner</Text>
              </View>
              <View style={[styles.tableCol, styles.column10]}>
                <Text style={styles.headerCell}>Trips Count</Text>
              </View>
              <View style={[styles.tableCol, styles.column20]}>
                <Text style={styles.headerCell}>Passengers</Text>
              </View>
              <View style={[styles.tableCol, styles.amountCell]}>
                <Text style={styles.headerCell}>Expense</Text>
              </View>
              <View style={[styles.tableCol, styles.amountCell]}>
                <Text style={styles.headerCell}>Revenue</Text>
              </View>
            </View>
            
            {/* Table Body - Rows */}
            {data.map((row, index) => (
              <View key={index} style={[
                styles.tableRow,
                index % 2 === 1 ? { backgroundColor: '#f9f9f9' } : {}
              ]}>
                <View style={[styles.tableCol, styles.column15]}>
                  <Text style={styles.tableCell}>{row.busNumber}</Text>
                </View>
                <View style={[styles.tableCol, styles.column15]}>
                  <Text style={styles.tableCell}>{row.busOwner}</Text>
                </View>
                <View style={[styles.tableCol, styles.column10]}>
                  <Text style={styles.tableCell}>{row.tripsCount}</Text>
                </View>
                <View style={[styles.tableCol, styles.column20]}>
                  <Text style={styles.tableCell}>{row.passengers}</Text>
                </View>
                <View style={[styles.tableCol, styles.amountCell]}>
                  <Text style={styles.tableCell}>
                    {row.expenses !== undefined ? formatCurrency(row.expenses) : ''}
                  </Text>
                </View>
                <View style={[styles.tableCol, styles.amountCell]}>
                  <Text style={styles.tableCell}>
                    {row.revenue !== undefined ? formatCurrency(row.revenue) : ''}
                  </Text>
                </View>
              </View>
            ))}
            
            {/* Table Footer - Totals */}
            <View style={styles.tableRowFooter}>
              <View style={[styles.tableCol, styles.column15]}>
                <Text style={styles.footerCell}>Total:</Text>
              </View>
              <View style={[styles.tableCol, styles.column15]}>
                <Text style={styles.footerCell}></Text>
              </View>
              <View style={[styles.tableCol, styles.column10]}>
                <Text style={styles.footerCell}></Text>
              </View>
              <View style={[styles.tableCol, styles.column20]}>
                <Text style={styles.footerCell}></Text>
              </View>
              <View style={[styles.tableCol, styles.amountCell]}>
                <Text style={styles.footerCell}>
                  {columnTotals.expenses !== undefined ? formatCurrency(columnTotals.expenses) : ''}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.amountCell]}>
                <Text style={styles.footerCell}>
                  {columnTotals.revenue !== undefined ? formatCurrency(columnTotals.revenue) : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <Text style={styles.footer}>
          Generated on {format(new Date(), 'dd MMM yyyy, HH:mm')} | New Subhan Accounts ERP System
        </Text>
        <Text 
          style={styles.pageNumber} 
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
          fixed 
        />
      </Page>
    </Document>
  );
};


export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page') || '1';
  const pageSize = request.nextUrl.searchParams.get('pageSize') || "10";
  const dateFilter = request.nextUrl.searchParams.get('date') || null;
  const busIdsFilter = request.nextUrl.searchParams.get('bus') || '';
  // const aggregate = request.nextUrl.searchParams.get('aggregate') || '';
  // const route = request.nextUrl.searchParams.get('route');
  
  const { start, end } = parseDateRange(dateFilter);

  const queryParams ={
    page: page.toString(),
    pageSize: pageSize.toString(),
    startDate: start ? start.toISOString() : "",
    endDate: end ? end.toISOString() : "",
    busId: busIdsFilter ? busIdsFilter.split('.') : []
  };

  console.log("Query Params for PDF:", queryParams);
    try {
    const response: ActionResponse<BusReport> = await getBusReports(queryParams);

    if (response.error) {
      return new NextResponse(JSON.stringify({ error: 'Failed to fetch data' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // console.log("Receivables loaded successfully", response.data);

    const stream = await renderToStream(
      <GeneratePdf 
        data={Array.isArray(response?.items) ? response?.items : []}
        columnTotals={response?.columnTotals || {}}
        startDate={start ? start : undefined}
        endDate={end ? end : undefined}
        // aggregate={aggregate}
      />
    );
    
    return new NextResponse(stream as unknown as ReadableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="receivables-report-${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new NextResponse(JSON.stringify({ error: 'Error generating PDF' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}