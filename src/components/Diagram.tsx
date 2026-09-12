import type { Project } from '../data/projects'

/**
 * Hand-authored SVG architecture diagrams, one per project that has a
 * mechanism worth showing. These illustrate the real signal/power flow
 * inferred from each project's source — they are diagrams, not photographs.
 */

const C = {
  stroke: '#252c35',
  box: '#101317',
  boxAlt: '#151a20',
  text: '#c4ccd8',
  dim: '#7c8797',
  accent: '#4ea3ff',
  signal: '#5fd3a6',
  warn: '#e0a458',
}

type BoxProps = {
  x: number
  y: number
  w?: number
  h?: number
  label: string
  sub?: string
  tone?: 'default' | 'accent' | 'signal' | 'warn'
}

function Box({ x, y, w = 116, h = 46, label, sub, tone = 'default' }: BoxProps) {
  const border = tone === 'accent' ? C.accent : tone === 'signal' ? C.signal : tone === 'warn' ? C.warn : C.stroke
  const opacity = tone === 'default' ? 1 : 0.65
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="7"
        fill={sub ? C.boxAlt : C.box}
        stroke={border}
        strokeOpacity={opacity}
        strokeWidth="1.2"
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 4}
        textAnchor="middle"
        fill={C.text}
        fontSize="11.5"
        fontFamily="ui-monospace, monospace"
      >
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fill={C.dim} fontSize="9.5" fontFamily="ui-monospace, monospace">
          {sub}
        </text>
      )}
    </g>
  )
}

function Arrow({ d, tone = 'default', dashed = false, label, lx, ly }: { d: string; tone?: 'default' | 'accent' | 'signal'; dashed?: boolean; label?: string; lx?: number; ly?: number }) {
  const color = tone === 'accent' ? C.accent : tone === 'signal' ? C.signal : '#333d49'
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.3"
        strokeDasharray={dashed ? '4 5' : undefined}
        markerEnd="url(#dgArrow)"
        opacity={tone === 'default' ? 1 : 0.85}
      />
      {label && lx != null && ly != null && (
        <text x={lx} y={ly} textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="ui-monospace, monospace">
          {label}
        </text>
      )}
    </g>
  )
}

function Frame({ viewBox, children, caption }: { viewBox: string; children: React.ReactNode; caption: string }) {
  return (
    <figure className="m-0">
      <div className="overflow-x-auto rounded-lg border border-white/[0.07] bg-ink-900/60 p-4">
        <svg viewBox={viewBox} className="h-auto w-full min-w-[560px]" role="img" aria-label={caption}>
          <defs>
            <marker id="dgArrow" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#3d4a57" />
            </marker>
          </defs>
          {children}
        </svg>
      </div>
      <figcaption className="mt-2.5 text-xs leading-relaxed text-slate-500">{caption}</figcaption>
    </figure>
  )
}

