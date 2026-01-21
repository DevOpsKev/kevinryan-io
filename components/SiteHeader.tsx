export default function SiteHeader() {
  return (
    <header className="w-full py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-6">
        <h1
          className="
            font-serif
            text-5xl
            md:text-6xl
            lg:text-7xl
            font-semibold
            tracking-tight
            text-base-content
          "
        >
          Kevin Ryan
        </h1>

        <p
          className="
            mt-4
            font-sans
            text-sm
            md:text-base
            uppercase
            tracking-widest
            text-base-content/70
          "
        >
          Technologist · Engineer · Author · Technical Writer
        </p>
      </div>
    </header>
  );
}
