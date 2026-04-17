import SectionTitle from '../SectionTitle/SectionTitle';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="content about__content">
        <SectionTitle normalText="about" strokeText=" chapter" />
      </div>
    </section>
  );
};

export default About;