"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import gsap from "gsap";
import { Plane, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth";
import AuthBrandpanel from "./AuthBrandpanel";

/* =========================================================
   VALIDATION
========================================================= */

const RegisterSchema = Yup.object().shape({
  first_name: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),

  last_name: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  employee_code: Yup.string().required("Employee code is required"),

  department: Yup.string(),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),

  confirm_password: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

/* =========================================================
   REGISTER PAGE
========================================================= */

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pathColRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const firstNameDotRef = useRef<HTMLDivElement>(null);
  const lastNameDotRef = useRef<HTMLDivElement>(null);

  const usernameDotRef = useRef<HTMLDivElement>(null);
  const emailDotRef = useRef<HTMLDivElement>(null);

  const employeeCodeDotRef = useRef<HTMLDivElement>(null);
  const departmentDotRef = useRef<HTMLDivElement>(null);

  const passwordDotRef = useRef<HTMLDivElement>(null);
  const confirmPasswordDotRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     MOVE PLANE
     
     IMPORTANT:
     There is NO entrance animation here.
     The animation happens ONLY when an input receives focus.
  ======================================================= */

  const placeMarker = (dotEl: HTMLDivElement | null) => {
    if (!dotEl || !markerRef.current || !pathColRef.current) {
      return;
    }

    const pathTop = pathColRef.current.getBoundingClientRect().top;

    const dotRect = dotEl.getBoundingClientRect();

    const dotCenter = dotRect.top + dotRect.height / 2 - pathTop;

    gsap.to(markerRef.current, {
      y: dotCenter - 7,
      duration: 0.45,
      ease: "power2.inOut",
    });
  };

  /* =======================================================
     FOCUS HANDLERS
  ======================================================= */

  const handleFirstNameFocus = () => {
    placeMarker(firstNameDotRef.current);
  };

  const handleLastNameFocus = () => {
    placeMarker(lastNameDotRef.current);
  };

  const handleUsernameFocus = () => {
    placeMarker(usernameDotRef.current);
  };

  const handleEmailFocus = () => {
    placeMarker(emailDotRef.current);
  };

  const handleEmployeeCodeFocus = () => {
    placeMarker(employeeCodeDotRef.current);
  };

  const handleDepartmentFocus = () => {
    placeMarker(departmentDotRef.current);
  };

  const handlePasswordFocus = () => {
    placeMarker(passwordDotRef.current);
  };

  const handleConfirmPasswordFocus = () => {
    placeMarker(confirmPasswordDotRef.current);
  };

  /* =======================================================
     INITIAL VALUES
  ======================================================= */

  const initialValues = {
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    employee_code: "",
    department: "",
    password: "",
    confirm_password: "",
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    values: typeof initialValues,
    {
      setSubmitting,
      setFieldError,
    }: {
      setSubmitting: (value: boolean) => void;
      setFieldError: (field: string, message: string) => void;
    },
  ) => {
    try {
      setSubmitting(true);

      const response = await register(values);

      console.log("Registration response:", response);

      setSuccess(true);

      setTimeout(() => {
        router.push("/signin");
      }, 1500);
    } catch (error: any) {
      console.error("Registration failed:", error);

      if (error?.response?.data?.email) {
        setFieldError("email", error.response.data.email);
      }

      if (error?.response?.data?.username) {
        setFieldError("username", error.response.data.username);
      }

      if (error?.response?.data?.employee_code) {
        setFieldError("employee_code", error.response.data.employee_code);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="w-full max-w-md border border-line bg-paper p-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-ink">
            <span className="text-paper text-xl">✓</span>
          </div>

          <h1 className="text-2xl font-semibold text-ink">
            Registration successful
          </h1>

          <p className="mt-3 text-sm text-muted">
            Your account has been created successfully. Redirecting you to sign
            in...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="grid min-h-screen lg:grid-cols-2">
        <AuthBrandpanel />

        <section className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-12">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
                Create account
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                Sign up
              </h1>

              <p className="mt-2 text-sm text-muted">
                Create your account to continue.
              </p>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="w-full">
                  <div ref={pathColRef} className="relative pl-7">
                    <div
                      className="
                        absolute
                        left-[6px]
                        top-1
                        bottom-1
                        border-l
                        border-dashed
                        border-line
                      "
                    />

                    <div
                      ref={markerRef}
                      className="
                        pointer-events-none
                        absolute
                        left-0
                        top-0
                        z-20
                        flex
                        h-3.5
                        w-3.5
                        items-center
                        justify-center
                        rounded-full
                        bg-ink
                        shadow-sm
                      "
                      style={{
                        transform: "translateY(0px)",
                      }}
                    >
                      <Plane className="h-2 w-2 text-paper" />
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* FIRST NAME */}

                      <div className="relative">
                        <div
                          ref={firstNameDotRef}
                          className="
                            absolute
                            -left-7
                            top-2
                            h-2.5
                            w-2.5
                            rounded-full
                            border-2
                            border-line
                            bg-paper
                          "
                        />

                        <label
                          htmlFor="first_name"
                          className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-ink
                          "
                        >
                          First name
                        </label>

                        <Field
                          id="first_name"
                          name="first_name"
                          type="text"
                          placeholder="Enter first name"
                          onFocus={handleFirstNameFocus}
                          className="
                            w-full
                            rounded-md
                            border
                            border-line
                            bg-paper
                            px-3
                            py-2.5
                            text-sm
                            text-ink
                            outline-none
                            transition
                            focus:border-ink
                            focus:ring-1
                            focus:ring-ink
                          "
                        />

                        <ErrorMessage
                          name="first_name"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* LAST NAME */}

                      <div className="relative">
                        <div
                          ref={lastNameDotRef}
                          className="
                            absolute
                            -left-7
                            top-2
                            h-2.5
                            w-2.5
                            rounded-full
                            border-2
                            border-line
                            bg-paper
                          "
                        />

                        <label
                          htmlFor="last_name"
                          className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-ink
                          "
                        >
                          Last name
                        </label>

                        <Field
                          id="last_name"
                          name="last_name"
                          type="text"
                          placeholder="Enter last name"
                          onFocus={handleLastNameFocus}
                          className="
                            w-full
                            rounded-md
                            border
                            border-line
                            bg-paper
                            px-3
                            py-2.5
                            text-sm
                            text-ink
                            outline-none
                            transition
                            focus:border-ink
                            focus:ring-1
                            focus:ring-ink
                          "
                        />

                        <ErrorMessage
                          name="last_name"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    </div>

                    <div className="relative mb-5">
                      <div
                        ref={usernameDotRef}
                        className="
                          absolute
                          -left-7
                          top-2
                          h-2.5
                          w-2.5
                          rounded-full
                          border-2
                          border-line
                          bg-paper
                        "
                      />

                      <label
                        htmlFor="username"
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-medium
                          text-ink
                        "
                      >
                        Username
                      </label>

                      <Field
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        onFocus={handleUsernameFocus}
                        className="
                          w-full
                          rounded-md
                          border
                          border-line
                          bg-paper
                          px-3
                          py-2.5
                          text-sm
                          text-ink
                          outline-none
                          transition
                          focus:border-ink
                          focus:ring-1
                          focus:ring-ink
                        "
                      />

                      <ErrorMessage
                        name="username"
                        component="div"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    <div className="relative mb-5">
                      <div
                        ref={emailDotRef}
                        className="
                          absolute
                          -left-7
                          top-2
                          h-2.5
                          w-2.5
                          rounded-full
                          border-2
                          border-line
                          bg-paper
                        "
                      />

                      <label
                        htmlFor="email"
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-medium
                          text-ink
                        "
                      >
                        Email
                      </label>

                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        onFocus={handleEmailFocus}
                        className="
                          w-full
                          rounded-md
                          border
                          border-line
                          bg-paper
                          px-3
                          py-2.5
                          text-sm
                          text-ink
                          outline-none
                          transition
                          focus:border-ink
                          focus:ring-1
                          focus:ring-ink
                        "
                      />

                      <ErrorMessage
                        name="email"
                        component="div"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* EMPLOYEE CODE */}

                      <div className="relative">
                        <div
                          ref={employeeCodeDotRef}
                          className="
                            absolute
                            -left-7
                            top-2
                            h-2.5
                            w-2.5
                            rounded-full
                            border-2
                            border-line
                            bg-paper
                          "
                        />

                        <label
                          htmlFor="employee_code"
                          className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-ink
                          "
                        >
                          Employee code
                        </label>

                        <Field
                          id="employee_code"
                          name="employee_code"
                          type="text"
                          placeholder="Employee code"
                          onFocus={handleEmployeeCodeFocus}
                          className="
                            w-full
                            rounded-md
                            border
                            border-line
                            bg-paper
                            px-3
                            py-2.5
                            text-sm
                            text-ink
                            outline-none
                            transition
                            focus:border-ink
                            focus:ring-1
                            focus:ring-ink
                          "
                        />

                        <ErrorMessage
                          name="employee_code"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>

                      {/* DEPARTMENT */}

                      <div className="relative">
                        <div
                          ref={departmentDotRef}
                          className="
                            absolute
                            -left-7
                            top-2
                            h-2.5
                            w-2.5
                            rounded-full
                            border-2
                            border-line
                            bg-paper
                          "
                        />

                        <label
                          htmlFor="department"
                          className="
                            mb-1.5
                            block
                            text-sm
                            font-medium
                            text-ink
                          "
                        >
                          Department
                          <span className="ml-1 text-muted">(Optional)</span>
                        </label>

                        <Field
                          id="department"
                          name="department"
                          type="text"
                          placeholder="Enter department"
                          onFocus={handleDepartmentFocus}
                          className="
                            w-full
                            rounded-md
                            border
                            border-line
                            bg-paper
                            px-3
                            py-2.5
                            text-sm
                            text-ink
                            outline-none
                            transition
                            focus:border-ink
                            focus:ring-1
                            focus:ring-ink
                          "
                        />

                        <ErrorMessage
                          name="department"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    </div>

                    <div className="relative mb-5">
                      <div
                        ref={passwordDotRef}
                        className="
                          absolute
                          -left-7
                          top-2
                          h-2.5
                          w-2.5
                          rounded-full
                          border-2
                          border-line
                          bg-paper
                        "
                      />

                      <label
                        htmlFor="password"
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-medium
                          text-ink
                        "
                      >
                        Password
                      </label>

                      <Field
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        onFocus={handlePasswordFocus}
                        className="
                          w-full
                          rounded-md
                          border
                          border-line
                          bg-paper
                          px-3
                          py-2.5
                          text-sm
                          text-ink
                          outline-none
                          transition
                          focus:border-ink
                          focus:ring-1
                          focus:ring-ink
                        "
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="
      absolute
      right-3
      top-[68%]
      -translate-y-1/2
      text-slate
      hover:text-ink
      transition-colors
    "
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

                      <ErrorMessage
                        name="password"
                        component="div"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    {/* =================================================
                        CONFIRM PASSWORD
                    ================================================= */}

                    <div className="relative mb-7">
                      <div
                        ref={confirmPasswordDotRef}
                        className="
                          absolute
                          -left-7
                          top-2
                          h-2.5
                          w-2.5
                          rounded-full
                          border-2
                          border-line
                          bg-paper
                        "
                      />

                      <label
                        htmlFor="confirm_password"
                        className="
                          mb-1.5
                          block
                          text-sm
                          font-medium
                          text-ink
                        "
                      >
                        Confirm password
                      </label>

                      <Field
                        id="confirm_password"
                        name="confirm_password"
                        // type="password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        onFocus={handleConfirmPasswordFocus}
                        className="
                          w-full
                          rounded-md
                          border
                          border-line
                          bg-paper
                          px-3
                          py-2.5
                          text-sm
                          text-ink
                          outline-none
                          transition
                          focus:border-ink
                          focus:ring-1
                          focus:ring-ink
                        "
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="
      absolute
      right-3
      top-[68%]
      -translate-y-1/2
      text-slate
      hover:text-ink
      transition-colors
    "
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      <ErrorMessage
                        name="confirm_password"
                        component="div"
                        className="mt-1 text-xs text-red-500"
                      />
                    </div>

                    {/* =================================================
                        SUBMIT BUTTON
                    ================================================= */}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        w-full
                        rounded-md
                        bg-ink
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-paper
                        transition
                        hover:opacity-90
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                  </div>

                  {/* =================================================
                      SIGN IN LINK
                  ================================================= */}

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted">
                      Already have an account?{" "}
                      <Link
                        href="/signin"
                        className="
                          font-medium
                          text-ink
                          underline
                          underline-offset-4
                          hover:opacity-70
                        "
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      </div>
    </main>
  );
}
