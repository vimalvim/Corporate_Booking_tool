// "use client";

// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// import {
//   Plane,
//   Briefcase,
//   ShieldCheck,
//   Wallet,
//   Activity,
//   TrendingDown,
// } from "lucide-react";

// const FEATURES = [
//   {
//     icon: Briefcase,
//     number: "01",
//     title: "CONTROL",
//     short: "Policy-aware booking",
//     desc: "Every booking is validated against travel policy, budget and approval rules automatically.",
//   },
//   {
//     icon: ShieldCheck,
//     number: "02",
//     title: "GOVERN",
//     short: "Dynamic approvals",
//     desc: "Approval chains adapt automatically to amount, policy status and employee grade.",
//   },
//   {
//     icon: Wallet,
//     number: "03",
//     title: "RECONCILE",
//     short: "Audit-ready spend",
//     desc: "Budgets, cards, reimbursements and transactions stay visible from request to reconciliation.",
//   },
// ];

// const ROUTE = {
//   from: {
//     code: "MAA",
//     city: "Chennai",
//   },
//   to: {
//     code: "SFO",
//     city: "San Francisco",
//   },
//   duration: "21h 40m",
// };

// export default function AuthBrandpanel() {
//   const rootRef = useRef<HTMLDivElement>(null);

//   const logoMarkRef = useRef<HTMLDivElement>(null);
//   const logoTextRef = useRef<HTMLDivElement>(null);

//   const eyebrowRef = useRef<HTMLDivElement>(null);
//   const headlineRef = useRef<HTMLHeadingElement>(null);
//   const subheadlineRef = useRef<HTMLParagraphElement>(null);

//   const flightCardRef = useRef<HTMLDivElement>(null);
//   const flightLineRef = useRef<HTMLDivElement>(null);
//   const flightPlaneRef = useRef<HTMLDivElement>(null);

//   const flightOriginRef = useRef<HTMLDivElement>(null);
//   const flightDestinationRef = useRef<HTMLDivElement>(null);

//   const policyCardRef = useRef<HTMLDivElement>(null);
//   const spendCardRef = useRef<HTMLDivElement>(null);

//   const capabilityRefs = useRef<Array<HTMLDivElement | null>>([]);
//   const capabilityDescRefs = useRef<Array<HTMLDivElement | null>>([]);

//   const footerRef = useRef<HTMLDivElement>(null);

//   /*
//    * ---------------------------------------------------------
//    * Feature hover
//    * ---------------------------------------------------------
//    */

//   const expandFeature = (index: number) => {
//     const desc = capabilityDescRefs.current[index];
//     const card = capabilityRefs.current[index];

//     if (!desc || !card) return;

//     gsap.to(desc, {
//       height: "auto",
//       opacity: 1,
//       duration: 0.3,
//       ease: "power2.out",
//     });

//     gsap.to(card, {
//       y: -4,
//       borderColor: "rgba(185, 133, 63, 0.3)",
//       backgroundColor: "rgba(255,255,255,0.055)",
//       duration: 0.25,
//     });
//   };

//   const collapseFeature = (index: number) => {
//     const desc = capabilityDescRefs.current[index];
//     const card = capabilityRefs.current[index];

//     if (!desc || !card) return;

//     gsap.to(desc, {
//       height: 0,
//       opacity: 0,
//       duration: 0.25,
//       ease: "power2.in",
//     });

//     gsap.to(card, {
//       y: 0,
//       borderColor: "rgba(255,255,255,0.08)",
//       backgroundColor: "rgba(255,255,255,0.025)",
//       duration: 0.25,
//     });
//   };

//   /*
//    * ---------------------------------------------------------
//    * Flight animation
//    * ---------------------------------------------------------
//    */

//   const startFlightAnimation = () => {
//     const plane = flightPlaneRef.current;
//     const line = flightLineRef.current;

//     if (!plane || !line) return;

//     gsap.killTweensOf(plane);

//     gsap.set(plane, {
//       x: 0,
//       opacity: 1,
//       rotation: 0,
//     });

//     const getDistance = () => line.offsetWidth;

//     const flightTimeline = gsap.timeline({
//       repeat: -1,
//       repeatDelay: 0.6,
//     });

//     // MAA
//     flightTimeline.to(plane, {
//       opacity: 1,
//       duration: 0.35,
//       ease: "power2.out",
//     });

//     // MAA -> SFO
//     flightTimeline.to(plane, {
//       x: () => getDistance(),
//       duration: 4,
//       ease: "power1.inOut",

//       onStart: () => {
//         gsap.to(flightLineRef.current, {
//           opacity: 1,
//           duration: 0.25,
//         });

//         gsap.to(flightOriginRef.current, {
//           scale: 0.85,
//           opacity: 0.5,
//           duration: 0.2,
//         });

//         gsap.to(flightDestinationRef.current, {
//           scale: 1.25,
//           duration: 0.25,
//           ease: "back.out(2)",
//         });
//       },

//       onComplete: () => {
//         gsap.to(flightDestinationRef.current, {
//           scale: 1,
//           duration: 0.2,
//         });
//       },
//     });

//     // Pause SFO
//     flightTimeline.to(
//       {},
//       {
//         duration: 0.9,
//       }
//     );

//     // Rotate
//     flightTimeline.to(plane, {
//       rotation: 180,
//       duration: 0.45,
//       ease: "power2.inOut",
//     });

