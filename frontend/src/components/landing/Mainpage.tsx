"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

import LandingFooter from "./LandingFooter";
import LandingHeader from "./LandingHeader";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Testimonials from "./Testimonials";
import ReviewStats from "./ReviewStats";


export default function Mainpage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
    // router.replace(user ? '/dashboard' : '/signin');
  }, [loading, user, router]);

  return (
    <div className="min-h-screen bg-paper">
      <LandingHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <ReviewStats />
      </main>
      <LandingFooter />
    </div>
  );
}
