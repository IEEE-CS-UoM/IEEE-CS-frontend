import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/gsap';
import SectionTitle from '../SectionTitle/SectionTitle';
import './About.css';

const PANELS = [
  {
    title: 'Who We Are',
    body: 'The IEEE Computer Society Student Branch Chapter of the University of Moratuwa is a dynamic, student-led community focused on advancing knowledge in computing and technology. We bring together passionate individuals who are eager to learn, innovate, and contribute to the rapidly evolving tech landscape.',
  },
  {
    title: 'Our Mission',
    body: 'Our mission is to inspire, support and equip students to become future leaders in technology. We are committed to bridging the gap between academic knowledge and industry demands, fostering a culture of continuous learning and professional growth.',
  },
  {
    title: 'What We Do',
    body: 'Through a range of carefully curated initiatives — including workshops, competitions, panel discussions and outreach programs — we provide a platform for students to develop both technical expertise and professional skills. From hackathons to industry talks, every event is designed to leave a lasting impact.',
  },
  {
    title: 'Our History',
    body: 'Established under the IEEE Computer Society, our chapter at the University of Moratuwa has grown from a small group of enthusiasts into one of the most active student chapters in the region. Over the years we have organized numerous landmark events, mentored hundreds of students and built lasting connections with industry leaders.',
  },
];

const About = () => {
  const [openIdx, setOpenIdx] = useState(-1);
  const sectionRef = useRef(null);
  const bodyRefs = useRef([]);
  const isFirst = useRef(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about__left',
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0,
          scrollTrigger: { trigger: '.about__body', start: 'top 82%', end: '+=240', scrub: 1 },
        }
      );
      gsap.fromTo('.about__panel',
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, stagger: 0.18,
          scrollTrigger: { trigger: '.about__right', start: 'top 82%', end: '+=300', scrub: 1 },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    bodyRefs.current.forEach((el, i) => {
      if (!el) return;
      if (isFirst.current) {
        gsap.set(el, { height: i === openIdx ? 'auto' : 0, opacity: i === openIdx ? 1 : 0 });
      } else if (i === openIdx) {
        gsap.fromTo(el,
          { height: 0, opacity: 0 },
          { height: el.scrollHeight, opacity: 1, duration: 0.32, ease: 'power3.out', onComplete: () => gsap.set(el, { height: 'auto' }) }
        );
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.32, ease: 'power3.in' });
      }
    });
    isFirst.current = false;
  }, [openIdx]);

  const toggle = (i) => setOpenIdx((prev) => (prev === i ? -1 : i));

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="content about__content">
        <SectionTitle normalText="about" strokeText=" chapter" />

        <div className="about__body">
          <div className="about__right">
            <div className="about__accordion" onMouseLeave={() => setOpenIdx(-1)}>
              {PANELS.map((panel, i) => (
                <div key={i} className={`about__panel${openIdx === i ? ' is-open' : ''}`} onMouseEnter={() => setOpenIdx(i)}>
                  <button
                    type="button"
                    className="about__panel-header"
                    onClick={() => toggle(i)}
                    aria-expanded={openIdx === i}
                  >
                    <span className="about__panel-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="about__panel-title">{panel.title}</span>
                    <span className="about__panel-icon" aria-hidden="true" />
                  </button>
                  <div
                    className="about__panel-body"
                    ref={(el) => { bodyRefs.current[i] = el; }}
                  >
                    <p className="about__panel-text">{panel.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="about__left">
            <img src="/img/logo.png" alt="IEEE CS UoM logo" className="about__logo" />
            <div className="about__left-text">
              <h3 className="about__name">
                IEEE Computer Society<br />Student Chapter
              </h3>
              <p className="about__uni">University of Moratuwa</p>
              <div className="about__divider" />
              <div className="about__stats">
                <div className="about__stat">
                  <span className="about__stat-num">150<span className="about__stat-plus">+</span></span>
                  <span className="about__stat-label">Members</span>
                </div>
                <div className="about__stat">
                  <span className="about__stat-num">20<span className="about__stat-plus">+</span></span>
                  <span className="about__stat-label">Events / Year</span>
                </div>
                <div className="about__stat">
                  <span className="about__stat-num">5<span className="about__stat-plus">+</span></span>
                  <span className="about__stat-label">Years Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
