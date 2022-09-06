---
title: "[Leetcode] Kth Largest Element in an Array(MIDIUM)"
date: 2022-06-22T22:55:53+08:00
draft: false
tags:
    - heap
    - array
    - priority queue
categories:
    - leetcode
---
## LeetCode 1268 - Search Suggestions System
Given an integer array `nums` and an integer `k`, return the `kth` *largest element in the array*.

Note that it is the `kth` largest element in the sorted order, not the `kth` distinct element.  

example: 
```
Input: nums = [3,2,1,5,6,4], k = 2
Output: 5
```
```
Input: nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
```

## How can we solve this problem?
這題要我們解決的問題是回傳在`sorted array`(*Input Array沒有排序*)中第`kth`大的元素。最簡單的解法是直接排序,然後回傳`kth`元素即可。但是, 這裡我們也可以使用`Priority Queue(Heap)`來幫我們解決這個問題。因為`Priority Queue`的特性,越大的值(`MaxHeap`)/越小的值(`MinHeap`)會越接近`root`,也就是說最大值(`MaxHeap`)/最小值(`MinHeap`)會在`root`。所以我們可以運用`MinHeap`來幫助的我們解決這個問題,只要`Priority Queue`裡面的元素多於`K`個我們就會把`top`的值移除，因更小的值會在前面,每次`pop`的值都會是當前最小的值,直到最後，省下來的值的`root`/`top`就會是我們的第`K`個最大的值，而`priority queue`中最後一個值便會是`Input`中最大的值。

#### Solution:
```c++
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int,vector<int>,greater<int>> q;
        for(int i = 0;i<nums.size();i++){
            q.push(nums[i]);
            if(q.size() > k) q.pop();
        }
        return q.top();
    }
};
```


