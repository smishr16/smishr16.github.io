import type { MeatPack } from './types'

export const systemsOsMeat: MeatPack[] = [
  {
    workId: 'sys-m1-ps',
    timeEstimate: '70 min',
    sources: [{ label: 'CSAPP Ch. 2', kind: 'textbook' }],
    deliverables: ['Numeric answers + bit diagrams', 'Float and cast explanations'],
    selfCheck: ['Two’s complement wrap stated explicitly', 'Endian byte order listed left-to-right in memory'],
    problems: [
      {
        id: 's1',
        title: 'P1 · Two’s complement',
        points: 25,
        prompt: 'For 8-bit two’s complement: encode −1, −128, 127. What is 100 + 50 if truncated to 8-bit signed?',
      },
      {
        id: 's2',
        title: 'P2 · Float pitfall',
        points: 25,
        prompt:
          'Explain why (0.1 + 0.2) == 0.3 may be false in IEEE-754 binary floating point. Give a 4-bit toy float analogy if helpful.',
      },
      {
        id: 's3',
        title: 'P3 · Casts',
        points: 25,
        prompt: 'In C-like semantics: int x = -1; unsigned u = x; what is u on a 32-bit two’s complement machine? Why?',
      },
      {
        id: 's4',
        title: 'P4 · Endian',
        points: 25,
        prompt: 'Bytes of 0x12345678 on little-endian in memory order at address A. Same on big-endian.',
      },
    ],
  },
  {
    workId: 'sys-m2-ps',
    timeEstimate: '80 min',
    sources: [{ label: 'CSAPP machine-level chapters', kind: 'textbook' }],
    deliverables: ['Annotated asm + stack drawing', 'Overflow location sketch'],
    selfCheck: ['Return address location marked', 'ABI or convention stated for args'],
    problems: [
      {
        id: 'm1',
        title: 'P1 · Stack frame',
        points: 40,
        prompt:
          'Function f calls g(a,b). Draw stack just after g’s prologue (locals: one int). Mark return address, saved rbp (if used), args per System V AMD64 or state your convention.',
      },
      {
        id: 'm2',
        title: 'P2 · Trace',
        points: 35,
        prompt:
          'Given toy asm: mov $3,%rdi; call abs_like; where abs_like does test %rdi,%rdi; jge .L; neg %rdi; .L: ret. What is returned?',
      },
      {
        id: 'm3',
        title: 'P3 · Overflow idea',
        points: 25,
        prompt: 'Explain buffer overflow at conceptual level: where is the return address relative to a local char buf[16]?',
      },
    ],
  },
  {
    workId: 'sys-m4-ps',
    timeEstimate: '75 min',
    sources: [{ label: 'CSAPP memory hierarchy', kind: 'textbook' }],
    deliverables: ['AMAT numbers + miss classification', 'Lab fault count for FIFO ref string'],
    selfCheck: ['Units consistent (cycles or ns)', 'Miss types named with one fix each'],
    problems: [
      {
        id: 'c1',
        title: 'P1 · AMAT',
        points: 30,
        prompt: 'Hit time 1ns, miss penalty 100ns, miss rate 3%. AMAT? If L2 cuts miss penalty to 20ns with local miss 20%, recompute (simplified two-level).',
      },
      {
        id: 'c2',
        title: 'P2 · Miss types',
        points: 35,
        prompt:
          'Classify: cold miss on first access to block; conflict in direct-mapped for two addresses mapping to same set; capacity when working set exceeds cache. Give one code-level fix for each of conflict and capacity.',
      },
      {
        id: 'c3',
        title: 'P3 · Lab bridge',
        points: 35,
        prompt:
          'Using the page-fault proxy lab (FIFO, 3 frames) on refs 1 2 3 2 4 1 5 2 1 3: count faults. Which refs hit? How does this relate to temporal locality (not cache geometry)?',
      },
    ],
  },
  {
    workId: 'os-m1-ps',
    timeEstimate: '45 min',
    sources: [{ label: 'OSTEP intro', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Syscall path narrative', 'Monolithic vs microkernel trade-off table'],
    selfCheck: ['User/kernel boundary named', 'Syscall mediation of privileged ops stated'],
    problems: [
      {
        id: 'o1',
        title: 'P1 · Dual mode',
        points: 30,
        prompt: 'Why can’t user code disable interrupts or rewrite page tables directly? What mechanism mediates?',
      },
      {
        id: 'o2',
        title: 'P2 · Syscall path',
        points: 40,
        prompt: 'Trace read() from user call to device at a high level (trap, kernel, driver, block/return).',
      },
      {
        id: 'o3',
        title: 'P3 · Design',
        points: 30,
        prompt: 'Monolithic vs microkernel: one reliability argument and one performance argument each.',
      },
    ],
  },
  {
    workId: 'os-m3-ps',
    timeEstimate: '70 min',
    sources: [{ label: 'OSTEP scheduling', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Gantt charts + metrics', 'Average waiting comparison across policies'],
    selfCheck: [
      'Same job set as lab: P1(0,5) P2(1,3) P3(2,8) P4(3,2)',
      'RR quantum = 2 in Gantt slices',
    ],
    problems: [
      {
        id: 'sch1',
        title: 'P1 · FCFS metrics',
        points: 30,
        prompt:
          'Jobs: P1 arr=0 burst=5, P2 a=1 b=3, P3 a=2 b=8, P4 a=3 b=2. Draw FCFS Gantt; compute turnaround and waiting for each; averages.',
      },
      {
        id: 'sch2',
        title: 'P2 · SJF',
        points: 30,
        prompt: 'Same jobs, non-preemptive SJF among arrived. Gantt + average waiting. Compare to FCFS.',
      },
      {
        id: 'sch3',
        title: 'P3 · RR q=2',
        points: 40,
        prompt: 'RR quantum 2. Gantt with all slices. Which job finishes first? Discuss response time vs FCFS for P4.',
      },
    ],
  },
  {
    workId: 'os-m4-ps',
    timeEstimate: '90 min',
    sources: [{ label: 'OSTEP concurrency', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Fixed code sketches', 'Lock order argument'],
    selfCheck: [
      'No busy-wait claimed as correct sync without justification',
      'Bounded-buffer invariants on count stated',
    ],
    problems: [
      {
        id: 'c1',
        title: 'P1 · Race',
        points: 25,
        prompt:
          'counter=0; two threads each do for i in 1..100000: counter++. Why final value may be <200000? Name the critical section.',
      },
      {
        id: 'c2',
        title: 'P2 · Bounded buffer',
        points: 40,
        prompt:
          'Write pseudocode for producer/consumer with mutex + two CVs (or semaphores). State invariants on count.',
      },
      {
        id: 'c3',
        title: 'P3 · Deadlock',
        points: 35,
        prompt:
          'Thread A locks L1 then L2; B locks L2 then L1. Show deadlock schedule. Fix with lock ordering.',
      },
    ],
  },
  {
    workId: 'os-m5-ps',
    timeEstimate: '60 min',
    sources: [{ label: 'OSTEP VM', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Replacement traces', 'Thrashing paragraph'],
    selfCheck: ['Same ref string as lab', 'FIFO and LRU fault lists both present'],
    problems: [
      {
        id: 'v1',
        title: 'P1 · FIFO',
        points: 35,
        prompt: '3 frames, refs 1,2,3,2,4,1,5,2,1,3. FIFO: list faults and final frames.',
      },
      {
        id: 'v2',
        title: 'P2 · LRU',
        points: 35,
        prompt: 'Same refs, LRU: list faults. Which refs hit under LRU but fault under FIFO (or vice versa)?',
      },
      {
        id: 'v3',
        title: 'P3 · Thrashing',
        points: 30,
        prompt: 'Define thrashing. How does a working-set idea reduce it (conceptual)?',
      },
    ],
  },
  {
    workId: 'sys-m2-lab',
    timeEstimate: '35–45 min',
    sources: [{ label: 'CSAPP machine-level chapters', kind: 'textbook' }],
    deliverables: ['Stack snapshots at call/return', 'Argument/return path notes'],
    selfCheck: ['Return address below locals stated', 'Nested call depth visible in drawings'],
    problems: [
      {
        id: 'sl1',
        title: 'P1 · Nested calls',
        points: 40,
        prompt:
          'On paper (stack toy forthcoming): f calls g calls h. Draw stack just after h’s prologue. Mark return addresses and each frame’s saved base pointer (or state your ABI).',
      },
      {
        id: 'sl2',
        title: 'P2 · Args',
        points: 30,
        prompt:
          'Under System V AMD64, where do the first two integer args live when g(a,b) is entered? Where is the return value of h expected?',
      },
      {
        id: 'sl3',
        title: 'P3 · Unwind',
        points: 30,
        prompt:
          'Describe stack height after h returns, then g returns, back in f. What must be true of %rsp for the next ret to be correct?',
      },
    ],
  },
  {
    workId: 'sys-m3-ps',
    timeEstimate: '55–70 min',
    sources: [{ label: 'CSAPP / Patterson-Hennessy undergrad pipeline chapters', kind: 'textbook' }],
    deliverables: ['Pipeline diagram notes', 'Speedup calculations'],
    selfCheck: ['Ideal speedup vs hazard caveats', 'Units of CPI/time consistent'],
    problems: [
      {
        id: 'p1',
        title: 'P1 · Ideal speedup',
        points: 30,
        prompt:
          'A single-cycle CPU takes 800ps per instruction. A 5-stage pipeline has 200ps stages but 1.2 CPI from stalls. Ideal speedup if CPI stayed 1? Actual speedup with 1.2 CPI?',
      },
      {
        id: 'p2',
        title: 'P2 · Hazards',
        points: 40,
        prompt:
          'Name data, control, and structural hazards with one concrete instruction-pair example each. For data hazards, state forwarding vs stall at survey depth.',
      },
      {
        id: 'p3',
        title: 'P3 · Pipeline diagram',
        points: 30,
        prompt:
          'Sketch a 5-stage (F D X M W) timeline for: add, sub dependent on add’s result, beq (assume not taken prediction wrong once). Mark at least one stall or flush.',
      },
    ],
  },
  {
    workId: 'sys-m4-lab-pages',
    timeEstimate: '30–40 min',
    sources: [{ label: 'CSAPP — memory hierarchy themes', kind: 'textbook' }],
    deliverables: ['Fault count table', 'Hit/miss classification of each ref'],
    selfCheck: [
      'systemsDemo page-fifo; 3 frames; refs 1 2 3 2 4 1 5 2 1 3',
      'Scope: page replacement not cache geometry',
    ],
    problems: [
      {
        id: 'pf1',
        title: 'P1 · Fault count',
        points: 40,
        prompt:
          'Run systemsDemo page-fifo (3 frames) on refs 1,2,3,2,4,1,5,2,1,3. Count total page faults. List frames after each reference (or after each fault).',
      },
      {
        id: 'pf2',
        title: 'P2 · Hits',
        points: 30,
        prompt:
          'Which references in that string hit under FIFO? For one hit, explain why the page was still resident (temporal locality).',
      },
      {
        id: 'pf3',
        title: 'P3 · Scope honesty',
        points: 30,
        prompt:
          'This lab is page replacement, not cache geometry (sets/ways/lines). In ≤6 sentences, what extra parameters would a true cache simulator need that this demo omits?',
      },
    ],
  },
  {
    workId: 'sys-m5-ps',
    timeEstimate: '60–75 min',
    sources: [{ label: 'CSAPP — linking chapter', kind: 'textbook' }],
    deliverables: ['Symbol resolution scenarios', 'Linker error predictions'],
    selfCheck: ['Strong vs weak symbol rules used', 'Static vs dynamic distinguished'],
    problems: [
      {
        id: 'lk1',
        title: 'P1 · Multiple definition',
        points: 35,
        prompt:
          'Two .o files both define strong global int x. What does the static linker do? What if one is weak (common/tentative) and one is strong?',
      },
      {
        id: 'lk2',
        title: 'P2 · Undefined',
        points: 30,
        prompt:
          'main.o calls foo(); foo is only in libfoo.a. Describe how the linker pulls members from the archive (order sensitivity).',
      },
      {
        id: 'lk3',
        title: 'P3 · Shared library',
        points: 35,
        prompt:
          'Contrast static linking vs dynamic shared library for disk size of executables and what happens at first call to a library function (PLT/GOT idea OK at survey depth).',
      },
    ],
  },
  {
    workId: 'sys-m6-ps',
    timeEstimate: '55–70 min',
    sources: [{ label: 'CSAPP — exceptional control flow', kind: 'textbook' }],
    deliverables: ['Exception taxonomy table', 'Process lifetime narrative'],
    selfCheck: ['Trap vs interrupt vs fault distinguished', 'User/kernel transition named'],
    problems: [
      {
        id: 'ec1',
        title: 'P1 · Exception classes',
        points: 35,
        prompt:
          'Classify with one example each: interrupt, trap, fault, abort. For a page fault, is the faulting instruction typically restarted?',
      },
      {
        id: 'ec2',
        title: 'P2 · Process lifetime',
        points: 35,
        prompt:
          'Trace a process from fork/exec idea through running, blocking on read, ready, and exit. Where does the PCB live conceptually?',
      },
      {
        id: 'ec3',
        title: 'P3 · Signals',
        points: 30,
        prompt:
          'User types Ctrl-C in a terminal job. Sketch path from keyboard interrupt to default SIGINT disposition. What changes if a handler is installed?',
      },
    ],
  },
  {
    workId: 'sys-m7-ps',
    timeEstimate: '60–75 min',
    sources: [{ label: 'CSAPP — virtual memory chapters', kind: 'textbook' }],
    deliverables: ['VA→PA calculations', 'Page-fault scenario answers'],
    selfCheck: ['VPN/offset split consistent with page size', 'TLB role stated'],
    problems: [
      {
        id: 'vm1',
        title: 'P1 · Translation',
        points: 40,
        prompt:
          '32-bit VA, 4KB pages, single-level page table. Split VA into VPN and offset bits. Translate VA 0x00003A2C given PTE for VPN maps to PPN 0x5F (PPN in page-number units). Physical address?',
      },
      {
        id: 'vm2',
        title: 'P2 · Page fault',
        points: 30,
        prompt:
          'On first touch of a demand-zero heap page: what does the kernel allocate, what goes in the PTE, and why is isolation preserved vs other processes?',
      },
      {
        id: 'vm3',
        title: 'P3 · TLB',
        points: 30,
        prompt:
          'Why is a TLB critical for performance? After a context switch, what problem arises if the TLB is not flushed or tagged (ASID idea)?',
      },
    ],
  },
  {
    workId: 'sys-m7-lab-process',
    timeEstimate: '25–35 min',
    sources: [{ label: 'CSAPP — exceptional control flow', kind: 'textbook' }],
    deliverables: ['Transition table for processes A and B', 'Syscall/interrupt mapping'],
    selfCheck: ['systemsDemo process-lifecycle', 'Each transition maps to a systems cause'],
    problems: [
      {
        id: 'pl1',
        title: 'P1 · Trace states',
        points: 40,
        prompt:
          'Run systemsDemo process-lifecycle. For processes A and B, list state at each step (new/ready/running/blocked/terminated) from the demo timeline.',
      },
      {
        id: 'pl2',
        title: 'P2 · Causes',
        points: 35,
        prompt:
          'Map three transitions to causes: (i) ready→running, (ii) running→blocked, (iii) blocked→ready. Use scheduler dispatch, I/O wait, and I/O completion language.',
      },
      {
        id: 'pl3',
        title: 'P3 · Context switch',
        points: 25,
        prompt:
          'When B runs while A is blocked, what must the OS save/restore for A (at conceptual PCB/register level)?',
      },
    ],
  },
  {
    workId: 'sys-m8-reading',
    timeEstimate: '45–60 min',
    sources: [{ label: 'CSAPP — system-level I/O / performance case studies', kind: 'textbook' }],
    deliverables: ['Case-study summary', 'Measurement caveats list'],
    selfCheck: ['Source cited', '≥3 measurement caveats'],
    problems: [
      {
        id: 'io1',
        title: 'P1 · Summary',
        points: 40,
        prompt:
          'Summarize one systems performance or reliability case study (CSAPP chapter case or a public paper). Problem, method, and headline result in ≤1 page.',
      },
      {
        id: 'io2',
        title: 'P2 · Buffering',
        points: 30,
        prompt:
          'Explain how user-space stdio buffering can make “write one byte at a time” look fast until fflush/exit—how would you measure true syscall cost?',
      },
      {
        id: 'io3',
        title: 'P3 · Caveats',
        points: 30,
        prompt:
          'List ≥4 measurement caveats (cold vs warm cache, turbo/boost, noisy neighbors, timer granularity, Amdahl limits). Tie two to your case study.',
      },
    ],
  },
  {
    workId: 'os-m2-ps',
    timeEstimate: '60–75 min',
    sources: [{ label: 'OSTEP — processes & address spaces', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['fork/exec diagrams', 'Address-space sketch'],
    selfCheck: ['COW or copy semantics mentioned if relevant', 'Isolation benefits named'],
    problems: [
      {
        id: 'pr1',
        title: 'P1 · fork/exec',
        points: 40,
        prompt:
          'Process P runs fork(); child returns 0, parent returns child pid. Then child calls exec(prog). Draw both processes’ conceptual address spaces before fork, after fork, and after exec in the child.',
      },
      {
        id: 'pr2',
        title: 'P2 · States',
        points: 30,
        prompt:
          'Place new, ready, running, blocked, terminated on a state diagram with labeled transitions (schedule, I/O, exit, create).',
      },
      {
        id: 'pr3',
        title: 'P3 · Isolation cost',
        points: 30,
        prompt:
          'Name two isolation benefits of separate address spaces and two costs (TLB shootdown, data copy, IPC overhead—pick concrete).',
      },
    ],
  },
  {
    workId: 'os-m2-lab',
    timeEstimate: '25–35 min',
    sources: [{ label: 'OSTEP — processes', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Step-by-step state table', 'Event naming for each transition'],
    selfCheck: ['systemsDemo process-lifecycle', 'Two processes A and B traced'],
    problems: [
      {
        id: 'ol1',
        title: 'P1 · Full trace',
        points: 40,
        prompt:
          'Run systemsDemo process-lifecycle. Build a table: step number → A state → B state → status text (or your paraphrase).',
      },
      {
        id: 'ol2',
        title: 'P2 · I/O block',
        points: 30,
        prompt:
          'When A goes running→blocked and B becomes running, name the OS mechanisms involved (blocking syscall, scheduler, context switch).',
      },
      {
        id: 'ol3',
        title: 'P3 · Termination',
        points: 30,
        prompt:
          'How does the demo show B terminating while A continues? What happens to A’s final transition to terminated?',
      },
    ],
  },
  {
    workId: 'os-m3-lab-fcfs',
    timeEstimate: '30–40 min',
    sources: [{ label: 'OSTEP — scheduling', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Gantt matching lab', 'Turnaround/waiting table'],
    selfCheck: [
      'systemsDemo schedule-fcfs',
      'Jobs P1(0,5) P2(1,3) P3(2,8) P4(3,2)',
    ],
    problems: [
      {
        id: 'fc1',
        title: 'P1 · Gantt',
        points: 40,
        prompt:
          'Run systemsDemo schedule-fcfs on the fixed jobs P1 arr=0 burst=5, P2 a=1 b=3, P3 a=2 b=8, P4 a=3 b=2. Record makespan and finish order.',
      },
      {
        id: 'fc2',
        title: 'P2 · Metrics',
        points: 35,
        prompt:
          'Compute turnaround and waiting time for each job under FCFS. Average waiting time?',
      },
      {
        id: 'fc3',
        title: 'P3 · Convoy',
        points: 25,
        prompt:
          'Explain the convoy effect using this instance: how does long P3 affect short P4 under FCFS vs a short-job-aware policy?',
      },
    ],
  },
  {
    workId: 'os-m3-lab-sjf',
    timeEstimate: '30–40 min',
    sources: [{ label: 'OSTEP — scheduling', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['SJF Gantt', 'Comparison to FCFS metrics'],
    selfCheck: [
      'systemsDemo schedule-sjf; non-preemptive; same 4 jobs',
      'Compared numerically to FCFS waiting average',
    ],
    problems: [
      {
        id: 'sj1',
        title: 'P1 · SJF order',
        points: 40,
        prompt:
          'Run systemsDemo schedule-sjf (non-preemptive, among arrived). List run order and finish times for P1–P4 on the same job set as FCFS lab.',
      },
      {
        id: 'sj2',
        title: 'P2 · Waiting',
        points: 35,
        prompt:
          'Compute average waiting time under SJF. Compare numerically to your FCFS average from the FCFS lab.',
      },
      {
        id: 'sj3',
        title: 'P3 · Knowledge caveat',
        points: 25,
        prompt:
          'SJF needs burst lengths. In ≤6 sentences, how do real systems approximate this (MLFQ / exponential average ideas at survey depth)?',
      },
    ],
  },
  {
    workId: 'os-m5-lab-fifo',
    timeEstimate: '30–40 min',
    sources: [{ label: 'OSTEP — virtual memory / replacement', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['FIFO fault list', 'Final frame contents'],
    selfCheck: [
      'systemsDemo page-fifo; 3 frames; refs 1,2,3,2,4,1,5,2,1,3',
      'Victim pages listed on each eviction',
    ],
    problems: [
      {
        id: 'ff1',
        title: 'P1 · Trace',
        points: 45,
        prompt:
          'Run systemsDemo page-fifo with 3 frames on refs 1,2,3,2,4,1,5,2,1,3. List which refs fault and the victim page on each eviction.',
      },
      {
        id: 'ff2',
        title: 'P2 · Count',
        points: 30,
        prompt:
          'Total FIFO fault count? Final three resident pages in any order you record from the lab.',
      },
      {
        id: 'ff3',
        title: 'P3 · Belady hint',
        points: 25,
        prompt:
          'Belady’s anomaly: FIFO fault count can increase with more frames for some strings. Give the idea in ≤5 sentences (no need for a full counterexample proof).',
      },
    ],
  },
  {
    workId: 'os-m5-lab-lru',
    timeEstimate: '30–40 min',
    sources: [{ label: 'OSTEP — virtual memory / replacement', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['LRU fault list', 'FIFO vs LRU comparison table'],
    selfCheck: [
      'systemsDemo page-lru; same ref string as FIFO lab',
      'At least one FIFO/LRU differing hit identified',
    ],
    problems: [
      {
        id: 'lr1',
        title: 'P1 · LRU trace',
        points: 40,
        prompt:
          'Run systemsDemo page-lru (3 frames) on refs 1,2,3,2,4,1,5,2,1,3. List faults and victims.',
      },
      {
        id: 'lr2',
        title: 'P2 · Diff vs FIFO',
        points: 35,
        prompt:
          'Compare total faults to FIFO on the same string. Identify one reference that hits under LRU but faults under FIFO (or vice versa) and explain using recency.',
      },
      {
        id: 'lr3',
        title: 'P3 · Implementation',
        points: 25,
        prompt:
          'True LRU is expensive in hardware. Name one approximation (clock/second-chance or aging) and the bit(s) it uses.',
      },
    ],
  },
  {
    workId: 'os-m6-ps',
    timeEstimate: '65–80 min',
    sources: [{ label: 'OSTEP — file systems', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['Layout sketches', 'Crash-consistency scenario answers'],
    selfCheck: ['Inode vs data block roles clear', 'Journaling purpose stated'],
    problems: [
      {
        id: 'fs1',
        title: 'P1 · Allocation',
        points: 35,
        prompt:
          'Compare contiguous, linked (FAT-like), and extent/inode block-pointer allocation for a 1GB file that grows: fragmentation, random read cost, metadata size.',
      },
      {
        id: 'fs2',
        title: 'P2 · Directory',
        points: 30,
        prompt:
          'Directory entry maps name→inode number. Walk open("/a/b.txt") from root: which inodes and data blocks are read (conceptual sequence)?',
      },
      {
        id: 'fs3',
        title: 'P3 · Crash',
        points: 35,
        prompt:
          'Create file needs: allocate inode, attach data block, update directory. Crash after inode+data but before directory update—what is visible? How does journaling help (survey depth)?',
      },
    ],
  },
  {
    workId: 'os-m7-ps',
    timeEstimate: '55–70 min',
    sources: [{ label: 'OSTEP — I/O & devices selected', kind: 'textbook', url: 'https://ostep.org/' }],
    deliverables: ['I/O path diagram', 'Device trade-off table'],
    selfCheck: ['User buffer vs kernel buffer vs device mentioned', 'Interrupt vs polling trade-off'],
    problems: [
      {
        id: 'ioa',
        title: 'P1 · Read path',
        points: 40,
        prompt:
          'Trace read(fd, buf, n) from app through syscall, file system, block layer, and device, back to user buf. Note where copies may occur.',
      },
      {
        id: 'iob',
        title: 'P2 · Interrupt vs poll',
        points: 30,
        prompt:
          'When is polling better than interrupts for device completion? Give a high-rate NIC vs slow keyboard intuition.',
      },
      {
        id: 'ioc',
        title: 'P3 · SSD vs HDD',
        points: 30,
        prompt:
          'Contrast HDD seek latency with SSD random read traits. Why do I/O schedulers matter less (or differently) on SSDs?',
      },
    ],
  },
  {
    workId: 'os-m8-reading',
    timeEstimate: '45–60 min',
    sources: [
      { label: 'OSTEP / OS security survey', kind: 'textbook' },
      {
        label: 'MIT 6.828 public materials',
        kind: 'curriculum',
        url: 'https://pdos.csail.mit.edu/6.828/',
      },
    ],
    deliverables: ['One-page isolation map', 'Cited public sources'],
    selfCheck: ['Maps onto process/VM concepts from earlier modules', 'Not a marketing brochure'],
    problems: [
      {
        id: 'sec1',
        title: 'P1 · Choose tech',
        points: 30,
        prompt:
          'Pick containers or VMs (or a named sandbox). Define the isolation boundary in one precise paragraph.',
      },
      {
        id: 'sec2',
        title: 'P2 · Classic map',
        points: 40,
        prompt:
          'Map your tech onto: process abstraction, virtual memory/protection, and syscall interface. Which OS mechanisms does it reuse vs virtualize?',
      },
      {
        id: 'sec3',
        title: 'P3 · Threat',
        points: 30,
        prompt:
          'Name one threat that your isolation handles well and one residual risk (escape, side channel, misconfig). Cite a public source.',
      },
    ],
  },
]
