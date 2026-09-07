import { getSchedule, getAllSeoPages, getAllBlogPosts } from '@/app/actions/seo-content'
import { SeoContentManager } from '@/components/admin/seo-content-manager'

export const dynamic = 'force-dynamic'

export default async function AdminSeoContentPage() {
  const schedule = await getSchedule()
  const pages = await getAllSeoPages()
  const blogs = await getAllBlogPosts()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SeoContentManager
        initialSchedule={schedule}
        initialPages={pages}
        initialBlogs={blogs}
      />
    </div>
  )
}
