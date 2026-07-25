export const BUBBLE_TEMPLATE = `# CS Visual Lab — bubble sort
# Hooks: get_array(), compare(i, j) -> -1|0|1, swap(i, j), log(msg)

def bubble_sort():
    a = get_array()
    n = len(a)
    for i in range(n):
        for j in range(0, n - i - 1):
            if compare(j, j + 1) > 0:
                swap(j, j + 1)
    log("bubble_sort finished")

bubble_sort()
`

export const INSERTION_TEMPLATE = `# CS Visual Lab — insertion sort
# Hooks: get_array(), compare(i, j) -> -1|0|1, swap(i, j), log(msg)

def insertion_sort():
    a = get_array()
    n = len(a)
    for i in range(1, n):
        j = i
        while j > 0 and compare(j - 1, j) > 0:
            swap(j - 1, j)
            j -= 1
    log("insertion_sort finished")

insertion_sort()
`

export const MERGE_TEMPLATE = `# CS Visual Lab — merge sort (in-place style with swaps)
# For teaching: sort via nested comparisons. Hooks record every step.

def merge_sort():
    a = get_array()
    n = len(a)

    def sort_range(lo, hi):
        if lo >= hi:
            return
        mid = (lo + hi) // 2
        sort_range(lo, mid)
        sort_range(mid + 1, hi)
        # Simple merge via insertion into place (clear to watch)
        for i in range(mid + 1, hi + 1):
            j = i
            while j > lo and compare(j - 1, j) > 0:
                swap(j - 1, j)
                j -= 1

    sort_range(0, n - 1)
    log("merge_sort finished")

merge_sort()
`

export const TEMPLATES_BY_ALGO: Record<string, string> = {
  bubble: BUBBLE_TEMPLATE,
  insertion: INSERTION_TEMPLATE,
  merge: MERGE_TEMPLATE,
}

export const DEFAULT_TEMPLATE = BUBBLE_TEMPLATE

export function templateFor(algoId: string): string {
  return TEMPLATES_BY_ALGO[algoId] ?? DEFAULT_TEMPLATE
}
