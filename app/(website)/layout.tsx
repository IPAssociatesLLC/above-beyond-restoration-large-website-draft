import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AIChatWidget } from '@/components/website/ai-chat-widget'

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIChatWidget />
    </div>
  )
}
