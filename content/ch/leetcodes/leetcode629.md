---
title: "[Leetcode DP] K Inverse Pairs Array(HARD)"
date: 2022-07-17T11:55:10+08:00
draft: false
---
*這題主要是學習DP思想，做個小記錄*

## LeetCode 629 - K Inverse Pairs Array
For an integer array nums, an **inverse pair** is a pair of integers `[i, j]` where `0 <= i < j < nums.length` and `nums[i] > nums[j]`.

Given two integers`n` and `k`, return the number of different arrays consist of numbers from 1 to n such that there are exactly `k` **inverse pairs**. Since the answer can be huge, return it **modulo** `109 + 7`.

example: 
```
Input: n = 3, k = 0
Output: 1
Explanation: Only the array [1,2,3] which consists of numbers from 1 to 3 has exactly 0 inverse pairs.
```
```
Input: n = 3, k = 1
Output: 2
Explanation: The array [1,3,2] and [2,1,3] have exactly 1 inverse pair.
```

## How can we solve this problem?
#### 題解
這題就是說給定一個數字`n`,從`[1,n]`中所能組成**inverse pair**為`k`組的有多少種組合方法。
> INVERSE PAIR 的定義：  
> i < j 且 num[i] > nums[j]  
> 如 `[2,1]` 的INVERSE PAIR為1; 相反`[1,2]`的INVERSE PAIR 為 0  

#### 解法
這題我們需要使用到`DP(動態規劃)`

1. DP規劃:
    * 題目很明確的問了我們在`n` array 中所能組成`K`個inverse pair有多少個，所以`DP[i][j]`表示的是`i`個數字在array中,組成`j`。
    * 定義**DP[n+1][k+1]**

2. 計算DP的值
    ```
    假設已知dp[4][j], j:0....k
    
    加入4呢?
    [x,x,x](1-3的任意組合) + 4
 
    dp[4][j] => 加入4到array 中為j個  inverse pair

    ```
