"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { emitScene } from "@/lib/sceneEvents";
import {
  COLLECTION_PRODUCTS,
  type CollectionProduct,
  type ColorVariant,
} from "@/lib/products";
import { ProductModal } from "@/components/ui/ProductModal";

const IMG_PARAMS = "?auto=format&fit=crop&w=900&q=80";

/* ─────────────────────────────────────────────────────────────
   Two-layer crossfade image — no setTimeout, pure CSS opacity.
   Layer A and B alternate as "front" on each src change.
───────────────────────────────────────────────────────────── */
function CrossfadeImage({
  src,
  alt,
  style,
}: {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}) {
  const [layers, setLayers] = useState({
    a: src,
    b: src,
    front: "a" as "a" | "b",
  });

  useEffect(() => {
    setLayers((prev) => {
      if (prev.front === "a") {
        return { a: prev.a, b: src, front: "b" };
      }
      return { a: src, b: prev.b, front: "a" };
    });
  }, [src]);

  const imgBase: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: "opacity 0.32s ease",
    display: "block",
  };

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={layers.a + IMG_PARAMS}
        alt={alt}
        loading="eager"
        style={{ ...imgBase, opacity: layers.front === "a" ? 1 : 0 }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={layers.b + IMG_PARAMS}
        alt={alt}
        loading="eager"
        style={{ ...imgBase, opacity: layers.front === "b" ? 1 : 0 }}
      />
    </div>
  );
}

/* ─── Desktop right panel ─── */
function ProductPanel({
  product,
  imgSrc,
}: {
  product: CollectionProduct;
  imgSrc: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#0E0E0E",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(28px)",
        transition:
          "opacity 0.5s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      {/* Full-bleed product photo */}
      <CrossfadeImage
        src={imgSrc}
        alt={product.name}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "62%",
        }}
      />

      {/* Gradient: photo → dark */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: 0,
          right: 0,
          height: "30%",
          background: "linear-gradient(to bottom, transparent, #0E0E0E)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      {product.badge && (
        <span
          className="font-body"
          style={{
            position: "absolute",
            top: 22,
            left: 26,
            background: product.accentLine,
            color: "#161616",
            fontSize: "9px",
            letterSpacing: "0.2em",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "100px",
            zIndex: 2,
          }}
        >
          {product.badge}
        </span>
      )}

      {/* SKU */}
      <p
        className="font-body"
        style={{
          position: "absolute",
          top: 24,
          right: 26,
          fontSize: "8px",
          letterSpacing: "0.16em",
          color: "#FAF7F2",
          opacity: 0.25,
          zIndex: 2,
        }}
      >
        {product.sku}
      </p>

      {/* Bottom info */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          padding: "0 clamp(24px,3vw,40px)",
        }}
      >
        <p
          className="font-display"
          style={{
            fontSize: "clamp(28px,3vw,50px)",
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "#FAF7F2",
            marginBottom: 12,
          }}
        >
          {product.name}
        </p>
        <div
          style={{
            width: 36,
            height: 2,
            background: product.accentLine,
            borderRadius: 2,
            marginBottom: 12,
          }}
        />
        <p
          className="font-body"
          style={{
            fontSize: 11,
            lineHeight: 1.65,
            color: "#FAF7F2",
            opacity: 0.42,
            maxWidth: 240,
          }}
        >
          {product.description}
        </p>
      </div>

      {/* Materials strip */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(24px,3vw,40px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <p
          className="font-body"
          style={{
            fontSize: 8,
            letterSpacing: "0.12em",
            color: "#FAF7F2",
            opacity: 0.24,
          }}
        >
          {product.materials}
        </p>
      </div>
    </div>
  );
}

/* ─── Color swatch ─── */
function ColorSwatch({
  color,
  isSelected,
  sectionBg,
  onClick,
}: {
  color: ColorVariant;
  isSelected: boolean;
  sectionBg: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={color.name}
      aria-label={`Màu ${color.name}`}
      aria-pressed={isSelected}
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: color.hex,
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        transition: "transform 0.18s ease, box-shadow 0.18s ease",
        transform: isSelected ? "scale(1.15)" : "scale(1)",
        /*
         * Double ring: first ring = sectionBg (gap), second ring = dark ink.
         * This looks clean on ANY background color.
         */
        boxShadow: isSelected
          ? `0 0 0 2px ${sectionBg}, 0 0 0 4px #161616`
          : `inset 0 0 0 1px rgba(0,0,0,0.14)`,
      }}
    />
  );
}

