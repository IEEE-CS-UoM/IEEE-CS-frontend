import './SectionTitle.css';

const SectionTitle = ({ normalText, strokeText, align = 'center' }) => {
  return (
    <h2 className={`section-title ${align === 'left' ? 'align-left' : ''}`}>
      {normalText}<span className="stroke">{strokeText}</span>
    </h2>
  );
};

export default SectionTitle;
