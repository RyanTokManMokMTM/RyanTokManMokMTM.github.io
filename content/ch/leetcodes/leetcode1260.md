---
title: "Shift 2D Grid(easy)"
date: 2022-04-13T19:14:44+08:00
draft: false
tags:
    - array
    - math
categories:
    - leetcode
---

## LeetCode 1260 -  Shift 2D Grid
Given a 2D grid of size m x n and an integer k. You need to shift the grid k times.

In one shift operation:

* Element at grid[i][j] moves to grid[i][j + 1].
* Element at grid[i][n - 1] moves to grid[i + 1][0].
* Element at grid[m - 1][n - 1] moves to grid[0][0].
  
Return the 2D grid after applying shift operation k times.

example
```
Input: grid = [[1,2,3],[4,5,6],[7,8,9]], k = 1
Output: [[9,1,2],[3,4,5],[6,7,8]]

Input: grid = [[3,8,1,9],[19,7,2,5],[4,6,11,10],[12,0,21,13]], k = 4
Output: [[12,0,21,13],[3,8,1,9],[19,7,2,5],[4,6,11,10]]

Input: grid = [[1,2,3],[4,5,6],[7,8,9]], k = 9
Output: [[1,2,3],[4,5,6],[7,8,9]]
```

## How can we solve this problem?
This question is easy, but we need to care about the last column of the grid if it right-shifts to the first column of the grid, the last element of this column becomes the first and the others will move down by 1 step. In order to solve this question, we can use math to help us:  
**n is the row size and m is the column size**  
1. left-shifting : `currentColum + k % n, moving by k step`
2. shifting row : 
   1. `(j + k) / n), if it is in the last column, (j + k) / m will be 1. Otherwise will be 0`
   2. total row shifting step : `(i + (j + k) / n)) % m`. For example, suppose n = 3 , j = 2 , m = 3 and i = 2: `(2 + ((2+1)/3)) % 3 = 0` so that it will move to `[0][0]`

## The solving steps:
1. iterate the array and apply the formula to calumniate new row and column index.
2. store the number to the new new row and column index

```c++
class Solution {
public:
    vector<vector<int>> shiftGrid(vector<vector<int>>& grid, int k) {
        //just be careful the last element on [m-1][n-1]
        //n - k
        int n = grid.size();
        int m = grid[0].size();
        vector<vector<int>> res(n,vector<int>(m,0));
        for(int i = 0 ;i<n;i++){
            for(int j = 0;j<m;j++){
                //here we need to know how many time does the colums j pass the col 0,then we need to movie the i of that time
                // (j + k) % m => total time walk passed
                int moveJ = (j + k) % m; //if current moving j is the last one
                int walkPassedZeorTimes = (j + k)/m;
                int moveI = (i + walkPassedZeorTimes) % n;
                res[moveI][moveJ] = grid[i][j];
            }
        }
        return res;
    }
};
```


