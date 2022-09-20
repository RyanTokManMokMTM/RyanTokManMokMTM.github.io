---
title: "[Leetcode] Trapping Rain Water(Hard)"
date: 2022-09-18T14:29:08+08:00
draft: false
tags:
    - array
    - dp
categories:
    - leetcode
---

## LeetCode 42 - Trapping Rain Water
Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.
example
```
Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.
```

```
Input: height = [4,2,0,3,2,5]
Output: 9
```

## How can we solve this problem?
這題是給定一個`array`代表著**高度**，問我們一共可以裝多少水。這題的解題思路，假設當前是`i`,那我當前這個`i`是否可以裝水呢？我們是是不是要知道`i`的左手邊的最高的柱子(`x`)和最右手邊的最高的柱子(`y`)，那跟柱子比較矮而且是不是大於現在這個`i`。假設`IFF x < y && x > i`,哪`i`可以裝的水就會是`x - i`那麼多。所以說，我們必須要知道當前`i`的左邊最高和`i`的右邊最高是多少。哪要怎麼做呢？我們可以透過預處理的方式，預先計算左手邊(`i之前`)最大值以及右手邊(`i之後`)的最大值，然後在根據以上的方法即可解出答案。
#### Solution:

```c++
class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        
        /*
        how can we solve this problem?
        
        [i] can trap water ?? 
        it determin the min(maxinum number [0..i] ,maxinum number [i...n-1])
        but the problem is 
        how can we know what is the maxinum height before i?[0...i] //maybe itself is the local maxinum height
        and 
        how can we know what is the maxinum height after i ?// /maybe itself is the local maxinum height
        
        pre-calculating the left and the right??
        */
        
        vector<int> leftHeight(n,0);
        vector<int> rightHeight(n,0);
        
        //init case ->the first height is the maxinum heigh of left height 
        //init case ->the last height is the maxinum heigh of right height
        
        leftHeight[0] = height[0];
        rightHeight[n-1] = height[n-1];
        
        //precalculating step
        for(int i = 1;i<n;i++) leftHeight[i] = max(leftHeight[i-1],height[i]); //current i is the heigher one ?
        for(int i = n-2;i >= 0;i--) rightHeight[i] = max(rightHeight[i+1],height[i]);
        
        int res = 0;
        //calculating trapping water
        for(int i = 1;i<n-1;i++){ //the first height and the last height can't trap any water
            res += min(leftHeight[i],rightHeight[i]) - height[i];
        }
        
        
        return res;
    }

};
```


