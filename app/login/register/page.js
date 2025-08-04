"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Firebase/config";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { LuStore } from "react-icons/lu";

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
      await updateProfile(userCredential.user, { displayName: userName });
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
    <section className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8 space-y-6">
        <div className="flex justify-center">
          <LuStore className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-center text-gray-900">
          Бүртгүүлэх
        </h3>

        <div className="flex gap-4">
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition">
            <FaGoogle />
            Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">эсвэл</span>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Нэр
            </label>
            <input
              type="text"
              id="userName"
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Нэвтрэх нэр"
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              И-Мэйл
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="name@example.com"
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
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition"
          >
            Бүртгүүлэх
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Та бүртгэлтэй юу?
          <a
            href="/login"
            className="text-gray-800 hover:underline ml-1 font-bold"
          >
            Нэвтрэх
          </a>
        </p>
      </div>
    </section>
  );
};

export default Register;
