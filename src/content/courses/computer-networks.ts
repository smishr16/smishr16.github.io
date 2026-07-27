import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const computerNetworksMeta: CourseMeta = {
  id: 'computer-networks',
  title: 'Computer Networks',
  status: 'partial',
  track: 'Core / systems elective',
  level: 'undergraduate',
  moduleCount: 7,
  liveLabCount: 0,
  academicNote: 'End-to-end systems in the wide area',
  blurb:
    'Layering, routing, transport, reliability, and congestion — end-to-end systems in the wide area.',
  cs2023Areas: ['NC'],
}

export const computerNetworksCourse: CourseDetail = {
  ...computerNetworksMeta,
  peerAnchors: [
    {
      school: 'Stanford',
      courseCode: 'CS144',
      title: 'Introduction to Computer Networking',
      note: 'Undergrad networking + projects tradition',
    },
    {
      school: 'MIT',
      courseCode: '6.02 / 6.829',
      title: 'Intro communications / Computer Networks',
      note: 'Varies by year; OCW materials exist for related subjects',
    },
    {
      school: 'CMU',
      courseCode: '15-441/641',
      title: 'Networking and the Internet',
      note: 'Systems networking',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['NC'],
  overview: `**Computer Networks** studies how packets move: layering, reliable transport, routing, and congestion control. The course is systems-oriented (Kurose/Ross or Peterson/Davie style), not vendor certification.

Programming projects (toy TCP, routers) are offline/self-hosted when assigned; in-browser instruments are optional later.`,
  prerequisites: [
    'Computer Systems recommended',
    'Programming maturity (sockets later)',
    'Probability helpful for some analyses',
  ],
  learningGoals: [
    'Explain end-to-end arguments and layering',
    'Analyze reliable transport and congestion control mechanisms',
    'Describe routing algorithms at undergrad depth',
    'Reason about latency, bandwidth, and application protocol design',
  ],
  modules: [
    moduleOf({
      id: 'net-m1',
      code: 'M1',
      title: 'Internet architecture & layering',
      schedule: 'Week 1',
      summary: 'Hosts, links, packets, and why layers exist.',
      topics: ['Packet switching', 'Layering', 'End-to-end argument', 'Performance metrics', 'Socket API landscape'],
      outcomes: [
        'Apply end-to-end reasoning to design questions',
        'Compute simple delay/bandwidth problems',
      ],
      lectureBeats: [
        'Packet switching: statistical multiplexing vs circuit reservations',
        'Layers hide complexity; APIs between layers are contracts',
        'End-to-end argument: put functions where they can be complete',
        'Delay = processing + queue + transmission + propagation — units matter',
        'Sockets are the OS-facing application interface to the stack',
      ],
      readings: [
        { label: 'Kurose & Ross — Chapter 1', kind: 'textbook' },
        { label: 'Saltzer, Reed, Clark — End-to-end arguments (classic paper)', kind: 'paper' },
      ],
      work: [
        analysisWork(
          'net-m1-ps',
          'Problem set: architecture & metrics',
          'Layering scenarios and delay/bandwidth calculations.',
          'Written.',
          'partial',
        ),
        {
          id: 'net-m1-lab',
          title: 'Lab: store-and-forward path',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective: 'Trace a packet Client→R1→R2→Server with toy tx+prop delays; record cumulative time.',
          brief: 'systemsDemo network-path. Compare to paper delay calculations in net-m1-ps.',
          config: { systemsDemo: 'network-path' },
          sources: [{ label: 'Kurose & Ross Ch. 1', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'net-m2',
      code: 'M2',
      title: 'Application layer',
      schedule: 'Weeks 2–3',
      summary: 'HTTP, DNS, and application protocol design.',
      topics: ['HTTP/HTTPS idea', 'DNS', 'SMTP landscape', 'CDN intuition', 'API design over the network'],
      outcomes: [
        'Trace a web fetch across DNS and HTTP',
        'Critique application protocol choices',
      ],
      lectureBeats: [
        'DNS: hierarchical names, iterative vs recursive resolution, caching',
        'HTTP request/response; cookies and state are application choices',
        'HTTPS = HTTP over TLS; identity and confidentiality goals differ',
        'CDNs push content near users; DNS and anycast often involved',
        'Protocol design: IDs, retries, and idempotency prevent silent chaos',
      ],
      readings: [{ label: 'Kurose & Ross — application layer', kind: 'textbook' }],
      work: [
        analysisWork(
          'net-m2-ps',
          'Problem set: applications',
          'DNS/HTTP timeline problems and short protocol design critiques.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'net-m3',
      code: 'M3',
      title: 'Transport: reliability',
      schedule: 'Weeks 4–5',
      summary: 'UDP vs TCP, ARQ, sliding windows, and connection management.',
      topics: ['UDP', 'Checksums', 'Stop-and-wait / GBN / SR', 'TCP handshake/teardown', 'Flow control'],
      outcomes: [
        'Compare ARQ variants on lossy links',
        'Explain TCP connection lifecycle',
      ],
      lectureBeats: [
        'UDP: demux + checksum; reliability is the application’s job',
        'ARQ: ACK, timeout, retransmission; sequence numbers fight duplicates',
        'Stop-and-wait wastes BW on long fat pipes; windows pipeline data',
        'GBN vs selective repeat: what retransmits after a loss',
        'TCP 3-way handshake and teardown; flow control ≠ congestion control',
      ],
      readings: [{ label: 'Kurose & Ross — transport reliability', kind: 'textbook' }],
      work: [
        analysisWork(
          'net-m3-ps',
          'Problem set: reliable transport',
          'Sequence-number timelines and ARQ throughput reasoning.',
          'Written quantitative set.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'net-m4',
      code: 'M4',
      title: 'Congestion control',
      schedule: 'Week 6',
      summary: 'Why networks congest and how TCP responds.',
      topics: ['Congestion collapse idea', 'AIMD', 'Slow start', 'Loss signals', 'Modern CC landscape'],
      outcomes: [
        'Simulate AIMD on a simple model',
        'Explain fairness/efficiency trade-offs at intro depth',
      ],
      lectureBeats: [
        'Congestion is a shared-resource problem; collapse is possible without control',
        'Slow start probes capacity; congestion avoidance AIMDs around it',
        'Loss (or ECN/delay) is a signal — not always a perfect one',
        'AIMD fairness story: equal share under homogeneous RTTs (model assumptions)',
        'Modern CC (CUBIC, BBR landscape): same problem, different signals',
      ],
      readings: [{ label: 'Kurose & Ross — congestion control', kind: 'textbook' }],
      work: [
        analysisWork(
          'net-m4-ps',
          'Problem set: congestion control',
          'AIMD traces and short essay on loss-based vs delay-based signals.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'net-m5',
      code: 'M5',
      title: 'Network layer & routing',
      schedule: 'Weeks 7–9',
      summary: 'IP, forwarding vs routing, and classic routing algorithms.',
      topics: ['IP addressing', 'Forwarding tables', 'Distance vector', 'Link state', 'BGP landscape', 'NAT'],
      outcomes: [
        'Run DV/LS updates on small graphs',
        'Explain control plane vs data plane',
      ],
      lectureBeats: [
        'Forwarding (data plane) uses tables; routing (control plane) builds them',
        'CIDR and longest-prefix match make hierarchical addressing work',
        'Distance vector: Bellman-Ford style; count-to-infinity pathology',
        'Link state: flood topology, run Dijkstra locally',
        'BGP landscape + NAT: policy and address scarcity shape the real Internet',
      ],
      readings: [{ label: 'Kurose & Ross — network layer', kind: 'textbook' }],
      work: [
        analysisWork(
          'net-m5-ps',
          'Problem set: routing',
          'Distance-vector and link-state hand simulations; IP/CIDR problems.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'net-m6',
      code: 'M6',
      title: 'Link layer & wireless landscape',
      schedule: 'Weeks 10–11',
      summary: 'MAC, Ethernet, switching, and wireless challenges.',
      topics: ['MAC protocols', 'CSMA ideas', 'Switching/learning', 'ARP', 'Wireless loss & hidden terminal'],
      outcomes: [
        'Compare MAC approaches qualitatively',
        'Explain learning switches and loops/STP idea',
      ],
      lectureBeats: [
        'MAC: who speaks when on a shared medium',
        'CSMA/CD wired Ethernet vs CSMA/CA wireless half-duplex realities',
        'Learning switches fill tables from source MACs; flooding on miss',
        'Loops without STP/flood control can melt a LAN',
        'Hidden terminal and wireless loss break “carrier sense is enough”',
      ],
      readings: [{ label: 'Kurose & Ross — link layer', kind: 'textbook' }],
      work: [
        analysisWork(
          'net-m6-ps',
          'Problem set: link layer',
          'MAC scenarios and switch-table problems.',
          'Written.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'net-m7',
      code: 'M7',
      title: 'Security & measurement coda',
      schedule: 'Week 12',
      summary: 'TLS landscape, common attacks, and measuring the Internet carefully.',
      topics: ['TLS handshake idea', 'Common attacks survey', 'Measurement pitfalls', 'Course synthesis'],
      outcomes: [
        'Place TLS in the stack',
        'Critique a network performance claim with method caveats',
      ],
      lectureBeats: [
        'TLS sits above TCP (or with QUIC integration): confidentiality + integrity + auth',
        'Common attacks map to layers: spoofing, MITM, DDoS, DNS tricks',
        'Measurement needs vantage points; traceroute and RTT are not full stories',
        'Bandwidth ≠ latency; middleboxes and caching skew experiments',
        'Course synthesis: app → transport → network → link as one system',
      ],
      readings: [
        { label: 'Kurose & Ross — security chapter (selected)', kind: 'textbook' },
        { label: 'Public measurement papers optional', kind: 'paper' },
      ],
      work: [
        readingWork(
          'net-m7-reading',
          'Reading: one network system or paper',
          'One-page summary connecting a modern network system to M1–M6 concepts.',
          'Cite public sources.',
          'partial',
        ),
      ],
    }),
  ],
}
