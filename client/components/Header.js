"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch {
      setUser(null);
    }
  }, [pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/courses");
  }

  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" href="/courses">
          <span className="brand-mark">L</span>
          <span>
            Lumen<span className="brand-accent">.</span>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link
            className={pathname === "/courses" ? "active" : ""}
            href="/courses"
          >
            Explore
          </Link>
          {user && (
            <Link
              className={pathname === "/ai-assistant" ? "active" : ""}
              href="/ai-assistant"
            >
              AI assistant
            </Link>
          )}
          {user?.role === "student" && (
            <Link
              className={pathname === "/my-learning" ? "active" : ""}
              href="/my-learning"
            >
              My learning
            </Link>
          )}
          {user?.role === "instructor" && (
            <Link
              className={pathname.startsWith("/instructor") ? "active" : ""}
              href="/instructor/courses"
            >
              Instructor studio
            </Link>
          )}
        </nav>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="user-chip">
                <span className="avatar">
                  {user.username?.[0]?.toUpperCase()}
                </span>
                {user.username}
              </span>
              <button
                className="button button-green button-small"
                onClick={logout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="button button-green button-small" href="/login">
                Log in
              </Link>
              <Link
                className="button button-green button-small"
                href="/register"
              >
                Join free
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
