---
title: "[Leetcode] Maximum Length of Repeated Subarray(Medium)"
date: 2022-09-20T14:47:44+08:00
draft: false
tags:
    - array
    - dp
categories:
    - leetcode
---

## LeetCode 718 - Maximum Length of Repeated Subarray
Given two integer arrays ``nums1` and `nums2`, return the maximum length of a subarray that appears in both arrays.
```
Input: nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
Output: 3
Explanation: The repeated subarray with maximum length is [3,2,1].
```

```
Input: nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
Output: 5
```

## How can we solve this problem?
這題要我們找出2個`array`中最長的相同`subarray`。這題有點類似於[最長公共子序列](/notes/lcm),但是不同的是`子序列`不一樣的**連續的**,而`subarray`是必須要**連續的**。哪我們只需要改寫一下`最長公共子序列`,我們只需要更新**相等**的元素即可。其餘的都不需要關心。
#### Solution:

```c++
class Solution {
    vector<vector<int>> dp;
public:
    int findLength(vector<int>& nums1, vector<int>& nums2) {
        /*
        [0,1,1,1,1]
        [1,0,1,0,1]
        
        we need to know where
        the max length between num 1 and num 2
        suppose i = 0,j = 0
        dp[0][0] = the longest length of subarray in num2[i:n-1]num2[j:m-1]
              
        
        */
        int n = nums1.size();
        int m = nums2.size();
        int res = 0;
        dp = vector<vector<int>>(n+1,vector<int>(m+1,0));
        for(int i = 1;i<n+1;i++){
            for(int j = 1; j <m+1;j++){
                if(nums1[i-1] == nums2[j-1]){
                    dp[i][j] = 1 + dp[i-1][j-1];
                }
                 res = max(dp[i][j],res);
               
            }
        }
        
        return res;
    }
        
};
```


