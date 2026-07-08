// src/pages/BlogsPage.jsx
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import PageBanner from '../components/PageBanner'
import { blogs, categories, tags } from '../data/blogData'

/* --------------------------------------------------------------
   Component
---------------------------------------------------------------- */
export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = blogs.filter((blog) => {
    const matchesCategory = activeCategory === "All" || blog.category === activeCategory;
    const matchesSearch =
      normalizedQuery.length === 0 ||
      [blog.title, blog.excerpt, blog.category, blog.author]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesCategory && matchesSearch;
  });

  const recentPosts = blogs.slice(0, 4);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('.blog-list-item'));

    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.classList.remove('is-visible');
      card.style.transitionDelay = `${index * 80}ms`;
    });

    if (!('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [filtered.length, activeCategory, normalizedQuery]);

  return (
    <main className="blog-page">

      {/* Shared banner */}
      <PageBanner title="Blogs" breadcrumbs={[{ label: 'Blogs' }]} />

      {/* ===================== BLOG LIST + SIDEBAR ===================== */}
      <section className="blog-list-section section py-5">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="80">
              <div className="blog-list" data-aos="fade-up" data-aos-delay="100">
                {filtered.map((blog) => (
                  <article
                    key={blog.id}
                    className="blog-list-item"
                  >
                    {blog.image && (
                      <div className="blog-list-image">
                        <img src={blog.image} alt={blog.title} />
                      </div>
                    )}
                    <div className="blog-list-body">
                      <div className="blog-list-top">
                        <span className="blog-list-category">{blog.category}</span>
                        <span className="blog-list-author">By {blog.author}</span>
                        <span className="blog-list-date">{blog.date}</span>
                      </div>
                      <h3 className="blog-list-title">{blog.title}</h3>
                      <p className="blog-list-excerpt">{blog.excerpt}</p>
                      <div className="blog-list-footer">
                        <NavLink to={`/blogs/${blog.id}`} className="blog-card-link">
                          Read More <i className="bi bi-arrow-right ms-1" />
                        </NavLink>
                        <span className="blog-list-readtime">{blog.readTime}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="blog-empty text-center py-5" data-aos="fade-up">
                  <i
                    className="bi bi-journal-x"
                    style={{ fontSize: "3rem", color: "rgba(0, 191, 166, 0.35)" }}
                  />
                  <p style={{ color: "#6b7280", marginTop: "1rem" }}>
                    {searchQuery ? "No posts match your search yet." : "No posts in this category yet."}
                  </p>
                </div>
              )}
            </div>

            <aside className="col-lg-4">
              <div className="blog-sidebar">
                <div className="blog-sidebar-widget" data-aos="fade-up" data-aos-delay="40">
                  <div className="sidebar-widget-title">Search</div>
                  <div className="blog-search-wrap">
                    <input
                      type="search"
                      className="blog-search-input"
                      placeholder="Search blogs"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      data-aos="fade-up"
                      data-aos-delay="120"
                    />
                    <button type="button" className="blog-search-btn" data-aos="zoom-in" data-aos-delay="140">
                      <i className="bi bi-search" />
                    </button>
                  </div>
                </div>

                <div className="blog-sidebar-widget" data-aos="fade-up" data-aos-delay="80">
                  <div className="sidebar-widget-title">Recent Posts</div>
                  <div className="blog-recent-list">
                    {recentPosts.map((post, index) => (
                      <NavLink key={post.id} to={`/blogs/${post.id}`} className="blog-recent-item" data-aos="fade-up" data-aos-delay={140 + index * 40}>
                        <span>{post.title}</span>
                        <small>{post.date}</small>
                      </NavLink>
                    ))}
                  </div>
                </div>

                <div className="blog-sidebar-widget" data-aos="fade-up" data-aos-delay="120">
                  <div className="sidebar-widget-title">Categories</div>
                  <ul className="blog-sidebar-cats">
                    {categories.filter((cat) => cat !== 'All').map((cat, index) => (
                      <li key={cat}>
                        <button
                          data-aos="fade-up"
                          data-aos-delay={180 + index * 40}
                          type="button"
                          className={`blog-sidebar-cat-link ${activeCategory === cat ? 'active' : ''}`}
                          onClick={() => setActiveCategory(cat)}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="blog-sidebar-widget" data-aos="fade-up" data-aos-delay="160">
                  <div className="sidebar-widget-title">Tags</div>
                  <div className="blog-tags-wrap">
                    {tags.map((tag, index) => (
                      <button type="button" key={tag} className="blog-tag-pill" data-aos="fade-up" data-aos-delay={220 + index * 30}>
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ================== NEWSLETTER CTA ================== */}
      <section className="blog-newsletter section py-6">
        <div className="container">
          <div className="blog-newsletter-inner" data-aos="zoom-in" data-aos-delay="80">
            <div className="blog-newsletter-glow" />
            <div className="blog-newsletter-content text-center">
              <div className="blog-section-label">Stay Updated</div>
              <h2 className="blog-newsletter-title">
                Get Marketing Insights{' '}
                <span className="blog-gradient">Delivered Weekly</span>
              </h2>
              <p className="blog-newsletter-text">
                Subscribe to the newsletter for the latest digital‑marketing tips,
                case studies, and industry news.
              </p>

              <div className="blog-newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  className="blog-newsletter-input"
                  data-aos="fade-up"
                  data-aos-delay="140"
                />
                <button className="blog-newsletter-btn" data-aos="fade-up" data-aos-delay="180">
                  Subscribe <i className="bi bi-send-fill ms-2" />
                </button>
              </div>

              <p className="blog-newsletter-note">
                <i className="bi bi-lock-fill me-1" />
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}