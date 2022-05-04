---
title: "[Leetcode] Baseball Game(EASY)"
date: 2022-04-10T19:15:31+08:00
draft: false
tags:
    - array
    - stack
categories:
    - leetcode
---

## LeetCode 682 - Baseball Game

You are keeping score for a baseball game with strange rules. The game consists of several rounds, where the scores of past rounds may affect future rounds' scores.

At the beginning of the game, you start with an empty record. You are given a list of strings ops, where ops[i] is the ith operation you must apply to the record and is one of the following:
1. An integer x - Record a new score of x.
2. "+" - Record a new score that is the sum of the previous two scores. It is guaranteed there will always be two previous scores.
3. "D" - Record a new score that is double the previous score. It is guaranteed there will always be a previous score.
4. "C" - Invalidate the previous score, removing it from the record. It is guaranteed there will always be a previous score.
Return the sum of all the scores on the record.

example
```
Input: ops = ["5","2","C","D","+"]
Output: 30
Explanation:
"5" - Add 5 to the record, record is now [5].
"2" - Add 2 to the record, record is now [5, 2].
"C" - Invalidate and remove the previous score, record is now [5].
"D" - Add 2 * 5 = 10 to the record, record is now [5, 10].
"+" - Add 5 + 10 = 15 to the record, record is now [5, 10, 15].
The total sum is 5 + 10 + 15 = 30.

Input: ops = ["5","-2","4","C","D","9","+","+"]
Output: 27
Explanation:
"5" - Add 5 to the record, record is now [5].
"-2" - Add -2 to the record, record is now [5, -2].
"4" - Add 4 to the record, record is now [5, -2, 4].
"C" - Invalidate and remove the previous score, record is now [5, -2].
"D" - Add 2 * -2 = -4 to the record, record is now [5, -2, -4].
"9" - Add 9 to the record, record is now [5, -2, -4, 9].
"+" - Add -4 + 9 = 5 to the record, record is now [5, -2, -4, 9, 5].
"+" - Add 9 + 5 = 14 to the record, record is now [5, -2, -4, 9, 5, 14].
The total sum is 5 + -2 + -4 + 9 + 5 + 14 = 27.
```

## How can we solve this problem?
這題就是一個簡單的籃球比賽模擬。我們只要關心遊戲rule，並透過額外的container(`array/stack`)進行分數保存即可。
<!-- This question is simply simulating a baseball game. We just need to care about games rules and store the score separately into any container like `array` or `stack`. -->

<!-- ## The solving steps:
1. iterate整個array並以遊戲rule作為計算條件
2. 保存對應分數到`stack`/`array`
3. 返回整個`array`/`stack`的總和 -->
<!-- 1. iterate the array and determine the score by applying the game rules.
2. store the score into a `stack` or `array`
3. return sum up numbers storted in the container. -->
#### Solution:
```c++
class Solution {
public:
    int calPoints(vector<string>& ops) {
        //ops : + D C x
        // vector<int> s; //or using a stack 
        stack<int> sk; //O(n)
        //O(n)
        for(auto i : ops) {
            if(i == "+"){
                
                int a = sk.top();
                sk.pop();
                
                int b = sk.top();
                sk.push(a);
                
                sk.push(a+b);
            }else if(i == "D"){
                sk.push(sk.top() * 2);
            }else if(i == "C"){
                sk.pop();
            }else{
                sk.push(stoi(i));
            }
        }
        
        int res = 0;
        
        //O(n)
        while(!sk.empty()){
            res += sk.top();sk.pop();
        } 
        return res;
    }
};
```