function LunaDiagram() {
  return (
    <Frame
      viewBox="0 0 720 350"
      caption="Luna signal flow. The ESP32 closes every control loop locally; the host receives telemetry and issues velocity commands over WiFi. Simulation attaches to the same ROS 2 graph under a namespace."
    >
      <text x="16" y="20" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">ROBOT (ESP32)</text>
      <rect x="12" y="28" width="364" height="196" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />

      <Box x={28} y={48} w={100} h={44} label="Encoders" sub="x2 quad" tone="signal" />
      <Box x={28} y={104} w={100} h={44} label="MPU6050" sub="accel+gyro" tone="signal" />
      <Box x={28} y={160} w={100} h={44} label="ToF + cliff" sub="VL53L0X, x5" tone="signal" />

      <Box x={160} y={74} w={100} h={50} label="PID x3" sub="50 Hz" tone="accent" />
      <Box x={160} y={150} w={100} h={44} label="Safety" sub="watchdog" tone="warn" />

      <Box x={286} y={74} w={76} h={50} label="TB6612" sub="motors" />

      <Arrow d="M128 70 H154" />
      <Arrow d="M128 126 H154 V124" />
      <Arrow d="M128 182 H154 V172" />
      <Arrow d="M260 99 H280" tone="accent" />
      <Arrow d="M210 150 V130" />

      {/* wireless link — labels sit above/below their own arrows, clear of both frames */}
      <text x="448" y="92" textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="ui-monospace, monospace">
        micro-ROS / UDP
      </text>
      <Arrow d="M376 104 H516" tone="accent" dashed />
      <Arrow d="M516 134 H376" tone="accent" dashed />
      <text x="448" y="150" textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="ui-monospace, monospace">
        /cmd_vel
      </text>

      <text x="526" y="20" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">HOST (ROS 2 HUMBLE)</text>
      <rect x="520" y="28" width="188" height="196" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />

      <Box x={534} y={48} w={160} h={44} label="micro-ROS agent" sub="UDP :8888" />
      <Box x={534} y={110} w={160} h={44} label="ROS 2 graph" sub="/odom /imu /tof" tone="accent" />
      <Box x={534} y={172} w={160} h={40} label="Gazebo twin" sub="same contract" />

      <Arrow d="M614 92 V106" />
      <Arrow d="M614 154 V168" />

      <text x="16" y="256" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">YAW ESTIMATION</text>
      <rect x="12" y="264" width="696" height="62" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />
      <Box x={28} y={280} w={132} h={32} label="encoder heading" tone="signal" />
      <Box x={196} y={280} w={120} h={32} label="gyro heading" tone="signal" />
      <Box x={370} y={280} w={126} h={32} label="circular mean" tone="accent" />
      <Box x={548} y={280} w={144} h={32} label="fused yaw" tone="accent" />
      <Arrow d="M160 296 H190" />
      <Arrow d="M316 296 H364" />
      <Arrow d="M496 296 H542" tone="accent" />
    </Frame>
  )
}

function LoraDiagram() {
  return (
    <Frame
      viewBox="0 0 640 250"
      caption="Andromeda link architecture. Two frequencies carry the two directions simultaneously, so telemetry and commands never contend. The ARQ layer sits above the radios and makes delivery reliable."
    >
      <text x="16" y="20" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">BASE STATION</text>
      <rect x="12" y="28" width="240" height="188" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />
      <Box x={28} y={44} w={208} h={40} label="base_station.py" />
      <Box x={28} y={94} w={208} h={44} label="LinkManager" sub="ARQ: seq, ACK, retry" tone="accent" />
      <Box x={28} y={150} w={98} h={44} label="ESP8266" sub="TX bridge" />
      <Box x={138} y={150} w={98} h={44} label="ESP8266" sub="RX bridge" />
      <Arrow d="M132 84 V90" />
      <Arrow d="M90 138 V146" />
      <Arrow d="M187 146 V140" />

      <text x="388" y="20" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">VEHICLE (AUV)</text>
      <rect x="388" y="28" width="240" height="188" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />
      <Box x={404} y={44} w={208} h={40} label="vehicle_station.py" />
      <Box x={404} y={94} w={208} h={44} label="LinkManager" sub="ARQ: seq, ACK, retry" tone="accent" />
      <Box x={404} y={150} w={98} h={44} label="ESP8266" sub="RX bridge" />
      <Box x={514} y={150} w={98} h={44} label="ESP8266" sub="TX bridge" />
      <Arrow d="M508 84 V90" />
      <Arrow d="M453 146 V140" />
      <Arrow d="M563 138 V146" />

      <Arrow d="M236 164 H400" tone="accent" label="865.5 MHz  base to vehicle" lx={318} ly={158} />
      <Arrow d="M504 190 H128" tone="signal" label="866.5 MHz  vehicle to base" lx={318} ly={206} />

      <text x="318" y="236" textAnchor="middle" fill={C.dim} fontSize="9" fontFamily="ui-monospace, monospace">
        packet: [type][seq][len][payload][crc16] then base64
      </text>
    </Frame>
  )
}

