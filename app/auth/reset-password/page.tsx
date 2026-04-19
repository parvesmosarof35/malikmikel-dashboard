"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { buttonbg } from "@/contexts/theme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useResetPasswordAdminMutation } from "@/store/api/adminApi";
import { toast } from "sonner";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordAdminMutation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem("verifiedEmail") || sessionStorage.getItem("resetEmail");
    if (verifiedEmail) {
      setEmail(verifiedEmail);
    } else {
      toast.error("Session expired. Please try again.");
      router.push("/auth/forget-password");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const res = await resetPassword({ email, newPassword, confirmPassword }).unwrap();
      if (res.success) {
        toast.success(res.message || "Password changed successfully");
        sessionStorage.removeItem("resetEmail");
        sessionStorage.removeItem("verifiedEmail");
        router.push("/auth");
      } else {
        toast.error(res.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-5">
      <div className="container mx-auto">
        <div className="flex  justify-center items-center">
          <div className="w-full lg:w-1/2 bg-white p-5 md:px-18 md:py-28 shadow-[0px_10px_20px_rgba(0,0,0,0.2)] rounded-2xl">
            <div className="flex justify-center items-center">
               <Image className="mx-auto my-5" src="/clientLogo.png" alt="Logo" width={200} height={200} />
            </div>
            <h2 className="text-[#0D0D0D] text-2xl  font-bold text-center mb-5">
              Set a new password
            </h2>
            <p className="text-[#6A6D76] text-center mb-10">
              Create a new password. Ensure it differs from previous ones for
              security
            </p>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="**********"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="w-full">
                <label className="text-xl text-[#0D0D0D] mb-2 font-bold">
                  Confirm New Password
                </label>
                <div className="w-full relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="**********"
                    className="w-full px-5 py-3 border-2 border-[#6A6D76] rounded-md outline-none mt-5 placeholder:text-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 bottom-4 flex items-center text-[#6A6D76]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-1/3 mt-5">
                  <AnimatedButton
                    text={isLoading ? "Updating..." : "Update Password"}
                    type="submit"
                    className="w-full"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