//     // SFO -> MAA
//     flightTimeline.to(plane, {
//       x: 0,
//       duration: 4,
//       ease: "power1.inOut",

//       onStart: () => {
//         gsap.to(flightLineRef.current, {
//           opacity: 0.75,
//           duration: 0.25,
//         });

//         gsap.to(flightDestinationRef.current, {
//           scale: 0.85,
//           opacity: 0.5,
//           duration: 0.2,
//         });

//         gsap.to(flightOriginRef.current, {
//           scale: 1.25,
//           opacity: 1,
//           duration: 0.25,
//           ease: "back.out(2)",
//         });
//       },

//       onComplete: () => {
//         gsap.to(flightOriginRef.current, {
//           scale: 1,
//           duration: 0.2,
//         });
//       },
//     });

//     // Pause MAA
//     flightTimeline.to(
//       {},
//       {
//         duration: 0.9,
//       }
//     );

//     // Rotate back
//     flightTimeline.to(plane, {
//       rotation: 0,
//       duration: 0.45,
//       ease: "power2.inOut",
//     });

//     return flightTimeline;
//   };

//   /*
//    * ---------------------------------------------------------
//    * Entrance animations
//    * ---------------------------------------------------------
//    */

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.set(
//         [
//           logoTextRef.current,
//           eyebrowRef.current,
//           headlineRef.current,
//           subheadlineRef.current,
//           flightCardRef.current,
//           policyCardRef.current,
//           spendCardRef.current,
//           ...capabilityRefs.current,
//           footerRef.current,
//         ],
//         {
//           opacity: 0,
//         }
//       );

//       const tl = gsap.timeline({
//         defaults: {
//           ease: "power3.out",
//         },
//       });

//       /*
//        * Logo
//        */

//       tl.fromTo(
//         logoMarkRef.current,
//         {
//           opacity: 0,
//           scale: 0.65,
//           rotate: -10,
//         },
//         {
//           opacity: 1,
//           scale: 1,
//           rotate: 0,
//           duration: 0.55,
//           ease: "back.out(2)",
//         }
//       )
//         .fromTo(
//           logoTextRef.current,
//           {
//             opacity: 0,
//             x: -10,
//           },
//           {
//             opacity: 1,
//             x: 0,
//             duration: 0.4,
//           },
//           "-=0.25"
//         )

//         /*
//          * Hero
//          */

//         .fromTo(
//           eyebrowRef.current,
//           {
//             opacity: 0,
//             x: -12,
//           },
//           {
//             opacity: 1,
//             x: 0,
//             duration: 0.35,
//           },
//           "-=0.1"
//         )
//         .fromTo(
//           headlineRef.current,
//           {
//             opacity: 0,
//             y: 30,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.75,
//           },
//           "-=0.12"
//         )
//         .fromTo(
//           subheadlineRef.current,
//           {
//             opacity: 0,
//             y: 12,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.45,
//           },
//           "-=0.35"
//         )

//         /*
//          * Flight
//          */

//         .fromTo(
//           flightCardRef.current,
//           {
//             opacity: 0,
//             y: 20,
//             scale: 0.97,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             scale: 1,
//             duration: 0.65,
//           },
//           "-=0.15"
//         )

//         /*
//          * Floating cards
//          */

//         .fromTo(
//           policyCardRef.current,
//           {
//             opacity: 0,
//             y: 12,
//             x: 12,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             x: 0,
//             duration: 0.45,
//           },
//           "-=0.35"
//         )
//         .fromTo(
//           spendCardRef.current,
//           {
//             opacity: 0,
//             y: 12,
//             x: -12,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             x: 0,
//             duration: 0.45,
//           },
//           "-=0.3"
//         )

//         /*
//          * Features
//          */

//         .fromTo(
//           capabilityRefs.current,
//           {
//             opacity: 0,
//             y: 12,
//           },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.4,
//             stagger: 0.08,
//           },
//           "-=0.15"
//         )

//         .fromTo(
//           footerRef.current,
//           {
//             opacity: 0,
//           },
//           {
//             opacity: 1,
//             duration: 0.4,
//           },
//           "-=0.15"
//         );

//       /*
//        * Floating policy card
//        */

//       if (policyCardRef.current) {
//         gsap.to(policyCardRef.current, {
//           y: -6,
//           duration: 2.7,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//           delay: 1,
//         });
//       }

//       /*
//        * Floating spend card
//        */

//       if (spendCardRef.current) {
//         gsap.to(spendCardRef.current, {
//           y: 6,
//           duration: 3.2,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//           delay: 1.5,
//         });
//       }

//       /*
//        * Route line
//        */

//       if (flightLineRef.current) {
//         gsap.to(flightLineRef.current, {
//           opacity: 0.65,
//           duration: 1.8,
//           repeat: -1,
//           yoyo: true,
//           ease: "sine.inOut",
//           delay: 1,
//         });
//       }

//       /*
//        * Status dots
//        */

//       gsap.to(".voyentra-status-dot", {
//         opacity: 0.35,
//         duration: 1,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         delay: 1.6,
//       });

//       /*
//        * Metric glow
//        */

//       gsap.to(".metric-glow", {
//         opacity: 0.55,
//         duration: 2.4,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         delay: 1.5,
//       });

//       /*
//        * Start flight
//        */

//       gsap.delayedCall(1.8, () => {
//         startFlightAnimation();
//       });
//     }, rootRef);

//     return () => ctx.revert();
//   }, []);

//   /*
//    * ---------------------------------------------------------
//    * Render
//    * ---------------------------------------------------------
//    */

//   return (
//     <div
//       ref={rootRef}
//       className="hidden lg:flex flex-col justify-between bg-ink text-paper p-12 relative overflow-hidden"
//     >
//       {/* Background atmosphere */}

//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="absolute inset-0 opacity-[0.045]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
//             backgroundSize: "48px 48px",
//           }}
//         />

//         <div
//           className="absolute inset-0 opacity-[0.025]"
//           style={{
//             backgroundImage:
//               "radial-gradient(circle, #fff 1px, transparent 1px)",
//             backgroundSize: "18px 18px",
//           }}
//         />

//         <div className="absolute -top-56 -left-48 w-[620px] h-[620px] rounded-full bg-brass/10 blur-[130px]" />

//         <div className="absolute -bottom-56 -right-48 w-[580px] h-[580px] rounded-full bg-blue-500/[0.08] blur-[140px]" />

//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.012] blur-[100px]" />

//         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent" />

//         <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-paper/10 to-transparent" />
//       </div>

//       {/* Header */}

//       <div className="relative flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             ref={logoMarkRef}
//             className="relative w-10 h-10 rounded-xl bg-paper/[0.07] border border-paper/10 flex items-center justify-center shadow-[0_0_35px_rgba(185,133,63,.14)]"
//           >
//             <Plane className="w-[17px] h-[17px] text-paper" />

//             <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.85)]" />
//           </div>

//           <div ref={logoTextRef}>
//             <div className="font-display text-lg leading-none tracking-tight">
//               AKBHAR
//             </div>

//             <div className="text-[9px] tracking-[0.25em] text-paper/35 mt-1">
//               CORPORATE TRAVELS
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.035] px-3 py-1.5 backdrop-blur-sm">
//           <span className="voyentra-status-dot w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />

