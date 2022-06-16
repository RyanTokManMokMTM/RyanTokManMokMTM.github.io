---
title: "[Leetcode] Longest Palindromic Substring(MEDIUM)"
date: 2022-06-16T14:09:50+08:00
draft: false
tags:
    - string
    - dynamic programming
categories:
    - leetcode
---

## LeetCode 5 - Longest Palindromic Substring
Given a string s, return the longest palindromic substring in s.

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
要解決這題，我們必須要先知道什麼是Palindrome。可以參考這篇文章[Palindromic string迴文](/leetcodenotes/palindromicstring)。而這題要我們找出在給定string中,找到最長的Palindrome。我們可以透過以每個單一字元(`index i`)以及倆個字元(`index i`,`index i+1`)為中心點，並擴展`left,right`找出他們的局部的最長Palindrome為多少，然後根據這個長度計算`starting point i`以及記錄長度`len`,最後以`starting point`和`len`得出字串中`str[startingPoint,len]`為解。
#### Solution:
```c++
class Solution {
public:
    string longestPalindrome(string s) {
        /*
        Using an easy solution
        
        "babad" 
        finding all posible palindrome string starting at index i(mid point)
        odd case:
        i-1 i i+1 ? Palindrome
        i-2 i-1 i i+1 i+2  ?Palindrome
        
        what about even case.We're simply starting at index i and i+1
        i-1 [i,i+1] i+2 ?Palindrome
        */
        int n = s.length();
        int len = 0;
        int startPoint = 0;
        //O(n * n(finding Palindrome))
        
        
        for(int i = 0;i<n;i++){
            int cur = max(getLen(s,i,i,n),getLen(s,i,i+1,n)); // which one is longest? odd or even
            if(cur > len){
                //update our len and starting point
                len = cur;
                startPoint = i - (len-1)/2; //(len-1) for even case 
                //suppose the len is 3 and the index is 1 ,then the starting point will be 1 - (3-1)/2 => 0-> len str[0...2]
                //suppose the len is 4 and the index is 1 ,then the starting point will be 1 - (4-1)/2 => 0-> len str[0...2]
            }
        }
        
        return s.substr(startPoint,len);
    }
    
    //str[i..j] is our middle point of Palindrome
    int getLen(string&str,int i,int j,int n){
        //left(i) right(j)
        while(i>=0 && j<n && str[i] == str[j]){
            i--;
            j++;
        }


        //string at i+1 and getting
        //|y|x2|x1|x|x1|x2|y| => the length of this string is l - r + 1 -(out of bounds of both i and j => 2) => l-r-1
        return j-i-1; //string at i+1(is decreased from the loop),total
    }
};
```


