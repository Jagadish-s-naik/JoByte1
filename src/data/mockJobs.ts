export const mockJobs = [
  {
    id: 'nasa-mission-01',
    title: 'Aerospace Systems Engineer',
    company: 'NASA Jet Propulsion Laboratory',
    location: 'Pasadena, CA (Hybrid)',
    description: 'Lead the development of next-generation propulsion control systems for Mars exploration rovers.',
    vjsa_tasks: [
      {
        id: 'task-1',
        type: 'MCQ',
        question: 'A satellite in a geostationary orbit experiences a minor orbital decay. Which propulsion maneuver is most fuel-efficient to restore its altitude while maintaining orbital synchronization?',
        options: [
          'Hohmann Transfer to a higher circular orbit',
          'Continuous low-thrust tangential burn',
          'Bi-elliptic transfer maneuver',
          'Radial outward impulse burn'
        ],
        correct_answer: 'Hohmann Transfer to a higher circular orbit'
      },
      {
        id: 'task-2',
        type: 'CODE',
        question: 'Implement a PID controller function to stabilize the vertical descent velocity of a lunar lander module. The function should take current_velocity, target_velocity, and dt as parameters.',
        template: 'function stabilizeLander(v, v_target, dt) {\n  // Implement PID logic here\n}'
      }
    ]
  }
];
