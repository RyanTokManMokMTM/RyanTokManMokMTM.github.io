---
title: "Longest Common SubString(最長公共子序列)"
date: 2022-06-14T13:11:28+08:00
draft: false
tags:
    - dynamic programming
categories:
    - leetcode template
    - leetcode note
    - coding skill
---

## 什麼是最長公共子序列?
給定2個字串`string A`和`string B`,2個字串中所共同擁有的最長的子字串。  
例如:
```
String A : leetcode
String B : ecbod
他們的最長公共子序列便是`ecod`

解釋:
String A 包含了 __e_cod_ => ecod
String B 包含了 ec_od => ecod
```
## 要怎麼找到最長公共子序列LCM呢?
我們需要定義一個數組用於保存當前情況下的最優解,也就是使用`DP`的方式。我們需要以每個字符最為考量,並一一匹配，最後得出整體最優解。
![LCM](/images/leetcodesHelper/lcm.png)

## LCM Code Template 
```c++
int longestCommonSubStr(string &s1, string &s2){
        int n = s1.length();
        int m = s2.length();

        vector<vector<int>> dp(n+1,vector<int>(m+1,0));

        for(int i = 1;i<=n;i++){
            for(int j = 1;j<=m;j++){
                if(s1[i-1] == s2[j-1])
                    dp[i][j] = 1 + dp[i-1][j-1]; 
                    //the LCM of previous size + current matched
                else
                    dp[i][j] = max(dp[i-1][j],dp[i][j-1]); 
                    //strA[0..i-2] str[0...j-1] or strA[0..i-1] str[0...j-2] check which one have the longest LCM
            }
        }

        return dp[n][m];
    }
```

#### 參考資料
[经典动态规划：最长公共子序列](https://labuladong.github.io/algo/3/24/76/)