//           <span className="text-[8px] uppercase tracking-[0.19em] text-paper/40">
//             Systems operational
//           </span>
//         </div>
//       </div>

//       {/* Hero */}

//       <div className="relative max-w-2xl">
//         <div ref={eyebrowRef} className="flex items-center gap-3 mb-5">
//           <span className="text-[9px] uppercase tracking-[0.3em] text-brass">
//             Enterprise travel infrastructure
//           </span>

//           <div className="h-px w-16 bg-gradient-to-r from-brass/60 to-transparent" />
//         </div>

//         <h1
//           ref={headlineRef}
//           className="font-display text-[50px] leading-[0.99] tracking-[-0.04em] max-w-xl"
//         >
//           Travel at scale.
//           <br />
//           <span className="text-paper/40">Control by design.</span>
//         </h1>

//         <p
//           ref={subheadlineRef}
//           className="mt-5 text-[13px] leading-6 text-paper/45 max-w-md"
//         >
//           One operating layer for corporate travel, approvals, budgets and
//           spend — from request to reconciliation.
//         </p>

//         {/* Flight */}

//         <div className="relative mt-9">
//           <div
//             ref={flightCardRef}
//             className="relative rounded-2xl border border-paper/10 bg-white/[0.035] backdrop-blur-md overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,.22)]"
//           >
//             {/* Card header */}

//             <div className="flex items-center justify-between px-5 py-3 border-b border-paper/[0.07]">
//               <div className="flex items-center gap-2">
//                 <span className="voyentra-status-dot w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />

//                 <span className="text-[8px] uppercase tracking-[0.22em] text-paper/40">
//                   Live itinerary
//                 </span>
//               </div>

//               <div className="flex items-center gap-3">
//                 <span className="text-[8px] uppercase tracking-[0.16em] text-paper/20">
//                   Route monitored
//                 </span>

//                 <span className="font-mono text-[9px] text-paper/25">
//                   VE-2048
//                 </span>
//               </div>
//             </div>

//             {/* Route */}

//             <div className="p-5">
//               <div className="flex items-end justify-between">
//                 {/* MAA */}

//                 <div>
//                   <div className="font-mono text-[30px] tracking-tight">
//                     {ROUTE.from.code}
//                   </div>

//                   <div className="text-[9px] text-paper/35 mt-1">
//                     {ROUTE.from.city}
//                   </div>
//                 </div>

//                 {/* Corridor */}

//                 <div className="flex-1 mx-6 mb-4 relative">
//                   <div
//                     ref={flightLineRef}
//                     className="h-px bg-gradient-to-r from-paper/10 via-brass/70 to-paper/10"
//                   />

//                   {/* Origin */}

//                   <div
//                     ref={flightOriginRef}
//                     className="absolute left-0 top-1/2 -translate-y-1/2"
//                   >
//                     <div className="relative">
//                       <div className="w-2 h-2 rounded-full bg-paper/80 shadow-[0_0_8px_rgba(255,255,255,.15)]" />

//                       <div className="absolute inset-[-5px] rounded-full border border-paper/10" />
//                     </div>
//                   </div>

//                   {/* Destination */}

//                   <div
//                     ref={flightDestinationRef}
//                     className="absolute right-0 top-1/2 -translate-y-1/2"
//                   >
//                     <div className="relative">
//                       <div className="w-2 h-2 rounded-full bg-paper/80 shadow-[0_0_8px_rgba(255,255,255,.15)]" />

