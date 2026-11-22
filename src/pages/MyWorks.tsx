import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { featuredProjects } from "../data/projects";
import "./MyWorks.css";

const MyWorks = () => {
  return (
    <main className="myworks-page">
      <header className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Home
        </Link>
        <h1>
          Our <span>Projects</span>
        </h1>
        <p>Explore the technology powering more connected healthcare.</p>
      </header>

      <section className="myworks-grid" aria-label="Featured MedUX projects">
        {featuredProjects.map((project, index) => (
          <a
            className="myworks-card"
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Explore ${project.title} (opens in a new tab)`}
            data-cursor="disable"
          >
            <span className="myworks-card-number">0{index + 1}</span>
            <div className="myworks-card-image">
              <img src={project.image} alt="" />
            </div>
            <div className="myworks-card-info">
              <div className="myworks-card-heading">
                <h2>{project.title}</h2>
                <MdArrowOutward aria-hidden="true" />
              </div>
              <p className="myworks-card-category">{project.category}</p>
              <p className="myworks-card-description">{project.description}</p>
              <p className="myworks-card-tech">{project.technologies}</p>
              <span className="myworks-card-cta">Explore project</span>
            </div>
          </a>
        ))}
      </section>
    </main>
  );
};

export default MyWorks;
