import { forwardRef } from 'react';
import './ZigzagView.css';

export interface ZigzagViewItem {
  alt: string;
  description: React.ReactNode;
  eyebrow?: React.ReactNode;
  image: string;
  key?: string | number;
  title: React.ReactNode;
}

interface ZigzagViewProps {
  className?: string;
  items: ZigzagViewItem[];
  visible?: boolean;
}

export const ZigzagView = forwardRef<HTMLElement, ZigzagViewProps>(
  ({ className = '', items, visible = false }, ref) => {
    return (
      <section ref={ref} className={`zigzag-view ${visible ? 'visible' : ''} ${className}`.trim()}>
        {items.map((item, index) => (
          <article
            key={item.key ?? index}
            className={`zigzag-view__item ${index % 2 === 1 ? 'zigzag-view__item--reverse' : ''}`}
          >
            <div className="zigzag-view__media">
              <img src={item.image} alt={item.alt} />
            </div>

            <div className="zigzag-view__copy">
              {item.eyebrow ? <span className="zigzag-view__eyebrow">{item.eyebrow}</span> : null}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </section>
    );
  }
);

ZigzagView.displayName = 'ZigzagView';
