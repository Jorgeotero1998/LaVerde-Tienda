import React, { useRef, Suspense, lazy } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";
import useMediaQuery from "../hooks/useMediaQuery";

const HeroScene = lazy(() => import("./HeroScene"));

const HeroParallax = () => {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 992px)");
  const show3d = isDesktop && !reduced;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 40]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="hero-parallax" aria-label="Presentación">
      <motion.div className="hero-parallax__bg" style={{ y: bgY }}>
        <motion.div
          className="hero-parallax__glow"
          style={{ scale: glowScale }}
          aria-hidden="true"
        />
        {show3d && (
          <Suspense fallback={null}>
            <div className="hero-parallax__canvas-wrap" aria-hidden="true">
              <HeroScene />
            </div>
          </Suspense>
        )}
        <div className="hero-parallax__mesh" aria-hidden="true" />
      </motion.div>

      <motion.div
        className="container hero-parallax__content"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.span
          className="hero-parallax__eyebrow"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          🌿 Mercado premium · Entrega el mismo día
        </motion.span>

        <motion.h1
          className="hero-parallax__title"
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          Del campo
          <span className="hero-parallax__title-accent"> a tu mesa</span>
        </motion.h1>

        <motion.p
          className="hero-parallax__subtitle"
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          Frutas y verduras de temporada, curadas como en un mercado boutique. Comprá, guardá favoritos
          y recibí en el día con checkout seguro.
        </motion.p>

        <motion.div
          className="hero-parallax__actions"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <a href="#productos" className="btn btn-accent hero-parallax__cta">
            Explorar catálogo <i className="fas fa-arrow-right"></i>
          </a>
          <a href="/cart" className="btn btn-outline-accent hero-parallax__cta-secondary">
            Ver mi canasta
          </a>
        </motion.div>

        <motion.div
          className="hero-parallax__stats glass-panel"
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {[
            ["27+", "Productos frescos"],
            ["100%", "Calidad natural"],
            ["24h", "Entrega express"],
          ].map(([value, label]) => (
            <div key={label} className="hero-parallax__stat">
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroParallax;
