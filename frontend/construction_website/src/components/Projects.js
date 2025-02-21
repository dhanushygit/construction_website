import React from 'react';
import '../styles/Projects.css';
const Projects = () => {
  const projects = [
    {
      image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80',
      title: 'Luxury Residential Complex',
      category: 'Residential',
      description: 'Modern apartment complex with premium amenities'
    },
    {
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
      title: 'Corporate Headquarters',
      category: 'Commercial',
      description: 'State-of-the-art office building in downtown'
    },
    {
      image: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&q=80',
      title: 'Shopping Mall',
      category: 'Commercial',
      description: 'Modern shopping center with entertainment facilities'
    },
    {
      image: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80',
      title: 'Luxury Villa',
      category: 'Residential',
      description: 'Custom-built luxury home with modern amenities'
    }
  ];

  return (
    <section id="projects" className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Projects</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <span className="text-sm text-gray-500">{project.category}</span>
                <h3 className="text-lg font-semibold mt-1">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
