---
title: "[Leetcode DP] Counting Bits(Easy)"
date: 2022-06-23T11:33:51+08:00
draft: false
tags:
    - bit operation
    - dynamic programming
categories:
    - leetcode
---

## LeetCode 338 - Counting Bits
Given an integer `n`, return an *array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the **number** of `1`'s in the binary representation of `i`.*

example: 
```
Input: n = 2
Output: [0,1,1]
Explanation:
0 --> 0
1 --> 1
2 --> 10
```
```
Input: n = 5
Output: [0,1,1,2,1,2]
Explanation:
0 --> 0
1 --> 1
2 --> 10
3 --> 11
4 --> 100
5 --> 101
```

## How can we solve this problem?
這題要我們解決的問題是給定一個數字`n`,回傳`0 - n`中每個數字包含了多少個為1的`bits`。例如: `n=2 => 00,01,10`,回傳的結果便會是`[0,1,1]`。  

### Bit Operation approach
這裡我們可以透過`bit operation` **AND** 來解決這個問題。從`Truth Table`中:  
|  A   | B  | Y(AND)  |
|:--:  |:--:|:--:|
| 0    | 0  | 0  |
| 0    | 1  | 0  |
| 1    | 0  | 0  |
| 1    | 1  | 1  |

我們可以到只有`1`**AND**`1`才會是**True**,所有我們只需要對每一個`bit`與當前`counter`的值做**AND**,如果為`1`就`bitCounter++`就可以計算出每一個值的`bits`的數目。  
因為一個`Int`類型為**4BYTE**,包含了`32`個bits,所以對於`[0,n]`中每一個數字都必須做**32次**的LOOP,因此**Time Complexity**是**O(32N)**。

#### Solution:
```c++
class Solution {
public:
    vector<int> countBits(int n) {
        for(int i = 0;i<n+1;i++){
            int temp = 0;
            for(int j = 0;j<=31;j++){
                if( (1 << j) & i) temp++;
            }
            res[i]=temp;
        }
        return res;
    }
};
```


### Dynamic Programming approach
我們可以先觀察一下每個數字的**Binary**,以`n=8`為例:
![BITS](/imgs-custom/leetcodesHelper/338-helper-1.png) 

從圖中我們可以看得到只有1個`bit`為1的數字都是**2<sup>i</sup>**,而我們所需要計算的[**2<sup>i</sup>** , **2<sup>i+1</sup>-1**]之間的數字的數目即可。  但是,我們要怎麼計算呢?  
首先,我們需要知道怎麼計算[**2<sup>i</sup>** , **2<sup>i+1</sup>-1**]裡面的`bits`的數目,然後我們在觀察一下**Binary**: 如下圖:
![BITS](/imgs-custom/leetcodesHelper/338-helper-2.png)
我們可以發現[**2<sup>i</sup>** , **2<sup>i+1</sup>-1**]都會想相隔**2<sup>i</sup>-1**個，也就是說我們只需要定義一個變數`j`作為*offset* 就可以移動到需要計算數字的位置( 0 <= j <= **2<sup>i</sup>-1** )。例如: `i=2`(**2<sup>2</sup>** = 4),`2+0(2)`,`2+1(3)`。

接下來,我們可以透過**DP**來幫助我們計算。  
定義**BASE CASE:**
> DP[0] = 0 //number 0 不包含任何1's

根據目前**2<sup>i</sup>**,求出*DP[2<sup>i</sup>+j] = DP[j]*,直到計算到(`n`)  
*注意: i 會根據i是否到達2<sup>i</sup>,最後進行Left-Shift(Double自己)*  
*注意: j 作為[0,2<sup>i</sup>)的指標*
> 例如:  
> DP[1] = DP[0] + 1 //比DP[0] 多一Bits  
> DP[2] = DP[0] + 1 //比DP[0] 多一Bits => 也可以視為在2的區間的1, DP[1] = DP[2] = 1  
> DP[3] = DP[1] + 1 //比DP[1] 多一Bits
> DP[4] = DP[0] + 1 //比DP[1] 多一Bits
#### Solution:
```c++
class Solution {
public:
    vector<int> countBits(int n) {
        //Trying to use DP
        vector<int> dp(n + 1); //from 0 to n
        dp[0] = 0; //base case
        int bits = 1; //2^0 = 1
        int i = 0;
        while(bits <= n){
            //bits will be pow of 2 ->1,2,4,8,16,24
            while(i<bits && i + bits <= n){
                dp[i + bits] = dp[i] + 1;
                i++;
            }
            i = 0;
            bits = bits << 1; //double bits value
            // cout << bits;
        }
        
        return dp;
    }
};
```


