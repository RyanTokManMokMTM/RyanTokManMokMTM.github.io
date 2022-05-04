---
title: "[Leetcode] Max Number of K-Sum Pairs(MEDIUM)"
date: 2022-05-04T20:11:43+08:00
draft: false
tags:
    - array
    - map
    - two-pointer
categories:
    - leetcode
---

## LeetCode 1679 - Max Number of K-Sum Pairs
You are given an integer array `nums` and an integer `k`.

In one operation, you can pick two numbers from the array whose sum equals `k` and remove them from the array.

Return `the maximum number of operations you can perform on the array`.

example
```
Input: nums = [1,2,3,4], k = 5
Output: 2
Explanation: Starting with nums = [1,2,3,4]:
- Remove numbers 1 and 4, then nums = [2,3]
- Remove numbers 2 and 3, then nums = []
There are no more pairs that sum up to 5, hence a total of 2 operations.
```
```
Input: nums = [3,1,3,4,3], k = 6
Output: 1
Explanation: Starting with nums = [3,1,3,4,3]:
- Remove the first two 3's, then nums = [1,4,3]
There are no more pairs that sum up to 6, hence a total of 1 operation.
```

## How can we solve this problem?
這題就是要移除`Array`中2個elements加起來等於`k`的操作有幾次。  
第一個解法，我們可以使用`sorting`以及`two-pointer approach`來解決。先將`array`排序，然後設置`i`為0,`j`為`n-1`,直接使用iteration找出`nums[i]+nums[j] = k`的數，然後`answer+1`即可。
#### Solution:
```c++
class Solution {
public:
    int maxOperations(vector<int>& nums, int k) {
        //sort
        sort(nums.begin(),nums.end()); //O n log n
        
        int ans = 0;
        int i = 0,j = nums.size()-1;
        
        while(i < j){
            if(nums[i] + nums[j] == k) {
                ans++;
                i++;
                j--;
            }else if(nums[i] + nums[j] > k)j--;
            else i++;
        }
        
        return ans;

    }
};
```

第二種解法是透過`map`來記錄。首先，會透過`x = k - nums[i]`得出一個數，如果這個數不存在`map`裡面或者`map[x] <= 0`就代表沒有，就把目前的`nums[i]`加入到`map`。如果存在，就將`answer+1`並且從`map`中移除`map[x]`的數量(`map[x]--`)。

#### Solution:
```c++
class Solution {
public:
    int maxOperations(vector<int>& nums, int k) {
        unordered_map<int,int> temp;
        int ans = 0;
        for(int i = 0;i<nums.size();i++){
            int sum = k - nums[i];
            if(temp[sum] > 0){
                //exist this value;
                //for example:[3,1,3,4,3]
                //3,1,3(we are here) 6-3=3 and 3:1 and we found a pair(3,3)=6 ,and remove the existing value
                ans++;
                temp[sum]--;
            }else temp[nums[i]]++;
        }
        return ans;
    }
};
```



