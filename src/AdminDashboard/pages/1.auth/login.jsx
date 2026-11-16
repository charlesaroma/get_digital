/* Admin: sign in. Dummy mode accepts the accounts in src/data/staff.json (shown on screen). */
import { CircleAlert, Eye, EyeOff, LogIn } from "lucide-react";
import { useId, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import Logo from "@/components/site/Logo";
import Button from "@/components/ui/Button";
import { useAdminAuth } from "@/store/context/AdminAuthContext";
import { useStaffSignIn } from "@/store/tanstackStore/queries/admin";

const input =
  "h-12 w-full rounded-md border border-border-strong bg-surface px-4 text-body text-foreground focus:border-foreground focus:outline-none focus-visible:ring-4 focus-visible:ring-gd-yellow-500/35";
const DEMO = import.meta.env.MODE === "dummy";

export default function AdminLoginPage() {
  const { admin, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mutation = useStaffSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const ids = { email: useId(), password: useId() };
  const to = location.state?.from ?? "/admin";

  if (admin) return <Navigate to={to} replace />;

  return (
    <main className="grid min-h-dvh place-items-center bg-gd-stone-100 px-4 py-10 dark:bg-gd-navy-950">
      <div className="w-full max-w-md">
        <Logo alt="GetDigital256" className="mx-auto h-11" />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate({ email, password }, { onSuccess: (session) => { signIn(session); navigate(to, { replace: true }); } });
          }}
          className="mt-8 flex flex-col gap-5 rounded-2xl bg-surface p-6 shadow-card ring-1 ring-inset ring-border sm:p-8"
        >
          <div>
            <h1 className="text-h3">Admin sign in</h1>
            <p className="mt-1 text-muted">For GetDigital staff only.</p>
          </div>
          {mutation.isError && (
            <p role="alert" className="flex items-start gap-2 rounded-xl bg-error-soft p-4 text-small font-semibold text-error">
              <CircleAlert aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              {mutation.error.message}
            </p>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor={ids.email} className="text-small font-semibold">
              Email
            </label>
            <input id={ids.email} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={input} required />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor={ids.password} className="text-small font-semibold">
              Password
            </label>
            <div className="relative">
              <input id={ids.password} type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} pr-12`} required />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute top-0.5 right-0.5 grid size-11 place-items-center rounded-md text-muted hover:text-foreground">
                {show ? <EyeOff aria-hidden="true" size={18} strokeWidth={1.75} /> : <Eye aria-hidden="true" size={18} strokeWidth={1.75} />}
              </button>
            </div>
          </div>
          <Button type="submit" size="lg" icon={LogIn} loading={mutation.isPending} className="w-full">
            Sign in
          </Button>
        </form>
        {DEMO && (
          <div className="mt-5 rounded-2xl bg-info-soft p-5 text-small text-info">
            <p className="font-bold">Demo accounts (dummy mode only)</p>
            <p className="mt-2 font-mono">admin@gd256.org / GetDigital@2026</p>
            <p className="font-mono">editor@gd256.org / Editor@2026</p>
          </div>
        )}
      </div>
    </main>
  );
}
