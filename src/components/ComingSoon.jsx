import Link from "next/link";

export default function ComingSoon({ feature = "This page" }) {
  return (
    // <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
    //   <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-lg">
    //     <h1 className="text-3xl font-bold mb-3">🚧 Coming Soon</h1>
    //     <p className="text-gray-700 mb-6">
    //       {feature} isn’t ready yet, but we’re working on it. Check back soon!
    //     </p>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-charcoal to-black text-center px-4">
      {/* Logo / Hero */}
      <h3 className="text-3xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
        🚧 Coming Soon 🚧
      </h3>

      <p className="mt-4 max-w-lg text-base sm:text-lg text-gray-300">
        We’re working hard to bring you something exciting.  
        Stay tuned — it’ll be worth the wait!
      </p>

      {/* Animated loader dots */}
      <div className="flex gap-2 my-7">
        <span className="w-3 h-3 bg-lime-400 rounded-full animate-bounce"></span>
        <span className="w-3 h-3 bg-coral rounded-full animate-bounce [animation-delay:0.2s]"></span>
        <span className="w-3 h-3 bg-cyan-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
      </div>
        <Link
          href="/"
          className="font-bold cursor-pointer bg-lime-400 border-3 border-gray-500/100 px-8 py-1 rounded-full text-black hover:bg-white hover:text-black hover:translate-y-0.5 shadow-[0_4px_0_0_#0f0] hover:shadow-[0_2px_0_0_#0f0] active:translate-y-2 transition-all duration-200"
        >
          Go home!
        </Link>
      </div>
    // </div>
  );
}
