"use client";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCred.user, {
        displayName: name,
      });

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="space-y-4 w-full max-w-sm">
        <h1 className="text-xl font-bold">Create Account</h1>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} className="w-full border p-2" />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full border p-2" />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full border p-2" />

        <button onClick={handleRegister} className="w-full bg-black text-white p-2">
          Register
        </button>
      </div>
    </div>
  );
}