"use client";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push("/dashboard");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold">Login</h1>

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full border p-2" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full border p-2" />

        <button onClick={login} className="w-full bg-black text-white p-2">
          Login
        </button>

        <button onClick={googleLogin} className="w-full border p-2">
          Continue with Google
        </button>
      </div>
    </div>
  );
}