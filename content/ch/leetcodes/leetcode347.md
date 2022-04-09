---
title: "Top K Frequent Elements(Midium)"
date: 2022-04-09T06:22:34+08:00
draft: false
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
For solving this problem, we need to know the frequency of each number in the array, so we need to iterate the array and it will take `O(n) times` for counting, also the frequency of each number needs to be stored in a place(`like map`). Then we can get the answer by ascending order of the frequency(`using priority queue`).

## The solving steps:
1. iterate the array and store the frequency of each number to a `map`
2. reverse all key and value that stored in the map and push to a `priority queue`.
3. get the top k element from the `priority queue`

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

