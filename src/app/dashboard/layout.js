import { auth } from "@/lib/auth"; 
import { headers } from "next/headers";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { redirect } from "next/navigation";



export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  const user = session?.user; 

  
  if (!user) {
    redirect("/auth/LogIn");
  }

  
  const currentUserRole = user?.role || "user"; 

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
     
      <DashboardSidebar userRole={currentUserRole} />

      <div className="flex flex-1 flex-col overflow-hidden">
       <DashboardHeader 
  userName={user?.name || user?.email} 
  userRole={currentUserRole} 
  userImage={user?.image} 
/>


         

        <main className="flex-1 overflow-y-auto p-6 bg-default-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}