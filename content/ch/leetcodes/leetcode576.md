---
title: "Out of Boundary Paths"
date: 2022-07-16T10:18:43+08:00
draft: true
---

## LeetCode 5 - Longest Palindromic Substring
There is an m x n grid with a ball. The ball is initially at the position [startRow, startColumn]. You are allowed to move the ball to one of the four adjacent cells in the grid (possibly out of the grid crossing the grid boundary). You can apply at most maxMove moves to the ball.

Given the five integers m, n, maxMove, startRow, startColumn, return the number of paths to move the ball out of the grid boundary. Since the answer can be very large, return it modulo 109 + 7.

 
example
```
Input: s = "babad"
Output: "bab"
Explanation: "aba" is also a valid answer.
```

```
Input: s = "cbbd"
Output: "bb"
```

## How can we solve this problem?



