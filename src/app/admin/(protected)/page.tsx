"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { services } from "@/lib/api";
import type { AdminDashboard } from "@/lib/types/admin";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  useEffect(() => {
    services.admin.dashboard.getDashboard().then(setDashboard);
  }, []);
  if (!dashboard)
    return (
      <div className="admin-page">
        <p>Loading the counter...</p>
      </div>
    );
  return (
    <div className="admin-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Overview</p>
          <h1>Today at the counter</h1>
        </div>
        <p>
          Mock operational data for frontend development. Your Go API will provide authoritative
          values.
        </p>
      </div>
      <div className="admin-metrics">
        <article>
          <span>Active products</span>
          <strong>{dashboard.activeProductCount}</strong>
        </article>
        <article>
          <span>Low stock</span>
          <strong>{dashboard.lowStockProductCount}</strong>
        </article>
        <article>
          <span>Total orders</span>
          <strong>{dashboard.totalOrderCount}</strong>
        </article>
        <article>
          <span>Pending orders</span>
          <strong>{dashboard.pendingOrderCount}</strong>
        </article>
      </div>
      <div className="admin-quick-actions">
        <Link href="/admin/products/new">Add a product</Link>
        <Link href="/admin/products">Review low stock</Link>
      </div>
    </div>
  );
}
