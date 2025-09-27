import Link from "next/link";
import { CometCardDemo } from "@/components/CometCardDemo";

const routes = [
  { name: "ISS", path: "/iss" },
  { name: "Escape Suit", path: "/suits/escape" },
  { name: "Space Suit", path: "/suits/space" },
  { name: "Astronaut", path: "/astronaut" },
];

export default function Home() {
  return (
    <div className="min-h-screen p-12 bg-black flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-12 text-white">3D Model Explorer</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 w-full max-w-7xl">
        {routes.map((route, idx) => (
          <Link key={idx} href={route.path} className="group">
            <div className="bg-gray-900 rounded-xl shadow-lg p-10 flex flex-col items-center justify-center hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1">
              <CometCardDemo />
              <h2 className="mt-8 text-xl font-semibold text-white group-hover:text-blue-400">
                {route.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