//                       <div className="absolute inset-[-5px] rounded-full border border-paper/10" />
//                     </div>
//                   </div>

//                   {/* Plane */}

//                   <div
//                     ref={flightPlaneRef}
//                     className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
//                     style={{
//                       transform: "translateX(0) translateY(-50%)",
//                       transformOrigin: "center center",
//                     }}
//                   >
//                     <div className="relative">
//                       <div className="absolute inset-[-8px] rounded-full bg-brass/20 blur-md" />

//                       <Plane
//                         className="relative w-4 h-4 text-brass"
//                         style={{
//                           transform: "rotate(90deg)",
//                         }}
//                       />
//                     </div>
//                   </div>

//                   <div className="absolute left-1/2 -translate-x-1/2 top-3 whitespace-nowrap text-[7px] uppercase tracking-[0.22em] text-paper/20">
//                     Pacific corridor
//                   </div>
//                 </div>

//                 {/* SFO */}

//                 <div className="text-right">
//                   <div className="font-mono text-[30px] tracking-tight">
//                     {ROUTE.to.code}
//                   </div>

//                   <div className="text-[9px] text-paper/35 mt-1">
//                     {ROUTE.to.city}
//                   </div>
//                 </div>
//               </div>

//               {/* Metadata */}

//               <div className="grid grid-cols-3 gap-2 mt-7">
//                 <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
//                   <div className="text-[7px] uppercase tracking-[0.2em] text-paper/25">
//                     Duration
//                   </div>

//                   <div className="font-mono text-xs mt-1 text-paper/80">
//                     {ROUTE.duration}
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
//                   <div className="text-[7px] uppercase tracking-[0.2em] text-paper/25">
//                     Policy
//                   </div>

//                   <div className="font-mono text-xs text-emerald-400 mt-1">
//                     Compliant
//                   </div>
//                 </div>

//                 <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
//                   <div className="text-[7px] uppercase tracking-[0.2em] text-paper/25">
//                     Approval
//                   </div>

//                   <div className="font-mono text-xs text-brass mt-1">
//                     Auto-cleared
//                   </div>
//                 </div>
//               </div>

//               {/* Status */}

//               <div className="flex items-center justify-between mt-4 pt-3 border-t border-paper/[0.06]">
//                 <div className="flex items-center gap-2">
//                   <Activity className="w-3 h-3 text-paper/30" />

//                   <span className="text-[8px] text-paper/30">
//                     Real-time policy validation active
//                   </span>
//                 </div>

//                 <span className="font-mono text-[8px] text-emerald-400/70">
//                   ONLINE
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Policy card */}

//           <div
//             ref={policyCardRef}
//             className="absolute -right-7 -top-7 w-[148px] rounded-xl border border-paper/10 bg-[#171717]/95 backdrop-blur-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,.4)]"
//           >
//             <div className="flex items-center justify-between">
//               <span className="text-[7px] uppercase tracking-[0.2em] text-paper/30">
//                 Policy score
//               </span>

//               <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
//             </div>

//             <div className="metric-glow font-mono text-xl mt-2 text-paper">
//               98.7%
//             </div>

//             <div className="mt-2 h-1 rounded-full bg-paper/10 overflow-hidden">
//               <div className="h-full w-[98.7%] bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full" />
//             </div>

//             <div className="text-[7px] text-paper/25 mt-1.5">
//               +4.2% this quarter
//             </div>
//           </div>

//           {/* Spend card */}

//           <div
//             ref={spendCardRef}
//             className="absolute -left-7 bottom-[-28px] w-[164px] rounded-xl border border-paper/10 bg-[#171717]/95 backdrop-blur-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,.4)]"
//           >
//             <div className="flex items-center justify-between">
//               <span className="text-[7px] uppercase tracking-[0.2em] text-paper/30">
//                 Controlled spend
//               </span>

//               <Wallet className="w-3.5 h-3.5 text-brass" />
//             </div>

//             <div className="metric-glow font-mono text-xl mt-2">
//               ₹24.8M
//             </div>

//             <div className="flex items-center gap-1.5 mt-1.5">
//               <TrendingDown className="w-3 h-3 text-emerald-400" />

//               <span className="text-[7px] text-emerald-400">
//                 12.4%
//               </span>

//               <span className="text-[7px] text-paper/20">
//                 vs previous period
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Capability rail */}

//         <div className="grid grid-cols-3 gap-3 mt-12">
//           {FEATURES.map((feature, index) => {
//             const Icon = feature.icon;

//             return (
//               <div
//                 key={feature.number}
//                 ref={(el) => {
//                   capabilityRefs.current[index] = el;
//                 }}
//                 onMouseEnter={() => expandFeature(index)}
//                 onMouseLeave={() => collapseFeature(index)}
//                 className="group cursor-default relative rounded-xl border border-paper/[0.08] bg-paper/[0.025] p-4 transition-colors"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="w-7 h-7 rounded-lg bg-paper/[0.06] flex items-center justify-center">
//                     <Icon className="w-3.5 h-3.5 text-paper/60 group-hover:text-brass transition-colors" />
//                   </div>

//                   <span className="font-mono text-[8px] text-paper/15">
//                     {feature.number}
//                   </span>
//                 </div>

//                 <div className="text-[8px] uppercase tracking-[0.22em] text-paper/30">
//                   {feature.title}
//                 </div>

//                 <div className="text-[11px] text-paper/70 mt-1 leading-snug">
//                   {feature.short}
//                 </div>

