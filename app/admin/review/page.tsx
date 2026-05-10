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
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  Trash2,
  Star,
  AlertCircle,
  RefreshCw,
  Search,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
} from "@/store/api/reviewApi";
import { getImageUrl } from "@/store/config/envConfig";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";
import { useDebounce } from "@/store/hooks";

// ── Types ──────────────────────────────────────────────────────────────────────
type ApiReview = {
  _id: string;
  rating: number;
  comment: string;
  serviceId: {
    _id: string;
    name: string;
    image: string;
  };
  userId: {
    _id: string;
    email: string;
  };
  RettingType: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function ReviewPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");

  // ── RTK Query ─────────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useGetAllReviewsQuery({ 
    page, 
    limit
  });
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // ── Delete confirmation ───────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<ApiReview | null>(null);

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
    else if (user?.role !== "admin") router.push("/");
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== "admin") return null;
  // ── Derived & Frontend Search ─────────────────────────────────────────────
  const allReviews: ApiReview[] = data?.meta?.data ?? [];
  const meta = data?.meta?.pagination;
  const totalPages = meta?.totalPages ?? 1;
  const averageRating = data?.meta?.averageRating ?? 0;

  // Handle search from frontend
  const filteredReviews = allReviews.filter((review) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      review.userId?.email?.toLowerCase().includes(searchStr) ||
      review.serviceId?.name?.toLowerCase().includes(searchStr) ||
      review.comment?.toLowerCase().includes(searchStr)
    );
  });

  const reviews = filteredReviews;

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteReview(deleteTarget._id).unwrap();
      toast.success("Review deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Failed to delete review");
    } finally {
      setDeleteTarget(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-transparent p-6 space-y-6">

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{meta?.total ?? "—"}</h3>
            <p className="text-gray-500 font-medium mt-1">Total Reviews</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#2E6F65]">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1)}</h3>
            <p className="text-gray-500 font-medium mt-1">Average Rating</p>
          </div>
          <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500">
            <Star className="w-6 h-6 fill-current" />
          </div>
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div
        className={`${buttonbg} rounded-t-xl p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
          <h2 className="text-white text-xl font-bold">Reviews</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden -mt-4 relative z-10 min-h-[400px] flex flex-col justify-between">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-gray-400">
            <Loader className="w-8 h-8 animate-spin text-[#2E6F65]" />
            <p className="text-sm">Loading reviews…</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-red-400">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">Failed to load reviews</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
              <RefreshCw className="w-4 h-4" /> Retry
            </Button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20 text-gray-400">
            <Star className="w-10 h-10" />
            <p className="text-sm">No reviews found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white">
                  <TableRow className="border-b border-[#2E6F65] hover:bg-transparent">
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary} pl-6`}>#</TableHead>
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>User</TableHead>
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Service</TableHead>
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Rating</TableHead>
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Comment</TableHead>
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Date</TableHead>
                    <TableHead className={`font-semibold text-base py-5 ${textPrimary} text-right pr-6`}>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review, i) => (
                    <TableRow key={review._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                      <TableCell className="font-medium text-gray-500 py-4 pl-6">
                        {(page - 1) * limit + i + 1}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-900">{review.userId?.email}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          {review.serviceId?.image ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                              <Image
                                src={getImageUrl(review.serviceId.image)}
                                alt={review.serviceId.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                              <Star className="w-4 h-4" />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                            {review.serviceId?.name}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold text-gray-900">{review.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500 py-4 max-w-[250px] truncate">
                        {review.comment}
                      </TableCell>
                      <TableCell className="text-gray-500 py-4 text-sm">{formatDate(review.createdAt)}</TableCell>
                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setDeleteTarget(review)}
                            className="text-red-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
                      className={page === 1 ? "pointer-events-none opacity-40" : "text-gray-500 hover:text-[#2E6F65]"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
                    <PaginationItem key={pg}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setPage(pg); }}
                        isActive={pg === page}
                        className={
                          pg === page
                            ? "bg-[#2E6F65] text-white hover:bg-[#2E6F65]/90 hover:text-white border-0"
                            : "text-gray-500 hover:text-[#2E6F65]"
                        }
                      >
                        {pg}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
                      className={page === totalPages ? "pointer-events-none opacity-40" : "text-gray-500 hover:text-[#2E6F65]"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>

      {/* ── Delete Confirmation Dialog ─────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review from{" "}
              <span className="font-semibold text-gray-800">{deleteTarget?.userId?.email}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" /> Deleting…
                </span>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
