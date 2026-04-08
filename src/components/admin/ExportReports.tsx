import { useState, useEffect } from 'react';
import { User } from '../../App';
import { Booking, bookingService } from '../../services/bookingService';
import {
  Download,
  FileText,
  Calendar,
  IndianRupee,
  Package,
  Users,
  Trophy,
  XCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ReportData {
  id: string;
  name: string;
  type: 'booking' | 'payment' | 'inventory' | 'user' | 'tournament' | 'revenue';
  data: any[];
  dateRange: { start: string; end: string };
  generatedAt: string;
}

interface ExportReportsProps {
  currentUser: User;
  onClose?: () => void;
  isModal?: boolean;
  bookings?: Booking[];
  orders?: any[];
  inventory?: any[];
  activities?: any[];
}

export function ExportReports({ currentUser, onClose, isModal = true, bookings = [], orders = [], inventory = [], activities = [] }: ExportReportsProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState({ start: '2026-01-01', end: '2026-01-31' });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Mock report data
  const availableReports = [
    {
      id: 'booking',
      name: 'Booking Report',
      description: 'Detailed booking information with dates, times, and payments',
      icon: <Calendar className="w-5 h-5" />,
      type: 'booking'
    },
    {
      id: 'payment',
      name: 'Payment Report',
      description: 'Payment transactions and revenue analytics',
      icon: <IndianRupee className="w-5 h-5" />,
      type: 'payment'
    },
    {
      id: 'inventory',
      name: 'Inventory Report',
      description: 'Stock levels, suppliers, and product details',
      icon: <Package className="w-5 h-5" />,
      type: 'inventory'
    },
    {
      id: 'user',
      name: 'User Report',
      description: 'User activity, bookings, and preferences',
      icon: <Users className="w-5 h-5" />,
      type: 'user'
    },
    {
      id: 'tournament',
      name: 'Tournament Report',
      description: 'Tournament participation and results',
      icon: <Trophy className="w-5 h-5" />,
      type: 'tournament'
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Revenue analytics by turf, store, and time period',
      icon: <IndianRupee className="w-5 h-5" />,
      type: 'revenue'
    }
  ];

  // Mock data generators for different reports
  const generateReportData = (reportId: string) => {
    switch (reportId) {
      case 'booking':
        return bookings.length > 0 ? bookings : [{ id: '1', turfName: 'Elite Arena', userName: 'Demo', date: '2026', status: 'confirmed' }];
      case 'payment':
        return bookings.map(b => ({ id: b.id, customer: b.userName, amount: 500, method: b.paymentMethod || 'cash', status: b.paymentStatus, date: b.date }));
      case 'inventory':
        return inventory.length > 0 ? inventory : [{ category: 'System', message: 'Master Inventory Management active' }];
      case 'user':
        return activities.filter(a => a.action === 'LOGIN').map(a => ({ email: a.userName, lastActive: new Date(a.timestamp).toLocaleString() }));
      case 'tournament':
        return [{ name: 'Box Cricket Premier League', status: 'Ongoing', participants: 12 }];
      case 'revenue':
        return [
          { category: 'Turf Bookings', total: bookings.length * 500 },
          { category: 'Store Orders', total: orders.reduce((sum, o) => sum + o.total, 0) },
          { category: 'Grand Total', total: (bookings.length * 500) + orders.reduce((sum, o) => sum + o.total, 0) }
        ];
      default:
        return [];
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] ?? ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (data: any[], filename: string) => {
    // In a real implementation, we would use a library like jsPDF
    // For this demo, we'll simulate the process
    console.log(`Exporting ${filename} as PDF with ${data.length} records`);

    // Simulate PDF generation delay
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  };

  const handleExport = async () => {
    if (!selectedReport) return;

    setIsExporting(true);
    setExportStatus('idle');

    try {
      const reportData = generateReportData(selectedReport);
      const filename = `${selectedReport}-report-${new Date().toISOString().split('T')[0]}`;

      if (exportFormat === 'csv') {
        exportToCSV(reportData, filename);
      } else {
        await exportToPDF(reportData, filename);
        // In a real app, we would download the generated PDF
        console.log('PDF export completed');
      }

      setExportStatus('success');
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const content = (
    <div className={`bg-white rounded-xl w-full ${isModal ? 'shadow-2xl max-w-4xl max-h-[90vh] overflow-auto' : ''}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Export Reports</h2>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Selection */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
            <div className="space-y-3">
              {availableReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedReport === report.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      {report.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-1">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Export {availableReports.find(r => r.id === selectedReport)?.name}
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={() => setExportFormat('csv')}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span>CSV (Comma-Separated Values)</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value="pdf"
                        checked={exportFormat === 'pdf'}
                        onChange={() => setExportFormat('pdf')}
                        className="mr-2 text-purple-600 focus:ring-purple-500"
                      />
                      <span>PDF (Portable Document Format)</span>
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium mb-2">Report Preview</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-40 overflow-auto">
                    {(() => {
                      const data = generateReportData(selectedReport);
                      if (data.length === 0) return <p className="text-gray-500 italic">No data available for preview</p>;

                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs text-gray-500 border-b">
                                {Object.keys(data[0]).map(key => (
                                  <th key={key} className="pb-1 px-2">{key.charAt(0).toUpperCase() + key.slice(1)}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {data.slice(0, 3).map((row, index) => (
                                <tr key={index} className="text-sm border-b border-gray-100 last:border-0">
                                  {Object.values(row).map((value: any, i) => (
                                    <td key={i} className="py-2 px-2 whitespace-nowrap">{value}</td>
                                  ))}
                                </tr>
                              ))}
                              {data.length > 3 && (
                                <tr>
                                  <td colSpan={Object.keys(data[0]).length} className="text-center text-xs text-gray-400 pt-2 italic">
                                    +{data.length - 3} more rows...
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {exportStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>Report exported successfully!</span>
                  </div>
                )}

                {exportStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>Error exporting report. Please try again.</span>
                  </div>
                )}

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all ${isExporting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]'
                    }`}
                >
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Export {exportFormat.toUpperCase()} Report
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <FileText className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Report Selected</h3>
                <p className="text-gray-500 max-w-xs">
                  Select a report from the list to configure export options and preview data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {content}
    </div>
  );
}