//                 <div
//                   ref={(el) => {
//                     capabilityDescRefs.current[index] = el;
//                   }}
//                   className="overflow-hidden"
//                   style={{
//                     height: 0,
//                     opacity: 0,
//                   }}
//                 >
//                   <p className="text-[9px] text-paper/35 leading-relaxed pt-2">
//                     {feature.desc}
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Coordinates */}

//         <div className="absolute -right-1 bottom-[-52px] text-right pointer-events-none">
//           <div className="font-mono text-[7px] tracking-[0.2em] text-paper/10">
//             13.0827° N
//           </div>

//           <div className="font-mono text-[7px] tracking-[0.2em] text-paper/10">
//             80.2707° E
//           </div>
//         </div>
//       </div>

//       {/* Footer */}

//       <div
//         ref={footerRef}
//         className="relative flex items-center justify-between text-paper/20"
//       />
//     </div>
//   );
// }














"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Plane,
  ShieldCheck,
  Wallet,
  Activity,
  TrendingDown,
  Briefcase,
  Check,
} from "lucide-react";

type RouteInfo = {
  from: {
    code: string;
    city: string;
  };
  to: {
    code: string;
    city: string;
  };
  duration: string;
};

type Feature = {
  number: string;
  title: string;
  short: string;
  desc: string;
  icon: typeof Briefcase;
};

const ROUTE: RouteInfo = {
  from: {
    code: "MAA",
    city: "Chennai",
  },
  to: {
    code: "SFO",
    city: "San Francisco",
  },
  duration: "17h 45m",
};

const FEATURES: Feature[] = [
  {
    number: "01",
    title: "Travel",
    short: "Global booking",
    desc: "Centralized corporate travel booking with policy-aware itineraries and real-time visibility.",
    icon: Plane,
  },
  {
    number: "02",
    title: "Control",
    short: "Policy engine",
    desc: "Enforce company travel policies automatically before bookings are confirmed.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Spend",
    short: "Budget intelligence",
    desc: "Track travel budgets, approvals and spend from request through reconciliation.",
    icon: Wallet,
  },
];

