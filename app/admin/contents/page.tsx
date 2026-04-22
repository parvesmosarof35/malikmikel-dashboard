"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary } from "@/contexts/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Trash2,
  Edit,
  X,
  HelpCircle,
  FileText,
  Shield,
  Info,
  Save,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Loader } from "@/components/ui/loader";

import {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} from "@/store/api/faqApi";
import {
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} from "@/store/api/termsApi";
import {
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
} from "@/store/api/privacyApi";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from "@/store/api/aboutUsApi";

type View = "faq" | "terms" | "privacy" | "about";

const navTabs: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: "faq", label: "FAQ", icon: <HelpCircle className="w-4 h-4" /> },
  { id: "terms", label: "Terms & Conditions", icon: <FileText className="w-4 h-4" /> },
  { id: "privacy", label: "Privacy Policy", icon: <Shield className="w-4 h-4" /> },
  { id: "about", label: "About Us", icon: <Info className="w-4 h-4" /> },
];

export default function ContentsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>("faq");

  useEffect(() => {
    if (!isAuthenticated) router.push("/auth");
    else if (user?.role !== "admin") router.push("/");
  }, [isAuthenticated, user, router]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-transparent p-6 space-y-6">
      {/* Header */}
      <div className={`${buttonbg} rounded-xl p-6 shadow-lg`}>
        <h1 className="text-2xl font-bold text-white mb-4">Content Management</h1>
        <div className="flex flex-wrap gap-2">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                view === tab.id
                  ? "bg-white text-[#2E6F65] shadow-md scale-105"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {view === "faq" && <FaqSection />}
        {view === "terms" && <TermsSection />}
        {view === "privacy" && <PrivacySection />}
        {view === "about" && <AboutSection />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────── FAQ SECTION ───────────────────────────────────── */

function FaqSection() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  const { data, isLoading, refetch } = useGetAllFaqQuery({ page, limit: 10 });
  const [deleteFaq] = useDeleteFaqMutation();

  const faqs: any[] = data?.data?.faqs || [];
  const meta = data?.data?.meta || { totalPages: 1, total: 0 };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this FAQ?")) return;
    try {
      await deleteFaq(id).unwrap();
      toast.success("FAQ deleted");
      refetch();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  return (
    <>
      {/* Sub-header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <HelpCircle className={`w-5 h-5 ${textPrimary}`} />
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{meta.total || 0} total FAQs</p>
        </div>
        <Button
          onClick={() => { setEditItem(null); setIsModalOpen(true); }}
          className={`${buttonbg} gap-2 font-semibold`}
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#2E6F65]/20 hover:bg-transparent">
              <TableHead className={`font-bold py-4 pl-6 ${textPrimary}`}>#</TableHead>
              <TableHead className={`font-bold py-4 ${textPrimary}`}>Question</TableHead>
              <TableHead className={`font-bold py-4 ${textPrimary}`}>Answer</TableHead>
              <TableHead className={`font-bold py-4 pr-6 text-right ${textPrimary}`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center"><Loader /></TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-20 text-center text-gray-400">
                  <HelpCircle className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                  No FAQs yet. Click "Add FAQ" to create one.
                </TableCell>
              </TableRow>
            ) : faqs.map((faq: any, i: number) => (
              <TableRow key={faq._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-0 group">
                <TableCell className="pl-6 font-medium text-gray-500 py-4">
                  {((page - 1) * 10 + i + 1).toString().padStart(2, "0")}
                </TableCell>
                <TableCell className="py-4 font-semibold text-gray-800 max-w-[280px]">
                  {faq.question}
                </TableCell>
                <TableCell className="py-4 text-gray-500 max-w-[380px] truncate">
                  {faq.answer}
                </TableCell>
                <TableCell className="py-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditItem(faq); setIsModalOpen(true); }}
                      className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq._id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/30">
        <Pagination>
          <PaginationContent className="gap-2">
            <PaginationItem>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-gray-500 hover:text-[#2E6F65] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <PaginationPrevious className="p-0 h-auto hover:bg-transparent" />
              </button>
            </PaginationItem>
            {Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <button
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg font-bold transition-all ${
                    page === p ? "bg-[#2E6F65] text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages || 1, p + 1))}
                disabled={page === meta.totalPages || !meta.totalPages}
                className="px-3 py-2 text-gray-500 hover:text-[#2E6F65] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <PaginationNext className="p-0 h-auto hover:bg-transparent" />
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <FaqModal
          item={editItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); refetch(); }}
        />
      )}
    </>
  );
}

/* FAQ Add/Edit Modal */
function FaqModal({ item, onClose, onSuccess }: { item: any; onClose: () => void; onSuccess: () => void }) {
  const [question, setQuestion] = useState(item?.question || "");
  const [answer, setAnswer] = useState(item?.answer || "");
  const [isLoading, setIsLoading] = useState(false);

  const [createFaq] = useCreateFaqMutation();
  const [updateFaq] = useUpdateFaqMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) { toast.error("Both fields are required"); return; }
    setIsLoading(true);
    try {
      if (item) {
        await updateFaq({ _id: item._id, data: { question, answer } }).unwrap();
        toast.success("FAQ updated successfully");
      } else {
        await createFaq({ question, answer }).unwrap();
        toast.success("FAQ created successfully");
      }
      onSuccess();
    } catch {
      toast.error(item ? "Failed to update FAQ" : "Failed to create FAQ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#2E6F65]">{item ? "Edit FAQ" : "Add New FAQ"}</h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Question</Label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. What is your refund policy?"
              className="h-12 rounded-xl"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">Answer</Label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write a clear, helpful answer..."
              className="min-h-[140px] rounded-xl"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-12 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className={`flex-1 h-12 rounded-xl ${buttonbg} font-bold flex items-center justify-center gap-2`}>
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : item ? "Update FAQ" : "Create FAQ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ──────────────────────────────── LEGAL DOC SECTIONS ──────────────────────────────────────── */

/** Shared editor UI — each caller passes its own typed data */
function LegalEditor({
  label,
  icon,
  hint,
  description,
  isLoading,
  onSave,
}: {
  label: string;
  icon: React.ReactNode;
  hint: string;
  description: string;
  isLoading: boolean;
  onSave: (content: string) => Promise<void>;
}) {
  const [content, setContent] = useState(description);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Sync when parent description loads from API
  useEffect(() => { setContent(description); }, [description]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content);
      toast.success(`${label} updated successfully`);
    } catch {
      toast.error(`Failed to update ${label}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className={textPrimary}>{icon}</span>
            {label}
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">{hint}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              showPreview
                ? "bg-[#2E6F65] text-white border-[#2E6F65]"
                : "border-gray-200 text-gray-600 hover:border-[#2E6F65] hover:text-[#2E6F65]"
            }`}
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className={`${buttonbg} gap-2 font-semibold flex items-center justify-center`}
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : showPreview ? (
          <div
            className="prose max-w-none min-h-[400px] p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400'>Nothing to preview yet.</p>" }}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <ChevronRight className="w-3 h-3" />
              HTML editor — supports &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`<h2>${label}</h2>\n<p>Write your content here...</p>`}
              className="min-h-[420px] rounded-2xl font-mono text-sm border-gray-200 focus:border-[#2E6F65] focus:ring-[#2E6F65]/20 resize-y"
            />
            <p className="text-xs text-gray-400 text-right">{content.length} characters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TermsSection() {
  const { data, isLoading } = useGetTermsAndConditionsQuery(undefined);
  const [updateTerms] = useUpdateTermsAndConditionsMutation();
  return (
    <LegalEditor
      label="Terms & Conditions"
      icon={<FileText className="w-5 h-5" />}
      hint="Write your Terms & Conditions using HTML tags for formatting."
      description={data?.data?.description || ""}
      isLoading={isLoading}
      onSave={(content) => updateTerms({ description: content }).unwrap()}
    />
  );
}

function PrivacySection() {
  const { data, isLoading } = useGetPrivacyQuery(undefined);
  const [updatePrivacy] = useUpdatePrivacyMutation();
  return (
    <LegalEditor
      label="Privacy Policy"
      icon={<Shield className="w-5 h-5" />}
      hint="Write your Privacy Policy. You can use HTML for rich formatting."
      description={data?.data?.description || ""}
      isLoading={isLoading}
      onSave={(content) => updatePrivacy({ description: content }).unwrap()}
    />
  );
}

function AboutSection() {
  const { data, isLoading } = useGetAboutUsQuery(undefined);
  const [updateAboutUs] = useUpdateAboutUsMutation();
  return (
    <LegalEditor
      label="About Us"
      icon={<Info className="w-5 h-5" />}
      hint="Describe your company, mission, and values."
      description={data?.data?.description || ""}
      isLoading={isLoading}
      onSave={(content) => updateAboutUs({ description: content }).unwrap()}
    />
  );
}
