export type ProjectStatus = 'active' | 'complete' | 'prototype' | 'archived'

export type DetailSection = {
  title: string
  body: string
  bullets?: string[]
}

export type Project = {
  slug: string
  title: string
  subtitle: string
  oneLiner: string
  year: string
  status: ProjectStatus
  statusNote: string
  featured?: boolean
  confidential?: boolean
  confidentialNote?: string
  summary: string
  problem: string
  approach: string
  technologies: string[]
  hardware: string[]
  software: string[]
  features: string[]
  contribution: string
  results?: string[]
  links?: { label: string; href: string }[]
  images?: { src: string; alt: string; caption: string }[]
  diagram?: 'luna' | 'lora' | 'eps' | 'fingerprint' | 'stepper' | 'micromouse' | 'homer'
  sections?: DetailSection[]
}

export const projects: Project[] = [
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'luna-ros2-robot',
    title: 'Luna',
    subtitle: 'ROS 2 / micro-ROS differential-drive robot with a Gazebo digital twin',
    oneLiner:
      'A wireless ESP32 robot running closed-loop PID control, sensor fusion and a simulation twin that shares one topic contract.',
    year: '2026',
    status: 'complete',
    statusNote: 'Complete — full sim-and-hardware stack verified on the real robot',
    featured: true,
    diagram: 'luna',
    summary:
      'Luna is a complete mobile robot stack: ESP32 firmware speaking micro-ROS over WiFi/UDP to a ROS 2 Humble workspace, paired with a Gazebo Fortress simulation of the same machine. Simulation and hardware publish identical topic names, types and frame IDs, so every downstream node is written once and runs in both. Switching between them is a single launch argument.',
    problem:
      'Robotics projects usually fork into two incompatible codebases — one that drives the real robot and one that drives the simulator — so work done in simulation rarely transfers, and hardware bugs cannot be reproduced offline. On top of that, a robot with no absolute heading reference (no magnetometer, no external localisation) accumulates dead-reckoning drift that never gets corrected once boot calibration finishes.',
    approach:
      'I designed the system around a single topic contract enforced across both targets. Gazebo has no native digital cliff sensor, so the simulation attaches short-range downward-facing gpu_lidar sensors and a ROS node thresholds them into the exact same UInt8 bitmask the ESP32 publishes from its digital pins. Control architecture is mirrored rather than duplicated: the firmware runs two per-wheel velocity PID loops plus a gyro-feedback yaw-rate loop, and the simulation runs the same architecture adapted to the DiffDrive plugin’s whole-robot Twist interface. Drift is attacked with continuous gyro bias re-estimation and yaw fusion rather than a one-time calibration.',
    technologies: [
      'ROS 2 Humble',
      'micro-ROS',
      'Gazebo Fortress',
      'C++ / Arduino',
      'Python',
      'URDF / xacro',
      'UDP over WiFi',
    ],
    hardware: [
      'ESP32',
      'TB6612FNG dual motor driver',
      'Quadrature encoders ×2',
      'MPU6050 IMU (accel + gyro)',
      'VL53L0X time-of-flight sensor',
      '5× digital cliff sensors',
    ],
    software: [
      'robot_description — URDF/xacro with Fusion 360 STL meshes',
      'robot_bringup — mode switching launch files',
      'robot_gazebo — simulation world and bridge',
      'robot_control — PID, safety and mirror nodes',
      'esp32_robot_firmware — three firmware variants',
    ],
    features: [
      'One launch argument switches between simulation, hardware, or both running simultaneously',
      'Per-wheel velocity PID at 50 Hz with anti-windup clamping, independent of the 10 Hz publish loop',
      'Yaw-rate PID using direct gyro measurement, immune to wheel slip',
      'Continuous gyro bias re-estimation (ZUPT) that corrects thermal drift across a whole session',
      'Encoder/gyro yaw fusion via circular mean, handling the ±180° wrap correctly',
      'Mirror mode drives the simulated robot from the real robot’s measured motion',
      'Layered safety: cliff-sensor voting, ToF forward blocking, and a command-timeout watchdog',
    ],
    contribution:
      'Sole developer. I built the URDF model, the Gazebo world and bridge configuration, all four ROS 2 packages, and all three firmware variants — including the kinematics, the PID loops, the fusion filter and the safety logic. I also wrote the project’s standing implementation plan, which tracks every roadmap item with an honest status flag and records which work is blocked on hardware that does not exist yet.',
    results: [
      'Complete sim-and-hardware stack, verified against the real ESP32',
      'Wheel calibration measured on hardware: 0.049773 mm/tick (right), 0.050400 mm/tick (left)',
      'Mesh-derived and encoder-derived geometry agree: 120 mm track width, 22 mm wheel radius',
      'Fixed a mirror-mode failure where the simulation froze because the global /clock had no publisher',
    ],
    sections: [
      {
        title: 'System Architecture',
        body: 'The ESP32 is the only thing touching hardware. It runs the control loops locally so that a dropped WiFi packet cannot destabilise the robot, and exposes everything else as ROS 2 topics through a micro-ROS agent over UDP. The host runs the ROS 2 graph; Gazebo, when active, is bridged into that same graph under a namespace.',
        bullets: [
          '/cmd_vel — commanded velocity in real physical units (m/s, rad/s)',
          '/odom — encoder-derived pose with fused heading',
          '/imu/data — accelerometer and gyroscope, no magnetometer',
          '/tof — single-point forward range, not a scan',
          '/ir_array — UInt8 bitmask, one bit per cliff sensor',
          '/safety_stop — boolean, asserted by cliff voting or ToF threshold',
          '/joint_states — wheel positions for visualisation',
        ],
      },
      {
        title: 'Control Strategy',
        body: 'Because /cmd_vel arrives already in physical units, target wheel speed comes straight from differential-drive kinematics with no PWM guesswork. Two PID loops then find whatever PWM actually achieves that speed, self-correcting for the real PWM-to-speed relationship — which is nonlinear, mismatched left to right, and changes as the battery sags. A third loop trims the wheels differentially against the gyro’s measured turn rate.',
        bullets: [
          'Control loop runs at 50 Hz, deliberately faster than the 10 Hz telemetry publish',
          'Integral term clamped in PWM units to prevent windup during stalls',
          'Yaw loop uses gyro rather than encoder-derived turn rate, so wheel slip does not corrupt it',
          'Command timeout of 500 ms stops the robot if telemetry is lost',
        ],
      },
      {
        title: 'Estimation & Drift Correction',
        body: 'A MEMS gyro’s bias walks with temperature and self-heating, so a single boot calibration goes stale within minutes. Luna re-estimates bias continuously whenever it can confirm it is genuinely stationary — both the commanded velocity and the encoder-measured velocity must sit under their thresholds continuously for a debounce window, so a brief pause mid-manoeuvre does not false-trigger.',
        bullets: [
          'Bias corrections are deliberately slow, targeting session-timescale thermal drift rather than noise',
          'Encoder heading and gyro heading are blended each publish cycle by circular mean',
          'The fused result is written back into both the odometry pose and the IMU heading, so /odom and /imu/data never disagree',
          'Heading error dominates dead-reckoning position error, so fixing heading also improves X/Y',
          'Honest limit: with no absolute reference, position can still wander over a long enough run',
        ],
      },
      {
        title: 'Simulation Parity',
        body: 'The simulation is not a toy mock-up — it is held to the same interface as the hardware, which is what makes it useful. Where Gazebo lacks an equivalent sensor or actuator, a node bridges the gap rather than the contract being relaxed.',
        bullets: [
          'Cliff sensors simulated as short-range downward gpu_lidar, thresholded to the identical bitmask',
          'Simulation-side PID mirrors the firmware architecture on whole-robot quantities',
          'Mirror mode makes the simulated robot a live puppet of the real robot’s sensed motion',
          'Custom messages deliberately avoided so stock micro-ROS needs no rebuild to flash',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'nanosat-eps',
    title: 'Nano-Satellite Electrical Power System',
    subtitle: 'CubeSat-class EPS motherboard and power subsystem boards',
    oneLiner:
      'Solar power conditioning, battery management and switched power distribution for a student satellite.',
    year: '2023 — 2025',
    status: 'archived',
    statusNote: 'Team programme — my contribution ran Dec 2023 to Nov 2025',
    featured: true,
    diagram: 'eps',
    summary:
      'The Electrical Power System for the SS AMU SAT student satellite: a multi-sheet KiCad motherboard handling solar input conditioning, battery charging, power path arbitration and independently switched rails for each satellite subsystem, alongside a family of supporting boards.',
    problem:
      'A satellite has one non-negotiable subsystem. If power fails, nothing else matters — the spacecraft is unrecoverable. The EPS must harvest from solar panels whose output swings wildly with orientation and eclipse, keep a battery healthy across thousands of charge cycles, and guarantee that a fault in any one subsystem cannot pull down the rest.',
    approach:
      'The design is built as a hierarchical schematic, one sheet per functional block, so each subsystem can be reviewed and validated in isolation. Solar input is handled across twelve MPPT channels. Power path arbitration between solar and battery uses ideal-diode ORing controllers rather than plain diodes, avoiding the forward-drop loss that matters at satellite power budgets. Each downstream subsystem — ADCS, communications, payload — sits behind its own switched and boosted rail so it can be isolated or power-cycled independently.',
    technologies: ['KiCad 7', 'Hierarchical schematic design', 'Power electronics', 'DFM'],
    hardware: [
      'STM32H743ZGT6 microcontroller',
      '12-channel MPPT solar input',
      'LTC4415 ideal-diode ORing controller',
      'L6981N synchronous buck regulator',
      'M41T0M6F real-time clock',
      'Independent boost rails for ADCS, COM and payload',
      'ESD protection on external interfaces',
    ],
    software: ['KiCad schematic capture and layout', 'Git version control'],
    features: [
      'Twelve MPPT channels for distributed solar panel harvesting',
      'Ideal-diode power path ORing between solar and battery sources',
      'Per-subsystem switched rails: ADCS, communications and payload isolated separately',
      'Dedicated step-up converters sized per subsystem rather than one shared rail',
      'Battery-backed real-time clock for timekeeping across power events',
      'Board family spans EPS motherboard, battery charger, backplane, ADCS, payload and solar panel boards',
    ],
    contribution:
      'I joined as an EPS Team Member and was promoted to EPS Designer L2 based on technical contribution and subsystem responsibility. I contributed to the design, analysis and validation of the power system, and delivered a KiCad PCB design workshop to train other members of the satellite team. This is a multi-year team programme — the board family as a whole is the work of the EPS team, not of any one person.',
    sections: [
      {
        title: 'Hardware Architecture',
        body: 'The motherboard is organised as one schematic sheet per functional block, which keeps a complex mixed-signal power design reviewable.',
        bullets: [
          'microcontroller — STM32H743 supervisor with debug and boot configuration',
          'mppt — twelve maximum power point tracking channels for the solar array',
          'oring_diode — ideal-diode source arbitration between solar and battery',
          'solar_connector — panel interface and input protection',
          'step_up_adcs / step_up_subsystem — independently sized boost rails',
          'switch_adcs / switch_com / switch_payload — per-subsystem load switching',
          'real_time_clock — battery-backed timekeeping',
        ],
      },
      {
        title: 'Supporting Boards',
        body: 'The EPS motherboard sits inside a larger board family developed by the team, all held in the same repository.',
        bullets: [
          'Battery Charger V2.0 and battery terminal board',
          'Backplane V3 — inter-board power and signal distribution',
          'ADCS boards including ESCON motor driver revisions V2.3 through V2.5',
          'Payload V2.0 board',
          'HAT base template for daughterboard standardisation',
          'Top, side and general-mounted solar panel boards',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'andromeda-lora',
    title: 'Andromeda',
    subtitle: 'Full-duplex LoRa telemetry and control link for an autonomous underwater vehicle',
    oneLiner:
      'A dual-frequency radio link with a custom framed protocol, CRC integrity checking and automatic retransmission.',
    year: '2026',
    status: 'prototype',
    statusNote: 'Working implementation, consolidated after several design iterations',
    featured: true,
    diagram: 'lora',
    summary:
      'A bidirectional telemetry and command link built for the AMU AUV team. Two frequencies carry the two directions simultaneously, ESP8266 bridges translate between the host and the radios, and a Python link layer adds sequencing, integrity checking and automatic retransmission on top of a radio that offers none of it.',
    problem:
      'An autonomous underwater vehicle needs to stream telemetry up and accept commands down at the same time. A single LoRa module is half-duplex — it cannot transmit and receive simultaneously — so a naive implementation either loses commands while sending telemetry, or collides when both ends transmit at once. LoRa modules also expose an AT command interface with no delivery guarantee whatsoever: a sent packet may simply never arrive, silently.',
    approach:
      'Full duplex is achieved with frequency separation: 865.5 MHz carries base-to-vehicle, 866.5 MHz carries vehicle-to-base, so neither direction ever contends with the other. Both sit inside the 865–867 MHz band legal for LoRa in India. Each node is assigned a unique address over AT commands at startup. Above the radio, I wrote a framed binary protocol with CRC16-CCITT integrity checking, Base64-encoded so payload bytes can never be mistaken for AT command escape sequences. A threaded link manager layers stop-and-wait ARQ on top: every data packet is acknowledged, unacknowledged packets are retried, and duplicate sequence numbers are detected and discarded.',
    technologies: ['Python', 'C++ / Arduino', 'LoRa', 'CRC16-CCITT', 'Base64 framing', 'ARQ protocol', 'Threading'],
    hardware: [
      'REYAX RYLR998 LoRa modules (up to 4)',
      'ESP8266 serial bridges',
      '868 MHz SMA antennas',
    ],
    software: [
      'protocol.py — packet encoding, decoding and CRC verification',
      'link_manager.py — ARQ state machine, retries, deduplication, statistics',
      'radio.py — threaded serial driver and AT command configuration',
      'base_station.py / vehicle_station.py — the two endpoints',
      'diagnostics.py — throughput and latency stress testing',
      'config.py — mode, frequency and address configuration',
    ],
    features: [
      'Dual-frequency full duplex — no contention between telemetry and command paths',
      'Framed packets: type, sequence ID, length, payload, CRC16',
      'Base64 transport encoding so binary payloads survive an AT command interface',
      'Stop-and-wait ARQ with acknowledgements, 2 second timeout and 3 retries',
      'Duplicate detection per sender address using tracked sequence numbers',
      'Live link statistics: packets sent, acknowledged, dropped, and round-trip time',
      'Five operating modes, including a loopback mode that tests the full software stack with no radio hardware',
    ],
    contribution:
      'I designed and implemented the complete software stack — the wire protocol, the ARQ link layer, the threaded radio driver, both station endpoints, and the diagnostics harness — along with the ESP8266 bridge firmware and the frequency and addressing plan.',
    sections: [
      {
        title: 'Protocol Design',
        body: 'Each packet is a fixed header followed by payload and a trailing checksum, then Base64-encoded for transport. Decoding verifies the CRC before anything else and silently drops corrupted frames rather than passing bad data upward.',
        bullets: [
          'Header: 1-byte type, 2-byte sequence ID, 2-byte payload length',
          'CRC16-CCITT computed across header and payload, appended as 2 bytes',
          'Two packet types: DATA and ACK',
          'Minimum valid frame length enforced on decode',
        ],
      },
      {
        title: 'Link Layer',
        body: 'The link manager runs on its own thread, tracking every unacknowledged packet with its timestamp and retry count. It is the piece that turns an unreliable radio into something an autonomy stack can depend on.',
        bullets: [
          'Unacknowledged packets held with timestamp and retry counter until confirmed',
          'Timeout triggers retransmission up to the configured retry limit, then counts as dropped',
          'Sequence numbers tracked per sender address so duplicates are discarded, not reprocessed',
          'Round-trip time accumulated across acknowledged packets for link quality measurement',
        ],
      },
      {
        title: 'Test Modes',
        body: 'Development on radio hardware is slow, so the system is configurable down to the amount of hardware you actually have in front of you.',
        bullets: [
          'Full duplex — four modules, two per side, true simultaneous bidirectional operation',
          'Half duplex ping-pong — two modules sharing one frequency',
          'Directional test modes — two modules, one direction at a time',
          'Loopback — no radio hardware at all, exercises the entire software stack internally',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'homer-tracker',
    title: 'Homer',
    subtitle: 'Fault-tolerant homing tracker with multi-network failover and BLE peer fusion',
    oneLiner:
      'An ESP32-S3 tracker that keeps reporting position even when GPS drops out and the network fails.',
    year: '2026',
    status: 'prototype',
    statusNote: 'Working firmware across five iterations; hardware study documented',
    featured: true,
    diagram: 'homer',
    summary:
      'A location tracker built around the assumption that things fail. When GPS loses lock it falls back to estimating position from a BLE peer; when WiFi drops it falls back to GSM. Every transition is logged, failures are counted independently per transport, and the system restarts itself if both paths stay down.',
    problem:
      'A tracker that only works with a clear sky view and a good WiFi connection is not much of a tracker. GPS goes blind indoors and in urban canyons, 2G coverage is patchy and slow, and WiFi is not available in the field. Any one of those failing silently means the position stream just stops, with nothing to indicate why.',
    approach:
      'The design treats location source and network transport as two independent failover problems. For location, the device advertises its own fix over BLE while GPS is valid, and switches to scanning mode when GPS is lost — picking up a peer’s broadcast coordinates and estimating range from signal strength using the log-distance path loss model. For transport, uploads prefer WiFi and fall back to GSM over GPRS, with separate failure counters so a persistent fault in one path does not mask the other. Before integrating the SIM800L I ran a hardware study of it, because its power behaviour is the usual reason these builds fail.',
    technologies: [
      'Embedded C++',
      'ESP32 Arduino framework',
      'BLE (advertising + scanning)',
      'HTTP over GPRS',
      'AT command protocol',
      'TinyGPS++',
    ],
    hardware: [
      'ESP32-S3',
      'NEO-6M GPS module',
      'SIM800L GSM/GPRS module',
      'MPU6050 IMU',
      'WS2812 RGB status LED',
    ],
    software: [
      'Location source state machine (GPS ↔ BLE peer)',
      'Network arbitration layer (WiFi primary, GSM fallback)',
      'BLE peer callback with RSSI range estimation',
      'Per-transport failure counters and watchdog restart',
      'PHP server endpoint for telemetry ingest',
    ],
    features: [
      'Automatic failover from GPS to BLE peer-assisted positioning on signal loss',
      'BLE role switches with GPS state: advertising while the fix is valid, scanning once it is lost',
      'Range estimation from RSSI using the log-distance path loss model',
      'WiFi-preferred upload with GSM/GPRS fallback and automatic WiFi reconnection',
      'GSM network registration and GPRS attachment verified before upload is attempted',
      'Independent WiFi and GSM failure counters, with a self-restart when both persist',
      'Colour-coded RGB status LED showing the active transport at a glance',
      'SMS reporting with a Google Maps link alongside 6-DOF motion data',
    ],
    contribution:
      'I developed the firmware across five iterations — GPS acquisition, SMS reporting, IMU integration, the BLE peer layer, and the WiFi/GSM arbitration with status LEDs and failure recovery. I also carried out the SIM800L hardware study that informed the power and network design. This was a collaborative project; the initial GPRS server-upload path was contributed by a teammate.',
    results: [
      'Final firmware runs to roughly 510 lines with all failover paths implemented',
      'SIM800L integration documented in a separate hardware test report',
      'Verified BLE range estimation using a calibrated reference power of -59 dBm and a path loss exponent of 2.8',
    ],
    links: [
      {
        label: 'Repository (ESP32_GPS_GSM_MPU6050)',
        href: 'https://github.com/BoldDreamEater/ESP32_GPS_GSM_MPU6050',
      },
    ],
    sections: [
      {
        title: 'Location Source Arbitration',
        body: 'The device treats GPS as primary and a BLE peer as the standby source, switching between them on a timeout rather than on a single bad reading.',
        bullets: [
          'GPS valid → the device advertises its own coordinates as BLE manufacturer data',
          'GPS lost (timeout on fix age) → the device switches to BLE scanning',
          'Incoming peer advertisements are length-checked before being parsed, so malformed packets are discarded',
          'Peer range estimated as d = 10^((P_tx − RSSI) / 10n), with P_tx = −59 dBm and n = 2.8',
          'Each upload carries the active source so the server knows whether a fix is GPS, peer-derived, or unavailable',
        ],
      },
      {
        title: 'Network Failover',
        body: 'Transport selection is strictly prioritised and re-evaluated on every upload cycle, rather than being latched at boot.',
        bullets: [
          'WiFi is always preferred; the device re-checks and reconnects on an interval',
          'GSM path validates network registration (AT+CREG?) and GPRS attachment (AT+CGATT=1) before attempting HTTP',
          'HTTP transactions on GSM are driven through the SIM800L AT command set',
          'WiFi and GSM failures are counted separately; a combined threshold triggers a full system restart',
          'Every transport transition is logged for post-run diagnosis',
        ],
      },
      {
        title: 'SIM800L Hardware Study',
        body: 'The SIM800L is notoriously unreliable when treated as a 5 V logic-level peripheral. I characterised it before designing it in, and documented the findings in a separate test report.',
        bullets: [
          'Operates at 3.8–4.2 V, not 5 V — a common integration mistake',
          'Transmission bursts draw up to 2 A, demanding a low-noise supply with real current headroom',
          'Decoupling and bulk current buffering identified as critical to avoiding brownout resets',
          'Registration behaviour characterised across home and roaming states',
          'Known limits accepted by design: 2G dependency, slow HTTP relative to WiFi, and throughput suited only to light payloads',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'intelli-logger',
    title: 'Intelli Logger',
    subtitle: 'Wearable multi-sensor data logging platform',
    oneLiner:
      'A compact battery-powered acquisition board integrating motion, physiological and positioning sensing.',
    year: '2025 — 2026',
    status: 'active',
    statusNote: 'Iterated across six hardware revisions',
    confidential: true,
    confidentialNote:
      'Developed in a context covered by a non-disclosure agreement. Schematics, layout, bill of materials, component selection and repository access are withheld. The description below is limited to design capability.',
    summary:
      'A custom printed circuit board bringing several classes of sensing together into one compact, battery-powered wearable logging platform, designed for portable applications where data is acquired in the field and moved off the device wirelessly.',
    problem:
      'Research applications that combine motion, physiological and positional data usually end up with several separate off-the-shelf modules wired together — bulky, unsynchronised, and impractical to wear for any length of time. A single integrated board removes that friction.',
    approach:
      'The design is organised as a hierarchical schematic with one sheet per functional block, allowing each subsystem to be validated on its own before integration. Careful attention went into the power architecture, since a wearable device has to charge safely, report its remaining capacity honestly and keep sensitive analog sensing clean while doing so.',
    technologies: ['KiCad 9', 'Hierarchical schematic design', 'Mixed-signal PCB layout', 'DFM'],
    hardware: [
      'Wireless microcontroller',
      'Inertial motion sensing',
      'Analog physiological sensing front end',
      'Satellite positioning interface',
      'Real-time clock for timestamping',
      'Onboard non-volatile storage',
      'Lithium battery charging with state-of-charge monitoring',
    ],
    software: ['KiCad schematic capture and layout', 'Git version control with release branching'],
    features: [
      'Multiple sensing modalities integrated onto a single compact board',
      'Battery-powered operation with onboard charging and capacity monitoring',
      'Timestamped logging to onboard storage',
      'Wireless data offload',
      'Hierarchical schematic organised one sheet per subsystem',
      'Carried through to manufacturable fabrication output',
    ],
    contribution:
      'PCB design — schematic capture, component selection, layout and production output, iterated across six hardware revisions with version-controlled release branches.',
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'flex-strider',
    title: 'Flex Strider',
    subtitle: 'Sensor instrumentation board for movement analysis',
    oneLiner: 'A compact instrumentation PCB taken from schematic through to production-ready fabrication output.',
    year: '2026',
    status: 'complete',
    statusNote: 'Reached production-ready state',
    confidential: true,
    confidentialNote:
      'Developed during a research internship under a non-disclosure agreement. Schematics, layout, bill of materials, component selection and repository access are withheld. The description below is limited to design capability.',
    summary:
      'A compact sensor instrumentation board developed during my PCB design internship at the Department of Biomedical Informatics, Taipei Medical University, taken from schematic capture through layout to production-ready fabrication output within the internship period.',
    problem:
      'Research instrumentation frequently needs a purpose-built board: the right sensors, in the right form factor, at the right power budget. Off-the-shelf development hardware is rarely any of those things at once.',
    approach:
      'Schematic capture and layout in KiCad, with a complete bill of materials and automated fabrication output generated so the design could be sent directly for manufacture.',
    technologies: ['KiCad', 'PCB layout', 'BOM generation', 'DFM / fabrication output'],
    hardware: ['Environmental and motion sensing', 'Compact form factor for wearable use'],
    software: ['KiCad schematic capture and layout', 'Automated fabrication toolkit', 'Git version control'],
    features: [
      'Complete design cycle from schematic to manufacturable output within a one-month internship',
      'Full bill of materials prepared for procurement',
      'Automated fabrication output generation',
      'Version controlled with tagged release branches',
    ],
    contribution:
      'PCB design under the supervision of Prof. Dr. Shabbir Syed-Abdul at Taipei Medical University. Signed letter of recommendation available on request.',
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'micromouse',
    title: 'Micromouse Maze-Solving Robot',
    subtitle: 'Autonomous maze navigation robot with custom power electronics',
    oneLiner:
      'A compact autonomous robot using multi-directional time-of-flight ranging and wall-following navigation.',
    year: '2024',
    status: 'prototype',
    statusNote: 'Hardware built and navigation logic implemented',
    diagram: 'micromouse',
    summary:
      'An autonomous maze-solving robot built for AMURoboclub, combining multi-directional distance sensing with a custom-designed step-down converter and efficient wall-following navigation.',
    problem:
      'Micromouse robots have to navigate an unknown maze autonomously, which means sensing walls in several directions at once, reacting fast enough to avoid collisions, and doing it all from a small battery inside a tight chassis. Off-the-shelf regulators waste power that a small robot cannot spare.',
    approach:
      'Five time-of-flight sensors give simultaneous distance readings in multiple directions, so the robot can identify wall configurations without scanning. Motor control uses a dual H-bridge driver with micro metal gear motors chosen for the torque-to-size ratio the chassis demanded. Rather than accept the losses of a linear regulator, I designed a P-channel MOSFET-based step-down converter for the power stage.',
    technologies: ['Embedded C', 'ESP-IDF', 'Power electronics', 'Sensor integration'],
    hardware: [
      'TB6612FNG dual motor driver',
      'Pololu micro metal gear motors',
      '5× VL53L0X time-of-flight sensors',
      'P-channel MOSFET step-down converter (IRF9540N with zener bias)',
    ],
    software: ['Embedded C firmware', 'Wall-following navigation logic'],
    features: [
      'Five-way simultaneous time-of-flight ranging for wall detection',
      'Custom-designed switching step-down converter rather than a linear regulator',
      'Wall-following navigation driven by sensor feedback',
      'Component selection documented and costed before build',
    ],
    contribution:
      'Selected and integrated the drive, sensing and power components; designed the step-down converter; and implemented the navigation logic.',
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: 'biometric-lock',
    title: 'Biometric Access Control System',
    subtitle: 'Fingerprint-authenticated solenoid lock with a hand-written sensor driver',
    oneLiner:
      'An ESP32-S3 access control system driving a fingerprint module through a protocol implemented from the datasheet.',
    year: '2026',
    status: 'prototype',
    statusNote: 'Working prototype across eight incremental firmware builds',
    diagram: 'fingerprint',
    summary:
      'A fingerprint-controlled electronic lock built on the ESP32-S3, notable less for the application than for the driver underneath it: the ZW101 sensor is driven through a UART packet protocol I implemented directly from the datasheet rather than through a vendor library.',
    problem:
      'The ZW101 fingerprint module communicates over a proprietary binary UART protocol with no convenient Arduino library available. Beyond getting bytes on the wire, an access control system needs an authority model — otherwise anyone who can reach the enrolment button can add themselves as a user.',
    approach:
      'I implemented the sensor protocol from the datasheet: fixed packet headers, a 32-bit device address, per-command opcodes, and length-prefixed payloads with timeout handling on every exchange. On top of that I built a master-authority enrolment model — the first fingerprint registered becomes the master, and every subsequent privileged operation requires master verification first. The system was developed as eight incremental firmware builds, each isolating one behaviour before combining them.',
    technologies: ['Embedded C++', 'Arduino framework', 'UART packet protocol', 'State machines'],
    hardware: [
      'ESP32-S3 Zero',
      'ZW101 optical fingerprint module',
      'Solenoid lock with MOSFET drive',
      'WS2812 NeoPixel status indicator',
      'Enrol and delete control buttons',
    ],
    software: [
      'Hand-written ZW101 UART protocol driver',
      'Master-authority enrolment and verification logic',
      'Eight incremental test firmware builds (~4,800 lines total)',
    ],
    features: [
      'Full sensor command set implemented from the datasheet — image capture, template generation, search, model registration, template storage and library management',
      'Master fingerprint authority: the first enrolment becomes master, and privileged operations require master verification',
      'Multi-user enrolment and deletion through physical buttons with debouncing',
      'Open mode fallback when no master is enrolled',
      'Colour-coded NeoPixel status feedback with brightness control',
      'Timed solenoid actuation with independent MOSFET drive testing',
    ],
    contribution:
      'Sole developer of the firmware, the sensor protocol driver and the access control logic. Prototype development costing was also prepared.',
    sections: [
      {
        title: 'Protocol Implementation',
        body: 'Every exchange with the sensor is a framed packet: a two-byte header, the device address, a packet identifier, a length field, the command payload and a checksum. Responses are parsed with explicit timeouts at each stage, because a fingerprint sensor waiting for a finger that never arrives must not hang the system.',
        bullets: [
          'Image capture and template generation from the captured image',
          'Search against the stored template library',
          'Model registration from multiple captures and storage to a library slot',
          'Template loading and full library clearing',
          'System parameter readback',
          'Separate timeouts for command response, finger presence and initialisation',
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: '8051-stepper',
    title: '8051 Stepper Motor Control System',
    subtitle: 'Bare-metal motor control with LCD interface and keypad mode selection',
    oneLiner:
      'A bare-metal 8051 system driving a stepper motor with live LCD feedback, verified in simulation and on hardware.',
    year: '2025',
    status: 'complete',
    statusNote: 'Complete — built, demonstrated and submitted',
    diagram: 'stepper',
    summary:
      'A stepper motor control system written in bare-metal C for the 8051, with a character LCD for live status, keypad-driven mode selection and bidirectional operation at multiple speeds. Validated first in Proteus simulation, then built and demonstrated on real hardware.',
    problem:
      'The 8051 has no hardware abstraction to hide behind: no motor library, no display driver, no timers configured for you. Driving a stepper motor and a character LCD simultaneously means writing both drivers from the register level up and managing the timing of both within a single cooperative loop.',
    approach:
      'I wrote the LCD driver directly against the HD44780 command set, bit-banging register-select, read/write and enable lines while using a full port for data. The stepper is driven through its coil sequence on a separate port, with step timing derived from calibrated software delay loops. The control loop cycles through speed profiles on a fixed schedule while keeping the display updated, and a keypad variant adds runtime mode selection.',
    technologies: ['Embedded C', 'Keil µVision', 'Proteus simulation', '8051 assembly startup'],
    hardware: [
      '8051 microcontroller',
      '28BYJ-48 stepper motor',
      '16×2 character LCD (HD44780)',
      'Matrix keypad',
      'Motor driver stage',
    ],
    software: [
      'LCD_Stepper.c — LCD and stepper drivers',
      'Keypad mode-selection variant',
      'Forward/reverse control variant',
      'Proteus simulation project',
    ],
    features: [
      'HD44780 LCD driver written from the command set — data on a full port, control lines bit-banged',
      'Stepper coil sequencing with calibrated software delay timing',
      'Multiple speed profiles cycled on a timed schedule',
      'Forward and reverse operation',
      'Keypad-driven runtime mode selection',
      'Verified in Proteus simulation before hardware build',
    ],
    contribution:
      'Wrote all firmware, built the Proteus simulation, assembled and demonstrated the hardware, and authored the submitted project report.',
    results: [
      'Working hardware built and demonstrated — photographed and recorded on video',
      'Simulation behaviour matched hardware behaviour',
      'Submitted as the Microcontroller Systems and Applications course project',
    ],
    images: [
      {
        src: 'projects/8051-setup.webp',
        alt: 'The assembled 8051 stepper motor control system on a breadboard with LCD and motor',
        caption: 'The assembled hardware — 8051, LCD, driver stage and stepper motor',
      },
      {
        src: 'projects/8051-motor.webp',
        alt: 'The stepper motor running with status shown on the LCD',
        caption: 'Running hardware with live status on the character LCD',
      },
      {
        src: 'projects/8051-proteus.webp',
        alt: 'Proteus circuit simulation of the full 8051 stepper control schematic',
        caption: 'Proteus simulation used to validate the design before building it',
      },
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  complete: 'Complete',
  prototype: 'Prototype',
  archived: 'Concluded',
}
