// Sample and fallback demo data for CodeQualityBenchmarker
// All demo data is explicitly labeled so users always know when sample metrics are displayed.

export const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: "Algorithmic-Core",
    description: "High-performance data structures and graph algorithms library in Java and Python.",
    language: "Java",
    stars: 124,
    submissionsCount: 42,
    avgScore: 84.5,
    updatedAt: "2026-10-27T18:30:00Z",
    repoUrl: "https://github.com/org/algo-core",
    isDemo: true
  },
  {
    id: 2,
    name: "FinTech-Payment-Gateway",
    description: "Distributed transaction processing pipeline with idempotency and retry mechanics.",
    language: "Python",
    stars: 89,
    submissionsCount: 28,
    avgScore: 78.2,
    updatedAt: "2026-10-26T14:15:00Z",
    repoUrl: "https://github.com/org/payment-gateway",
    isDemo: true
  },
  {
    id: 3,
    name: "Realtime-Stream-Analytics",
    description: "In-memory event aggregation and windowing service for time-series telemetry.",
    language: "JavaScript",
    stars: 64,
    submissionsCount: 19,
    avgScore: 91.0,
    updatedAt: "2026-10-25T09:40:00Z",
    repoUrl: "https://github.com/org/stream-analytics",
    isDemo: true
  }
];

export const SAMPLE_SUBMISSIONS = [
  {
    id: 101,
    projectId: 1,
    projectName: "Algorithmic-Core",
    title: "LRUCache.java",
    language: "java",
    score: 88,
    maintainabilityIndex: 82,
    cyclomaticComplexity: 7,
    linesOfCode: 114,
    issuesCount: 3,
    status: "Passed",
    timestamp: "12 mins ago",
    author: "Alex Rivera",
    isDemo: true
  },
  {
    id: 102,
    projectId: 2,
    projectName: "FinTech-Payment-Gateway",
    title: "transaction_processor.py",
    language: "python",
    score: 64,
    maintainabilityIndex: 59,
    cyclomaticComplexity: 19,
    linesOfCode: 240,
    issuesCount: 9,
    status: "Needs Refactoring",
    timestamp: "1 hour ago",
    author: "Sara Chen",
    isDemo: true
  },
  {
    id: 103,
    projectId: 3,
    projectName: "Realtime-Stream-Analytics",
    title: "slidingWindowAggregator.ts",
    language: "javascript",
    score: 94,
    maintainabilityIndex: 91,
    cyclomaticComplexity: 4,
    linesOfCode: 86,
    issuesCount: 1,
    status: "Optimal",
    timestamp: "3 hours ago",
    author: "Liam Vance",
    isDemo: true
  },
  {
    id: 104,
    projectId: 1,
    projectName: "Algorithmic-Core",
    title: "GraphPathFinder.java",
    language: "java",
    score: 72,
    maintainabilityIndex: 68,
    cyclomaticComplexity: 14,
    linesOfCode: 182,
    issuesCount: 6,
    status: "Smells Detected",
    timestamp: "Yesterday",
    author: "Alex Rivera",
    isDemo: true
  }
];

