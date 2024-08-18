---
title: "[Leetcode] Find Original Array From Doubled Array(Medium)"
date: 2022-09-15T00:21:27+08:00
draft: false
tags:
    - array
    - hash map
categories:
    - leetcode
---


## LeetCode 2007 - Find Original Array From Doubled Array
An integer array `original` is transformed into a **doubled** array changed by appending **twice the value** of every element in original, and then randomly **shuffling** the resulting array.

Given an array `changed`, return `original` if `changed` is a **doubled** array. If `changed` is not a **doubled** array, *return an empty array. The elements in `original` may be returned in any order*.
example
```
Input: changed = [1,3,4,2,6,8]
Output: [1,3,4]
Explanation: One possible original array could be [1,3,4]:
- Twice the value of 1 is 1 * 2 = 2.
- Twice the value of 3 is 3 * 2 = 6.
- Twice the value of 4 is 4 * 2 = 8.
Other original arrays could be [4,3,1] or [3,1,4].
```
```
Input: changed = [6,3,0,1]
Output: []
Explanation: changed is not a doubled array.
```
```
Input: changed = [1]
Output: []
Explanation: changed is not a doubled array.
```

## How can we solve this problem?
這是其實需要我們計算每個數出現的頻率，如果要找出某個數`x`的雙倍數是否存在於`array`中，如果存在，我們只需要將`x`與雙倍數移除(因為每個`x`只會匹配到一個順便數)。如果不存在，也就代表了這個`array`並不是一個有效的**Double list**，直接return `false`即可。

#### Solution:
```c++
class Solution {
public:
    vector<int> findOriginalArray(vector<int>& changed) {
        if(changed.size() % 2 != 0) return {}; //must be an even size
        vector<int> res;
        int n = changed.size();
        sort(changed.begin(),changed.end()); 
        unordered_map<int,int> m;
        for(auto num : changed) m[num]++; //number frequency
        for(auto num : changed){
           
            if(m.count(num) && m[num] > 0){ //num is exist?
                m[num]--;
                if(!m.count(num * 2) || m[num*2] == 0){ //num * 2 is not exist or num*2 is empty
                    return {};
                }else {
                    m[num * 2]--;
                    res.push_back(num);
                }
            }
        }
        return res;
    }
};
```


