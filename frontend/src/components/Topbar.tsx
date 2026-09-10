"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/format";
import Image from "next/image";

export default function Topbar({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex min-h-[77px] items-center justify-between border-b border-line bg-[#F7F5EF]/95 px-6 py-4 backdrop-blur-md">
      <div className="ml-10 lg:ml-0">
        <h1 className="font-display text-xl font-semibold leading-tight text-ink">
          {title || `Welcome, ${user?.first_name || "there"}`}
        </h1>

        <p className="mt-0.5 text-sm text-slate">
          {subtitle || "Here's what needs your attention today."}
        </p>
      </div>

      {user && (
        <div ref={profileRef} className="relative">
          <div className="h-10 w-10">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="relative overflow-hidden rounded-full transition-all duration-200"
              aria-label="Open profile"
              aria-expanded={profileOpen}
            >
              <Image
                src="/images/profile.jpeg"
                alt="Profile"
                width={100}
                height={100}
                className="object-cover"
              />
            </button>
          </div>

          {profileOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] z-[60] w-72 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_12px_35px_rgba(0,0,0,0.12)]">
              {/* Profile */}
              <div className="border-b border-line bg-[#F8F6F0] p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src="/images/profile.jpeg"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {user.first_name} {user.last_name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate">
                      {ROLE_LABELS[user.role]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="rounded-xl bg-[#FAF8F3] px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate">
                      Employee code
                    </span>

                    <span className="font-mono text-[11px] font-medium text-ink">
                      {user.employee_code}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate">Role</span>

                    <span className="text-[11px] font-medium text-ink">
                      {ROLE_LABELS[user.role]}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut size={16} />

                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
