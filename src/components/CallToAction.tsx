import { Link } from "react-router-dom";
import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-buttons">
        <Link to="https://meduxscan.lovable.app" className="cta-btn cta-btn-play" data-cursor="disable">
          Scan Disease →
        </Link>
        
        <a 
          href={config.contact.linkedin} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cta-btn cta-btn-hire"
          data-cursor="disable"
        >
          Contact Us →
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
