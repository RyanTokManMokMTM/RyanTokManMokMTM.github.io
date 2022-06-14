---
title: "[Leetcode] Delete Operation for Two Strings(MEDIUM)"
date: 2022-06-14T13:37:49+08:00
draft: true
tags:
    - dynamic programming
    - LCM
categories:
    - leetcode
---


## LeetCode 583 - Delete Operation for Two Strings
Given two strings `word1` and `word2`, return the minimum number of steps required to make `word1` and `word2` the same.

In one `step`, you can delete exactly one character in either string
example
```
Input: word1 = "sea", word2 = "eat"
Output: 2
Explanation: You need one step to make "sea" to "ea" and another step to make "eat" to "ea".
```

```
Input: word1 = "leetcode", word2 = "etco"
Output: 4
```

## How can we solve this problem?
這題要我們解決的問題是給定2個字串`Word1`和`Word2`,每次從`Word1`或者`Word2`中移除1個Character，問我們最少需要多少步使得2個string一樣。  
首先,我們需要先知道這2個`Word`有哪些Character的是一致的。為了能獲得他們之間的最長共同子字串，我們可以透過`Longest Commond Substring`來得到他們之間共同子字串的長度，只要每個字串的長度減去LCM的長度，就可以知道各自需要多少步。最後相加起來即可。  
[Longest Commond Substring Template](/leetcodenotes/lcm) 

#### Solution:

```c++
class Solution {
public:
    int minDistance(string word1, string word2) {
        int size =  longestCommonSubStr(word1,word2);
        int n = word1.length();
        int m = word2.length();
        //now we know the longest common substr size
        //we can use this information to calculate total step to remove character
        //n - LCM size => total character we need to remove for string A to get the common sub string
        //m - LCM size => total character we need to remove for string B to get the common sub string
        return (n - size) + (m - size);
    }
    
    int longestCommonSubStr(string &s1, string &s2){
        
        /*
        How it work
        
        Compare both 2 string to get the longest command sub string 
        for example:
        "sea", word2 = "eat"
        starting compare with string 2 
        suppose i index for string 1
        suppose j index for string 2
        
        find what is the logest command substring within 0...i and 0...j
        i=2 -> 0...2 => sea
        j=1 -> 0...1 => ea
        the longest command substring is 2, "ea"
        
        detail
        define a memo or dp to record each local ans
        dp[i for string a][j for string b]
        
        dp[1][1] = "s","e" LCS is? 0
        dp[1][2] = "s","ea" LCS is? 0
        dp[1][3] = "s","eat" LCS is? 0
        
        dp[2][1] = "se" , "e" = 1 
        dp[2][2] = "se" , "ea"  = 1
        dp[2][3] = "se" , "eat" = 1
        
        dp[3][1] = "sea" , "e" = 1 from dp[2][1]=1 | dp[3][0]=0
        dp[3][2] = "sea" , "ea"  = 2 from dp[2][1] +1 => a must be inside the LCS = 1 + the previous step i-1,j-1
        dp[3][3] = "sea" , "eat" = 2 from dp[2][3] = 1| dp[3][2] = 2
        
        the ans of  "sea", "eat" is 2 
        */
        
        
        int n = s1.length();
        int m = s2.length();
        
        //init dp
        //str:0,str:0 -> LCS still 0
        vector<vector<int>> dp(n+1,vector<int>(m+1,0));
        
        //calculating LCM
        for(int i = 1;i<=n;i++){
            for(int j = 1;j<=m;j++){
                if(s1[i-1] == s2[j-1])
                    dp[i][j] = 1 + dp[i-1][j-1]; //the LCM of previous size
                else
                    //strA[0..i-2] str[0...j-1] or strA[0..i-1] str[0...j-2] check which one have the longest LCM
                    dp[i][j] = max(dp[i-1][j],dp[i][j-1]); 
                
            }
        }

        return dp[n][m];
    }
};
```


