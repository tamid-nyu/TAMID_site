import './NumberedList.css';

export interface NumberedListItem {
  description: React.ReactNode;
  key?: string | number;
  number: React.ReactNode;
  title: React.ReactNode;
}

interface NumberedListProps {
  className?: string;
  items: NumberedListItem[];
}

export const NumberedList = ({ className = '', items }: NumberedListProps) => {
  return (
    <div className={`numbered-list ${className}`.trim()}>
      {items.map((item, index) => (
        <div key={item.key ?? index} className="numbered-list__item">
          <span className="numbered-list__number">{item.number}</span>
          <div className="numbered-list__content">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
