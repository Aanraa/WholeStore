"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, {
        displayName: userName,
      });
      toast.success("Амжилттай бүртгэгдлээ!");
      router.push("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Энэ и-мэйл хаяг аль хэдийн бүртгэлтэй байна.");
      } else {
        toast.error("Алдаа гарлаа: " + error.message);
      }
    }
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
          Бүртгүүлэх
        </h1>

        <div className="flex gap-4 justify-center">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-center">
            <FaGoogle />
            Google
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full justify-center">
            <FaFacebookF />
            Facebook
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
              эсвэл
            </span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
            >
              Нэр
            </label>
            <input
              type="text"
              id="userName"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Нэвтрэх нэр"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
            >
              И-Мэйл
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700 dark:text-white"
            >
              Нууц үг
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Бүртгүүлэх
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          Та бүртгэлтэй юу?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Нэвтрэх
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
