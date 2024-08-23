---
title: "[Leetcode] Game of Life(Medium)"
date: 2022-04-12T19:15:53+08:00
draft: false
tags:
    - array
categories:
    - leetcode
---

## LeetCode 289 -  Game of Life
According to Wikipedia's article: "The Game of Life, also known simply as Life, is a cellular automaton devised by the British mathematician John Horton Conway in 1970."

The board is made up of an m x n grid of cells, where each cell has an initial state: live (represented by a 1) or dead (represented by a 0). Each cell interacts with its eight neighbors (horizontal, vertical, diagonal) using the following four rules (taken from the above Wikipedia article):

1. Any live cell with fewer than two live neighbors dies as if caused by under-population.
2. Any live cell with two or three live neighbors lives on to the next generation.
3. Any live cell with more than three live neighbors dies, as if by over-population.
4. Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
  
The next state is created by applying the above rules simultaneously to every cell in the current state, where births and deaths occur simultaneously. Given the current state of the `m x n` grid board, return the next state.

example
```
Input: board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]
Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
```
```
Input: board = [[1,1],[1,0]]
Output: [[1,1],[1,1]]
```

## How can we solve this problem?
要解決這個，我們需要知道目前的cell的狀態(活/死)。要知道目前cell的狀態，我們可以用過條件判斷他身邊的cells(最多9個細胞)即可。
<!-- For solving this problem, we need to know what the current cell state is``(dead or alive)``. After that,we just need to check its neighbor `cell' s` state by the rules to determine the cell state. Because the maximum number of its neighbor cells is 9, from top to bottom and left to right. So, we can simply use some conditions to check. -->

<!-- ## The solving steps:
1. iterate the array and check the cell state.
2. Get the new state of the cell by applying the 4 rules -->
#### Solution:
```c++
class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        int n = board.size();
        int m = board[0].size();
        vector<vector<int>> res(n,vector<int>(m,0));
        
        //O(N^2 for checking each cells) : time
        //O(N^2 for storing new cells states) : space
        for(int i = 0;i<n;i++){
            for(int j = 0;j<m;j++){
                int total = checkState(board,i,j,n,m);
                if(board[i][j] == 1) res[i][j] = (total < 2 || total > 3 ) ? 0 : 1;
                else res[i][j] = total == 3 ? 1 : 0;
            }
        }
        board = res;
    }
    
    int checkState(vector<vector<int>>& board,int i,int j,int n,int m){
        
        // //neighbors bounds
        // int rowStart = (i - i) < 0 ? 0 : i - 1; 
        // int rowEnd = (i + 1) > n - 1 ? n - 1 : i + 1;
        // int colStart = (j - 1) < 0 ? 0 : j - 1;
        // int colEnd = (j + 1) > m - 1 ? m - 1 : j + 1;

        int livesCells = 0;
    
        //top left
        if(i - 1 >= 0 && j -1 >= 0){
            livesCells += board[i-1][j-1];
        }
        
        //top
        if(i - 1 >= 0){
            livesCells += board[i-1][j];
        }
        
        //top right
        if(i - 1 >= 0 && j + 1 < m){
            livesCells += board[i-1][j + 1];
        }
        
        //left
        if(j - 1 >= 0){
            livesCells += board[i][j - 1];
        }
        
        //right
        if(j + 1 < m){
            livesCells += board[i][j + 1];
        }
        
        //bottom left
        if(i + 1 < n && j - 1 >= 0){
            livesCells += board[i+1][j-1];
        }
        
        //bottom
        if(i + 1 < n ){
            livesCells += board[i+1][j];
        }
        
        //bottom right
        if(i + 1 < n && j + 1 < m){
            livesCells += board[i+1][j+1];
        }
        return livesCells;
    }
};
```


