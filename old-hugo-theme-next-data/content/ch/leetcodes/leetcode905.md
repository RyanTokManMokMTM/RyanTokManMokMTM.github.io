---
title: "[Leetcode] Sort Array By Parity(Easy)"
date: 2022-05-02T18:19:41+08:00
draft: false
tags:
    - array
categories:
    - leetcode
---

## LeetCode 905 - Sort Array By Parity
Given an integer array `nums`, move all the even integers at the beginning of the array followed by all the odd integers.

Return **any array** that satisfies this condition.

example:  
```
Input: nums = [3,1,2,4]
Output: [2,4,3,1]
Explanation: The outputs [4,2,3,1], [2,4,1,3], and [4,2,1,3] would also be accepted.
```
```
Input: nums = [0]
Output: [0]
```

## How can we solve this problem?
這個問題很簡單，就是把偶數移動到Array的前面，基數移動到後面。我們這裡可以使用`Two-pointer approach`, `i`為尋找前面的基數，而`j` 為尋找後面的偶數，只要`nums[i]`為基數,`nums[j]`為偶數就進行交換。


<!-- ## The solving steps:
1. 定義`i`和`j`,`i=0`和`j=n-1`
2. 使用iteration進行基數偶數的查找，直到`i>=j`就結束 -->
#### Solution:
```c++
class Solution {
public:
    vector<int> sortArrayByParity(vector<int>& nums) {
        int i = 0;
        int j = nums.size() - 1;
        
        //O(n)
        while(i < j){
            //i is even skip
            //j is odd skip
            //i is odd and j is even swap
            if(nums[i] % 2 == 0) i++;
            else if(nums[j] % 2 == 1) j--;
            else swap(nums[i++],nums[j--]);
        }
        return nums;
    }
};
```