/* ─── Size button ─── */
function SizeButton({
  size,
  isSelected,
  ink,
  onClick,
}: {
  size: string;
  isSelected: boolean;
  ink: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`Size EU ${size}`}
      aria-pressed={isSelected}
      className="font-body"
      style={{
        fontSize: 11,
        letterSpacing: "0.04em",
        padding: "6px 12px",
        borderRadius: 100,
        border: `1.5px solid ${isSelected ? ink : `${ink}28`}`,
        background: isSelected ? ink : "transparent",
        color: isSelected ? "#FAF7F2" : ink,
        cursor: "pointer",
        transition: "all 0.18s ease",
        transform: isSelected ? "scale(1.06)" : "scale(1)",
      }}
    >
      {size}
    </button>
  );
}

/* ─────────────────────────────────────────
   Main section
───────────────────────────────────────── */
export function CollectionSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorVariant>(
    COLLECTION_PRODUCTS[0].colors[0],
  );
  const [modalOpen, setModalOpen] = useState(false);

  const product: CollectionProduct = COLLECTION_PRODUCTS[activeIndex];

  /* Preload all color images when product changes */
  useEffect(() => {
    setSelectedSize(null);
    setSelectedColor(product.colors[0]);

    if (typeof window === "undefined") return;
    product.colors.forEach((c) => {
      const img = new window.Image();
      img.src = c.imgSrc + IMG_PARAMS;
    });
  }, [activeIndex, product.colors]);

  /* Instant color change — no delay needed, images are preloaded */
  const handleColorChange = useCallback((color: ColorVariant) => {
    setSelectedColor(color);
  }, []);

  useEffect(() => {
    if (!outerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ default: gsap }, { default: ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            setActiveIndex(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
            emitScene({ type: "shoe:progress", progress: p });
          },
        });
      },
    );

    return () => {
      import("gsap/ScrollTrigger").then(({ default: ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      });
    };
  }, []);

  return (
    <div
      ref={outerRef}
      style={{ height: "300vh" }}
      id="collection"
      aria-label="Collection"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: product.bg, transition: "background 0.7s ease" }}
      >
        {/*
         * CSS grid: single col on mobile, 56/44 split on md+.
         * Right panel is hidden on mobile — the grid auto-collapses.
         */}
        <div className="h-full grid md:grid-cols-[56%_44%]">
          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div className="flex flex-col h-full px-6 sm:px-10 md:px-14 py-8 md:py-12 overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between shrink-0 mb-4 md:mb-5">
              <p
                className="font-body"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: product.ink,
                  opacity: 0.5,
                }}
              >
                COLLECTION 2024
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {COLLECTION_PRODUCTS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: i === activeIndex ? 22 : 7,
                      height: 2,
                      background: product.ink,
                      opacity: i === activeIndex ? 1 : 0.22,
                      borderRadius: 2,
                      transition: "width 0.4s ease, opacity 0.4s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Mobile / Tablet: product photo card ── */}
            <div
              className="md:hidden shrink-0 rounded-2xl overflow-hidden relative mb-5"
              style={{
                height: "clamp(180px, 30vw, 260px)",
                background: "#0E0E0E",
              }}
            >
              <CrossfadeImage src={selectedColor.imgSrc} alt={product.name} />

              {/* Gradient */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "50%",
                  background:
                    "linear-gradient(to top, rgba(14,14,14,0.8), transparent)",
                  pointerEvents: "none",
                }}
              />

              {/* Badge */}
              {product.badge && (
                <span
                  className="font-body"
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 14,
                    background: product.accentLine,
                    color: "#161616",
                    fontSize: 8,
                    letterSpacing: "0.18em",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: 100,
                  }}
                >
                  {product.badge}
                </span>
              )}

              {/* Product name overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: 16,
                  right: 16,
                }}
              >
                <p
                  className="font-display"
                  style={{
                    fontSize: "clamp(20px,5vw,28px)",
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                    color: "#FAF7F2",
                    lineHeight: 1,
                  }}
                >
                  {product.name}
                </p>
                <p
                  className="font-body"
                  style={{
                    fontSize: 10,
                    color: "#FAF7F2",
                    opacity: 0.5,
                    marginTop: 3,
                  }}
                >
                  {selectedColor.name} · {product.price}
                </p>
              </div>
            </div>

            {/* ── Scrollable product info ── */}
            <div className="flex-1 flex flex-col justify-end min-h-0 overflow-y-auto">
              {/* Counter + name */}
              <p
                className="font-body mb-1.5"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: product.ink,
                  opacity: 0.42,
                }}
              >
                0{product.id} / 03
              </p>

              <h2
                className="font-display mb-1.5"
                style={{
                  fontSize: "clamp(32px, 5.5vw, 82px)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.88,
                  color: product.ink,
                }}
              >
                {product.name}
              </h2>

              <p
                className="font-body mb-2"
                style={{
                  fontSize: 14,
                  color: product.ink,
                  opacity: 0.58,
                }}
              >
                {product.sub}
              </p>

              <p
                className="font-body mb-3 hidden sm:block"
                style={{
                  fontSize: 12,
                  lineHeight: 1.75,
                  color: product.ink,
                  opacity: 0.48,
                  maxWidth: 320,
                }}
              >
                {product.description}
              </p>

              <p
                className="font-body mb-4"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: product.ink,
                  opacity: 0.35,
                }}
              >
                {product.materials}
              </p>

              {/* ── COLOR ── */}
              <div className="mb-4">
                <p
                  className="font-body mb-2"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: product.ink,
                    opacity: 0.45,
                  }}
                >
                  COLOR
                  <span
                    style={{
                      marginLeft: 8,
                      letterSpacing: "0.04em",
                      opacity: 1,
                    }}
                  >
                    — {selectedColor.name}
                  </span>
                </p>
                <div className="flex gap-3 items-center ml-2">
                  {product.colors.map((color) => (
                    <ColorSwatch
                      key={color.name}
                      color={color}
                      isSelected={selectedColor.name === color.name}
                      sectionBg={product.bg}
                      onClick={() => handleColorChange(color)}
                    />
                  ))}
                </div>
              </div>

              {/* ── SIZE ── */}
              <div className="mb-5">
                <p
                  className="font-body mb-2"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: product.ink,
                    opacity: 0.45,
                  }}
                >
                  SIZE
                  {selectedSize && (
                    <span
                      style={{
                        marginLeft: 8,
                        letterSpacing: "0.04em",
                        opacity: 1,
                      }}
                    >
                      — EU {selectedSize}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <SizeButton
                      key={s}
                      size={s}
                      isSelected={selectedSize === s}
                      ink={product.ink}
                      onClick={() =>
                        setSelectedSize((prev) => (prev === s ? null : s))
                      }
                    />
                  ))}
                </div>
              </div>

              {/* ── PRICE + CTA ── */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-display"
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: product.ink,
                    }}
                  >
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span
                      className="font-body"
                      style={{
                        fontSize: 13,
                        color: product.ink,
                        opacity: 0.3,
                        textDecoration: "line-through",
                      }}
                    >
                      {product.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  data-cursor="expand"
                  disabled={!selectedSize}
                  className="font-body font-medium active:scale-95"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.09em",
                    padding: "11px 22px",
                    borderRadius: 100,
                    border: `1.5px solid ${selectedSize ? product.ink : `${product.ink}38`}`,
                    background: selectedSize ? product.ink : "transparent",
                    color: selectedSize ? "#FAF7F2" : product.ink,
                    opacity: selectedSize ? 1 : 0.48,
                    cursor: selectedSize ? "pointer" : "default",
                    transition: "all 0.22s ease",
                  }}
                >
                  {selectedSize ? "ADD TO CART →" : "SELECT SIZE"}
                </button>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="font-body mt-2.5 hover:text-accent transition-colors text-left"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: product.ink,
                  opacity: 0.38,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                View full details →
              </button>
            </div>

            {/* Scroll hint */}
            <p
              className="font-body shrink-0 mt-3"
              style={{
                fontSize: 9,
                letterSpacing: "0.18em",
                color: product.ink,
                opacity: 0.3,
              }}
              aria-hidden="true"
            >
              SCROLL TO EXPLORE
            </p>
          </div>

          {/* ══════════════ RIGHT COLUMN — desktop only ══════════════ */}
          <div className="hidden md:block h-full">
            <ProductPanel
              key={product.id}
              product={product}
              imgSrc={selectedColor.imgSrc}
            />
          </div>
        </div>
      </div>

      <ProductModal
        open={modalOpen}
        product={product}
        selectedColor={selectedColor}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
