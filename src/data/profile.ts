export const profile = {
  name: 'Aman Javed',
  headline: 'Electrical Engineering student building robots, embedded systems and flight-grade hardware',
  intro:
    'I work at the boundary between hardware and software — ROS 2 robots with closed-loop control on bare-metal microcontrollers, custom PCBs from schematic to fabrication, and the RF links that hold it all together.',
  location: 'Aligarh, Uttar Pradesh, India',
  email: 'amanjaved0001@gmail.com',
  phone: '+91 9068139222',
  github: 'https://github.com/BoldDreamEater',
  githubHandle: 'BoldDreamEater',
  linkedin: 'https://linkedin.com/in/amanjaved',
  linkedinHandle: 'in/amanjaved',
  resumePath: `${import.meta.env.BASE_URL}docs/Aman_Javed_CV.pdf`,
  resumeUpdated: 'September 2026',
} as const

export const about = {
  paragraphs: [
    'I am a B.Tech Electrical Engineering student at Aligarh Muslim University, with a prior Diploma in Electrical Engineering from AMU University Polytechnic where I graduated with a 9.83/10 CPI and a university Gold Medal.',
    'Most of my work is systems work. On the robotics side that means a differential-drive robot running micro-ROS on an ESP32 over WiFi, with per-wheel velocity PID, gyro/encoder yaw fusion and a Gazebo digital twin that shares the same topic contract as the hardware. On the hardware side it means multi-sheet KiCad designs taken through to fabrication — satellite power electronics, wearable sensor platforms, motor control boards.',
    'I care about the parts that are easy to skip: honest calibration, drift that actually gets corrected, protocols that acknowledge and retry, and documentation that says what is genuinely done versus what is still open.',
  ],
  focus: [
    { label: 'Robotics', detail: 'ROS 2, micro-ROS, differential drive, Gazebo simulation' },
    { label: 'Control Systems', detail: 'PID, sensor fusion, closed-loop velocity and heading control' },
    { label: 'Embedded Systems', detail: 'ESP32, STM32, 8051, bare-metal C/C++, serial protocols' },
    { label: 'PCB Design', detail: 'KiCad, hierarchical schematics, power electronics, DFM' },
    { label: 'Automation', detail: 'Motor control, actuator drivers, safety interlocks' },
    { label: 'RF & Telemetry', detail: 'LoRa links, ARQ protocols, full-duplex radio architecture' },
  ],
} as const

export type Education = {
  institution: string
  qualification: string
  period: string
  detail?: string
  highlight?: string
}

export const education: Education[] = [
  {
    institution: 'Aligarh Muslim University',
    qualification: 'B.Tech, Electrical Engineering',
    period: 'Aug 2023 — Present',
    detail: 'Zakir Husain College of Engineering & Technology',
  },
  {
    institution: 'University Polytechnic, Aligarh Muslim University',
    qualification: 'Diploma, Electrical Engineering',
    period: 'Jul 2020 — Jun 2023',
    detail: 'CPI 9.83 / 10.0',
    highlight: 'Gold Medal awarded by the university',
  },
]

export type Experience = {
  role: string
  org: string
  location?: string
  period: string
  points: string[]
  tag?: string
}

export const experience: Experience[] = [
  {
    role: 'PCB Design Intern',
    org: 'Dept. of Biomedical Informatics, Taipei Medical University',
    location: 'Taipei, Taiwan',
    period: 'Mar 2026 — Apr 2026',
    tag: 'International',
    points: [
      'Completed a research internship in PCB design for biomedical applications under the direct supervision of Prof. Dr. Shabbir Syed-Abdul.',
      'Worked on multi-sensor acquisition hardware within the department’s research projects, from schematic capture through to layout.',
      'Signed letter of recommendation available on request. Project specifics are covered by a non-disclosure agreement.',
    ],
  },
  {
    role: 'EPS Designer L2 (previously EPS Team Member)',
    org: 'SS AMU SAT — Student Satellite Programme',
    location: 'Aligarh, India',
    period: 'Dec 2023 — Nov 2025',
    points: [
      'Contributed to the design, analysis and validation of the satellite Electrical Power System.',
      'Promoted from Team Member to EPS Designer L2 on the basis of technical contribution and subsystem responsibility.',
      'Delivered a KiCad PCB design workshop for the satellite team.',
    ],
  },
  {
    role: 'Joint Coordinator',
    org: 'AMURoboclub',
    location: 'Aligarh, India',
    period: 'May 2024 — Present',
    points: [
      'Coordinate technical activities, workshops and competitions across robotics, embedded systems and PCB design.',
      'Ran hands-on KiCad sessions for robotics-oriented PCB design.',
      'Co-organised the Fastest Line Follower competition at VERCERA and the National Space Day Quiz.',
    ],
  },
  {
    role: 'Industrial Trainee',
    org: '3.0 MW Solar Power Plant, Aligarh Muslim University',
    location: 'Aligarh, India',
    period: 'Aug 2023 — Jun 2024',
    points: [
      'Short-term industrial training covering solar power generation, system operation and basic maintenance practice.',
    ],
  },
]

