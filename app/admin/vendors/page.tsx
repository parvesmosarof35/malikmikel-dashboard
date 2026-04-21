"use client";

import { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  Star,
  Clock,
  ShieldCheck,
  X,
  GripVertical
} from "lucide-react";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { buttonbg, textPrimary, borderPrimary } from "@/contexts/theme";
import { useGetAllVendorsQuery, useDeleteVendorMutation, useCreateVendorMutation } from "@/store/api/vendorApi";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";

// Types
type Vendor = {
  id: string;
  name: string;
  badge: "Partner" | "Trending" | "NA" | "Popular" | "Trusted";
  type: string;
};

type Badge = {
  id: string;
  name: string;
  iconName: string;
};

// Mock Data
const initialVendors: Vendor[] = [
  { id: "01", name: "Air Condition", badge: "Partner", type: "Air Condition" },
  { id: "01", name: "Electric Work", badge: "Trending", type: "Electric Work" },
  { id: "01", name: "Electric Work", badge: "NA", type: "Electric Work" },
  { id: "01", name: "Electric Work", badge: "NA", type: "Electric Work" },
];

const initialBadges: Badge[] = [
  { id: "01", name: "Popular", iconName: "verified" },
  { id: "01", name: "Partner", iconName: "verified" },
  { id: "01", name: "Trusted", iconName: "verified" },
];

