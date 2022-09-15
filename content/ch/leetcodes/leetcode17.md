---
title: "[Leetcode] Letter Combinations of a Phone Number(Medium)"
date: 2022-05-09T21:50:34+08:00
draft: false
tags:
    - string
    - recursion
    - back-tracking
categories:
    - leetcode
---

## LeetCode 17 - Letter Combinations of a Phone Number
Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

A mapping of digit to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.


example
```
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

```
Input: digits = ""
Output: []
```

```
Input: digits = "2"
Output: ["a","b","c"]
```
## How can we solve this problem?
這題是要我們拿到`Input`的數字所能組合出所有字串。解法也很簡單，我們可以透過`Map`記錄每個數字代表來那些字符，然後再透過**Back-tracking**技巧來幫助我們組合字串。你有可能會問什麼是**Back-tracking**。簡單來說就是一個**Recursive Function**,但他會迴避一些不正常的數值。比如:"abc",而"abc"可能不是我們要的。因此退回上一步的"ab",並嘗試其他數值/結果。
#### Solution:

```c++
class Solution {
    unordered_map<char,string> temp = {
        {'2',"abc"},
        {'3',"def"},
        {'4',"ghi"},
        {'5',"jkl"},
        {'6',"mno"},
        {'7',"pqrs"},
        {'8',"tuv"},
        {'9',"wxyz"}
        };
public:
    vector<string> letterCombinations(string digits) {
        vector<string> res;
        if(digits.length() == 0) return res;
        solution(res,0,digits,"");
        return res;
    }
    
    void solution(vector<string>& res,int index,string &digits,string phone){
        if(index == digits.length()){
            res.push_back(phone);
            return;
        }
        
        auto numList = temp[digits[index]];
        for(int i = 0;i<numList.length();i++){
            phone += numList[i];
            solution(res,index+1,digits,phone);
            phone.pop_back();
        }
    }
};
```


