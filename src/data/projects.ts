import { config } from "../config";

const projectLinks: Record<number, string> = {
  1: "https://meduxconnect.lovable.app/",
  2: "https://meduxscan.lovable.app/",
  3: "https://meduxlocation.lovable.app/",
};

// Keep the portfolio focused on the three featured MedUX projects.
export const featuredProjects = config.projects.slice(0, 3).map((project) => ({
  ...project,
  link: projectLinks[project.id],
}));
