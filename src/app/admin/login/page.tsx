import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata = { title: "Admin sign in | Daily Crumb" };
export default function AdminLoginPage() {
  return (
    <main className="admin-login-page">
      <AdminLoginForm />
    </main>
  );
}
