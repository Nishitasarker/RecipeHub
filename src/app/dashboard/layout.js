import { auth } from "@/lib/auth"; // আপনার প্রজেক্টের Better Auth কনফিগ ফাইলের পাথ দিন
import { headers } from "next/headers";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({ children }) {
  // Better Auth এর মাধ্যমে সার্ভার সাইডে সেশন এবং ইউজার ডাটা ফেচ করা হচ্ছে
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const user = session?.user; 
  const currentUserRole = user?.role || "user"; // ডাটাবেজ থেকে আসা 'admin' বা 'user' ডাইনামিকালি সেট হবে

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* ডাইনামিক রোল পাস করা হলো */}
      <DashboardSidebar userRole={currentUserRole} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-default-200 px-6 justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold capitalize">
              {currentUserRole} Panel
            </h1>
          </div>
          {/* <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {user?.email || "No Email Found"}
            </span>
          </div> */}
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-default-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}