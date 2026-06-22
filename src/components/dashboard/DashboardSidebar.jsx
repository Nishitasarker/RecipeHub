'use client'
import React from "react";
import { 
  LayoutSideContentLeft, 
  House, 
  Person, 
  Folders, 
  Plus, 
  Heart, 
  ShoppingBag, 
  Persons, 
  FileText, 
  Receipt, 
  ArrowRightFromSquare 
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { ChefHat } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // 👈 টোস্ট দেখানোর জন্য ইমপোর্ট (sonner হলে 'import { toast } from "sonner"')

export function DashboardSidebar({ userRole = "user" }) { 
  const router = useRouter();

  const userItems = [
    { icon: House, label: "Overview", path: "/dashboard" },
    { icon: Folders, label: "My Recipes", path: "/dashboard/my-recipes" },
    { icon: Plus, label: "Add Recipe", path: "/dashboard/add-recipe" },
    { icon: Heart, label: "My Favorites", path: "/dashboard/favorites" },
    { icon: ShoppingBag, label: "Purchased Recipes", path: "/dashboard/purchased" },
    { icon: Person, label: "Profile", path: "/dashboard/profile" },
  ];

  const adminItems = [
    { icon: House, label: "Admin Overview", path: "/admin" },
    { icon: Persons, label: "Manage Users", path: "/admin/users" },
    { icon: Folders, label: "Manage Recipes", path: "/admin/recipes" },
    { icon: FileText, label: "Reports", path: "/admin/reports" },
    { icon: Receipt, label: "Transactions", path: "/admin/transactions" },
  ];

  const navItems = userRole === "admin" ? adminItems : userItems;

  // 🛠️ লগআউট হ্যান্ডলার ফাংশন (টোস্ট ও হোম পেজ রিডাইরেক্টসহ)
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully logged out! See you again. 👋"); // 👈 সাকসেস টোস্ট
            router.push("/"); // 👈 হোম পেজে রিডাইরেক্ট করা হলো
            router.refresh(); 
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong during logout.");
          }
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const navContent = (
    <div className="flex h-full flex-col justify-between">
      <nav className="flex flex-col gap-1">
        <div className="px-3 py-2 sm:border-b">
          <div className="flex items-center gap-1">
            <span className="text-2xl md:text-4xl text-[#e65c00]">
              <ChefHat size="1em" />
            </span>
            <span className="text-lg md:text-3xl text-[#c2271d] font-bold">
              RecipeHub
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-400 font-bold uppercase pt-2 pl-2">{userRole} Dashboard</p>
        </div>

        {navItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default-100"
            type="button"
            onClick={() => router.push(item.path)} 
          >
            <item.icon className="size-5 text-muted-foreground" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-default-200 pt-4">
        <button
          onClick={handleLogout} 
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-lg text-danger font-bold transition-colors hover:bg-danger-50"
          type="button"
        >
          <ArrowRightFromSquare className="size-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 border-r border-default-200 p-4 lg:block sticky top-0">
        {navContent}
      </aside>

      <Drawer>
        <Button className="lg:hidden" variant="secondary" isIconOnly aria-label="Open Sidebar">
          <LayoutSideContentLeft className="size-5" />
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header className="border-b border-default-100 pb-2">
                <Drawer.Heading className="text-md font-semibold">Navigation</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="py-4 h-[calc(100vh-80px)]">
                {navContent}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}