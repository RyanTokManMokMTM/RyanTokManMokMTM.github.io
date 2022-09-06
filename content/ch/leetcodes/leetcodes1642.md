---
title: "[Leetcode] Furthest Building You Can Reach(MEDIUM)"
date: 2022-06-21T22:55:43+08:00
draft: false
tags:
    - array
    - heap
    - priority queue
    - greedy
categories:
    - leetcode
---

## LeetCode 1642 - Furthest Building You Can Reach
You are given an integer array `heights` representing the heights of buildings, some `bricks`, and some `ladders`.

You start your journey from building `0` and move to the next building by possibly using bricks or ladders.

While moving from building `i` to building `i+1` (**0-indexed**),

* If the current building's height is **greater than or equal** to the next building's height, you do not need a ladder or bricks.
* If the current building's height is **less than** the next building's height, you can either use one ladder or `(h[i+1] - h[i])` bricks.
*Return the furthest building index (0-indexed) you can reach if you use the given ladders and bricks optimally.*

example:  
```
Input: heights = [4,2,7,6,9,14,12], bricks = 5, ladders = 1
Output: 4
Explanation: Starting at building 0, you can follow these steps:
- Go to building 1 without using ladders nor bricks since 4 >= 2.
- Go to building 2 using 5 bricks. You must use either bricks or ladders because 2 < 7.
- Go to building 3 without using ladders nor bricks since 7 >= 6.
- Go to building 4 using your only ladder. You must use either bricks or ladders because 6 < 9.
It is impossible to go beyond building 4 because you do not have any more bricks or ladders.
```
```
Input: heights = [4,12,2,7,3,18,20,3,19], bricks = 10, ladders = 2
Output: 7
```
```
Input: heights = [14,3,19,3], bricks = 17, ladders = 0
Output: 3
```

## How can we solve this problem?
這個要我們解決的問題是給定一定數量的磚塊`brick`和梯子`ladder`,問我們最遠能到達哪一棟建築(`array index`)。 我們主要注意的是題目給定的幾個限制條件。  
* 如果`i+1`的建築比`i`建築矮,我們可以不用任何磚塊(`bricks`)或者梯子`ladders`
* 如果`i+1`的建築比`i`建築搞，我們必須使用一個梯子`ladders`或者`(h[i+1] - h[i])`個磚塊(`bricks`)

從這裡我們可以看到梯子`ladders`無論建築有多高，我們都可以到達。相反磚塊(`bricks`)則需要數量。所以，我們要解決這個問題會優先考慮使用梯子`ladders`。如果梯子`ladders` 使用完畢，我們可以將前面2個建築之間高度最小的梯子`ladders`回收,使用磚塊(`bricks`)取代。如果磚塊(`bricks`)也不夠或者超出提供的數量，就代表我們最遠可以到達的建築為`i-1`(*因為`i`建築,我們沒有足夠的磚塊`brick`和梯子`ladder`*)。**如果梯子的數量跟建築的數量一樣多,直接回傳最後一棟(`n-1`)即可**。

#### Solution:
```c++
class Solution {
public:
    int furthestBuilding(vector<int>& h, int bricks, int ladders) {
        //Using all ladders first
        //if there is no other ladders,we try to use bricks(mininum one) instead of a ladder
        
        //if there have enough ladders
        //just return n-1(index)
        priority_queue<int, vector<int>, greater<int>> laddersUsed; //min heap
        
        //O(n*log l(min Head insert))
        for(int i = 1;i<h.size();i++){
            //use all ladders
            int climbingHeigh = h[i] - h[i-1];
            if(climbingHeigh <= 0) continue; //we can climb it
            laddersUsed.push(climbingHeigh);
            
            //our ladder is enough?
            if(laddersUsed.size() <= ladders) continue;
            
            //our ladder is not enough
            //try to use bricks to instead if our bricks is not enough too,return previous index(neither bricks nor ladders can reach ith building)
            bricks -= laddersUsed.top();
            laddersUsed.pop();
            if(bricks < 0) return i-1;
        }
        return h.size() - 1;
    }
    
    
    //Time Exceed
    // int dfs(vector<int>& h,int i,int bricks, int ladders){
    //     if(bricks < 0 || ladders < 0) return i-1;
    //     // if(bricks == 0 && ladders == 0) return i;
    //     if(i == h.size()-1) return i;
    //     int res = 0;
    //     if(h[i] > h[i+1]) {
    //         res = solution(h,i+1,bricks,ladders);
    //     }else{
    //         //either bricks ladders 
    //         int bricksCase = solution(h,i+1,bricks - (h[i+1]-h[i]),ladders);
    //         int laddersCase = solution(h,i+1,bricks,ladders-1);
    //         res = max(bricksCase,laddersCase);
    //     } 
    //     return res;
    // }
};
```

