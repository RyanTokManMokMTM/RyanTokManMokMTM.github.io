---
title: "[Leetcode] Backspace String Compare(Easy)"
date: 2022-05-01T17:52:25+08:00
draft: false
tags:
    - string
categories:
    - leetcode
---


## LeetCode 844 - Backspace String Compare
Given two strings s and t, return true *if they are equal when both are typed into empty text editors*. `'#'` means a backspace character.

Note that after backspacing an empty text, the text will continue empty.

example:  
```
Input: s = "ab#c", t = "ad#c"
Output: true
Explanation: Both s and t become "ac".
```
```
Input: s = "ab##", t = "c#d#"
Output: true
Explanation: Both s and t become "".
```
```
Input: s = "a#c", t = "b"
Output: false
Explanation: s becomes "c" while t becomes "b".
```

## How can we solve this problem?
這題主要要什麼比較2個String移除於`#`前的字符後是否為相同的String，就相當於`Backspace(#) 字符`。
這題有2種解法:  
1. 要使用到額外的空間，保存2個移除字符後的String再進行比較。
2. 透過pointer`r`的方式來決定哪個位置是要被移除的，然後將之後的字符將其進行取代，最後在比較倆者在`r`長度內的字符是否相同，即可。可見下圖為例:
![844-help](/images/leetcodesHelper/844-helper.png)


<!-- ## The solving steps:
1. 定義2個的pointer，用於決定各String在移除characters後的最後長度
2. 如果2個pointer的長度值不是一樣的，就代表2個String結果不一樣，return false即可
3. 如果長度一樣只需比較`r`長度內的各個characters一直即可 -->
#### Solution:
```c++
class Solution {
public:
    bool backspaceCompare(string s, string t) {
        int slen = s.length();
        int tlen = t.length();
        int i = 0;
        int rpSStrIndex = 0;
        while(i < slen ){
            if(s[i] == '#') {
                if(rpSStrIndex > 0) rpSStrIndex--;
            }
            else s[rpSStrIndex++] = s[i];
            i++;
        }
        
        i = 0;
        int rpTStrIndex = 0;
        while(i < tlen){
            if(t[i] == '#' ){
               if(rpTStrIndex > 0) rpTStrIndex--;
            } 
            else t[rpTStrIndex++] = t[i];
            i++;
        }
        cout << rpSStrIndex << rpTStrIndex;
        //there length is not same
        if(rpSStrIndex != rpTStrIndex) return false;
        
        //compare each string between replaced Index
        for(i = 0;i<rpSStrIndex;i++){
            if(s[i] != t[i]) return false;
        }
        
        return true;
    }
};
```