export const certifications = [
  'MATLAB Onramp',
  'PCB Design with KiCad',
  'Industrial Training in Web Development',
  'Excel Mastery: Basic to Advanced',
]

export const achievements = [
  'Gold Medal, Diploma in Electrical Engineering — Aligarh Muslim University',
  'Promoted to EPS Designer L2 on the SS AMU SAT student satellite programme',
  'Conducted KiCad PCB design workshops for SS AMU SAT and AMURoboclub',
  'Co-organiser, Fastest Line Follower at VERCERA (AMU Roboclub)',
  'Co-organiser, National Space Day Quiz Competition',
]

export type SkillCategory = {
  title: string
  note: string
  skills: { name: string; level?: 'core' | 'working' }[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming',
    note: 'Languages I have shipped working systems in',
    skills: [
      { name: 'C / C++', level: 'core' },
      { name: 'Python', level: 'core' },
      { name: 'Embedded C (8051, ESP32)', level: 'core' },
      { name: 'TypeScript / JavaScript', level: 'working' },
      { name: 'Java', level: 'working' },
      { name: 'MATLAB', level: 'working' },
    ],
  },
  {
    title: 'Embedded & Hardware',
    note: 'Silicon and actuators I have designed with or driven',
    skills: [
      { name: 'ESP32 / ESP32-S3 / ESP32-C6', level: 'core' },
      { name: 'ESP8266', level: 'core' },
      { name: '8051 microcontroller', level: 'core' },
      { name: 'STM32', level: 'working' },
      { name: 'Raspberry Pi', level: 'working' },
      { name: 'TB6612FNG motor driver', level: 'core' },
      { name: 'Stepper & DC gear motors', level: 'core' },
      { name: 'Solenoid / relay / MOSFET drive', level: 'core' },
      { name: 'MPU6050 IMU', level: 'core' },
      { name: 'VL53L0X ToF', level: 'core' },
      { name: 'Quadrature encoders', level: 'core' },
      { name: 'LoRa (REYAX RYLR998)', level: 'core' },
      { name: 'BLE (advertising & scanning)', level: 'core' },
      { name: 'GSM / GPRS (SIM800L)', level: 'core' },
      { name: 'GPS (NEO-6M)', level: 'core' },
      { name: 'I²C / SPI / UART', level: 'core' },
    ],
  },
  {
    title: 'Robotics & Control',
    note: 'Control and estimation techniques implemented in real firmware',
    skills: [
      { name: 'ROS 2 (Humble)', level: 'core' },
      { name: 'micro-ROS', level: 'core' },
      { name: 'PID control', level: 'core' },
      { name: 'Closed-loop velocity control', level: 'core' },
      { name: 'Complementary filter fusion', level: 'core' },
      { name: 'Gyro bias estimation (ZUPT)', level: 'core' },
      { name: 'Differential-drive kinematics', level: 'core' },
      { name: 'Odometry & dead reckoning', level: 'core' },
      { name: 'Gazebo simulation', level: 'core' },
      { name: 'URDF / xacro modelling', level: 'core' },
      { name: 'Sim-to-real transfer', level: 'working' },
    ],
  },
  {
    title: 'PCB & Tools',
    note: 'Design tooling and workflow',
    skills: [
      { name: 'KiCad (v7–v9)', level: 'core' },
      { name: 'Hierarchical schematic design', level: 'core' },
      { name: 'Mixed-signal PCB layout', level: 'core' },
      { name: 'Power electronics (buck, MPPT, ORing)', level: 'core' },
      { name: 'Li-ion charging & fuel gauging', level: 'core' },
      { name: 'DFM / fabrication output', level: 'core' },
      { name: 'Autodesk Eagle', level: 'working' },
      { name: 'Proteus simulation', level: 'working' },
      { name: 'Keil µVision', level: 'working' },
      { name: 'Git', level: 'core' },
      { name: 'Linux', level: 'core' },
      { name: 'Arduino IDE / ESP-IDF', level: 'core' },
    ],
  },
]
