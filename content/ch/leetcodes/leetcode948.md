---
title: "[Leetcode] Bag of Tokens(MEDIUM)"
date: 2022-09-12T18:01:44+08:00
draft: false
tags:
    - array
    - greedy
    - sort
    - two pointer
categories:
    - leetcode
---
## LeetCode 948 - Bag of Tokens

You have an initial **power** of `power`, an initial **score** of `0`, and a bag of `tokens` where `tokens[i]` is the value of the i<sup>th</sup> token (0-indexed).

Your goal is to maximize your total **score** by potentially playing each token in one of two ways:

* If your current **power** is at least `tokens[i]`, you may play the i<sup>th</sup> token face up, losing `tokens[i]`**power** and gaining `1`a score.
* If your current **score** is at least `1`, you may play the i<sup>th</sup> token face down, gaining `tokens[i]` **power** and losing `1` **score**.
Each token may be played **at most** once and **in any order**. You do **not** have to play all the tokens.

Return *the largest possible **score** you can achieve after playing any number of tokens*.

example
```
Input: tokens = [100,200], power = 150
Output: 1
Explanation: Play the 0th token (100) face up, your power becomes 50 and score becomes 1.
There is no need to play the 1st token since you cannot play it face up to add to your score.
```
```
Input: tokens = [100,200,300,400], power = 200
Output: 2
Explanation: Play the tokens in this order to get a score of 2:
1. Play the 0th token (100) face up, your power becomes 100 and score becomes 1.
2. Play the 3rd token (400) face down, your power becomes 500 and score becomes 0.
3. Play the 1st token (200) face up, your power becomes 300 and score becomes 1.
4. Play the 2nd token (300) face up, your power becomes 0 and score becomes 2.
```

## How can we solve this problem?
這題的解題思路是這樣透過貪心(`gready`),也就是說我能用多少`power`換分就用多少，如果不夠了我就用分換`power`。換句話說，就是先從最低的`token`開始換,直到足夠的`power`後，就以分來換取最高的`power`,直到不符合條件未知或者沒有任何`token`可以買為止。  
*因為要知道當前最大和最小，所以要先排序*
#### Solution:
```c++
class Solution {
public:
    int bagOfTokensScore(vector<int>& tokens, int power) {
        //maxinum 
        if(tokens.empty())return 0;
        int score = 0;
        sort(tokens.begin(),tokens.end());
        /*
        strategy: get the mininum token
        if not enough -> get maxinum token
        if it has enough power -> get this token
        */
        int i = 0;
        int j = tokens.size() - 1;
        int res = 0;
        while(i <= j){
            if(power >= tokens[i]){
                score += 1;
                power -= tokens[i++];
                res = max(res,score);
            }else if(score > 0){
                score -= 1;
                power += tokens[j--];
            } else break;
        }
        
        return res;
    }
};

```



