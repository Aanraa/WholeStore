"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Link from "next/link";
import {
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
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
      // router.push('/') гэх мэт дараагийн хуудас руу залах
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
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-6 sm:p-8">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white text-center">
            Нэвтрэх хэсэг
          </h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                И-Мейл
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@mail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Нууц үг
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-300">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                />

                <span>Сануулах</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Нууц үгээ мартсан?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Нэвтрэх
            </button>

            <div className="relative text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 z-10 relative">
                Эсвэл
              </span>
              <div className="absolute left-0 top-1/2 w-full h-px bg-gray-300 dark:bg-gray-600 -translate-y-1/2"></div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                className="w-full flex items-center dark:text-black dark:bg-white justify-center bg-gray-200 hover:bg-gray-300 text-black font-medium rounded-lg text-sm px-5 py-2.5"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="mr-2" />
                Google
              </button>
            </div>
          </form>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
            Бүртгэлгүй юу?
            <Link
              href="/login/register"
              className="ml-1 font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
