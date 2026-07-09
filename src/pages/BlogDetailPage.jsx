import { useRouter } from 'next/router'
import Link from 'next/link'
import { blogs } from '../data/blogData'
import PageBanner from '../components/PageBanner'

export default function BlogDetailPage() {
  const router = useRouter()
  const { blogId } = router.query
  
  // Show loading state while router is initializing
  if (!router.isReady) {
    return (
      <main className="blog-page">
        <div className="container py-6 text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }
  
  const blog = blogs.find((post) => String(post.id) === String(blogId))

  if (!blog) {
    return (
      <main className="blog-page">
        <PageBanner title="Blog Not Found" breadcrumbs={[{ label: 'Blogs', path: '/blogs' }, { label: 'Not Found' }]} />
        <section className="section py-6 text-center">
          <div className="container">
            <h2>Blog not found</h2>
            <p>The blog you’re looking for does not exist or may have been removed.</p>
            <Link href="/blogs" className="btn btn-primary mt-4">
              Back to Blogs
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="blog-page">
      <PageBanner title={blog.title} breadcrumbs={[{ label: 'Blogs', path: '/blogs' }, { label: blog.title }]} />

      <section className="blog-detail section py-6">
        <div className="container">
          <div className="row gy-5">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="80">
              <div className="blog-detail-card">
                {blog.image && (
                  <div className="blog-detail-image">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                )}

                <div className="blog-detail-meta">
                  <span className="blog-detail-category">{blog.category}</span>
                  <span className="blog-detail-date">{blog.date}</span>
                  <span className="blog-detail-readtime">{blog.readTime}</span>
                </div>

                <h1 className="blog-detail-title">{blog.title}</h1>
                <p className="blog-detail-intro">{blog.excerpt}</p>

                <div className="blog-detail-body">
                  {blog.body.map((block, blockIndex) => {
                    if (block.type === 'heading') {
                      return (
                        <h2 key={`block-${blockIndex}`} className="blog-detail-heading">
                          {block.text}
                        </h2>
                      )
                    }

                    if (block.type === 'list') {
                      return (
                        <ul key={`block-${blockIndex}`} className="blog-detail-list">
                          {block.items.map((item, itemIndex) => (
                            <li key={`item-${itemIndex}`}>{item}</li>
                          ))}
                        </ul>
                      )
                    }

                    return (
                      <p key={`block-${blockIndex}`} className="blog-detail-paragraph">
                        {block.text}
                      </p>
                    )
                  })}

                  <div className="blog-detail-author-card">
                    <div className="blog-detail-author-avatar">{blog.avatar}</div>
                    <div>
                      <p className="blog-detail-author-name">{blog.author}</p>
                      <p className="blog-detail-author-role">{blog.authorRole}</p>
                    </div>
                  </div>
                </div>

                <Link href="/blogs" className="blog-detail-back-link">
                  <i className="bi bi-arrow-left" /> Back to all posts
                </Link>
              </div>
            </div>

            <aside className="col-lg-4" data-aos="fade-up" data-aos-delay="120">
              <div className="blog-sidebar blog-sidebar-compact">
                <div className="blog-sidebar-widget">
                  <div className="sidebar-widget-title">About this blog</div>
                  <p>Explore practical marketing, SEO, social media, branding, and campaign ideas with a blue-teal visual tone.</p>
                </div>

                <div className="blog-sidebar-widget">
                  <div className="sidebar-widget-title">More posts</div>
                  {blogs
                    .filter((post) => post.id !== blog.id)
                    .slice(0, 4)
                    .map((suggested) => (
                    <Link key={suggested.id} href={`/blog-detail?blogId=${suggested.id}`} className="blog-recent-item">
                        <span>{suggested.title}</span>
                        <small>{suggested.date}</small>
                    </Link>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
