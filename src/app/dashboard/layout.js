import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const user = session?.user; 

  // ইউজার যদি লগইন করা না থাকে, তাহলে প্রটেকশনের জন্য লগইন পেজে রিডাইরেক্ট করবে
  if (!user) {
    redirect("/auth/LogIn");
  }

  // ডাটাবেজ থেকে আসা 'user' বা 'admin' রোল এখানে স্টোর হবে
  const currentUserRole = user?.role || "user"; 

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* সাইডবারে ইউজারের রোল পাস করা হলো */}
      <DashboardSidebar userRole={currentUserRole} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-default-200 px-6 justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold capitalize">
              {currentUserRole} Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {user?.name || user?.email}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-default-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}