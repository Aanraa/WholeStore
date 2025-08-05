"use client";

import { useState, useEffect } from "react";
import { auth } from "../app/Firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import Login from "../app/login/page";
import Dashboard from "../app/section/page";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {user ? <Dashboard user={user} /> : <Login />}
    </div>
  );
}
