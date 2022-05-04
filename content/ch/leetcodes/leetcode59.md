---
title: "Spiral Matrix II(medium)"
date: 2022-04-13T14:26:29+08:00
draft: false
tags:
    - array
categories:
    - leetcode
---

## LeetCode 59 -  Spiral Matrix II
Given a positive integer n, generate an n x n matrix filled with elements from 1 to n<sup>2</sup> in spiral order.

example
```
Input: n = 3
Output: [[1,2,3],[8,9,4],[7,6,5]]

Input: n = 1
Output: [[1]]
```

## How can we solve this problem?
First thing first, let's  think about how we can insert a number into an array spirally? Can we just simply set a boundary of row and column to limit its inserted direction? <span style="color:red">YES! You Can!</span> Let me explain how it works. According to the example, we can find out its moving pattern(`top-left to top-right`,`top-right to bottom-right`,`bottom-right to bottom-left` and `bottom-left to top left`), it always follows these 4 moving patterns, so that we can define a boundary of row and column to limit pointer moving to has inserted a number. Until reaching n<sup>2</sup>, it will break the loop and return the answer.

## The solving steps:
1. Define the upper boundary, lower boundary of row and column.
2. Follow the moving pattern(`top-left to top-right`,`top-right to bottom-right`,`bottom-right to bottom-left` and `bottom-left to top left`) and update upper boundary, lower boundary depending on what moving pattern it has done.
3. Until reaching n<sup>2</sup>, then return the answer


```c++
class Solution {
public:
    vector<vector<int>> generateMatrix(int n) {
        //total step n^2
        vector<vector<int>> res(n,vector<int>(n,0));
        int c = 1;
        int upperRow = 0,lowerRow = n - 1;
        int upperCol = 0,lowerCol = n - 1;
        while(c <= n*n){
            //moving left
            if(upperCol <= lowerCol){
                //n step
                for(int i = upperCol;i<=lowerCol;i++){
                    res[upperRow][i] = c++;
                }
            }
            upperRow ++; //moving down
            
            //moving down
            if(upperRow <= lowerRow){
                for(int i = upperRow;i<=lowerRow;i++){
                    res[i][lowerCol] = c++;
                }
            }
            lowerCol--;
            
            //moving right
            if(lowerCol >= upperCol){
                for(int i = lowerCol;i>=upperCol;i--){
                    res[lowerRow][i] = c++;
                }
            }
            lowerRow --;
            //moving up
            if(lowerRow >= upperRow){
                for(int i = lowerRow;i>=upperRow;i--){
                    res[i][upperCol] = c++;
                }
            }
            upperCol ++;
            
        }     
        return res;
    }
};
```


