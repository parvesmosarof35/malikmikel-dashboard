"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
    Eye, 
    XCircle, 
    X, 
    BarChart3, 
    Clock, 
    CheckCircle2, 
    AlertCircle 
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { textPrimary, buttonbg } from "@/contexts/theme";
import { useGetAllReportsQuery, useDeleteReportMutation } from "@/store/api/reportApi";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

// Report Detail Modal
const ReportDetailModal = ({ isOpen, onClose, report }: { isOpen: boolean; onClose: () => void; report: any }) => {
  if (!isOpen || !report) return null;
  
  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b pb-6">
                 <div className="w-14 h-14 rounded-full bg-[#2E6F65]/10 flex items-center justify-center text-[#2E6F65] text-xl font-bold border border-[#2E6F65]/20">
                    {report.userId?.userName?.charAt(0) || "U"}
                 </div>
                 <div>
                     <h3 className="text-xl font-bold text-gray-900">{report.userId?.userName || "Anonymous User"}</h3>
                     <p className="text-sm text-gray-500 font-medium">{report.userId?.email}</p>
                 </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Issue Type</p>
                        <p className="text-sm font-bold text-[#2E6F65] capitalize">{report.issueType?.replace('_', ' ')}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Status</p>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${report.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            <p className="text-sm font-bold text-gray-700 capitalize">{report.status}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Subject</p>
                    <p className="text-base font-bold text-gray-900 mb-3">{report.issueTitle}</p>
                    
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{report.description}</p>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <p className="text-xs text-gray-400 font-medium">Reported on: {new Date(report.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400 font-medium">ID: {report._id.slice(-8).toUpperCase()}</p>
                </div>
            </div>
            
            <Button onClick={onClose} className={`w-full h-12 rounded-xl font-bold ${buttonbg}`}>
                Close Report
            </Button>
        </div>
      </div>
    </div>
  );
};

export default function ReportPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: reportResponse, isLoading, refetch } = useGetAllReportsQuery({ page: currentPage, limit: 10 });
  const [deleteReport] = useDeleteReportMutation();

  const reports = reportResponse?.data || [];
  const meta = reportResponse?.meta || { 
    totalPage: 1, 
    total: 0, 
    pendingReports: 0, 
    completedReports: 0 
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else if (user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const handleDelete = async () => {
    if (!reportToDelete) return;
    try {
      await deleteReport(reportToDelete._id).unwrap();
      toast.success("Report deleted successfully");
      setIsDeleteOpen(false);
      setReportToDelete(null);
      refetch();
    } catch {
      toast.error("Failed to delete report");
    }
  };

  if (!user || user.role !== "admin") return null;

  const stats = [
    { label: "Total Reports", value: meta.total, icon: BarChart3, color: "bg-blue-500" },
    { label: "Pending", value: meta.pendingReports, icon: Clock, color: "bg-orange-500" },
    { label: "Completed", value: meta.completedReports, icon: CheckCircle2, color: "bg-green-500" },
  ];

  return (
    <div className="min-h-screen bg-transparent p-6 space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 animate-in slide-in-from-top-2 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                      <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  </div>
              </div>
          ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative z-10">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle className={`w-6 h-6 ${textPrimary}`} />
                User Reports & Issues
            </h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-xs font-bold text-gray-500">
                {meta.total} Total Entries
            </div>
        </div>

        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-gray-50/50">
                    <TableRow className="border-b border-gray-100 hover:bg-transparent">
                        <TableHead className={`font-bold py-5 ${textPrimary} pl-8`}>#</TableHead>
                        <TableHead className={`font-bold py-5 ${textPrimary}`}>User</TableHead>
                        <TableHead className={`font-bold py-5 ${textPrimary}`}>Issue Type</TableHead>
                        <TableHead className={`font-bold py-5 ${textPrimary}`}>Subject</TableHead>
                        <TableHead className={`font-bold py-5 ${textPrimary}`}>Date</TableHead>
                        <TableHead className={`font-bold py-5 ${textPrimary} text-right pr-8`}>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-20">
                                <Loader />
                            </TableCell>
                        </TableRow>
                    ) : reports.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-20">
                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                    <CheckCircle2 className="w-12 h-12 opacity-20" />
                                    <p className="font-bold">No reports found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : reports.map((report: any, i: number) => (
                        <TableRow key={report._id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group">
                             <TableCell className="font-bold text-gray-400 py-5 pl-8">
                                {((currentPage - 1) * 10 + i + 1).toString().padStart(2, '0')}
                             </TableCell>
                             <TableCell className="py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-[#2E6F65]/10 flex items-center justify-center text-sm font-bold text-[#2E6F65]">
                                        {report.userId?.userName?.charAt(0) || "U"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900 leading-none mb-1">{report.userId?.userName || "Anonymous"}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">{report.userId?.email}</span>
                                    </div>
                                </div>
                             </TableCell>
                             <TableCell className="py-5">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-gray-100 text-gray-500">
                                    {report.issueType?.replace('_', ' ')}
                                </span>
                             </TableCell>
                             <TableCell className="text-gray-900 font-bold py-5 max-w-[200px] truncate">
                                {report.issueTitle}
                             </TableCell>
                             <TableCell className="text-gray-500 font-bold py-5 text-sm">
                                {new Date(report.createdAt).toLocaleDateString()}
                             </TableCell>
                             <TableCell className="py-5 pr-8">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => { setSelectedReport(report); setIsViewOpen(true); }}
                                        className="p-2 rounded-xl text-gray-400 hover:text-[#2E6F65] hover:bg-green-50 transition-all"
                                        title="View Details"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    
                                    <button 
                                         onClick={() => { setReportToDelete(report); setIsDeleteOpen(true); }}
                                         className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                         title="Delete Report"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                             </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/30">
            <Pagination>
                <PaginationContent className="gap-2">
                    <PaginationItem>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#2E6F65] disabled:opacity-30 transition-colors"
                        >
                            <PaginationPrevious className="p-0 h-auto hover:bg-transparent" />
                        </button>
                    </PaginationItem>
                    
                    {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                            <button 
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${
                                    currentPage === page 
                                    ? "bg-[#2E6F65] text-white shadow-lg shadow-[#2E6F65]/30 scale-110" 
                                    : "text-gray-400 hover:text-gray-600 hover:bg-white"
                                }`}
                            >
                                {page}
                            </button>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(meta.totalPage, prev + 1))}
                            disabled={currentPage === meta.totalPage}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-[#2E6F65] disabled:opacity-30 transition-colors"
                        >
                            <PaginationNext className="p-0 h-auto hover:bg-transparent" />
                        </button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
      </div>

       {/* Report Details Modal */}
       <ReportDetailModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} report={selectedReport} />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-white rounded-2xl border-none shadow-2xl">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-black text-gray-900">Delete Report?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500 font-medium">
                    Are you sure you want to permanently delete the report from <span className="text-[#2E6F65] font-bold">@{reportToDelete?.userId?.userName}</span>? This action is irreversible.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 mt-4">
                <AlertDialogCancel onClick={() => setReportToDelete(null)} className="h-12 rounded-xl border-gray-100 font-bold">Cancel</AlertDialogCancel>
                <AlertDialogAction 
                    onClick={handleDelete} 
                    className="h-12 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold px-8 shadow-lg shadow-red-500/30"
                >
                    Yes, Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
