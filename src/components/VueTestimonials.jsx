import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '../data/siteContent.js';

export default function VueTestimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="vue-testimonials-host" data-reveal>
      <div className="vue-testimonials" aria-label="Traveler testimonials">
        <button
          className="testimonial-nav"
          onClick={() => setIndex((value) => (value - 1 + testimonials.length) % testimonials.length)}
          type="button"
        >
          <ChevronLeft aria-hidden="true" size={18} />
          <span>Prev</span>
        </button>

        <div className="vue-testimonials__stage" key={current.name}>
          <article className="testimonial-panel testimonial-profile">
            <img alt={current.name} loading="lazy" src={current.avatar} />
            <div className="testimonial-profile__body">
              <span>{current.location}</span>
              <h3>{current.name}</h3>
              <p>{current.role}</p>
            </div>
          </article>

          <article className="testimonial-panel testimonial-quote">
            <div>
              <span className="testimonial-quote__kicker">{current.rating}</span>
              <p>{current.quote}</p>
            </div>

            <div className="testimonial-quote__meta">
              <span className="testimonial-quote__rating">Traveler perspective</span>
              <div className="testimonial-thumbs">
                {current.thumbs.map((thumb) => (
                  <img alt="" key={thumb} loading="lazy" src={thumb} />
                ))}
              </div>
            </div>
          </article>
        </div>

        <button
          className="testimonial-nav"
          onClick={() => setIndex((value) => (value + 1) % testimonials.length)}
          type="button"
        >
          <span>Next</span>
          <ChevronRight aria-hidden="true" size={18} />
        </button>
      </div>
    </section>
  );
}