export default function AuthBrandpanel() {
  // ---------------------------------------------------------------------------
  // Root
  // ---------------------------------------------------------------------------

  const rootRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Logo
  // ---------------------------------------------------------------------------

  const logoMarkRef = useRef<HTMLDivElement>(null);
  const logoTextRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Hero
  // ---------------------------------------------------------------------------

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);

  // ---------------------------------------------------------------------------
  // Flight card
  // ---------------------------------------------------------------------------

  const flightCardRef = useRef<HTMLDivElement>(null);
  const flightLineRef = useRef<HTMLDivElement>(null);
  const flightPlaneRef = useRef<HTMLDivElement>(null);
  const flightOriginRef = useRef<HTMLDivElement>(null);
  const flightDestinationRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Floating cards
  // ---------------------------------------------------------------------------

  const policyCardRef = useRef<HTMLDivElement>(null);
  const spendCardRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Feature cards
  // ---------------------------------------------------------------------------

  const capabilityRefs = useRef<Array<HTMLDivElement | null>>([]);
  const capabilityDescRefs = useRef<Array<HTMLDivElement | null>>([]);

  // ---------------------------------------------------------------------------
  // Footer
  // ---------------------------------------------------------------------------

  const footerRef = useRef<HTMLDivElement>(null);

  // ===========================================================================
  // Feature hover animation
  // ===========================================================================

  const expandFeature = (index: number) => {
    const desc = capabilityDescRefs.current[index];
    const card = capabilityRefs.current[index];

    if (!desc || !card) return;

    gsap.to(desc, {
      height: "auto",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(card, {
      y: -4,
      borderColor: "rgba(185, 133, 63, 0.3)",
      backgroundColor: "rgba(255,255,255,0.055)",
      duration: 0.25,
    });
  };

  const collapseFeature = (index: number) => {
    const desc = capabilityDescRefs.current[index];
    const card = capabilityRefs.current[index];

    if (!desc || !card) return;

    gsap.to(desc, {
      height: 0,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });

    gsap.to(card, {
      y: 0,
      borderColor: "rgba(255,255,255,0.08)",
      backgroundColor: "rgba(255,255,255,0.025)",
      duration: 0.25,
    });
  };

  // ===========================================================================
  // Flight animation
  //
  // MAA -> SFO -> pause -> SFO -> MAA -> pause -> repeat
  // ===========================================================================

  const startFlightAnimation = () => {
    const plane = flightPlaneRef.current;
    const line = flightLineRef.current;

    if (!plane || !line) return;

    gsap.killTweensOf(plane);

    gsap.set(plane, {
      x: 0,
      opacity: 1,
      rotation: 0,
    });

    const getDistance = () => line.offsetWidth;

    const flightTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.6,
    });

    // -------------------------------------------------------------------------
    // Start at MAA
    // -------------------------------------------------------------------------

    flightTimeline.to(plane, {
      opacity: 1,
      duration: 0.35,
      ease: "power2.out",
    });

    // -------------------------------------------------------------------------
    // MAA -> SFO
    // -------------------------------------------------------------------------

    flightTimeline.to(plane, {
      x: () => getDistance(),
      duration: 4,
      ease: "power1.inOut",

      onStart: () => {
        gsap.to(flightLineRef.current, {
          opacity: 1,
          duration: 0.25,
        });

        gsap.to(flightOriginRef.current, {
          scale: 0.85,
          opacity: 0.5,
          duration: 0.2,
        });

        gsap.to(flightDestinationRef.current, {
          scale: 1.25,
          duration: 0.25,
          ease: "back.out(2)",
        });
      },

      onComplete: () => {
        gsap.to(flightDestinationRef.current, {
          scale: 1,
          duration: 0.2,
        });
      },
    });

    // -------------------------------------------------------------------------
    // Pause at SFO
    // -------------------------------------------------------------------------

    flightTimeline.to(
      {},
      {
        duration: 0.9,
      }
    );

    // -------------------------------------------------------------------------
    // Rotate aircraft
    // -------------------------------------------------------------------------

    flightTimeline.to(plane, {
      rotation: 180,
      duration: 0.45,
      ease: "power2.inOut",
    });

    // -------------------------------------------------------------------------
    // SFO -> MAA
    // -------------------------------------------------------------------------

    flightTimeline.to(plane, {
      x: 0,
      duration: 4,
      ease: "power1.inOut",

      onStart: () => {
        gsap.to(flightLineRef.current, {
          opacity: 0.75,
          duration: 0.25,
        });

        gsap.to(flightDestinationRef.current, {
          scale: 0.85,
          opacity: 0.5,
          duration: 0.2,
        });

        gsap.to(flightOriginRef.current, {
          scale: 1.25,
          opacity: 1,
          duration: 0.25,
          ease: "back.out(2)",
        });
      },

      onComplete: () => {
        gsap.to(flightOriginRef.current, {
          scale: 1,
          duration: 0.2,
        });
      },
    });

    // -------------------------------------------------------------------------
    // Pause at MAA
    // -------------------------------------------------------------------------

    flightTimeline.to(
      {},
      {
        duration: 0.9,
      }
    );

    // -------------------------------------------------------------------------
    // Rotate aircraft toward SFO
    // -------------------------------------------------------------------------

    flightTimeline.to(plane, {
      rotation: 0,
      duration: 0.45,
      ease: "power2.inOut",
    });

    return flightTimeline;
  };

  // ===========================================================================
  // Entrance + ambient animations
  // ===========================================================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      // -----------------------------------------------------------------------
      // Initial state
      // -----------------------------------------------------------------------

      gsap.set(
        [
          logoTextRef.current,
          eyebrowRef.current,
          headlineRef.current,
          subheadlineRef.current,
          flightCardRef.current,
          policyCardRef.current,
          spendCardRef.current,
          ...capabilityRefs.current,
          footerRef.current,
        ],
        {
          opacity: 0,
        }
      );

      // -----------------------------------------------------------------------
      // Main entrance timeline
      // -----------------------------------------------------------------------

      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // Logo mark
      tl.fromTo(
        logoMarkRef.current,
        {
          opacity: 0,
          scale: 0.65,
          rotate: -10,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.55,
          ease: "back.out(2)",
        }
      )

        // Logo text
        .fromTo(
          logoTextRef.current,
          {
            opacity: 0,
            x: -10,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
          },
          "-=0.25"
        )

        // Eyebrow
        .fromTo(
          eyebrowRef.current,
          {
            opacity: 0,
            x: -12,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
          },
          "-=0.1"
        )

        // Headline
        .fromTo(
          headlineRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
          },
          "-=0.12"
        )

        // Subheadline
        .fromTo(
          subheadlineRef.current,
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.35"
        )

        // Flight card
        .fromTo(
          flightCardRef.current,
          {
            opacity: 0,
            y: 20,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
          },
          "-=0.15"
        )

        // Policy card
        .fromTo(
          policyCardRef.current,
          {
            opacity: 0,
            y: 12,
            x: 12,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.45,
          },
          "-=0.35"
        )

        // Spend card
        .fromTo(
          spendCardRef.current,
          {
            opacity: 0,
            y: 12,
            x: -12,
          },
          {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.45,
          },
          "-=0.3"
        )

        // Feature cards
        .fromTo(
          capabilityRefs.current,
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
          },
          "-=0.15"
        )

        // Footer
        .fromTo(
          footerRef.current,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.4,
          },
          "-=0.15"
        );

      // -----------------------------------------------------------------------
      // Floating policy card
      // -----------------------------------------------------------------------

      if (policyCardRef.current) {
        gsap.to(policyCardRef.current, {
          y: -6,
          duration: 2.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }

      // -----------------------------------------------------------------------
      // Floating spend card
      // -----------------------------------------------------------------------

      if (spendCardRef.current) {
        gsap.to(spendCardRef.current, {
          y: 6,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
        });
      }

      // -----------------------------------------------------------------------
      // Flight line breathing
      // -----------------------------------------------------------------------

      if (flightLineRef.current) {
        gsap.to(flightLineRef.current, {
          opacity: 0.65,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }

      // -----------------------------------------------------------------------
      // Status pulse
      // -----------------------------------------------------------------------

      const statusDots =
        rootRef.current?.querySelectorAll(".voyentra-status-dot");

      if (statusDots) {
        gsap.to(statusDots, {
          opacity: 0.35,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.6,
        });
      }

      // -----------------------------------------------------------------------
      // Metric glow
      // -----------------------------------------------------------------------

      const metricGlow =
        rootRef.current?.querySelectorAll(".metric-glow");

      if (metricGlow) {
        gsap.to(metricGlow, {
          opacity: 0.55,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
        });
      }

      // -----------------------------------------------------------------------
      // Start flight animation
      // -----------------------------------------------------------------------

      gsap.delayedCall(1.8, () => {
        startFlightAnimation();
      });
    }, rootRef);

    // -------------------------------------------------------------------------
    // Important:
    // Revert ALL animations created inside this component.
    // Nothing outside this component is touched.
    // -------------------------------------------------------------------------

    return () => {
      ctx.revert();
    };
  }, []);

  // ===========================================================================
  // Render
  // ===========================================================================

  return (
    <div
      ref={rootRef}
      className="hidden lg:flex flex-col justify-between bg-ink text-paper p-12 relative overflow-hidden"
    >
      {/* =====================================================================
          BACKGROUND
      ====================================================================== */}

      <div className="pointer-events-none absolute inset-0">
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Dots */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Brass glow */}
        <div className="absolute -top-56 -left-48 w-[620px] h-[620px] rounded-full bg-brass/10 blur-[130px]" />

        {/* Blue glow */}
        <div className="absolute -bottom-56 -right-48 w-[580px] h-[580px] rounded-full bg-blue-500/[0.08] blur-[140px]" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.012] blur-[100px]" />

        {/* Top line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brass/60 to-transparent" />

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-paper/10 to-transparent" />
      </div>

      {/* =====================================================================
          TOP LOGO
      ====================================================================== */}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            ref={logoMarkRef}
            className="relative w-10 h-10 rounded-xl bg-paper/[0.07] border border-paper/10 flex items-center justify-center shadow-[0_0_35px_rgba(185,133,63,.14)]"
          >
            <Plane className="w-[17px] h-[17px] text-paper" />

            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.85)]" />
          </div>

          <div ref={logoTextRef}>
            <div className="font-display text-lg leading-none tracking-tight">
              AKBHAR
            </div>

            <div className="text-[9px] tracking-[0.25em] text-paper/35 mt-1">
              CORPORATE TRAVELS
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-paper/10 bg-paper/[0.035] px-3 py-1.5 backdrop-blur-sm">
          <span className="voyentra-status-dot w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />

          <span className="text-[8px] uppercase tracking-[0.19em] text-paper/40">
            Systems operational
          </span>
        </div>
      </div>

      {/* =====================================================================
          MAIN HERO
      ====================================================================== */}

      <div className="relative max-w-2xl">
        {/* Eyebrow */}

        <div
          ref={eyebrowRef}
          className="flex items-center gap-3 mb-5"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-brass">
            Enterprise travel infrastructure
          </span>

          <div className="h-px w-16 bg-gradient-to-r from-brass/60 to-transparent" />
        </div>

        {/* Headline */}

        <h1
          ref={headlineRef}
          className="font-display text-[50px] leading-[0.99] tracking-[-0.04em] max-w-xl"
        >
          Travel at scale.
          <br />
          <span className="text-paper/40">
            Control by design.
          </span>
        </h1>

        {/* Subheadline */}

        <p
          ref={subheadlineRef}
          className="mt-5 text-[13px] leading-6 text-paper/45 max-w-md"
        >
          One operating layer for corporate travel, approvals, budgets and
          spend — from request to reconciliation.
        </p>

        {/* ===================================================================
            FLIGHT AREA
        ==================================================================== */}

        <div className="relative mt-9">
          {/* Flight card */}

          <div
            ref={flightCardRef}
            className="relative rounded-2xl border border-paper/10 bg-white/[0.035] backdrop-blur-md overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,.22)]"
          >
            {/* Card header */}

            <div className="flex items-center justify-between px-5 py-3 border-b border-paper/[0.07]">
              <div className="flex items-center gap-2">
                <span className="voyentra-status-dot w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />

                <span className="text-[8px] uppercase tracking-[0.22em] text-paper/40">
                  Live itinerary
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[8px] uppercase tracking-[0.16em] text-paper/20">
                  Route monitored
                </span>

                <span className="font-mono text-[9px] text-paper/25">
                  VE-2048
                </span>
              </div>
            </div>

            {/* Card body */}

            <div className="p-5">
              <div className="flex items-end justify-between">
                {/* Origin */}

                <div>
                  <div className="font-mono text-[30px] tracking-tight">
                    {ROUTE.from.code}
                  </div>

                  <div className="text-[9px] text-paper/35 mt-1">
                    {ROUTE.from.city}
                  </div>
                </div>

                {/* Flight line */}

                <div className="flex-1 mx-6 mb-4 relative">
                  <div
                    ref={flightLineRef}
                    className="h-px bg-gradient-to-r from-paper/10 via-brass/70 to-paper/10"
                  />

                  {/* Origin dot */}

                  <div
                    ref={flightOriginRef}
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-paper/80 shadow-[0_0_8px_rgba(255,255,255,.15)]" />

                      <div className="absolute inset-[-5px] rounded-full border border-paper/10" />
                    </div>
                  </div>

                  {/* Destination dot */}

                  <div
                    ref={flightDestinationRef}
                    className="absolute right-0 top-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-paper/80 shadow-[0_0_8px_rgba(255,255,255,.15)]" />

                      <div className="absolute inset-[-5px] rounded-full border border-paper/10" />
                    </div>
                  </div>

                  {/* Animated airplane */}

                  <div
                    ref={flightPlaneRef}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                    style={{
                      transform:
                        "translateX(0) translateY(-50%)",
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="relative">
                      <div className="absolute inset-[-8px] rounded-full bg-brass/20 blur-md" />

                      <Plane
                        className="relative w-4 h-4 text-brass"
                        style={{
                          transform: "rotate(90deg)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 top-3 whitespace-nowrap text-[7px] uppercase tracking-[0.22em] text-paper/20">
                    Pacific corridor
                  </div>
                </div>

                {/* Destination */}

                <div className="text-right">
                  <div className="font-mono text-[30px] tracking-tight">
                    {ROUTE.to.code}
                  </div>

                  <div className="text-[9px] text-paper/35 mt-1">
                    {ROUTE.to.city}
                  </div>
                </div>
              </div>

              {/* Metrics */}

              <div className="grid grid-cols-3 gap-2 mt-7">
                <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
                  <div className="text-[7px] uppercase tracking-[0.2em] text-paper/25">
                    Duration
                  </div>

                  <div className="font-mono text-xs mt-1 text-paper/80">
                    {ROUTE.duration}
                  </div>
                </div>

                <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
                  <div className="text-[7px] uppercase tracking-[0.2em] text-paper/25">
                    Policy
                  </div>

                  <div className="font-mono text-xs text-emerald-400 mt-1">
                    Compliant
                  </div>
                </div>

                <div className="rounded-lg border border-paper/[0.06] bg-paper/[0.025] p-3">
                  <div className="text-[7px] uppercase tracking-[0.2em] text-paper/25">
                    Approval
                  </div>

                  <div className="font-mono text-xs text-brass mt-1">
                    Auto-cleared
                  </div>
                </div>
              </div>

              {/* Bottom status */}

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-paper/[0.06]">
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-paper/30" />

                  <span className="text-[8px] text-paper/30">
                    Real-time policy validation active
                  </span>
                </div>

                <span className="font-mono text-[8px] text-emerald-400/70">
                  ONLINE
                </span>
              </div>
            </div>
          </div>

          {/* =================================================================
              FLOATING POLICY CARD
          ================================================================== */}

          <div
            ref={policyCardRef}
            className="absolute -right-7 -top-7 w-[148px] rounded-xl border border-paper/10 bg-[#171717]/95 backdrop-blur-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,.4)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-[0.2em] text-paper/30">
                Policy score
              </span>

              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="metric-glow font-mono text-xl mt-2 text-paper">
              98.7%
            </div>

            <div className="mt-2 h-1 rounded-full bg-paper/10 overflow-hidden">
              <div className="h-full w-[98.7%] bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full" />
            </div>

            <div className="text-[7px] text-paper/25 mt-1.5">
              +4.2% this quarter
            </div>
          </div>

          {/* =================================================================
              FLOATING SPEND CARD
          ================================================================== */}

          <div
            ref={spendCardRef}
            className="absolute -left-7 bottom-[-28px] w-[164px] rounded-xl border border-paper/10 bg-[#171717]/95 backdrop-blur-xl p-3.5 shadow-[0_20px_50px_rgba(0,0,0,.4)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-[0.2em] text-paper/30">
                Controlled spend
              </span>

              <Wallet className="w-3.5 h-3.5 text-brass" />
            </div>

            <div className="metric-glow font-mono text-xl mt-2">
              ₹24.8M
            </div>

            <div className="flex items-center gap-1.5 mt-1.5">
              <TrendingDown className="w-3 h-3 text-emerald-400" />

              <span className="text-[7px] text-emerald-400">
                12.4%
              </span>

              <span className="text-[7px] text-paper/20">
                vs previous period
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            CAPABILITY RAIL
        ==================================================================== */}

        <div className="grid grid-cols-3 gap-3 mt-12">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                ref={(el) => {
                  capabilityRefs.current[index] = el;
                }}
                onMouseEnter={() => expandFeature(index)}
                onMouseLeave={() => collapseFeature(index)}
                className="group cursor-default relative rounded-xl border border-paper/[0.08] bg-paper/[0.025] p-4 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-7 h-7 rounded-lg bg-paper/[0.06] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-paper/60 group-hover:text-brass transition-colors" />
                  </div>

                  <span className="font-mono text-[8px] text-paper/15">
                    {feature.number}
                  </span>
                </div>

                <div className="text-[8px] uppercase tracking-[0.22em] text-paper/30">
                  {feature.title}
                </div>

                <div className="text-[11px] text-paper/70 mt-1 leading-snug">
                  {feature.short}
                </div>

                <div
                  ref={(el) => {
                    capabilityDescRefs.current[index] = el;
                  }}
                  className="overflow-hidden"
                  style={{
                    height: 0,
                    opacity: 0,
                  }}
                >
                  <p className="text-[9px] text-paper/35 leading-relaxed pt-2">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===================================================================
            COORDINATES
        ==================================================================== */}

        <div className="absolute -right-1 bottom-[-52px] text-right pointer-events-none">
          <div className="font-mono text-[7px] tracking-[0.2em] text-paper/10">
            13.0827° N
          </div>

          <div className="font-mono text-[7px] tracking-[0.2em] text-paper/10">
            80.2707° E
          </div>
        </div>
      </div>

      {/* =====================================================================
          FOOTER
      ====================================================================== */}

      <div
        ref={footerRef}
        className="relative flex items-center justify-between text-paper/20"
      />
    </div>
  );
}