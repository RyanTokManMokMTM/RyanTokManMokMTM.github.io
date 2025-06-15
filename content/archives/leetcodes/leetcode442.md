---
title: "[Leetcode] Create Binary Tree From Descriptions(Medium)"
date: 2022-09-06T22:02:11+08:00
draft: false
tags:
    - array
    - hash map
categories:
    - leetcode
---

## LeetCode 442 - Find All Duplicates in an Array
Given an integer array `nums` of length `n` where all the integers of `nums` are in the range `[1, n]` and each integer appears **once** or **twice**, return an array of all the integers that appears **twice**.

You must write an algorithm that runs in `O(n)` time and uses only constant extra space.
example
```
Input: nums = [4,3,2,7,8,2,3,1]
Output: [2,3]
```

```
Input: nums = [1]
Output: []
```

## How can we solve this problem?
這題要我們找出所有在Array裡重複出現2次的數字。解法也很簡單, 因為題目也說了數字會出現1次或者2次,哪我們可以透過`Map`來計數,但當前數字已經出現過1次,也就代表當前數字是重複了2次,加入到結果即可。
#### Solution:
```c++
class Solution {
public:
    vector<int> findDuplicates(vector<int>& nums) {
        vector<int> res;
        // unordered_map<int,int> m;
        int n = nums.size();
        vector<int> m(nums.size() + 1); // 1 - n
        for(int i = 0;i<n;i++){
            if (m[nums[i]] == 0) {
                m[nums[i]] ++;
            }else{
                res.emplace_back(nums[i]);
            }
        }
        return res;
    }
};
```


