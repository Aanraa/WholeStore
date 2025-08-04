"use client";

import Link from "next/link";

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
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 text-gray-900">
      <section className="text-gray-900 body-font">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-12 py-32 gap-12">
          {/* Left Content */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight max-w-lg">
              Бараа бүртгэл амар боллоо
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-xl leading-relaxed">
              Бараа бүртгэх нэмэх хасах бүх үйлдлээ манай веб хуудсаар хийснээр
              та алтан цагаа хэмнэхээс гадна илүү бүтээмжтэй хурдан ажиллах
              болно.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <Link
                href="/login"
                className="inline-block px-8 py-3 bg-sky-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
              >
                Нэвтрэх
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-3/5 max-w-md md:max-w-none rounded-xl overflow-hidden shadow-lg ring-1 ring-indigo-100">
            <img
              src="https://dummyimage.com/720x600/ffffff/000000&text=🎲"
              alt="Hero image showing products"
              className="w-full h-auto object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-700 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            WholeStore нь жижиг дунд бизнесүүдэд зориулагдсан хөнгөн, уян хатан
            дэлгүүрийн удирдлагын платформ юм. Та бүтээгдэхүүнээ удирдаж байгаа,
            үйлчилгээ эрхэлж байгаа эсвэл бараа материал зохион байгуулж байгаа
            эсэхээс үл хамааран WholeStore бүх зүйлийг энгийн, хурдан бөгөөд нэг
            дор хадгалдаг.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-8 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} WholeStore. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
