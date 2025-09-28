import Link from "next/link";
import { CometCardDemo } from "@/components/CometCardDemo";

const routes = [
  { name: "Space Suit", path: "/spaceSuitZ2", img: "/images/spaceSuit.png" },
  { name: "ISS", path: "/iss", img: "/assets/img6.png" },
  { name: "Astronaut", path: "/astronaut", img: "/assets/img7.png" },
];

export default function Home() {
  return (
    <div className=" min-w-screen min-h-screen p-4 bg-gradient-to-b from-black via-gray-900 to-black flex  overflow-hidden flex-col items-center justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16  mx-auto">
        {routes.map((route, idx) => (
          <Link key={idx} href={route.path} className="group">
            <div className="flex flex-col  items-center text-center transform transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]">
              <CometCardDemo image={route.img} />
              <h2 className="mt-6 text-lg  font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                {route.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
