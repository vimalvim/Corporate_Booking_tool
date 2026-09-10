"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import gsap from "gsap";
import { Plane, Eye, EyeOff, Check } from "lucide-react";

import { useAuth } from "@/lib/auth";
import AuthBrandpanel from "./AuthBrandpanel";

const LoginSchema = Yup.object({
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required."),
});

const DEMO_ACCOUNTS = [
  { label: 'Employee', username: 'vimal.emp' },
  { label: 'Manager', username: 'karthik.mgr' },
  { label: 'Finance', username: 'finance' },
  { label: 'Travel Admin', username: 'admin' },
];

const DEMO_PASSWORD = 'Passw0rd!123';

const fillDemoAccount = (
  index: number,
  setFieldValue: (field: string, value: string) => void,
  username: string,
) => {
  setFieldValue('username', username); 
  setFieldValue('password', DEMO_PASSWORD);
  // stampRow(index);
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [stampedIndex, setStampedIndex] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const mobileLogoRef = useRef<HTMLDivElement>(null);
  const headerBlockRef = useRef<HTMLDivElement>(null);

  const pathColRef = useRef<HTMLDivElement>(null);

  const emailRowRef = useRef<HTMLDivElement>(null);
  const passwordRowRef = useRef<HTMLDivElement>(null);
  const gateRowRef = useRef<HTMLDivElement>(null);

  const emailDotRef = useRef<HTMLDivElement>(null);
  const passwordDotRef = useRef<HTMLDivElement>(null);
  const gateDotRef = useRef<HTMLDivElement>(null);

  const markerRef = useRef<HTMLDivElement>(null);

  const errorBoxRef = useRef<HTMLDivElement>(null);
  const signInBtnRef = useRef<HTMLButtonElement>(null);

  const manifestRowRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stampRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // -------------------------------------------------------------------------
  // Right panel route marker
  // -------------------------------------------------------------------------

  const placeMarker = (dotEl: HTMLDivElement) => {
    if (!markerRef.current || !pathColRef.current) return;

    const colTop = pathColRef.current.getBoundingClientRect().top;

    const dotCenter =
      dotEl.getBoundingClientRect().top +
      dotEl.getBoundingClientRect().height / 2 -
      colTop;

    gsap.to(markerRef.current, {
      y: dotCenter - 7,
      duration: 0.45,
      ease: "power2.inOut",
    });
  };

  const onEmailFocus = () => {
    if (emailDotRef.current) {
      placeMarker(emailDotRef.current);
    }
  };

  const onPasswordFocus = () => {
    if (passwordDotRef.current) {
      placeMarker(passwordDotRef.current);
    }
  };

  const onSubmitStart = () => {
    if (gateDotRef.current) {
      placeMarker(gateDotRef.current);
    }
  };

  const onDeparture = () => {
    if (!markerRef.current) return;

    gsap.to(markerRef.current, {
      x: 18,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
    });
  };

  // Button press animation

  const pressButton = (el: HTMLButtonElement | null) => {
    if (!el) return;

    gsap
      .timeline()
      .to(el, {
        scale: 0.97,
        duration: 0.08,
      })
      .to(el, {
        scale: 1,
        duration: 0.22,
        ease: "back.out(3)",
      });
  };

  const stampRow = (index: number) => {
    setStampedIndex(index);

    const row = manifestRowRefs.current[index];
    const stamp = stampRefs.current[index];

    if (row) {
      gsap
        .timeline()
        .to(row, {
          backgroundColor: "rgba(185,133,63,0.08)",
          duration: 0.15,
        })
        .to(row, {
          backgroundColor: "transparent",
          duration: 0.5,
          delay: 0.4,
        });
    }

    if (stamp) {
      gsap.fromTo(
        stamp,
        {
          scale: 0,
          opacity: 0,
          rotate: -20,
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.4,
          ease: "back.out(4)",
        },
      );
    }
  };

  const fillDemoAccount = (
    index: number,
    setFieldValue: (field: string, value: string) => void,
    email: string,
  ) => {
    setFieldValue("email", email);
    setFieldValue("password", DEMO_PASSWORD);

    stampRow(index);
  };

  useEffect(() => {
    if (!formError || !errorBoxRef.current) return;

    gsap.fromTo(
      errorBoxRef.current,
      {
        x: -8,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        ease: "elastic.out(1, 0.4)",
      },
    );
  }, [formError]);

  return (
    <div ref={rootRef} className="min-h-screen grid lg:grid-cols-2 bg-paper">
      <AuthBrandpanel />

      <div
        ref={rightPanelRef}
        className="flex items-center justify-center p-8 lg:p-12 bg-paper"
      >
        <div className="w-full max-w-sm relative">
          {/* Mobile logo */}

          <div
            ref={mobileLogoRef}
            className="flex items-center gap-2 mb-7 lg:hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-paper">
              <Plane className="w-4 h-4" />
            </div>

            <span className="font-display text-sm">Akbhar</span>
          </div>

          {/* Header */}

          <div ref={headerBlockRef} className="mb-8">
            <h2 className="font-display text-2xl mb-1">Sign in</h2>

            <p className="text-slate text-sm">
              Access your corporate travel and spend workspace.
            </p>
          </div>

          <Formik
            initialValues={{
              username: "",
              password: "",
              // rememberMe: true,
            }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setFormError(null);

              onSubmitStart();

              const result = await login(values.username, values.password);

              setSubmitting(false);

              if (result.ok) {
                onDeparture();

                router.replace("/dashboard");
              } else {
                setFormError(result.message || "Login failed.");
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="space-y-5" noValidate>
                <div ref={pathColRef} className="relative pl-6">
                  {/* Vertical path */}

                  <div className="absolute left-[5px] top-1 bottom-1 border-l border-dashed border-line" />

                  {/* Moving marker */}

                  <div
                    ref={markerRef}
                    className="absolute left-0 w-3.5 h-3.5 rounded-full bg-ink flex items-center justify-center z-10 shadow-sm"
                    style={{
                      transform: "translateY(0px)",
                    }}
                  >
                    <Plane className="w-2 h-2 text-paper" />
                  </div>

                  {/* <div ref={emailRowRef} className="relative mb-5">
                    <div
                      ref={emailDotRef}
                      className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-line bg-transparent"
                    />

                    <label className="field-label" htmlFor="email">
                      Work email
                    </label>

                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="field-input"
                      placeholder="employee@demo.com"
                      onFocus={onEmailFocus}
                      autoComplete="email"
                    />

                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div> */}

                  <div ref={emailRowRef} className="relative mb-5">
                    <div
                      ref={emailDotRef}
                      className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-line bg-transparent"
                    />

                    <label className="field-label" htmlFor="username">
                      Username
                    </label>

                    <Field
                      id="username"
                      name="username"
                      type="text"
                      className="field-input"
                      placeholder="Enter username"
                      onFocus={onEmailFocus}
                      autoComplete="username"
                    />

                    <ErrorMessage
                      name="username"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div ref={passwordRowRef} className="relative mb-5">
                    <div
                      ref={passwordDotRef}
                      className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-line bg-transparent"
                    />

                    <div className="flex items-center justify-between">
                      <label className="field-label" htmlFor="password">
                        Password
                      </label>
                    </div>

                    <div className="relative">
                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="field-input pr-10"
                        placeholder="••••••••"
                        onFocus={onPasswordFocus}
                        autoComplete="current-password"
                      />

                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((state) => !state)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <div
                    ref={gateRowRef}
                    className="relative flex items-center justify-between text-xs"
                  >
                    <div
                      ref={gateDotRef}
                      className="absolute -left-6 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-line bg-transparent"
                    />

                    <label className="flex items-center gap-2 text-slate cursor-pointer">
                      <Field
                        type="checkbox"
                        name="rememberMe"
                        className="rounded border-line"
                      />
                      Remember me
                    </label>

                    <Link
                      href="/forget-password"
                      className="text-xs text-brass hover:text-brass-600 font-medium mb-1"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {formError && (
                  <div
                    ref={errorBoxRef}
                    className="form-error-box rounded border border-brick-100 bg-brick-100 px-3 py-2 text-sm text-brick-600"
                  >
                    {formError}
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  <button
                    ref={signInBtnRef}
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => pressButton(signInBtnRef.current)}
                    className="btn-primary w-full"
                  >
                    {isSubmitting ? "Signing in…" : "Sign in"}
                  </button>
                </div>

                <p className="text-sm text-slate text-center">
                  New here?{" "}
                  <Link
                    href="/signup"
                    className="text-ink font-medium hover:text-brass"
                  >
                    Create an account
                  </Link>
                </p>

                <div className="pt-4 border-t border-line">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate">Demo accounts</p>

                    <span className="text-[9px] uppercase tracking-[0.15em] text-slate/50">
                      Quick access
                    </span>
                  </div>

                  <div>
                    {DEMO_ACCOUNTS.map((account, index) => (
                      <button
                        key={account.username}
                        type="button"
                        ref={(el) => {
                          manifestRowRefs.current[index] = el;
                        }}
                        onClick={() =>
                          fillDemoAccount(index, setFieldValue, account.username)
                        }
                        className="relative w-full flex items-center justify-between border-t border-line first:border-t-0 py-2.5 text-left hover:bg-black/[0.015] transition-colors px-1 -mx-1 rounded"
                      >
                        <span>
                          <span className="block text-sm font-medium text-ink">
                            {account.label}
                          </span>

                          <span className="block text-xs text-slate">
                            {account.username}
                          </span>
                        </span>

                        <span className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate">
                            {DEMO_PASSWORD}
                          </span>

                          <span
                            ref={(el) => {
                              stampRefs.current[index] = el;
                            }}
                            className={`w-4 h-4 rounded-full bg-brass flex items-center justify-center transition-opacity ${
                              stampedIndex === index
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          >
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
