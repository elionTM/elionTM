import User from '../models/User.js';
import Service from '../models/Service.js';
import Portfolio from '../models/Portfolio.js';

export const seedData = async () => {
  try {
    // ... admin seeding ...
    const adminEmail = 'Elion@Admin';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        name: 'Elion Admin',
        email: adminEmail,
        password: 'Admin123',
        role: 'admin'
      });
      console.log('Admin user seeded successfully');
    }

    // Seed initial services if empty
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      const mockServices = [
        { category: 'Legal & Business', name: 'CAC Registration', description: 'Business and Company registration with CAC.' },
        { category: 'Legal & Business', name: 'Legal Compliance', description: 'Ensuring your business meets all regulatory and legal requirements.' },
        { category: 'Legal & Business', name: 'Contract Management', description: 'Expert drafting and review of business contracts and agreements.' },
        { category: 'Legal & Business', name: 'Business Strategy', description: 'Strategic planning and financial guidance to scale your operations.' },
        { category: 'Branding & Marketing', name: 'Logo Design', description: 'Professional logo and brand identity design.' },
        { category: 'Branding & Marketing', name: 'Brand Identity', description: 'Logo design, color palettes, and typography that define your brand.' },
        { category: 'Branding & Marketing', name: 'Digital Marketing', description: 'SEO, SEM, and social media strategies to increase your online presence.' },
        { category: 'Branding & Marketing', name: 'Targeted Campaigns', description: 'Data-driven advertising campaigns that reach the right audience.' },
        { category: 'Tech & Development', name: 'Web Development', description: 'Custom websites and web applications.' },
        { category: 'Tech & Development', name: 'Full-Stack Development', description: 'Building robust and scalable web applications from front to back.' },
        { category: 'Tech & Development', name: 'Cloud Infrastructure', description: 'Secure and high-performance cloud solutions using modern providers.' },
        { category: 'Tech & Development', name: 'AI & Machine Learning', description: 'Integrating intelligent features and data-driven insights into your products.' },
      ];
      await Service.insertMany(mockServices);
      console.log('Initial services seeded successfully');
    }

    // Seed initial portfolio items if empty
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      const mockPortfolio = [
        {
          title: 'FinTech Dashboard',
          description: 'A comprehensive financial management platform with real-time data visualization and secure transaction handling.',
          category: 'Tech & Development',
          images: ['https://picsum.photos/seed/fintech/800/600', 'https://picsum.photos/seed/fintech2/800/600'],
          link: 'https://example.com'
        },
        {
          title: 'Eco-Brand Identity',
          description: 'Complete brand overhaul for a sustainable energy company, including logo, guidelines, and marketing collateral.',
          category: 'Branding & Marketing',
          images: ['https://picsum.photos/seed/eco/800/600', 'https://picsum.photos/seed/eco2/800/600'],
          link: 'https://example.com'
        },
        {
          title: 'Corporate Restructuring',
          description: 'Strategic legal and business guidance for a multi-national firm undergoing major organizational changes.',
          category: 'Legal & Business',
          images: ['https://picsum.photos/seed/legal/800/600', 'https://picsum.photos/seed/legal2/800/600'],
          link: 'https://example.com'
        }
      ];
      await Portfolio.insertMany(mockPortfolio);
      console.log('Initial portfolio items seeded successfully');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};
