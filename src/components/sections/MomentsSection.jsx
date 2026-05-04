import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { diaryMoments } from '../../data/siteContent.js';

export default function MomentsSection() {
  return (
    <section className="section-block section-block--muted">
      <div className="section-container section-stack">
        <div className="section-copy" data-reveal>
          <p className="eyebrow">Destination moodboard</p>
          <h2 className="section-title">A visual preview of the landscapes our travelers ask for most</h2>
        </div>

        <div className="moments-grid">
          {diaryMoments.map((item) => (
            <article className="moment-card" data-lift key={item.title}>
              <img alt={item.title} data-parallax loading="lazy" src={item.image} />
            </article>
          ))}
        </div>

        <div className="moments-carousel" data-reveal>
          <Swiper
            autoplay={{ delay: 2600, disableOnInteraction: false }}
            modules={[Autoplay]}
            slidesPerView={1.12}
            spaceBetween={16}
          >
            {diaryMoments.map((item) => (
              <SwiperSlide key={item.title}>
                <article className="moment-card">
                  <img alt={item.title} loading="lazy" src={item.image} />
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
