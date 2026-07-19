import java.util.ArrayList;
import java.util.List;
import java.util.PriorityQueue;

// 1. DATA STRUCTURE: Interval Tree Node for Cage Bookings
class IntervalNode {
    int start, end, max;
    String customerName;
    IntervalNode left, right;

    public IntervalNode(int start, int end, String customerName) {
        this.start = start;
        this.end = end;
        this.max = end;
        this.customerName = customerName;
        this.left = null;
        this.right = null;
    }
}

// Interval Tree Implementation
class IntervalTree {
    private IntervalNode root;

    public void insert(int start, int end, String customerName) {
        root = insertRec(root, start, end, customerName);
    }

    private IntervalNode insertRec(IntervalNode node, int start, int end, String customerName) {
        if (node == null) return new IntervalNode(start, end, customerName);

        if (start < node.start) {
            node.left = insertRec(node.left, start, end, customerName);
        } else {
            node.right = insertRec(node.right, start, end, customerName);
        }

        if (node.max < end) {
            node.max = end;
        }
        return node;
    }

    // O(log n) Overlap Detection Algorithm
    public boolean hasOverlap(int start, int end) {
        return checkOverlap(root, start, end);
    }

    private boolean checkOverlap(IntervalNode node, int start, int end) {
        if (node == null) return false;

        // Check if current node's date interval overlaps with target
        if (node.start < end && start < node.end) {
            return true;
        }

        // If left child's max value is greater than or equal to start, overlap must be in left subtree
        if (node.left != null && node.left.max >= start) {
            return checkOverlap(node.left, start, end);
        }

        return checkOverlap(node.right, start, end);
    }
}

// 2. DATA STRUCTURE: Priority Queue Element for Pet Feeding Tasks
class FeedingTask implements Comparable<FeedingTask> {
    int militaryTime; // e.g., 0800 for 8 AM, 1400 for 2 PM
    String petName;
    String instruction;

    public FeedingTask(int militaryTime, String petName, String instruction) {
        this.militaryTime = militaryTime;
        this.petName = petName;
        this.instruction = instruction;
    }

    // Min-Heap sorting logic based on earliest time priority
    @Override
    public int compareTo(FeedingTask other) {
        return Integer.compare(this.militaryTime, other.militaryTime);
    }
}

// MAIN OPERATIONAL SIMULATOR
public class CageScheduler {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("  EDEN NEST PETS: PRODUCTION JAVA DSA ENGINE ACTIVE ");
        System.out.println("==================================================\n");

        // --- DEMONSTRATION 1: INTERVAL TREE ALOCATION ---
        System.out.println("[DSA 1] Testing Shop Cage Allocation (Interval Tree)...");
        IntervalTree shopCages = new IntervalTree();

        // Simulate booking existing intervals (e.g., Day 5 to Day 10)
        shopCages.insert(5, 10, "Alex's Lovebird");
        shopCages.insert(12, 18, "Sapna's Rabbit");
        System.out.println("-> Existing bookings successfully loaded into Tree.");

        // Check conflict for a overlapping timeline request (Day 7 to Day 9)
        boolean conflict1 = shopCages.hasOverlap(7, 9);
        System.out.println("-> Requesting Shop Cage for Day 7-9. Overlap Conflict Detected? " + conflict1); // Expects true

        // Check conflict for a completely free timeline request (Day 20 to Day 25)
        boolean conflict2 = shopCages.hasOverlap(20, 25);
        System.out.println("-> Requesting Shop Cage for Day 20-25. Overlap Conflict Detected? " + conflict2); // Expects false
        System.out.println("Result: Algorithmic resource isolation operational.\n");


        // --- DEMONSTRATION 2: MIN-HEAP PRIORITY QUEUE ---
        System.out.println("[DSA 2] Testing Care & Feeding Priorities (Min-Heap Priority Queue)...");
        PriorityQueue<FeedingTask> taskQueue = new PriorityQueue<>();

        // Add tasks out of chronological order
        taskQueue.add(new FeedingTask(1400, "Budgie Pearl", "Fresh veggies and water check"));
        taskQueue.add(new FeedingTask(800, "Rabbit Snowball", "Alfalfa hay reload"));
        taskQueue.add(new FeedingTask(1200, "Cockatiel Sunny", "Seed mix replenishment"));

        System.out.println("-> Care tasks added out-of-order. Processing queue by chronological priority:");
        
        // Pull items out of the heap (automatically outputs earliest priority tasks first)
        while (!taskQueue.isEmpty()) {
            FeedingTask nextTask = taskQueue.poll();
            System.out.printf("   [Time: %04d] Pet: %-15s Task: %s\n", 
                nextTask.militaryTime, nextTask.petName, nextTask.instruction);
        }
        System.out.println("\n==================================================");
    }
}