export default function VendorsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // State
  const [view, setView] = useState<"list" | "badges">("list");
  const [isRelationshipModalOpen, setIsRelationshipModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: vendorsResponse, isLoading } = useGetAllVendorsQuery({ page: currentPage, limit: 10 });
  const [deleteVendor] = useDeleteVendorMutation();
  const [createVendor] = useCreateVendorMutation();

  const vendors = vendorsResponse?.data || [];
  const meta = vendorsResponse?.meta || { totalPage: 1, total: 0 };
  const [badges, setBadges] = useState<Badge[]>(initialBadges);

  // Form State
  const [formIcon, setFormIcon] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [criteriaList, setCriteriaList] = useState([
    { id: 1, text: "Verified business registration and insurance", icon: "check" },
    { id: 2, text: "Minimum 4.8 star rating with 50+ reviews", icon: "star" },
    { id: 3, text: "Consistent response time under 2 hours", icon: "clock" },
    { id: 4, text: "Background check and identity verification completed", icon: "shield" },
  ]);
  const [showNote, setShowNote] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    } else if (user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCriteria = (id: number) => {
    setCriteriaList(criteriaList.filter(c => c.id !== id));
  };
  
  const addCriteria = () => {
      setCriteriaList([...criteriaList, { id: Date.now(), text: "", icon: "check" }]);
  }

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-transparent p-6 space-y-6">
      
      {/* Header */}
      <div className={`${buttonbg} rounded-t-xl p-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4`}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">
              <h1 className="text-2xl font-bold text-white">
                  {view === "list" ? "Vendor Lists" : "Vendor Badge"}
              </h1>
              
              <div className="bg-white rounded-lg p-1 flex items-center gap-1">
                 <button 
                    onClick={() => setView("list")}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${view === "list" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                 >
                    Vendor Lists
                 </button>
                 <button 
                    onClick={() => setView("badges")}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${view === "badges" ? "bg-gray-100 text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                 >
                    Badges
                 </button>
              </div>
          </div>
          
          <Button 
            onClick={() => {
                if (view === "list") setIsAddModalOpen(true);
                if (view === "badges") setIsRelationshipModalOpen(true);
            }} 
            className="bg-white text-[#2E6F65] hover:bg-white/90 font-bold w-full md:w-auto"
          >
              +Add New {view === "badges" && "Badge"}
          </Button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 overflow-hidden -mt-4 relative z-10 min-h-[500px] flex flex-col justify-between">
         {view === "list" ? (
             <>
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white">
                        <TableRow className="border-b border-[#2E6F65] hover:bg-transparent">
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary} pl-6`}>S.ID</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Name</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Badge</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Type</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary} text-right pr-6`}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20">
                                    <Loader />
                                </TableCell>
                            </TableRow>
                        ) : vendors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-20 text-gray-500">
                                    No vendors found
                                </TableCell>
                            </TableRow>
                        ) : vendors.map((vendor: any, i: number) => (
                            <TableRow key={vendor._id || i} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                <TableCell className="font-medium text-gray-600 py-4 pl-6">
                                    {((currentPage - 1) * 10 + i + 1).toString().padStart(2, '0')}
                                </TableCell>
                                <TableCell className="text-gray-900 font-medium py-4">{vendor.name}</TableCell>
                                <TableCell className="text-gray-600 py-4">Partner</TableCell>
                                <TableCell className="text-gray-600 py-4">{vendor.serviceType || "N/A"}</TableCell>
                                <TableCell className="py-4 pr-6">
                                    <div className="flex items-center justify-end gap-3">
                                        <button 
                                            onClick={async () => {
                                                if (window.confirm("Are you sure you want to delete this vendor?")) {
                                                    try {
                                                        await deleteVendor(vendor._id).unwrap();
                                                        toast.success("Vendor deleted successfully");
                                                    } catch (error) {
                                                        toast.error("Failed to delete vendor");
                                                    }
                                                }
                                            }}
                                            className="text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button className="text-gray-800 hover:text-black transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </div>
             {/* Pagination for List */}
              <div className="p-4 border-t border-gray-100">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-[#2E6F65] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PaginationPrevious className="hover:bg-transparent p-0 h-auto" />
                            </button>
                        </PaginationItem>
                        
                        {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <button 
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg border-0 transition-colors ${
                                        currentPage === page 
                                        ? "bg-[#2E6F65] text-white" 
                                        : "text-gray-600 hover:text-[#2E6F65] hover:bg-gray-100"
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
                                className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-[#2E6F65] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PaginationNext className="hover:bg-transparent p-0 h-auto" />
                            </button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
              </div>
             </>
         ) : (
            <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-white">
                        <TableRow className="border-b border-[#2E6F65] hover:bg-transparent">
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary} pl-6`}>S.ID</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Name</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary}`}>Name</TableHead>
                            <TableHead className={`font-semibold text-base py-5 ${textPrimary} text-right pr-6`}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {badges.map((badge, i) => (
                            <TableRow key={i} className="hover:bg-gray-50 border-b border-gray-100 last:border-0">
                                <TableCell className="font-medium text-gray-600 py-4 pl-6">{badge.id}</TableCell>
                                <TableCell className="text-gray-900 font-medium py-4">{badge.name}</TableCell>
                                <TableCell className="py-4">
                                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5" fill="white" textAnchor="middle" stroke="none" />
                                        <div className="absolute w-2 h-2 bg-blue-500 rotate-45"></div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-4 pr-6">
                                    <div className="flex items-center justify-end gap-3">
                                        <button className="text-red-500 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => setIsRelationshipModalOpen(true)}
                                            className="text-gray-800 hover:text-black transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
             {/* Pagination for Badges */}
             <div className="p-4 border-t border-gray-100">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" className="text-gray-500 hover:text-[#2E6F65]" />
                        </PaginationItem>
                         <PaginationItem>
                             <PaginationLink href="#" isActive className="bg-[#2E6F65] text-white hover:bg-[#2E6F65]/90 hover:text-white border-0">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                             <PaginationLink href="#" className="text-gray-600 hover:text-[#2E6F65] hover:bg-gray-100 border-0">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" className="text-gray-500 hover:text-[#2E6F65]" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
              </div>
            </>
         )}
      </div>

      {/* Vendor Relationship Modal */}
      {isRelationshipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-gray-50 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col my-8 animate-in fade-in zoom-in duration-200">
                
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    <h2 className={`text-2xl font-bold ${textPrimary} text-center`}>Vendor Relationship Type</h2>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-800 border-b pb-2">Vendor Relationship Type</h3>
                        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
                             <div className="space-y-2">
                                <Label>Title</Label>
                                <Input defaultValue="What does Partner mean?" />
                             </div>
                             <div className="space-y-4">
                                 <div className="space-y-2">
                                    <Label>Add Icon</Label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-12 h-12 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center cursor-pointer hover:bg-green-100 transition-colors"
                                    >
                                        {formIcon ? <Image src={formIcon} alt="icon" width={24} height={24} /> : <div className="w-3 h-3 bg-[#2E6F65] rounded-full"></div>}
                                    </div>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleIconUpload} />
                                 </div>
                                 <div className="flex items-center justify-end gap-2 pt-2">
                                     <span className="text-sm font-medium text-gray-600">Enable Modal</span>
                                     <Switch defaultChecked className="data-[state=checked]:bg-[#2E6F65]" />
                                 </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <h3 className="font-bold text-gray-800">Description Text</h3>
                        <div className="space-y-2">
                            <Label>Intro Description</Label>
                            <Textarea 
                                className="min-h-[80px] text-gray-500" 
                                defaultValue="Being a Caribee Partner means you've met our highest standards for quality, reliability, and customer service." 
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                         <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">Criteria List</h3>
                            <Button 
                                onClick={addCriteria}
                                variant="outline" 
                                className="text-green-600 bg-green-50 border-green-100 hover:bg-green-100 gap-1 h-8"
                            >
                                <Plus className="w-4 h-4" /> Add Item
                            </Button>
                         </div>
                         
                         <div className="space-y-3">
                            {criteriaList.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <GripVertical className="text-gray-400 w-5 h-5 cursor-move shrink-0" />
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 
                                            ${item.icon === 'check' ? 'bg-green-100 text-green-600' : 
                                              item.icon === 'star' ? 'bg-blue-100 text-blue-600' :
                                              item.icon === 'clock' ? 'bg-purple-100 text-purple-600' :
                                              'bg-orange-100 text-orange-600'}`}
                                    >
                                        {item.icon === 'check' && <CheckCircle2 className="w-5 h-5" />}
                                        {item.icon === 'star' && <Star className="w-5 h-5" />}
                                        {item.icon === 'clock' && <Clock className="w-5 h-5" />}
                                        {item.icon === 'shield' && <ShieldCheck className="w-5 h-5" />}
                                    </div>
                                    <Input defaultValue={item.text} className="flex-1 w-full" />
                                    <button 
                                        onClick={() => removeCriteria(item.id)}
                                        className="text-red-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full shrink-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                             <h3 className="font-bold text-gray-800">Supporting Note</h3>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Show Note</span>
                                <Switch checked={showNote} onCheckedChange={setShowNote} className="data-[state=checked]:bg-[#2E6F65]" />
                             </div>
                        </div>
                        {showNote && (
                            <div className="space-y-2">
                                <Label>Footer Reassurance Text</Label>
                                <Textarea 
                                    className="min-h-[80px] text-gray-400" 
                                    defaultValue="Partner status is reviewed quarterly to ensure continued excellence. This badge represents our commitment." 
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-6 pt-2 border-t border-gray-100 bg-gray-50 rounded-b-xl sticky bottom-0">
                     <Button 
                        onClick={() => setIsRelationshipModalOpen(false)}
                        variant="outline" 
                        className={`w-full sm:flex-1 h-11 border-[#2E6F65] ${textPrimary} hover:bg-green-50 font-semibold`}
                    >
                        Cancel
                     </Button>
                     <Button 
                         className={`w-full sm:flex-1 h-11 ${buttonbg} font-semibold`}
                         onClick={() => {
                             setIsRelationshipModalOpen(false);
                             // Handle save logic
                         }}
                     >
                        Download Invoice
                     </Button>
                </div>

            </div>
        </div>
      )}

       {/* Add Vendor Modal */}
       <AddVendorModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={async (formData) => {
             try {
                await createVendor(formData).unwrap();
                toast.success("Vendor created successfully");
                setIsAddModalOpen(false);
             } catch (error) {
                toast.error("Failed to create vendor");
             }
          }}
       />

    </div>
  );
}

// Add Vendor Modal Component
const AddVendorModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: FormData) => Promise<void> }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    await onSubmit(formData);
    setIsLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
           <h2 className="text-xl font-bold text-[#2E6F65]">Add New Vendor</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required placeholder="Malik service" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="vendor1@gmail.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required placeholder="0101010101" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="serviceType">Service Type</Label>
                <Input id="serviceType" name="serviceType" required placeholder="Catering" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required placeholder="123 Street Name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required placeholder="New York" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required placeholder="state" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="zip">Zip</Label>
                <Input id="zip" name="zip" required placeholder="10001" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" required placeholder="USA" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="serviceDescription">Service Description</Label>
                <Textarea id="serviceDescription" name="serviceDescription" required placeholder="High-quality catering services..." />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Vendor Image</Label>
                <div className="flex items-center gap-4">
                   <div className="w-20 h-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
                      {preview ? (
                          <Image src={preview} alt="preview" fill className="object-cover" />
                      ) : (
                          <ImageIcon className="text-gray-300 w-8 h-8" />
                      )}
                   </div>
                   <Input 
                      type="file" 
                      name="image" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="flex-1 cursor-pointer"
                      required
                   />
                </div>
              </div>
           </div>
           
           <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={isLoading} className={`flex-1 ${buttonbg}`}>
                {isLoading ? "Creating..." : "Create Vendor"}
              </Button>
           </div>
        </form>
      </div>
    </div>
  );
};
