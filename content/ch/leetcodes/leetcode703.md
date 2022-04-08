---
title: "Leetcode-703 Kth Largest Element in a Stream(Easy)"
date: 2022-04-08T20:21:39+08:00
draft: true
---

## LeetCode 703 - Kth Largest Element in a Stream

Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.  

Implement KthLargest class:  
* `KthLargest(int k, int[] nums)` Initializes the object with the integer `k` and the stream of integers nums.
* `int add(int val)` Appends the integer val to the stream and returns the element representing the kth largest element in the stream.

example:
```
Input
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
Output
[null, 4, 5, 5, 8, 8]

Explanation
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3);   // return 4
kthLargest.add(5);   // return 5
kthLargest.add(10);  // return 5
kthLargest.add(9);   // return 8
kthLargest.add(4);   // return 8
```

## How can we solve this problem?
First thing first, we need to know what this problem is asking about. This question is asking about what is the k<sup>th</sup> largest element in the array, so we just need to know what the largest k<sup>th</sup> elements are. For example `[1,2,3,4,5 ]  k=3`, the  largest 3 elements are `[3,4,5]` right?. Therefore, we just need to consider the top k elements in the array and the other elements will be discarded.

## The solving steps:
1.  using priority queue with `greater/maxinum cmp` or using min heap.
2.  keep the largest k elements.
3.  return the last element/top element(`the size of the queue is k`)

```c++
class KthLargest {
private:
    priority_queue<int,vector<int>,greater<int>> q;
    int k;
public:

    KthLargest(int k, vector<int>& nums) {
        for(auto e : nums) {
            q.push(e);
            if(q.size() > k) q.pop();
        }
        this->k = k;
    }
    
    int add(int val) {
        q.push(val);
        if(q.size() > k) q.pop();
        return q.top();
    }
};
```