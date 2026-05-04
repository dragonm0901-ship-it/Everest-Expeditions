import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default function usePageAnimations(rootRef) {
  useLayoutEffect(() => {
    if (!rootRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;
    let splitInstances = [];

    const context = gsap.context(() => {
      splitInstances = gsap.utils
        .toArray('[data-split]')
        .map((target) => new SplitType(target, { types: isSmallScreen ? 'lines' : 'lines, chars' }));

      splitInstances.forEach((split) => {
        const targets = split.chars?.length ? split.chars : split.lines;

        gsap.from(targets, {
          yPercent: 105,
          opacity: 0,
          duration: 0.82,
          ease: 'power4.out',
          stagger: isSmallScreen ? 0.08 : 0.018
        });
      });

      gsap.utils.toArray('[data-hero-copy] > *').forEach((element, index) => {
        gsap.from(element, {
          y: 28,
          opacity: 0,
          duration: 0.82,
          ease: 'power3.out',
          delay: 0.08 * index + 0.1
        });
      });

      gsap.utils.toArray('[data-reveal]').forEach((element) => {
        gsap.from(element, {
          y: 36,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            once: true,
            start: 'top 86%'
          }
        });
      });

      gsap.utils.toArray('[data-lift]').forEach((element) => {
        gsap.from(element, {
          y: 40,
          opacity: 0,
          scale: 0.985,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            once: true,
            start: 'top 88%'
          }
        });
      });

      gsap.utils.toArray('[data-parallax]').forEach((element) => {
        gsap.to(element, {
          scale: isSmallScreen ? 1.08 : 1.16,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            end: 'bottom 85%',
            scrub: 0.12
          }
        });
      });

      gsap.utils.toArray('[data-count]').forEach((element) => {
        const endValue = Number(element.dataset.count);
        const suffix = element.dataset.suffix ?? '';
        const tracker = { value: 0 };

        ScrollTrigger.create({
          trigger: element,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            gsap.to(tracker, {
              value: endValue,
              duration: 1.2,
              ease: 'power2.out',
              onUpdate: () => {
                element.textContent = `${Math.round(tracker.value)}${suffix}`;
              }
            });
          }
        });
      });
    }, rootRef);

    return () => {
      splitInstances.forEach((split) => split.revert());
      context.revert();
    };
  }, [rootRef]);
}
