import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { PhotoPlaceholder } from "@/components/photo-placeholder";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { services } from "@/lib/api";

export default async function HomePage() {
  const [featured, freshToday] = await Promise.all([
    services.products.getFeatured(),
    services.products.getFreshToday(),
  ]);
  const categories = await services.categories.getAll().catch(() => []);

  return (
    <main id="top">
      <SiteHeader />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stage">
          <p className="hero-kicker">Pastry &#8226; Cakes &#8226; Good Days</p>
          <Image
            alt="Daily Crumb"
            className="hero-logo"
            height={1400}
            priority
            src="/primary-logo.png"
            width={1400}
          />
          <h1 id="hero-title">A little crumb of happiness, every day.</h1>
          <p className="hero-summary">
            Thoughtfully baked pastries, delightful cakes, and little moments worth sharing.
          </p>
          <Link className="button button-primary" href="/shop">
            Explore Our Bakes <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="hero-photo hero-photo-large">
          <PhotoPlaceholder
            brief={featured[0].photoBrief}
            imageAlt={featured[0].imageAlt}
            imageUrl={featured[0].imageUrl}
            palette={featured[0].palette}
            priority
          />
        </div>
        <div className="hero-photo hero-photo-small">
          <PhotoPlaceholder
            brief={featured[1].photoBrief}
            imageAlt={featured[1].imageAlt}
            imageUrl={featured[1].imageUrl}
            palette={featured[1].palette}
          />
        </div>
      </section>

      <section className="intro-band" aria-label="Brand introduction">
        <p>Small-batch baking for slow mornings, long lunches, and the good part of any day.</p>
      </section>

      <section className="featured section-shell" id="featured" aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <p className="section-label">Fresh today</p>
            <h2 id="featured-title">Baked with care, made for sharing.</h2>
          </div>
          <Link className="text-link" href="/shop">
            See all bakes <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section
        className="categories section-shell"
        id="categories"
        aria-labelledby="categories-title"
      >
        <div className="category-heading">
          <p className="section-label">Made for the moment</p>
          <h2 id="categories-title">A little something for every kind of day.</h2>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article className="category-card" key={category.id}>
              <PhotoPlaceholder
                brief={category.photoBrief}
                palette={category.palette}
                className="category-photo"
              />
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fresh-list section-shell" aria-labelledby="fresh-list-title">
        <div className="fresh-list-intro">
          <p className="section-label">A few more from the oven</p>
          <h2 id="fresh-list-title">Save one for later, or pass it across the table.</h2>
        </div>
        <div className="fresh-row">
          {freshToday.map((product) => (
            <article className="fresh-item" key={product.id}>
              <PhotoPlaceholder
                brief={product.photoBrief}
                palette={product.palette}
                className="fresh-photo"
              />
              <div className="fresh-item-copy">
                <p>{product.name}</p>
                <span>${(product.price.amount / 100).toFixed(2)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rituals" id="story" aria-labelledby="story-title">
        <div className="ritual-photo-wrap">
          <PhotoPlaceholder
            brief="A tray of pastries being put into the bakery window, with a handwritten price card and visible crumbs."
            palette="oat"
            className="ritual-photo"
          />
          <p className="photo-caption">Made for passing around.</p>
        </div>
        <div className="ritual-copy">
          <p className="section-label">A good day, baked in</p>
          <h2 id="story-title">The nicest plans begin with, “Should we split one?”</h2>
          <p>
            We bake for passing through, taking home, and calling somebody over. There is always
            something soft, something crisp, and something worth saving for later.
          </p>
          <a className="button button-secondary" href="#seasonal">
            See the seasonal box <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
      </section>

      <section className="seasonal section-shell" id="seasonal" aria-labelledby="seasonal-title">
        <div className="seasonal-copy">
          <p className="section-label">For the next invitation</p>
          <h2 id="seasonal-title">A box that makes the table feel set.</h2>
          <p>
            Seasonal pastries, wrapped up for the next gathering, thoughtful thank-you, or ordinary
            Tuesday worth making sweeter.
          </p>
          <Link className="button button-primary" href="/shop">
            Browse the counter <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="seasonal-art">
          <Image alt="Daily Crumb monogram" height={1400} src="/third-logo.png" width={1400} />
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <a className="footer-logo" href="#top">
          <Image alt="Daily Crumb" height={160} src="/secondary-logo.png" width={1000} />
        </a>
        <div>
          <a href="mailto:hello@dailycrumb.example">Say hello</a>
          <p>
            Product records, prices, and photo briefs remain mock frontend content until the API is
            connected.
          </p>
        </div>
      </footer>
    </main>
  );
}
