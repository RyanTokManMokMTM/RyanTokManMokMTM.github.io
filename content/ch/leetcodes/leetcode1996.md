---
title: "[Leetcode] The Number of Weak Characters in the Game(MEDIUM)"
date: 2022-09-09T23:36:50+08:00
draft: false
tags:
    - array
    - stack
categories:
    - leetcode
---


## LeetCode 1996 - The Number of Weak Characters in the Game

You are playing a game that contains multiple characters, and each of the characters has **two** main properties: **attack** and **defense**. You are given a 2D integer array `properties` where `properties[i] = [attacki, defensei]` represents the properties of the i<sup>th</sup> character in the game.

A character is said to be **weak** if any other character has **both** attack and defense levels **strictly greater** than this character's attack and defense levels. More formally, a character `i` is said to be **weak** if there exists another character `j` where attack<sub>j</sub> attack<sub>i</sub> and defense<sub>j</sub> > defense<sub>i</sub>.

Return *the number of **weak** characters*.

example
```
Input: properties = [[5,5],[6,3],[3,6]]
Output: 0
Explanation: No character has strictly greater attack and defense than the other.
```
```
Input: properties = [[2,2],[3,3]]
Output: 1
Explanation: The first character is weak because the second character has a strictly greater attack and defense.
```

## How can we solve this problem?
這題就是要我們找出多少個**弱角色(會被攻擊的人)**。對於這種包含了2個維度資訊的題目(`attack`,`defense`)，直接藉並不好解，所以，通常我們都會**固定一個維度**去解**另外一個維度**，這樣就會相對容易許多。  

這題我們可以透過固定`attack`這個維度。因為我們知道高`attack`的可以攻擊低`attack`d的人。所以我們根據`attack`做排序。這樣`attack`就會是單調遞增排序。我們自然就可以不讓管這個維度(因為已經符合   *attack<sub>i</sub> < attack<sub>j</sub>*  這個條件)。之後我們只需要處理`defense`這個維度就可以了。

`defense`這個維度必須以單調遞減的方式處理! 為什麼呢?  
假設 *Attack* : `[[1,1],[1,2],[2,4]]` -> 這裡會有2個attack為1的角色。如果不以遞減的方式除了,這樣就會不符合條件(**相同attack不能互打**)。所以一遞減方式會變成這樣`[[1,2],[1,1]...]`，這樣一來就能避免互打的情況

解決完維度問題後，就很簡單了，只需要透過`stack`就可以知道有多少個人被攻擊了。只要進來的人`defense`的比`stack top`的人`defense` 大就`+1`即可。

#### Solution:
```c++
class Solution {
public:
    int numberOfWeakCharacters(vector<vector<int>>& pro) {
        //[attacki, defensei]
        sort(pro.begin(),pro.end(),[&](auto &a1,auto &a2){
            if(a1[0]==a2[0]){
                return a1[1]>a2[1];
            }
            return a1[0]<a2[0];
        });
        /*
        3: 6
        5: 5
        6: 3
        */

        /*
        get the maxinum defense value from previous group 
        if previous group defense value is greater the current group characteri -> this guy is the weak one
        in this case: [9,1] is a weak character
        [10,5] ->[9,1]
        [10,4] ->[9,1]
        [10,3] ->[9,1]
        [10,2] ->[9,1]
        
        [9,2] is a weak character
        [10,5] ->[9,3]
        [10,4] ->[9,3]
        */
        int res = 0;
        stack<int> s;
        for(int i = 0;i<pro.size();i++){
            while(!s.empty() && s.top() < pro[i][1]){
                s.pop();
                res++;
            }
            s.push(pro[i][1]);
        }

        
        return res;
    }
};
```



