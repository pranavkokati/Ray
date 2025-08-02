import { HfInference } from '@huggingface/inference';

if (!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY) {
  console.warn('HuggingFace API key not found. Some features may not work.');
}

export const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export interface CodeAnalysis {
  complexity: number;
  maintainability: number;
  suggestions: string[];
  technologies: string[];
  estimatedTime: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prompt: string;
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    description: 'Full-featured online store with cart, checkout, and admin panel',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe', 'Prisma'],
    complexity: 'advanced',
    estimatedTime: '2-3 hours',
    prompt: 'Create a complete e-commerce store with product catalog, shopping cart, user authentication, payment processing with Stripe, order management, and admin dashboard. Include product search, filtering, reviews, and inventory management.'
  },
  {
    id: 'task-manager',
    name: 'Project Management Tool',
    description: 'Kanban-style task management with team collaboration',
    technologies: ['React', 'TypeScript', 'Tailwind', 'DnD Kit', 'Supabase'],
    complexity: 'intermediate',
    estimatedTime: '1-2 hours',
    prompt: 'Build a project management tool with Kanban boards, drag-and-drop tasks, team collaboration, real-time updates, task assignments, due dates, comments, and project analytics dashboard.'
  },
  {
    id: 'social-platform',
    name: 'Social Media Platform',
    description: 'Twitter-like social platform with posts, follows, and messaging',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'WebSocket'],
    complexity: 'advanced',
    estimatedTime: '3-4 hours',
    prompt: 'Create a social media platform with user profiles, posts, likes, comments, following system, real-time messaging, notifications, image uploads, and trending topics.'
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Data visualization dashboard with charts and metrics',
    technologies: ['React', 'TypeScript', 'Chart.js', 'Tailwind', 'API'],
    complexity: 'intermediate',
    estimatedTime: '1-2 hours',
    prompt: 'Build a comprehensive analytics dashboard with interactive charts, real-time data updates, customizable widgets, data filtering, export functionality, and responsive design for monitoring business metrics.'
  },
  {
    id: 'learning-platform',
    name: 'Online Learning Platform',
    description: 'Course platform with video lessons and progress tracking',
    technologies: ['Next.js', 'TypeScript', 'Video.js', 'Tailwind', 'Supabase'],
    complexity: 'advanced',
    estimatedTime: '2-3 hours',
    prompt: 'Create an online learning platform with course creation, video lessons, quizzes, progress tracking, certificates, student-teacher messaging, and payment integration for course purchases.'
  },
  {
    id: 'portfolio-website',
    name: 'Developer Portfolio',
    description: 'Professional portfolio with project showcase and blog',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'MDX', 'Framer Motion'],
    complexity: 'beginner',
    estimatedTime: '30-60 minutes',
    prompt: 'Build a professional developer portfolio with project showcase, skills section, blog with MDX support, contact form, smooth animations, dark/light mode, and SEO optimization.'
  }
];

export async function analyzePrompt(prompt: string): Promise<CodeAnalysis> {
  try {
    const analysisPrompt = `Analyze this software development request and provide a JSON response with the following structure:
{
  "complexity": <number 1-10>,
  "maintainability": <number 1-10>,
  "suggestions": ["suggestion1", "suggestion2"],
  "technologies": ["tech1", "tech2"],
  "estimatedTime": "X hours"
}

Request: "${prompt}"

Consider factors like:
- Technical complexity
- Number of features
- Integration requirements
- UI/UX complexity
- Database requirements
- Authentication needs
- Third-party services

Provide practical suggestions for improvement and realistic time estimates.`;

    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: analysisPrompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.3,
        return_full_text: false,
      },
    });

    // Parse the response and extract JSON
    const text = response.generated_text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        // Fallback if parsing fails
      }
    }

    // Fallback analysis based on prompt length and keywords
    const complexityKeywords = ['authentication', 'payment', 'real-time', 'dashboard', 'admin', 'api', 'database'];
    const complexity = Math.min(10, Math.max(1, 
      3 + complexityKeywords.filter(keyword => prompt.toLowerCase().includes(keyword)).length
    ));

    return {
      complexity,
      maintainability: Math.max(1, 10 - Math.floor(complexity / 2)),
      suggestions: [
        'Consider breaking down into smaller components',
        'Implement proper error handling',
        'Add loading states and user feedback',
        'Include responsive design considerations'
      ],
      technologies: extractTechnologies(prompt),
      estimatedTime: `${Math.ceil(complexity / 2)}-${complexity} hours`
    };
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    
    // Fallback analysis
    return {
      complexity: 5,
      maintainability: 7,
      suggestions: ['Add proper error handling', 'Implement loading states'],
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      estimatedTime: '1-2 hours'
    };
  }
}

function extractTechnologies(prompt: string): string[] {
  const techKeywords = {
    'react': 'React',
    'next': 'Next.js',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'tailwind': 'Tailwind CSS',
    'css': 'CSS',
    'html': 'HTML',
    'node': 'Node.js',
    'express': 'Express',
    'mongodb': 'MongoDB',
    'postgresql': 'PostgreSQL',
    'mysql': 'MySQL',
    'supabase': 'Supabase',
    'firebase': 'Firebase',
    'stripe': 'Stripe',
    'auth': 'Authentication',
    'api': 'REST API',
    'graphql': 'GraphQL',
    'websocket': 'WebSocket',
    'chart': 'Chart.js',
    'animation': 'Framer Motion'
  };

  const lowerPrompt = prompt.toLowerCase();
  const foundTechs = Object.entries(techKeywords)
    .filter(([keyword]) => lowerPrompt.includes(keyword))
    .map(([, tech]) => tech);

  return foundTechs.length > 0 ? foundTechs : ['React', 'TypeScript', 'Tailwind CSS'];
}

export async function generateCodeSuggestions(prompt: string): Promise<string[]> {
  try {
    const suggestionPrompt = `Given this development request, suggest 3-5 specific code improvements or features that would enhance the project:

"${prompt}"

Provide practical, implementable suggestions as a JSON array of strings.`;

    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium',
      inputs: suggestionPrompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.4,
        return_full_text: false,
      },
    });

    // Try to extract suggestions from response
    const text = response.generated_text;
    const suggestions = [];
    
    // Look for bullet points or numbered lists
    const lines = text.split('\n');
    for (const line of lines) {
      const cleaned = line.trim();
      if (cleaned.match(/^[\d\-\*\•]/) && cleaned.length > 10) {
        suggestions.push(cleaned.replace(/^[\d\-\*\•\s]+/, ''));
      }
    }

    return suggestions.length > 0 ? suggestions.slice(0, 5) : [
      'Add comprehensive error handling and user feedback',
      'Implement responsive design for mobile devices',
      'Add loading states and skeleton screens',
      'Include accessibility features (ARIA labels, keyboard navigation)',
      'Add unit tests and integration tests'
    ];
  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      'Add comprehensive error handling',
      'Implement responsive design',
      'Add loading states',
      'Include accessibility features'
    ];
  }
}