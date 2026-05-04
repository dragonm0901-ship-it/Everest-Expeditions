import { Minus, Plus } from 'lucide-react';
import { useId, useState } from 'react';

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);
  const baseId = useId();

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <article className={`faq-item ${isOpen ? 'is-open' : ''}`} data-reveal key={item.question}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="faq-button"
              id={buttonId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              type="button"
            >
              <span>{item.question}</span>
              {isOpen ? <Minus size={18} /> : <Plus size={18} />}
            </button>
            <div
              aria-labelledby={buttonId}
              className="faq-answer"
              hidden={!isOpen}
              id={panelId}
              role="region"
            >
              <p>{item.answer}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
