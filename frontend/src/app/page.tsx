import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-medium mb-2">Pet Finder</h1>
      <p className="text-gray-600 mb-6">Platforma dla zweryfikowanych hodowców zwierząt.</p>
      <Link href="/offers" className="inline-block bg-black text-white px-4 py-2 rounded">
        Zobacz ogłoszenia
      </Link>
    </div>
  );
}
