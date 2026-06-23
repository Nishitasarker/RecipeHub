import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    // Better Auth এর মাধ্যমে সার্ভার সাইডে সেশন এবং ইউজার ডাটা ফেচ করা
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // ১. ইউজার যদি লগইন করা না থাকে
    if (!session) {
        // রিকোয়ারমেন্ট অনুযায়ী আপনার লগইন পাথ "/auth/LogIn", তাই সেখানে রিডাইরেক্ট করা হলো
        return NextResponse.redirect(new URL('/auth/LogIn', request.url));
    }

    const userRole = session?.user?.role?.toLowerCase();

    // ২. রোল ভিত্তিক রাউট প্রোটেকশন (Role-Based Access Control)
    
    // যদি কোনো সাধারণ ইউজার (role: user) এডমিন প্যানেলে ঢোকার চেষ্টা করে
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
        // তাকে জোরপূর্বক তার নিজস্ব ড্যাশবোর্ডে পাঠিয়ে দেওয়া হবে (৪MD ব্লক করতে)
        return NextResponse.redirect(new URL('/dashboard/organizer', request.url));
    }

    // যদি কোনো এডমিন (role: admin) ইউজার/অর্গানাইজার প্যানেলে ঢোকার চেষ্টা করে
    if (pathname.startsWith('/dashboard/organizer') && userRole === 'admin') {
        // তাকে এডমিন ড্যাশবোর্ডে রিডাইরেক্ট করা হবে
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    // সব কন্ডিশন ঠিক থাকলে ইউজারকে তার গন্তব্যে যেতে দেওয়া হবে
    return NextResponse.next();
}

// আপনার প্রজেক্টের রিকোয়ারমেন্ট অনুযায়ী ম্যাচার কনফিগ আপডেট করা হলো
export const config = {
    matcher: [
        '/profile', 
        '/dashboard/admin/:path*', 
        '/dashboard/organizer/:path*'
    ]
};