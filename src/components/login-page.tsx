"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { UserNav } from "./user-nav";
import { ArrowRight, Wallet } from "lucide-react";

export function LoginPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "login-hero");

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 flex flex-col items-center justify-center text-center p-4">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover opacity-10"
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="relative z-10 bg-background/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline">
            EduChain Records
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
            Immutable Academic Records on the Blockchain. Secure, transparent, and
            tamper-proof verification for students and institutions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <div className="flex items-center space-x-2">
                <Wallet className="w-5 h-5"/>
                <span>Connect your Hiro Wallet to get started</span>
                <ArrowRight className="w-5 h-5"/>
            </div>
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
}
