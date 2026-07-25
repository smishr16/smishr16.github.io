export const BUBBLE_TEMPLATE = `# CS Visual Lab — bubble sort exercise
# Use compare(i, j) and swap(i, j). get_array() returns a copy.

def bubble_sort():
    a = get_array()
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            # compare returns -1, 0, or 1 (and records a viz step)
            if compare(j, j + 1) > 0:
                swap(j, j + 1)
    log("bubble_sort finished")

bubble_sort()
`

export const DEFAULT_TEMPLATE = BUBBLE_TEMPLATE
