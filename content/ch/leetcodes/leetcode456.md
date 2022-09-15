---
title: "[Leetcode] 132 Pattern(Medium)"
date: 2022-05-07T06:30:23+08:00
draft: false
tags:
    - array
    - stack
categories:
    - leetcode
---

## LeetCode 456 - 132 Pattern
Given an array of `n` integers nums, a **132 pattern** is a subsequence of three integers nums[i], nums[j] and nums[k] such that i < j < k and nums[i] < nums[k] < nums[j].

Return true *if there is a 132 pattern in nums, otherwise, return false*.
example
```
Input: nums = [1,2,3,4]
Output: false
Explanation: There is no 132 pattern in the sequence.
```
```
Input: nums = [3,1,4,2]
Output: true
Explanation: There is a 132 pattern in the sequence: [1, 4, 2].
```
```
Input: nums = [-1,3,2,0]
Output: true
Explanation: There are three 132 patterns in the sequence: [-1, 3, 2], [-1, 3, 0] and [-1, 2, 0].
```

## How can we solve this problem?
這題就是要我們找出`List`有沒有符合`132 Pattern`。那怎麼才算是`132 Pattern`呢。從題目定義可以看出在`List`中任意的`nums[i] < nums[k] < nums[j]，也就是說`nums[k]`為最大,`nums[j]`為第二大,`nums[i]`為第三大。

那要怎麼找到是不是符合呢?  
假設我們現在的位置是`nums[j]`,我們是否能在找到`[0 - j)`這個範圍內找到`nums[k]`以及`nums[i]`且符合nums[i] < nums[k] < nums[j]就好了呢? 

哪我們應該要怎麼做呢?  
因為`nums[i]`都是會是`132 pattern`當中最小的的值。因此每當iterate時，記錄當前值的左邊的最小的值(`當前這個值可能會是k，最小值可能會是i`)。當我要判斷一個值是不是`j`時，我們只需要拿到比他大的值，然後再透過記錄在此值得最小值，跟`j`做比較是不是符合`nums[i] < nums[j]`這個條件，我們就可知道當前的`j`是不是我們要找的。

解題步驟如下:
1. 我們要記錄每個值的左手邊的最小值，用於判斷是不是`nums[i]`
2. 我們要用定義一個pointer暫存目前的最小值
3. 當我們要判斷當前的值是否會構成`132 Pattern`,就從先前的記錄中獲取比較當前值還要大的記錄，並且透過記錄中的最小值判斷是不是也小於`j`,從而得出結論。

#### Solution:
```c++
class Solution {
public:
    bool find132pattern(vector<int>& nums) {
        //i < k < j
        //if there exist one return true
        
        return solution(nums);
    }
    
    // bool burstForce(vector<int>& nums){
    //     int n = nums.size();
    //     for(int i = 0;i<n;i++){
    //         for(int j = i+1;j<n;j++){
    //             for(int k = j + 1;k<n;k++)
    //                 if(nums[i] < nums[j] && nums[j] > nums[k] && nums[i] < nums[k]) return true;
    //         }
    //     }
    //     return false;
    // }
    
    bool solution(vector<int>& nums){
        //current k
        int curMin = nums[0];
        stack<pair<int,int>> s; //<num,minBeforeNum>
        for(int i = 1;i<nums.size();i++){
            //nums[i] repersent the j
            //and top will be our k and check min before k
            while(!s.empty() && nums[i] >= s.top().first){
                //finding the k before j
                s.pop();                
            }
            
            //checking the top elements of the stack
            if(!s.empty() && s.top().second < nums[i]) return true;
            
            //checking 
            //push to stack
            s.push({nums[i],curMin});
            curMin = min(nums[i],curMin);
        }
        return false;
    }
    
};
```

