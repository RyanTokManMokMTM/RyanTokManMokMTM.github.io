---
title: "[LeetCode] Remove All Adjacent Duplicates in String II(MEDIUM)"
date: 2022-05-06T21:19:25+08:00
draft: false
tags:
    - string
    - stack
categories:
    - leetcode
---

## LeetCode 1209 - Remove All Adjacent Duplicates in String II
You are given a string `s` and an integer `k`, a `k` **duplicate removal** consists of choosing `k` adjacent and equal letters from `s` and removing them, causing the left and the right side of the deleted substring to concatenate together.

We repeatedly make `k` duplicate removals on `s` until we no longer can.

Return the final string after all such duplicate removals have been made. It is guaranteed that the answer is unique.

example
```
Input: s = "abcd", k = 2
Output: "abcd"
Explanation: There's nothing to delete.
```
```
Input: s = "deeedbbcccbdaa", k = 3
Output: "aa"
Explanation: 
First delete "eee" and "ccc", get "ddbbbdaa"
Then delete "bbb", get "dddaa"
Finally delete "ddd", get "aa"
```
```
Input: s = "pbbcggttciiippooaais", k = 2
Output: "ps"
```

## How can we solve this problem?
這題就是要我們刪除掉在String裡面某些相鄰且相同並重複了`k`次的**Characters**。例如: `aeee`,`k=3`，輸出`a`。如果我們要解決這個問題就要知道目前string裡面有哪些`subString`符合條件，但是這裡要注意一個問題就是**有些Substring被移除後，會使前(刪除Str)後2個substring符合條件**。例如:`aeeeaa`,但我們刪除`eee`後,`aaa`也會符合條件，因此會被移除。

哪我們要怎麼知道哪些characters符合條件呢?  
這裡我們可以使用`Stack/Array`來幫組我們解題。為什麼是用`Stack`? 因為我們只需要關注當前`str[i]`是否與前一個`str[i-1]`一致,如果是一致的我們會加入到`Stack.top`的Counter裡面。只要Counter的值為`k`我們就知道是符合條件的*String*，移除即可。最後，把`Stack/Array`裡面剩餘的元素串接就可以得出最後答案(**注:Stack元素串接需要Reverse結果**)。

#### Solution:

```c++
class Solution {
public:
    string removeDuplicates(string s, int k) {
        if(s.length() < k) return s;
        
        string res;
        vector<pair<char,int>> counter;
        //O(n)
        for(auto str : s){
            //how many same character
            if(counter.empty() || counter.back().first != str) counter.push_back({str,1});
            else{
                counter.back().second++;
            }
            
            if(counter.back().second == k) counter.pop_back();
        }
        // for(auto e:vc) cout << e;
        //O(i*k <= n ) => O(n);
        for(int i = 0;i<counter.size();i++){
            for(int j = 0;j<counter[i].second;j++)
                res+=counter[i].first;
        }
        
        cout << res <<endl;
        return res;
    }
};
```


