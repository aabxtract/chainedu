"use client";

import { useAuth } from "@/contexts/auth-context";
import { LoginPage } from "@/components/login-page";
import { Dashboard } from "@/components/dashboard";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner
  }

  return user ? <Dashboard /> : <LoginPage />;
}