function EpsDiagram() {
  return (
    <Frame
      viewBox="0 0 640 250"
      caption="Satellite EPS power path. Solar harvesting feeds MPPT conversion, ideal-diode ORing arbitrates between solar and battery, and each subsystem sits behind its own switched rail so a fault cannot pull down the others."
    >
      <Box x={16} y={92} w={96} h={52} label="Solar array" sub="panels" tone="signal" />
      <Box x={140} y={92} w={104} h={52} label="MPPT" sub="12 channels" tone="accent" />
      <Box x={272} y={40} w={104} h={48} label="Battery" sub="charger" tone="signal" />
      <Box x={272} y={108} w={104} h={52} label="ORing" sub="ideal diode" tone="accent" />

      <Box x={432} y={24} w={188} h={42} label="ADCS rail" sub="boost + switch" />
      <Box x={432} y={78} w={188} h={42} label="COM rail" sub="boost + switch" />
      <Box x={432} y={132} w={188} h={42} label="Payload rail" sub="boost + switch" />
      <Box x={432} y={186} w={188} h={42} label="STM32H743" sub="supervisor + RTC" tone="accent" />

      <Arrow d="M112 118 H134" tone="signal" />
      <Arrow d="M244 118 H266" tone="accent" />
      <Arrow d="M244 110 V64 H266" tone="signal" />
      <Arrow d="M324 88 V104" />

      <Arrow d="M376 128 H406 V45 H426" tone="accent" />
      <Arrow d="M406 99 H426" tone="accent" />
      <Arrow d="M406 153 H426" tone="accent" />
      <Arrow d="M406 128 V207 H426" tone="accent" />
    </Frame>
  )
}

function FingerprintDiagram() {
  return (
    <Frame
      viewBox="0 0 640 180"
      caption="Access control flow. Every privileged action routes through master verification before the solenoid is ever energised."
    >
      <Box x={16} y={64} w={104} h={52} label="ZW101" sub="fingerprint" tone="signal" />
      <Box x={150} y={64} w={118} h={52} label="UART driver" sub="packet protocol" tone="accent" />
      <Box x={298} y={64} w={118} h={52} label="Auth logic" sub="master check" tone="accent" />
      <Box x={446} y={30} w={178} h={44} label="Solenoid" sub="MOSFET drive" tone="warn" />
      <Box x={446} y={92} w={178} h={44} label="NeoPixel" sub="status feedback" />

      <Box x={150} y={132} w={118} h={34} label="Buttons" sub="" />
      <Arrow d="M209 132 V122" />

      <Arrow d="M120 90 H144" tone="signal" label="57600 baud" lx={132} ly={82} />
      <Arrow d="M268 90 H292" tone="accent" />
      <Arrow d="M416 82 V52 H440" tone="accent" />
      <Arrow d="M416 98 V114 H440" />
    </Frame>
  )
}

function StepperDiagram() {
  return (
    <Frame
      viewBox="0 0 640 170"
      caption="8051 system layout. One microcontroller drives both peripherals from separate ports within a single cooperative control loop."
    >
      <Box x={16} y={58} w={104} h={48} label="Keypad" sub="mode select" tone="signal" />
      <Box x={158} y={52} w={130} h={60} label="8051" sub="bare-metal C" tone="accent" />
      <Box x={340} y={22} w={152} h={44} label="16x2 LCD" sub="P1 data, P2 control" />
      <Box x={340} y={96} w={152} h={44} label="Driver stage" sub="P3 coil sequence" />
      <Box x={524} y={96} w={100} h={44} label="28BYJ-48" sub="stepper" tone="signal" />

      <Arrow d="M120 82 H152" tone="signal" />
      <Arrow d="M288 70 V44 H334" />
      <Arrow d="M288 94 V118 H334" tone="accent" />
      <Arrow d="M492 118 H518" tone="accent" />
    </Frame>
  )
}

