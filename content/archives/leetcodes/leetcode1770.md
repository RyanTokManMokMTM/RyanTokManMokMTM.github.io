---
title: "[Leetcode] Maximum Score from Performing Multiplication Operations(Medium)"
date: 2022-09-16T20:42:00+08:00
draft: false
tags:
    - array
    - dp
    - dynamic programming
    - recursion
categories:
    - leetcode
---

## LeetCode 1770 - Maximum Score from Performing Multiplication Operations

You are given two integer arrays `nums` and `multipliers` of size `n` and `m` respectively, where `n >= m`. The arrays are **1-indexed**.

You begin with a score of `0`. You want to perform **exactly** `m` operations. On the `ith` operation (**1-indexed**), you will:

* Choose one integer `x` from **either the start or the end** of the array `nums`.
* Add `multipliers[i] * `x` to your score.
* Remove x from the array `nums`.
Return the maximum score after performing m operations.
example
```
Input: nums = [1,2,3], multipliers = [3,2,1]
Output: 14
Explanation: An optimal solution is as follows:
- Choose from the end, [1,2,3], adding 3 * 3 = 9 to the score.
- Choose from the end, [1,2], adding 2 * 2 = 4 to the score.
- Choose from the end, [1], adding 1 * 1 = 1 to the score.
The total score is 9 + 4 + 1 = 14.
```
```
Input: nums = [-5,-3,-3,-2,7,1], multipliers = [-10,-5,3,4,6]
Output: 102
Explanation: An optimal solution is as follows:
- Choose from the start, [-5,-3,-3,-2,7,1], adding -5 * -10 = 50 to the score.
- Choose from the start, [-3,-3,-2,7,1], adding -3 * -5 = 15 to the score.
- Choose from the start, [-3,-2,7,1], adding -3 * 3 = -9 to the score.
- Choose from the end, [-2,7,1], adding 1 * 4 = 4 to the score.
- Choose from the end, [-2,7], adding 7 * 6 = 42 to the score. 
The total score is 50 + 15 - 9 + 4 + 42 = 102.
```

## How can we solve this problem?
這題最主要的重點是對於每個`multipliers[i]`,它只能挑選最左邊或者最右邊的值。所有，我們需要知道`multipliers[i]`拿最左邊的值最後的結果比較大，還是拿最右邊後的結果比較大。為了避免重複計算而超時，所以我們需要使用`dp`來幫助我們記錄當前最優解。`注:因multipliers最多為m個，所有最多只能從nums拿m個數字`
* dp 定義： dp[i][j], 從前面取了`i`個,以及後面取了`j`個，但是因為j很大(n-1),所以我們透過計算當前計算的`multipliers`的第`k`個來表示(`n - j - i + 1`)。當前的`multipliers`是`k`。
* dp 初始條件 : init 為 INT_MIN

#### Solution:
```c++
class Solution {
     vector<vector<int>> dp;
public:
    int maximumScore(vector<int>& nums, vector<int>& multipliers) {
        //n >= m
        //socre : 0
        //m operations
        //[3,2,1]
        int m = multipliers.size();
        int n = nums.size();
        
        dp = vector<vector<int>>(m+1,vector<int>(m+1,INT_MIN));
        
        return solution(nums,multipliers,0,n-1,n,m);
    }
    
    
    int solution(vector<int>& nums, vector<int>& multipliers,int i,int j,int n,int m){
        
        int currentMul = n - (j - i + 1); //the rest of size of the sub-array is the index of current multipliers
        if(currentMul == m) return 0;
        //current maxvalue = choose first or choose end?
        
        if(dp[i][currentMul] != INT_MIN) return dp[i][currentMul];

        //choose the front val
        return dp[i][currentMul] = 
            max(
            (nums[i] * multipliers[currentMul]) + solution(nums,multipliers,i+1,j,n,m),// take left
            (nums[j] * multipliers[currentMul]) + solution(nums,multipliers,i,j-1,n,m) //take right
        );           
    }
    
};
```



