---
title: "[Leetcode] Kth Largest Element in a Stream(EASY)"
date: 2022-04-08T20:21:39+08:00
draft: false
tags:
    - heap
    - priority queue
categories:
    - leetcode
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
首先，我們要知道這個問題在問什麼。很簡單，這個問題問的是array中k個大元素。舉例 `[1,2,3,4,5 ]  k=3`，需要我們求出三個最大的element，所以會是`[3,4,5]`。因此。我們只需要關心最大的K的element即可，其他都可以拋棄掉。

<!-- First thing first, we need to know what this problem is asking about. This question is asking about what is the k<sup>th</sup> largest element in the array, so we just need to know what the largest k<sup>th</sup> elements are. For example `[1,2,3,4,5 ]  k=3`, the  largest 3 elements are `[3,4,5]` right?. Therefore, we just need to consider the top k elements in the array and the other elements will be discarded. -->

<!-- ## The solving steps:
1.  使用priority queue或者max heap(大小為k個).
2.  queue中元素的數量不能超過k個.
3.  回傳queue中的top即可(便是第K個最大的element) -->
#### Solution:
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