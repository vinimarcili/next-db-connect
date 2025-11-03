export default function Footer() {
  return (
    <footer className="w-full py-4 bg-zinc-900 text-zinc-200 mt-10">
      <div className="max-w-5xl mx-auto px-6 text-center text-xs">
        &copy; {new Date().getFullYear()} Black Friday Hotpage. All rights reserved.
      </div>
    </footer>
  );
}
