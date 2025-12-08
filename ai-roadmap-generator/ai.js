/**
 * ai.js
 * Mock AI Service to generate learning roadmaps.
 * In a real app, this would call an OpenAI or Gemini API.
 */

const MOCK_DELAY = 2000; // 2 seconds to simulate thinking

async function generateRoadmap(topic) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const data = generateMockData(topic);
            resolve(data);
        }, MOCK_DELAY);
    });
}

function generateMockData(topic) {
    // Basic randomization to make it feel dynamic
    const t = topic.trim();

    return {
        topic: t,
        overview: `${t} is a powerful subject that opens many doors in today's tech landscape. This roadmap will guide you from the basics to advanced concepts, ensuring a solid foundation.`,
        roadmap: {
            beginner: [
                { id: 'b1', title: 'Introduction to ' + t, desc: 'Understand the core concepts, history, and setup.' },
                { id: 'b2', title: 'Basic Syntax & Structure', desc: 'Learn the fundamental building blocks and rules.' },
                { id: 'b3', title: 'Setting up the Environment', desc: 'Install necessary tools, IDEs, and dependencies.' },
                { id: 'b4', title: 'Your First Project', desc: 'Create a simple "Hello World" style application.' }
            ],
            intermediate: [
                { id: 'i1', title: 'Data Structures & Algorithms', desc: 'Deep dive into efficient data handling in ' + t },
                { id: 'i2', title: 'Advanced Concepts', desc: 'Master classes, inheritance, or functional paradigms.' },
                { id: 'i3', title: 'Working with APIs', desc: 'Learn to fetch and manipulate external data.' },
                { id: 'i4', title: 'Database Integration', desc: 'Connect ' + t + ' to SQL or NoSQL databases.' }
            ],
            advanced: [
                { id: 'a1', title: 'Performance Optimization', desc: 'Techniques to make your ' + t + ' apps lightning fast.' },
                { id: 'a2', title: 'Security Best Practices', desc: 'Protect your applications from common vulnerabilities.' },
                { id: 'a3', title: 'Testing & Deployment', desc: 'Unit testing, CI/CD pipelines, and cloud hosting.' },
                { id: 'a4', title: 'Scalability & Architecture', desc: 'Designing systems that handle millions of users.' }
            ]
        },
        resources: [
            { title: 'Official Documentation', url: '#' },
            { title: 'FreeCodeCamp ' + t + ' Course', url: '#' },
            { title: 'MDN Web Docs', url: '#' },
            { title: 'Stack Overflow Community', url: '#' }
        ],
        projects: [
            { title: 'Personal Portfolio', desc: 'Build a showcase site using ' + t + '.' },
            { title: 'Task Manager App', desc: 'A CRUD application to manage daily tasks.' },
            { title: 'E-commerce Store', desc: 'Full-featured shop with cart and checkout simulations.' }
        ]
    };
}
