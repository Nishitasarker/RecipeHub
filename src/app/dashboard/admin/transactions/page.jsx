"use client"
import React, { useEffect, useState } from 'react';
import { authClient } from "@/lib/auth-client";

const Transactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = authClient.useSession();
  const loggedInUser = session?.user;

  useEffect(() => {
    if (!loggedInUser?.email) {
      setLoading(false);
      return;
    }

    fetch(`https://recipehub-server-side.vercel.app/api/payments?email=${loggedInUser.email}`)
      .then(res => res.json())
      .then(data => {
        setPayments(data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [loggedInUser?.email]);

  if (!loggedInUser) {
    return <div className="text-center py-10 text-gray-500">Please log in to view transactions.</div>;
  }

  if (loading) return <div className="text-center py-10 text-orange-600">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment <span className="text-orange-500">Transactions</span></h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-sm border-b">
              <th className="pb-4 font-medium">User Email</th>
              <th className="pb-4 font-medium">Type</th>
              <th className="pb-4 font-medium">Amount</th>
              <th className="pb-4 font-medium">Transaction ID</th>
              <th className="pb-4 font-medium">Date</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {payments.map((payment) => (
              <tr key={payment._id} className="border-b last:border-0 hover:bg-orange-50/30 transition">
                <td className="py-4 text-sm font-medium">{payment.userEmail}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    payment.recipeId 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {payment.recipeId ? "Recipe Purchase" : "Premium Subscription"}
                  </span>
                </td>
                <td className="py-4 text-sm font-bold text-gray-800">${payment.amount}</td>
                <td className="py-4 text-xs font-mono text-gray-500 truncate max-w-[150px]">
                  {payment.transactionId}
                </td>
                <td className="py-4 text-sm">
                  {new Date(payment.paidAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    payment.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {payment.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-400 font-medium">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;