function MicromouseDiagram() {
  return (
    <Frame
      viewBox="0 0 640 180"
      caption="Micromouse sensing and drive chain, including the custom switching converter that replaced a linear regulator."
    >
      <Box x={16} y={26} w={128} h={46} label="5x VL53L0X" sub="time of flight" tone="signal" />
      <Box x={16} y={100} w={128} h={46} label="Battery" sub="cell pack" />
      <Box x={186} y={100} w={140} h={46} label="MOSFET buck" sub="IRF9540N" tone="warn" />
      <Box x={186} y={26} w={140} h={46} label="Wall following" sub="navigation logic" tone="accent" />
      <Box x={370} y={62} w={122} h={48} label="TB6612FNG" sub="dual H-bridge" tone="accent" />
      <Box x={520} y={62} w={104} h={48} label="Gear motors" sub="Pololu micro" tone="signal" />

      <Arrow d="M144 49 H180" tone="signal" />
      <Arrow d="M144 123 H180" />
      <Arrow d="M326 49 V80 H364" tone="accent" />
      <Arrow d="M326 123 V92 H364" tone="default" />
      <Arrow d="M492 86 H514" tone="accent" />
    </Frame>
  )
}

function HomerDiagram() {
  return (
    <Frame
      viewBox="0 0 700 300"
      caption="Homer's two independent failover paths. Location falls back from GPS to a BLE peer; transport falls back from WiFi to GSM. Each has its own failure counter, and a combined threshold restarts the device."
    >
      <text x="16" y="20" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">LOCATION SOURCE</text>
      <rect x="12" y="28" width="300" height="120" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />
      <Box x={28} y={48} w={118} h={42} label="GPS (NEO-6M)" sub="primary" tone="signal" />
      <Box x={28} y={98} w={118} h={38} label="BLE peer" sub="RSSI range" tone="warn" />
      <Box x={182} y={68} w={112} h={48} label="arbiter" sub="fix timeout" tone="accent" />
      <Arrow d="M146 69 H176" tone="signal" />
      <Arrow d="M146 117 H176 V112" tone="default" />

      <Box x={352} y={64} w={104} h={56} label="ESP32-S3" sub="+ MPU6050" tone="accent" />
      <Arrow d="M294 92 H346" tone="accent" />

      <text x="500" y="20" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">TRANSPORT</text>
      <rect x="494" y="28" width="194" height="120" rx="9" fill="none" stroke={C.stroke} strokeDasharray="3 4" />
      <Box x={510} y={48} w={162} h={42} label="WiFi" sub="preferred" tone="signal" />
      <Box x={510} y={98} w={162} h={38} label="GSM / GPRS" sub="SIM800L fallback" tone="warn" />
      <Arrow d="M456 80 H504" tone="accent" />
      <Arrow d="M456 104 H504 V112" tone="default" />

      <Box x={276} y={186} w={148} h={44} label="HTTP upload" sub="lat/lon, source, IMU" tone="accent" />
      <Arrow d="M591 136 V208 H430" tone="accent" />

      <text x="16" y="258" fill={C.dim} fontSize="10" fontFamily="ui-monospace, monospace">RELIABILITY</text>
      <rect x="12" y="264" width="676" height="26" rx="7" fill="none" stroke={C.stroke} strokeDasharray="3 4" />
      <text x="32" y="281" fill={C.dim} fontSize="9.5" fontFamily="ui-monospace, monospace">
        independent WiFi / GSM fail counters
      </text>
      <text x="300" y="281" fill={C.dim} fontSize="9.5" fontFamily="ui-monospace, monospace">
        transition logging
      </text>
      <text x="470" y="281" fill={C.warn} fontSize="9.5" fontFamily="ui-monospace, monospace">
        combined threshold -&gt; ESP.restart()
      </text>
    </Frame>
  )
}

const MAP = {
  luna: LunaDiagram,
  homer: HomerDiagram,
  lora: LoraDiagram,
  eps: EpsDiagram,
  fingerprint: FingerprintDiagram,
  stepper: StepperDiagram,
  micromouse: MicromouseDiagram,
} as const

export function Diagram({ kind }: { kind: NonNullable<Project['diagram']> }) {
  const Component = MAP[kind]
  return Component ? <Component /> : null
}
