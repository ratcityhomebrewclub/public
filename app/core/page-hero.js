import { withBase } from './paths';

export default function PageHero({ title, label }) {
  return (
    <div className="relative pt-16 md:pt-20">
      <div className="relative h-44 md:h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${withBase('/images/header-ai-2x.jpeg')}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/70 to-[#0f0f0f]" />

        <div className="relative z-10 h-full flex items-end justify-center pb-8 px-4">
          <div className="text-center">
            {label && <p className="brew-label mb-2">{label}</p>}
            <h1 className="font-display text-3xl md:text-4xl text-brew-amber-glow mb-2">
              {title}
            </h1>
            <div className="h-0.5 w-12 bg-brew-amber mx-auto rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
