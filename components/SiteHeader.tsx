import FitSubtitle from "@/components/FitSubtitle"

export default function SiteHeader() {
  return (
    <header className="w-full py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-base-content">
          Kevin Ryan
        </h1>

        <FitSubtitle
          text="Technologist · Engineer · Author · Technical Writer"
          className="mt-2"
          minSize={10}
          maxSize={16}
        />
      </div>
    </header>
  )
}
