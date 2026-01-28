import { Camera } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl supports-[backdrop-filter]:bg-card/30">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:h-16 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary md:h-9 md:w-9">
            <Camera className="h-4 w-4 text-primary-foreground md:h-5 md:w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
              FujiLens
            </h1>
            <p className="text-[9px] text-muted-foreground md:text-[10px]">
              Nano Banana Pro
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
