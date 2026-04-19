"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { buttonbg } from "@/contexts/theme";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { useVerifyOtpAdminMutation } from "@/store/api/adminApi";
import { toast } from "sonner";

function VerificationCode() {
  const [code, setCode] = useState(new Array(4).fill("")); // Changed to 4 based on example payload
  const router = useRouter();
  const [verifyOtp, { isLoading }] = useVerifyOtpAdminMutation();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!isNaN(Number(value))) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (code[index] === "" && index > 0) {
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        document.getElementById(`code-${index - 1}`)?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim().slice(0, 4);
    if (/^\d+$/.test(pastedData)) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);
      const nextIndex = Math.min(pastedData.length, 3);
      if (pastedData.length === 4) {
        document.getElementById(`code-3`)?.focus();
      } else {
        document.getElementById(`code-${nextIndex}`)?.focus();
      }
    }
  };

  const handleVerifyCode = async () => {
    const otp = code.join("");
    if (otp.length < 4) {
      toast.error("Please enter the 4 digit code");
      return;
    }
    
    try {
      const res = await verifyOtp({ otp, email }).unwrap();
      if (res.success) {
        toast.success(res.message || "OTP verified successfully");
        sessionStorage.setItem("verifiedEmail", res.email || email);
        router.push(`/auth/reset-password`);
      } else {
        toast.error(res.message || "Invalid OTP");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Verification failed");
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
              Verification code
            </h2>
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-[#6A6D76] mb-10 w-full md:w-2/3 ">
                We sent a reset code to {email || "your email"}. Enter the 4 digit code
                that is mentioned in the email.
              </p>
            </div>

            <form className="space-y-5">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="shadow-xs w-12 h-12 text-2xl text-center border border-[#6A6D76] text-[#0d0d0d] rounded-lg focus:outline-none"
                  />
                ))}
              </div>
            </form>
            <div className="flex justify-center items-center my-5">
              <div className="w-1/3 mt-5">
                <AnimatedButton
                  text={isLoading ? "Verifying..." : "Verify Code"}
                  onClick={handleVerifyCode}
                  type="button"
                  className="w-full"
                />
              </div>
            </div>
            <p className="text-[#6A6D76] text-center mb-10">
              You have not received the email?{" "}
              <span className="text-[#00B047]"> Resend</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerificationCode;
