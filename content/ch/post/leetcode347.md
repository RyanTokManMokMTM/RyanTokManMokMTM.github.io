---
title: "[Leetcode] Top K Frequent Elements(MEDIUM)"
date: 2022-04-09T06:22:34+08:00
draft: false
tags:
    - map
    - priority queue
    - array
categories:
    - leetcode
---

## LeetCode 347 - Top K Frequent Elements

Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

example
```
Input: nums = [1,1,1,2,2,3], k = 2
Output: [1,2]

Input: nums = [1], k = 1
Output: [1]
```

## How can we solve this problem?
這一題需要我們返回K個數量最多的element。所以，我們可以使用`map`記錄我們array中element的個數，然後在把他們以`<frequency,element>`存到`priority queue/max queue`，最後只要返回`priority queue`中的`k`個element即可。
<!-- For solving this problem, we need to know the frequency of each number in the array, so we need to iterate the array and it will take `O(n) times` for counting, also the frequency of each number needs to be stored in a place(`like map`). Then we can get the answer by ascending order of the frequency(`using priority queue`). -->

<!-- ## The solving steps:
1. iterate整個array並以`map`保存數值和frequency
2. revere map中的key和value並保存到`priority queue`.
3. 從`priority queue`中獲取Top K個 element -->
<!-- 1. iterate the array and store the frequency of each number to a `map`
2. reverse all key and value that stored in the map and push to a `priority queue`.
3. get the top k element from the `priority queue` -->
#### Solution:
```c++
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        vector<int> res;
        unordered_map<int,int> map;
        priority_queue<pair<int,int>> q;
        for(auto i : nums) map[i]++; //counter numbers 
        for(auto it : map) q.push({it.second,it.first}); //according to the second for priority
        while(k-- > 0) {
            res.push_back(q.top().second);
            q.pop();
        }
        return res;
    }
};
```

