import BlackFridayHero from "@/app/(components)/BlackFridayHero";
import PromoForm from "@/app/(components)/PromoForm";

export default function Page() {
  return (
    <div className="bg-linear-to-br from-black via-zinc-900 to-zinc-700 flex items-center justify-center font-sans p-4 rounded">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <BlackFridayHero />
        <PromoForm />
      </div>
    </div>
  );
}
