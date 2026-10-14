type PhotoPlaceholderProps = {
  brief: string;
  imageUrl?: string;
  imageAlt?: string;
  palette?: "butter" | "oat" | "jam" | "rose" | "sage" | "cream";
  className?: string;
  priority?: boolean;
};

const paletteClasses = {
  butter: "placeholder-butter",
  oat: "placeholder-oat",
  jam: "placeholder-jam",
  rose: "placeholder-rose",
  sage: "placeholder-sage",
  cream: "placeholder-cream",
};

export function PhotoPlaceholder({
  brief,
  imageUrl,
  imageAlt,
  palette = "cream",
  className = "",
  priority = false,
}: PhotoPlaceholderProps) {
  if (imageUrl) {
    return (
      <div className={`photo-placeholder photo-loaded ${className}`}>
        {/* API image hosts are unknown until the Go service supplies them. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={imageAlt ?? brief} src={imageUrl} />
      </div>
    );
  }

  return (
    <div
      aria-label={`Photo placeholder. Final photography needed: ${brief}`}
      className={`photo-placeholder ${paletteClasses[palette]} ${className}`}
      role="img"
      {...(priority ? { "data-priority-placeholder": "true" } : {})}
    >
      <span className="placeholder-stamp">Photo brief</span>
      <p>{brief}</p>
      <span className="placeholder-note">Temporary art direction placeholder</span>
    </div>
  );
}
