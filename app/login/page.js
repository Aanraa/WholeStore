"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { LuStore } from "react-icons/lu";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, provider } from "../Firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Амжилттай нэвтэрлээ!");
      router.push("/section");
    } catch (error) {
      toast.error(error.message || "Нэвтрэхэд алдаа гарлаа");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Google-р амжилттай нэвтэрлээ!");
      router.push("/section");
    } catch (error) {
      toast.error(error.message || "Google-р нэвтрэхэд алдаа гарлаа");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("И-мэйл хаягаа оруулна уу");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Нууц үг сэргээх холбоос таны и-мэйл рүү илгээгдлээ");
    } catch (error) {
      toast.error(error.message || "И-мэйл илгээхэд алдаа гарлаа");
    }
  };

  return (
    <section className="bg-gray-100  min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8 space-y-6">
        <div className="flex justify-center">
          <LuStore className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Нэвтрэх хэсэг
        </h2>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              И-Мейл
            </label>
            <input
              type="email"
              id="email"
              className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="name@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Нууц үг
            </label>
            <input
              type="password"
              id="password"
              className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span>Сануулах</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-gray-700 hover:underline"
            >
              Нууц үгээ мартсан?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2.5 rounded-lg hover:bg-gray-900 transition font-semibold"
          >
            Нэвтрэх
          </button>
        </form>

        <div className="flex items-center justify-between">
          <div className="h-px bg-gray-300 w-full"></div>
          <span className="px-2 text-sm text-gray-400">эсвэл</span>
          <div className="h-px bg-gray-300 w-full"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300 py-2.5 rounded-lg font-medium transition"
        >
          <FaGoogle className="text-lg" />
          Google-р нэвтрэх
        </button>

        <p className="text-center text-sm text-gray-600">
          Бүртгэлгүй юу?
          <Link
            href="/login/register"
            className="ml-1 text-gray-700 hover:underline font-bold"
          >
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
