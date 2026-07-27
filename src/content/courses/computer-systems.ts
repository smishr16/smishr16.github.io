import {
  DEFAULT_LICENSE_NOTE,
  type CourseDetail,
  type CourseMeta,
} from '../../contracts'
import { analysisWork, moduleOf, readingWork } from '../scaffold'

export const computerSystemsMeta: CourseMeta = {
  id: 'computer-systems',
  title: 'Computer Systems',
  status: 'partial',
  track: 'Core · required',
  level: 'undergraduate',
  moduleCount: 8,
  liveLabCount: 2,
  academicNote: 'Hardware/software interface · typically sophomore/junior',
  blurb:
    'Bits to programs: data representation, assembly, processor organization, memory hierarchy, linking, and exceptions — how software meets the machine.',
  cs2023Areas: ['AR', 'SF', 'OS'],
}

export const computerSystemsCourse: CourseDetail = {
  ...computerSystemsMeta,
  peerAnchors: [
    {
      school: 'CMU',
      courseCode: '15-213',
      title: 'Introduction to Computer Systems',
      note: 'Classic “CSAPP” course — bits, asm, memory, concurrency intro',
    },
    {
      school: 'Stanford',
      courseCode: 'CS107',
      title: 'Computer Organization & Systems',
      note: 'C, memory, assembly, systems programming',
    },
    {
      school: 'MIT',
      courseCode: '6.004',
      title: 'Computation Structures',
      url: 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/',
      note: 'Digital abstraction through architecture',
    },
  ],
  licenseNote: DEFAULT_LICENSE_NOTE,
  cs2023Areas: ['AR', 'SF', 'OS'],
  overview: `**Computer Systems** is the hardware/software interface course: how programs become bits, how the processor executes them, how the memory hierarchy hides latency, and how the OS appears at the exception boundary.

This is **not** a full Operating Systems course (see Operating Systems) and **not** pure digital design. Alignment is closest to CMU 15-213 / CSAPP-style curricula. Interactive instruments (cache toys, stack visualizations) ship later; the syllabus plan is complete now.`,
  prerequisites: [
    'Intro programming completed',
    'Some C (or willingness to learn C alongside the course)',
    'Basic discrete math helpful',
  ],
  learningGoals: [
    'Explain integer and floating-point representation and common pitfalls',
    'Read and reason about simple assembly and calling conventions',
    'Describe pipeline/datapath ideas at undergrad systems depth',
    'Analyze cache locality and simple hierarchy performance models',
    'Locate linking, exceptions, and virtual memory in the system stack',
  ],
  modules: [
    moduleOf({
      id: 'sys-m1',
      code: 'M1',
      title: 'Bits, bytes & data representation',
      schedule: 'Weeks 1–2',
      summary: 'Two’s complement, bitwise ops, float, and why representation bugs are systems bugs.',
      topics: ['Bits/bytes/endianness', 'Two’s complement', 'Bitwise operations', 'IEEE float intuition', 'String encodings intro'],
      outcomes: [
        'Convert and reason about signed overflow and cast pitfalls',
        'Explain float rounding failure modes at course level',
      ],
      lectureBeats: [
        'Two’s complement: range, wrap on overflow, −1 is all bits 1',
        'Endianness: byte order of multi-byte words in memory',
        'IEEE float: rounding means 0.1+0.2 may not equal 0.3',
        'Signed/unsigned casts reinterpret bits — common C pitfalls',
      ],
      readings: [
        { label: 'Computer Systems: A Programmer’s Perspective (CSAPP) — Ch. 2', kind: 'textbook' },
        { label: 'CMU 15-213 — data lab style unit', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'sys-m1-ps',
          'Problem set: representation',
          'Solve bit-level and float-intuition problems (written / offline coding).',
          'Inspired by classic “data lab” topics; original problems only — not CMU handouts.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'sys-m2',
      code: 'M2',
      title: 'Machine-level programs',
      schedule: 'Weeks 3–5',
      summary: 'ISA view, registers, control flow, procedures, and stack discipline.',
      topics: ['ISA abstraction', 'Registers & addressing', 'Condition codes', 'Calls/returns', 'Stack frames', 'Buffer overflow idea'],
      outcomes: [
        'Trace simple assembly for loops and calls',
        'Sketch a stack frame for a nested call sequence',
      ],
      lectureBeats: [
        'ISA: registers, memory operands, condition codes drive branches',
        'call pushes return address; ret pops — stack frames hold locals and saved regs',
        'System V AMD64: first args in registers; return in %rax (survey depth)',
        'Buffer overflow idea: locals adjacent to saved return address',
      ],
      readings: [
        { label: 'CSAPP — machine-level representation chapters', kind: 'textbook' },
        { label: 'Stanford CS107 — assembly unit', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'sys-m2-ps',
          'Problem set: assembly & stack',
          'Annotate assembly snippets and draw stack snapshots at call/return.',
          'Written + offline practice; bomb/attack labs are not reproduced.',
          'partial',
        ),
        {
          id: 'sys-m2-lab',
          title: 'Lab: call stack',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective: 'Step nested calls and returns on a toy stack; relate frames to return addresses.',
          brief: 'Open stack-calls demo. Trace depth changes. Connect to buffer-overflow intuition from paper set.',
          config: { systemsDemo: 'stack-calls' },
          sources: [{ label: 'CSAPP — machine-level / stack', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'sys-m3',
      code: 'M3',
      title: 'Processor organization (landscape)',
      schedule: 'Week 6',
      summary: 'Datapath, control, pipelining intuition, and hazards at survey depth.',
      topics: ['Fetch-decode-execute', 'Pipelining idea', 'Hazards & forwarding (overview)', 'Performance metrics'],
      outcomes: [
        'Explain pipeline speedup limits qualitatively',
        'Name common hazards and high-level mitigations',
      ],
      lectureBeats: [
        'Single-cycle vs multi-stage: pipeline overlaps F/D/X/M/W',
        'Ideal speedup ≈ stages; stalls from hazards cut CPI gains',
        'Data hazards: forwarding vs stall; control hazards: predict/flush',
        'Performance: latency vs throughput; survey depth only (not full digital design)',
      ],
      readings: [
        { label: 'CSAPP / Patterson-Hennessy undergrad chapters (selected)', kind: 'textbook' },
        {
          label: 'MIT OCW 6.004 — computation structures',
          kind: 'ocw',
          url: 'https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/',
        },
      ],
      work: [
        analysisWork(
          'sys-m3-ps',
          'Problem set: pipeline intuition',
          'Reason about pipeline diagrams and simple speedup calculations.',
          'Written survey-depth work, not full digital design.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'sys-m4',
      code: 'M4',
      title: 'Memory hierarchy & caches',
      schedule: 'Weeks 7–8',
      summary: 'Locality, cache organization, miss types, and programmer-visible performance.',
      topics: ['Temporal/spatial locality', 'Cache geometry', 'Hit/miss/write policies', 'Blocking/tiling idea', 'Memory mountain intuition'],
      outcomes: [
        'Classify miss types and propose code-level locality fixes',
        'Compute simple hit-rate / AMAT style estimates',
      ],
      lectureBeats: [
        'Temporal vs spatial locality; why hierarchies work',
        'AMAT = hit time + miss rate × miss penalty (multi-level variants)',
        'Compulsory / capacity / conflict misses; blocking helps locality',
        'Lab page-fifo is a locality proxy (faults), not full cache geometry',
      ],
      readings: [
        { label: 'CSAPP — memory hierarchy chapters', kind: 'textbook' },
        { label: 'CMU 15-213 — cache lab themes', kind: 'curriculum' },
      ],
      work: [
        analysisWork(
          'sys-m4-ps',
          'Problem set: caches',
          'Work cache set-mapping and locality problems; write a short code-tuning claim.',
          'Written. Interactive cache toy planned for systems lab.',
          'partial',
        ),
        {
          id: 'sys-m4-lab-pages',
          title: 'Lab: reference locality (page-fault proxy)',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective:
            'Study locality via page faults (not a full cache-geometry simulator): same reference string under FIFO.',
          brief:
            'Honest scope: page replacement proxy. Pair with the direct-mapped cache lab for hierarchy themes.',
          config: { systemsDemo: 'page-fifo' },
          sources: [{ label: 'CSAPP — memory hierarchy themes', kind: 'textbook' }],
        },
        {
          id: 'sys-m4-lab-cache',
          title: 'Lab: direct-mapped cache',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective: 'Trace hits/misses on a fixed address stream in a 4-line direct-mapped cache toy.',
          brief: 'systemsDemo cache-direct. Record hit rate; classify cold vs conflict misses on the stream.',
          config: { systemsDemo: 'cache-direct' },
          sources: [{ label: 'CSAPP — cache chapters', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'sys-m5',
      code: 'M5',
      title: 'Linking & object files',
      schedule: 'Week 9',
      summary: 'Symbols, relocation, static vs dynamic linking, and libraries.',
      topics: ['Object files', 'Symbols & relocation', 'Static linking', 'Shared libraries intro', 'Weak/strong symbols'],
      outcomes: [
        'Explain how separate compilation becomes an executable',
        'Diagnose simple undefined/multiple-definition failures',
      ],
      lectureBeats: [
        'Compile units → .o with symbols; linker resolves and relocates',
        'Strong vs weak symbols; multiple definition vs undefined reference errors',
        'Static archives (.a) member extraction is order-sensitive',
        'Shared libraries: smaller executables; binding via PLT/GOT at survey depth',
      ],
      readings: [{ label: 'CSAPP — linking chapter', kind: 'textbook' }],
      work: [
        analysisWork(
          'sys-m5-ps',
          'Problem set: linking',
          'Trace symbol resolution scenarios and predict linker errors.',
          'Written systems reasoning.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'sys-m6',
      code: 'M6',
      title: 'Exceptions, processes & signals (bridge)',
      schedule: 'Weeks 10–11',
      summary: 'Exceptional control flow from hardware traps to process abstraction.',
      topics: ['Exceptions/interrupts', 'Process abstraction', 'Context switch idea', 'Signals overview', 'System calls'],
      outcomes: [
        'Place exceptions in the path from user code to kernel',
        'Contrast process vs thread at systems intro depth',
      ],
      lectureBeats: [
        'Exceptions: interrupt / trap / fault / abort — different restart rules',
        'Syscall path: user → trap → kernel → return; dual mode is the guardrail',
        'Process = address space + registers + OS metadata (PCB idea)',
        'Signals deliver async events to user handlers; bridge to full OS course',
      ],
      readings: [
        { label: 'CSAPP — exceptional control flow', kind: 'textbook' },
        { label: 'Cross-link: Operating Systems for depth', kind: 'notes' },
      ],
      work: [
        analysisWork(
          'sys-m6-ps',
          'Problem set: exceptional control flow',
          'Reason about handlers, process lifetime, and simple signal scenarios.',
          'Written. Full OS scheduling depth is in Operating Systems.',
          'partial',
        ),
      ],
    }),
    moduleOf({
      id: 'sys-m7',
      code: 'M7',
      title: 'Virtual memory (intro)',
      schedule: 'Week 12',
      summary: 'Address spaces, page tables, TLB intuition, and protection.',
      topics: ['Virtual vs physical addresses', 'Paging idea', 'Page faults', 'TLB', 'Protection & isolation'],
      outcomes: [
        'Explain why virtual memory exists (multiprogramming, protection, locality)',
        'Sketch a single-level page-table translation',
      ],
      lectureBeats: [
        'VA → VPN + offset; PTE maps to PPN; page size sets the split',
        'Page fault path allocates/loads and restarts; isolation via per-process tables',
        'TLB caches translations; context switch needs flush or ASID tags',
        'Lab process-lifecycle bridges exceptional control flow to ready/running/blocked',
      ],
      readings: [
        { label: 'CSAPP — virtual memory chapters', kind: 'textbook' },
        { label: 'Cross-link: Operating Systems VM unit', kind: 'notes' },
      ],
      work: [
        analysisWork(
          'sys-m7-ps',
          'Problem set: address translation',
          'Work simple VA→PA translations and page-fault scenarios.',
          'Written intro depth.',
          'partial',
        ),
        {
          id: 'sys-m7-lab-process',
          title: 'Lab: process abstraction bridge',
          kind: 'lab',
          status: 'live',
          labId: 'systems',
          objective: 'Connect exceptional control flow to process states (ready/running/blocked).',
          brief:
            'Run the process lifecycle demo. Map each transition to a systems concept (syscall, interrupt, context switch).',
          config: { systemsDemo: 'process-lifecycle' },
          sources: [{ label: 'CSAPP — exceptional control flow', kind: 'textbook' }],
        },
      ],
    }),
    moduleOf({
      id: 'sys-m8',
      code: 'M8',
      title: 'System I/O & performance wrap',
      schedule: 'Week 13',
      summary: 'Files, buffering, and measuring systems performance carefully.',
      topics: ['Unix I/O landscape', 'Buffering', 'Measurement pitfalls', 'Amdahl-style intuition', 'Course synthesis'],
      outcomes: [
        'Connect I/O buffering to performance claims',
        'Write a short systems performance critique with method caveats',
      ],
      lectureBeats: [
        'Unix I/O: fd, read/write, and where kernel buffers sit',
        'stdio buffering can hide syscall cost until flush',
        'Measurement caveats: cold/warm cache, timers, noise, boost clocks',
        'Amdahl: speedup limited by the serial fraction — critique claims carefully',
      ],
      readings: [{ label: 'CSAPP — system-level I/O / network programming selected', kind: 'textbook' }],
      work: [
        readingWork(
          'sys-m8-reading',
          'Reading: one systems paper or CSAPP case study',
          'Summarize one systems performance or reliability case study and list measurement caveats.',
          'Self-directed; cite sources. Not a copy of any university write-up.',
          'partial',
        ),
      ],
    }),
  ],
}
