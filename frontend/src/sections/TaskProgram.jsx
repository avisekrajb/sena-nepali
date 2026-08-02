import React from 'react';
import { Container } from '../components/ui/Section';

const programs = [
  {
    title: 'Social Welfare Programs',
    description: 'Organizing health camps, educational programs, and community development initiatives.'
  },
  {
    title: 'Veterans Assistance',
    description: 'Providing financial, medical, and social support to retired army personnel and families.'
  },
  {
    title: 'Disaster Response',
    description: 'Quick response teams for natural disasters and emergency situations.'
  },
  {
    title: 'Skills Development',
    description: 'Vocational training and skills development programs for veterans.'
  },
  {
    title: 'Awareness Programs',
    description: 'Conducting awareness programs on national security and social issues.'
  },
  {
    title: 'Recognition Events',
    description: 'Organizing events to honor the sacrifices of army personnel.'
  }
];

export function TaskProgram() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-army mt-4">
            Task Programs
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Explore our ongoing programs and initiatives that make a difference in society.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="group bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-transparent hover:border-2 hover:border-green-500"
            >
              <h3 className="font-semibold text-army text-lg">{program.title}</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{program.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-army/5 rounded-2xl p-8 border border-transparent hover:border-2 hover:border-green-500 transition-all">
          <h2 className="font-display text-2xl font-bold text-army text-center mb-4">
            Get Involved
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Join us in our mission to serve the nation and support our veterans. Your contribution
            makes a difference in the lives of those who served our country.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default TaskProgram;
