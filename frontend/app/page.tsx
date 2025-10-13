"use client";
import Link from "next/link";
import Image from "next/image";
import { WaitlistForm } from "@/components/waitlist-form";
import { Sparkles, Heart, Users } from "lucide-react";
import { useState, useEffect } from "react";

function DecorativeStars() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f1419]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-white" />
            <span className="text-xl font-bold text-white">Luminary Labs</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="#features"
              className="text-white/80 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#rituals"
              className="text-white/80 hover:text-white transition-colors"
            >
              Rituals
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                  Embark on a Journey of Serenity & Style
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Join the Reserve List for an Elevated Daily Ritual
                </p>
              </div>

              <WaitlistForm />

              <p className="text-sm text-white/60">
                Be among 50 exclusive first to experience
              </p>
            </div>

            <div className="relative">
              <div className="relative z-10 flex items-center justify-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_xksqzoxksqzoxksq-yfSeqj0Z3FCsApIu59kYJ3AZRZci9i.png"
                  alt="Luminary Essence Elixir"
                  width={600}
                  height={600}
                  className="w-full max-w-md h-auto drop-shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#C9A88A]/30 via-[#E8D5C4]/20 to-transparent blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C9A88A]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>

        <DecorativeStars />
      </main>

      <section id="features" className="py-20 px-6 bg-[#F5F0EB]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-4">
                <Sparkles className="w-8 h-8 text-[#C9A88A]" />
              </div>
              <h3 className="text-xl font-bold text-[#2A2A3C]">
                Exquisite Formulations
              </h3>
              <p className="text-[#8B8B9E] leading-relaxed">
                Crafted with the finest ingredients for your daily ritual
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-4">
                <Heart className="w-8 h-8 text-[#C9A88A]" />
              </div>
              <h3 className="text-xl font-bold text-[#2A2A3C]">
                Holistic Well-being
              </h3>
              <p className="text-[#8B8B9E] leading-relaxed">
                Nurture your mind, body, and spirit with every use
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-4">
                <Users className="w-8 h-8 text-[#C9A88A]" />
              </div>
              <h3 className="text-xl font-bold text-[#2A2A3C]">
                Exclusive Community Access
              </h3>
              <p className="text-[#8B8B9E] leading-relaxed">
                Join a community of like-minded individuals on the same journey
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