export const SAMPLE_ANALYSIS_DETAIL = {
  id: 101,
  filename: "LRUCache.java",
  language: "java",
  qualityScore: 88,
  maintainabilityIndex: 82,
  cyclomaticComplexity: 7,
  linesOfCode: 114,
  cognitiveComplexity: 6,
  halsteadVolume: 420.5,
  executionOpsEstimate: "~1,240 ops / run",
  isAiRefactored: false,
  engineType: "Deterministic Rule-Based Static Analysis Engine",
  issues: [
    {
      id: "ISS-1",
      line: 34,
      severity: "Major",
      type: "Concurrency Bug",
      title: "Non-thread-safe HashMap access in get()",
      description: "Node lookup and move-to-head operations modify internal double-linked list pointers without synchronization lock."
    },
    {
      id: "ISS-2",
      line: 62,
      severity: "Minor",
      type: "Code Smell",
      title: "Hardcoded capacity without boundary validation",
      description: "Cache capacity parameter allows zero or negative values causing infinite eviction loops."
    },
    {
      id: "ISS-3",
      line: 88,
      severity: "Info",
      type: "Style / Best Practice",
      title: "Missing @Override annotation",
      description: "Class overrides toString() method but omits explicit @Override annotation."
    }
  ],
  originalCode: `public class LRUCache {
    private int capacity;
    private Map<Integer, Node> map;
    private Node head, tail;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            remove(node);
            insert(node);
            return node.value;
        }
        return -1;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
        }
        if (map.size() == capacity) {
            remove(tail.prev);
        }
        insert(new Node(key, value));
    }

    private void remove(Node node) {
        map.remove(node.key);
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insert(Node node) {
        map.put(node.key, node);
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}`,
  suggestedCode: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Thread-safe LRU Cache implementation with boundary validation
 * and deterministic O(1) amortized access.
 */
public class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head;
    private final Node tail;
    private final ReentrantLock lock = new ReentrantLock();

    public LRUCache(int capacity) {
        if (capacity <= 0) {
            throw new IllegalArgumentException("Capacity must be positive: " + capacity);
        }
        this.capacity = capacity;
        this.map = new HashMap<>(capacity * 2);
        this.head = new Node(0, 0);
        this.tail = new Node(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    public int get(int key) {
        lock.lock();
        try {
            Node node = map.get(key);
            if (node == null) return -1;
            moveToHead(node);
            return node.value;
        } finally {
            lock.unlock();
        }
    }

    public void put(int key, int value) {
        lock.lock();
        try {
            Node existing = map.get(key);
            if (existing != null) {
                existing.value = value;
                moveToHead(existing);
                return;
            }
            if (map.size() >= capacity) {
                Node lru = tail.prev;
                unlink(lru);
                map.remove(lru.key);
            }
            Node fresh = new Node(key, value);
            map.put(key, fresh);
            insertHead(fresh);
        } finally {
            lock.unlock();
        }
    }

    private void moveToHead(Node node) {
        unlink(node);
        insertHead(node);
    }

    private void unlink(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void insertHead(Node node) {
        node.next = head.next;
        node.next.prev = node;
        head.next = node;
        node.prev = head;
    }
}`,
  explanation: `Key Refactoring Improvements:
1. Thread Safety: Introduced ReentrantLock to guard pointer mutations across double-linked list during concurrent get() and put() calls.
2. Input Validation: Added boundary check for capacity <= 0 to prevent runaway evictions and NullPointerExceptions.
3. Clean Abstraction: Extracted moveToHead() to encapsulate common double-pointer operations cleanly.
4. Memory Footprint: Initialized HashMap with appropriate load factor bucket sizing to prevent rehashing stalls.`
};

export const SAMPLE_BENCHMARKS = [
  {
    version: "v1.0 (Baseline)",
    language: "Java",
    author: "Alex Rivera",
    cyclomaticComplexity: 19,
    maintainabilityIndex: 58,
    linesOfCode: 184,
    estimatedRuntimeMs: 38.4,
    memoryFootprintMb: 42.1,
    codeSmells: 8,
    qualityScore: 61,
    isCurrent: false
  },
  {
    version: "v1.1 (Static Refactor)",
    language: "Java",
    author: "Automated Engine",
    cyclomaticComplexity: 11,
    maintainabilityIndex: 74,
    linesOfCode: 142,
    estimatedRuntimeMs: 24.2,
    memoryFootprintMb: 31.8,
    codeSmells: 3,
    qualityScore: 78,
    isCurrent: false
  },
  {
    version: "v2.0 (Optimized AI)",
    language: "Java",
    author: "AI Advisor + Alex Rivera",
    cyclomaticComplexity: 6,
    maintainabilityIndex: 89,
    linesOfCode: 108,
    estimatedRuntimeMs: 14.8,
    memoryFootprintMb: 22.4,
    codeSmells: 0,
    qualityScore: 92,
    isCurrent: true
  }
];

export const SAMPLE_TEAM_MEMBERS = [
  { id: 1, name: "Alex Rivera", role: "Lead Engineer", avatar: "AR", submissions: 34, scoreAvg: 87.2 },
  { id: 2, name: "Sara Chen", role: "Backend Architect", avatar: "SC", submissions: 28, scoreAvg: 81.5 },
  { id: 3, name: "Liam Vance", role: "Algorithm Specialist", avatar: "LV", submissions: 19, scoreAvg: 92.4 },
  { id: 4, name: "Maya Patel", role: "DevOps & QA", avatar: "MP", submissions: 15, scoreAvg: 85.0 }
];

export const SAMPLE_COMMENTS = [
  {
    id: 1,
    author: "Sara Chen",
    role: "Backend Architect",
    avatar: "SC",
    targetFile: "LRUCache.java",
    line: 38,
    timestamp: "2 hours ago",
    comment: "The lock acquisition looks solid now. We should consider StampedLock if read concurrency exceeds 90% in production.",
    status: "Reviewed"
  },
  {
    id: 2,
    author: "Liam Vance",
    role: "Algorithm Specialist",
    avatar: "LV",
    targetFile: "LRUCache.java",
    line: 52,
    timestamp: "4 hours ago",
    comment: "Verified that amortized complexity is strictly O(1) for both operations. Memory overhead dropped by ~30%.",
    status: "Approved"
  }
];
