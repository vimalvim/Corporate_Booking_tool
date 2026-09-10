"use client";

import { useState } from "react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/lib/auth";
import AuthBrandpanel from "./AuthBrandpanel";

const ForgotSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email.")
    .required("Email is required."),
});

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthBrandpanel />

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl mb-1">Forgot password</h2>
          <p className="text-slate text-sm mb-8">
            We&apos;ll email you a link to reset it.
          </p>

          {sent ? (
            <div className="space-y-4">
              <div className="rounded border border-teal-100 bg-teal-100 px-3 py-3 text-sm text-teal-600">
                If that email exists, a reset link has been sent. Check your
                inbox (or the backend console, in this demo build).
              </div>
              <Link href="/login" className="btn-outline w-full flex">
                Back to sign in
              </Link>
            </div>
          ) : (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={ForgotSchema}
              onSubmit={async (values, { setSubmitting }) => {
                await forgotPassword(values.email);
                setSubmitting(false);
                setSent(true);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4" noValidate>
                  <div>
                    <label className="field-label" htmlFor="email">
                      Email
                    </label>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="field-input"
                      placeholder="you@demo-corp.example"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full"
                  >
                    {isSubmitting ? "Sending link…" : "Send reset link"}
                  </button>

                  <p className="text-sm text-slate text-center">
                    Remembered it?{" "}
                    <Link
                      href="/signin"
                      className="text-ink font-medium hover:text-brass"
                    >
                      Back to sign in
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}












// "use client";

// import { useRef, useState } from "react";
// import Link from "next/link";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import gsap from "gsap";
// import { Plane } from "lucide-react";

// import { useAuth } from "@/lib/auth";
// import AuthBrandpanel from "./AuthBrandpanel";

// const ForgotSchema = Yup.object({
//   email: Yup.string()
//     .email("Enter a valid email.")
//     .required("Email is required."),
// });

// export default function ForgotPasswordPage() {
//   const { forgotPassword } = useAuth();

//   const [sent, setSent] = useState(false);

//   /* =========================================================
//      ANIMATION REFS
//   ========================================================= */

//   const pathColRef = useRef<HTMLDivElement>(null);
//   const emailDotRef = useRef<HTMLDivElement>(null);
//   const markerRef = useRef<HTMLDivElement>(null);
//   const emailInputRef = useRef<HTMLInputElement>(null);

//   /* =========================================================
//      MOVE PLANE TO EMAIL FIELD
     
//      This runs only when the user focuses the field.
//      There is NO page-load animation.
//   ========================================================= */

//   const placeMarker = () => {
//     if (
//       !markerRef.current ||
//       !pathColRef.current ||
//       !emailDotRef.current
//     ) {
//       return;
//     }

//     const pathTop =
//       pathColRef.current.getBoundingClientRect().top;

//     const dotRect =
//       emailDotRef.current.getBoundingClientRect();

//     const dotCenter =
//       dotRect.top +
//       dotRect.height / 2 -
//       pathTop;

//     gsap.to(markerRef.current, {
//       y: dotCenter - 7,
//       duration: 0.45,
//       ease: "power2.inOut",
//     });
//   };

//   /* =========================================================
//      EMAIL FOCUS ANIMATION
//   ========================================================= */

//   const handleEmailFocus = () => {
//     placeMarker();

//     if (!emailInputRef.current) return;

//     gsap.fromTo(
//       emailInputRef.current,
//       {
//         x: -3,
//       },
//       {
//         x: 0,
//         duration: 0.35,
//         ease: "power2.out",
//       }
//     );
//   };

//   /* =========================================================
//      TYPING ANIMATION
     
//      Small pulse whenever the user types.
//      This makes the field feel interactive without
//      continuously shaking the input.
//   ========================================================= */

//   const handleEmailChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     setFieldValue: (
//       field: string,
//       value: string
//     ) => void
//   ) => {
//     const value = event.target.value;

//     setFieldValue("email", value);

//     if (!emailInputRef.current) return;

//     gsap.killTweensOf(emailInputRef.current);

//     gsap.fromTo(
//       emailInputRef.current,
//       {
//         x: 2,
//       },
//       {
//         x: 0,
//         duration: 0.2,
//         ease: "power2.out",
//       }
//     );
//   };

//   return (
//     <div className="min-h-screen grid lg:grid-cols-2 bg-paper">

//       {/* =====================================================
//           LEFT — BRAND PANEL

//           No animation added here.
//       ===================================================== */}

//       <AuthBrandpanel />

//       {/* =====================================================
//           RIGHT — FORGOT PASSWORD
//       ===================================================== */}

//       <div className="flex items-center justify-center p-8 lg:p-12 bg-paper">
//         <div className="w-full max-w-sm relative">

//           {/* =================================================
//               HEADER
//           ================================================= */}

//           <div className="mb-8">
//             <h2 className="font-display text-2xl mb-1">
//               Forgot password
//             </h2>

//             <p className="text-slate text-sm">
//               We&apos;ll email you a link to reset it.
//             </p>
//           </div>

//           {/* =================================================
//               SUCCESS STATE
//           ================================================= */}

//           {sent ? (
//             <div className="space-y-4">

//               <div className="rounded border border-teal-100 bg-teal-100 px-3 py-3 text-sm text-teal-600">
//                 If that email exists, a reset link has been
//                 sent. Check your inbox (or the backend
//                 console, in this demo build).
//               </div>

//               <Link
//                 href="/signin"
//                 className="btn-outline w-full flex justify-center"
//               >
//                 Back to sign in
//               </Link>

//             </div>
//           ) : (

//             /* =================================================
//                FORMIK
//             ================================================= */

//             <Formik
//               initialValues={{
//                 email: "",
//               }}
//               validationSchema={ForgotSchema}
//               onSubmit={async (
//                 values,
//                 { setSubmitting }
//               ) => {
//                 try {
//                   await forgotPassword(values.email);

//                   setSent(true);
//                 } finally {
//                   setSubmitting(false);
//                 }
//               }}
//             >
//               {({
//                 isSubmitting,
//                 setFieldValue,
//               }) => (
//                 <Form
//                   className="space-y-5"
//                   noValidate
//                 >

//                   {/* =================================================
//                       FLIGHT PATH
//                   ================================================= */}

//                   <div
//                     ref={pathColRef}
//                     className="relative pl-6"
//                   >

//                     {/* -----------------------------------------------
//                         Vertical dotted path
//                     ----------------------------------------------- */}

//                     <div
//                       className="
//                         absolute
//                         left-[5px]
//                         top-1
//                         bottom-1
//                         border-l
//                         border-dashed
//                         border-line
//                       "
//                     />

//                     {/* -----------------------------------------------
//                         Moving plane
//                     ----------------------------------------------- */}

//                     <div
//                       ref={markerRef}
//                       className="
//                         absolute
//                         left-0
//                         top-0
//                         w-3.5
//                         h-3.5
//                         rounded-full
//                         bg-ink
//                         flex
//                         items-center
//                         justify-center
//                         z-10
//                         shadow-sm
//                       "
//                       style={{
//                         transform: "translateY(0px)",
//                       }}
//                     >
//                       <Plane className="w-2 h-2 text-paper" />
//                     </div>

//                     {/* =================================================
//                         EMAIL
//                     ================================================= */}

//                     <div className="relative">

//                       {/* ---------------------------------------------
//                           Email path dot
//                       --------------------------------------------- */}

//                       <div
//                         ref={emailDotRef}
//                         className="
//                           absolute
//                           -left-6
//                           top-1.5
//                           w-2.5
//                           h-2.5
//                           rounded-full
//                           border-2
//                           border-line
//                           bg-transparent
//                         "
//                       />

//                       {/* ---------------------------------------------
//                           Label
//                       --------------------------------------------- */}

//                       <label
//                         className="field-label"
//                         htmlFor="email"
//                       >
//                         Email
//                       </label>

//                       {/* ---------------------------------------------
//                           Input
//                       --------------------------------------------- */}

//                       <Field
//                         innerRef={emailInputRef}
//                         id="email"
//                         name="email"
//                         type="email"
//                         className="field-input"
//                         placeholder="you@demo-corp.example"
//                         autoComplete="email"
//                         onFocus={handleEmailFocus}
//                         onChange={(
//                           event: React.ChangeEvent<HTMLInputElement>
//                         ) =>
//                           handleEmailChange(
//                             event,
//                             setFieldValue
//                           )
//                         }
//                       />

//                       {/* ---------------------------------------------
//                           Validation message
//                       --------------------------------------------- */}

//                       <ErrorMessage
//                         name="email"
//                         component="div"
//                         className="mt-1 text-xs text-red-500"
//                       />

//                     </div>

//                   </div>

//                   {/* =================================================
//                       SUBMIT
//                   ================================================= */}

//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="btn-primary w-full"
//                   >
//                     {isSubmitting
//                       ? "Sending link…"
//                       : "Send reset link"}
//                   </button>

//                   {/* =================================================
//                       BACK TO SIGN IN
//                   ================================================= */}

//                   <p className="text-sm text-slate text-center">
//                     Remembered it?{" "}

//                     <Link
//                       href="/signin"
//                       className="
//                         text-ink
//                         font-medium
//                         hover:text-brass
//                       "
//                     >
//                       Back to sign in
//                     </Link>
//                   </p>

//                 </Form>
//               )}
//             </Formik>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

