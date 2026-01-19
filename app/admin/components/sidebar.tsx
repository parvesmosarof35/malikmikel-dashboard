"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { 
    LayoutDashboard, 
    Users, 
    ShieldCheck, 
    Settings, 
    LogOut, 
    X 
} from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonbg, sidebarbg } from "@/contexts/theme";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  
  const isActive = (path: string) => pathname === path;

  const navItems = [
    { name: "Dashboard",       path: "/admin/dashboard",       icon: LayoutDashboard },
    { name: "User Management", path: "/admin/users",           icon: Users },
    { name: "Create Admin",    path: "/admin/create-admin",    icon: ShieldCheck },
    { name: "Settings",        path: "/admin/settings",        icon: Settings },
  ];

  return (
    <div
      className={` ${sidebarbg} text-[#0D0D0D] h-screen overflow-y-auto py-5 md:py-0 z-50 transition-all duration-300 transform overflow-hidden
        w-[80%] sm:w-[70%] md:w-[50%] ${isOpen ? "lg:w-68 xl:w-72 md:rounded-2xl lg:mt-5 md:mt-0 rounded-l-none" : "lg:w-0"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"} ${isOpen ? "lg:translate-x-0" : "lg:-translate-x-full"}
        fixed top-0 left-0 
        lg:static
      `}
    >
      {/* Close Button (Mobile Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 lg:hidden text-white bg-[#0D0D0D] focus:outline-none p-2 rounded-full"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Logo */}
      <Link href="/">
      <div className="flex justify-center items-center gap-2 px-5 mt-2">
        <div className="relative w-[150px] h-[100px]">
             <Image src="/caribee.png" alt="User Avatar" fill className="object-contain" />
        </div>
      </div>
      </Link>

      {/* Sidebar Menu */}
      <ul className="mt-10 px-5 text-[10px]">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <li
                className={`flex items-center gap-2 mt-5 cursor-pointer transition-all duration-300 ease-in-out ${
                isActive(item.path)
                    ? `${buttonbg} text-white px-3 py-3 rounded-lg`
                    : ""
                }`}
            >
                <item.icon className="w-5 h-5" />
                <p className="text-lg font-semibold">{item.name}</p>
            </li>
          </Link>
        ))}
      </ul>

      {/* Logout Button with Shadcn AlertDialog */}
      <div className="absolute mt-8 md:mt-20 mmd:mt-20 w-full px-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className={`flex items-center gap-4 w-full py-3 rounded-lg ${buttonbg} px-3 duration-200 text-white justify-center`}
            >
              <LogOut className="w-5 h-5 font-bold" />
              <span>Logout</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be logged out of your account and redirected to the login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => { logout(); router.push("/auth"); }} 
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
