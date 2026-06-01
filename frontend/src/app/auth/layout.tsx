import Logo from '@/components/ui/Logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <Logo size={28} className="rounded-md flex-shrink-0" />
          <span className="text-sm font-semibold text-stone-900">TaskFlow</span>
        </div>

        {/* Page content */}
        {children}
      </div>
    </div>
  )
}
