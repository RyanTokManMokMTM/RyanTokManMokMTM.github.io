---
title: "[Leetcode] UTF-8 Validation(Medium)"
date: 2022-09-13T14:41:37+08:00
draft: false
tags:
    - array
    - binary
    - bit operation
categories:
    - leetcode
---


## LeetCode 393 - UTF-8 Validation

Given an integer array `data` representing the data, return whether it is a valid **UTF-8** encoding (i.e. it translates to a sequence of valid UTF-8 encoded characters).

A character in **UTF8** can be from **1 to 4 bytes** long, subjected to the following rules:

1. For a **1-byte** character, the first bit is a `0`, followed by its Unicode code.
2. For an **n-bytes** character, the first n bits are all one's, the `n + 1` bit is `0`, followed by `n - 1` bytes with the most significant `2` bits being `10`.

This is how the UTF-8 encoding would work:
```
     Number of Bytes   |        UTF-8 Octet Sequence
                       |              (binary)
   --------------------+-----------------------------------------
            1          |   0xxxxxxx
            2          |   110xxxxx 10xxxxxx
            3          |   1110xxxx 10xxxxxx 10xxxxxx
            4          |   11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
```
example
```
Input: data = [197,130,1]
Output: true
Explanation: data represents the octet sequence: 11000101 10000010 00000001.
It is a valid utf-8 encoding for a 2-bytes character followed by a 1-byte character.
```
```
Input: data = [235,140,4]
Output: false
Explanation: data represented the octet sequence: 11101011 10001100 00000100.
The first 3 bits are all one's and the 4th bit is 0 means it is a 3-bytes character.
The next byte is a continuation byte which starts with 10 and that's correct.
But the second continuation byte does not start with 10, so it is invalid.
```

## How can we solve this problem?
這一題其實也不太算是`算法題`, 只是單純的驗證是不是一個合法的**UTF-8**。只要根據題目給你條件，就可以判斷出是不是合法的了。

要解這題我們需要判斷**UTF-8**的長度是多少，然後根據這個長度檢測是否包含了這裡多個**BYTE**(n-1)即可。

* **UTF-8** 長度為1 => 沒有其他組成部分，所有ByteCount會是0
* **UTF-8** 長度為2 => 組成部分包含了2個(包含自己),所以ByteCount會是1
* **UTF-8** 長度為3 => 組成部分包含了3個(包含自己),所以ByteCount會是2
* **UTF-8** 長度為4 => 組成部分包含了4個(包含自己),所以ByteCount會是3

因此讀取到`(110xx xxx)/(1110 xxxx)/(1111 0xxx)` 為UTF-8開頭,接下來就會包含`n-1個為10xx xxxx`的`BYTE`(**1-byte的除外(0xxx xxxx)**)。如果不符號這個條件直接返回*false*即可。

> 小提示：  
> 0(`b00000000`) - 127(b`01111111`) : `0xxx xxxx`的最小值與最大值的範圍  
> 128(`b10000000`) - 191(`b10111111`) : `10xx xxxx`的最小值與最大值的範圍  
> 192(`b11000000`) - 223(`b11011111`) : `110x xxxx`的最小值與最大值的範圍  
> 224(`b11100000`) - 239(`b11101111`) : `1110 xxxx`的最小值與最大值的範圍  
> 240(`b11000000`) - 247(`b11011111`) : `1111 0xxx`的最小值與最大值的範圍  

#### Solution:
```c++
class Solution {
public:
    bool validUtf8(vector<int>& data) {
        ios_base::sync_with_stdio(false);
        cin.tie(nullptr);
        //UTF 8 1 to 4 bytes
        //1 byte character -> 8bit -> the first bit is 0 -> unicode
        //n byte ->first n bytes -> 1 then n+1 -> 0(at most 4)
        //starting at 2th byte to n-1 byte -> the most significant 2 bits should be 10

        /*
        suppose n = 4
        //first number only
        11110xxx = 2^3(xxx)
        (128,64,32,16,8,4,2,1)
          1  1  1   1 0 x x x
          128+64+32+16
        */
        
        /*
        0xxxxx
        data[i]
        
        
        */
        
        int n = data.size();
        int byteCount = 0;
        for(int i = 0;i<n;i++){
            //there may be not only one nbyte code??
            if(byteCount == 0){
                if(data[i] >= 0 && data[i] < 128 ) byteCount = 0; // for unicode
                else if(data[i] >= 192  && data[i] < 224) byteCount = 1; 
                else if(data[i] >= 224 && data[i] < 240) byteCount = 2;
                else if(data[i] >= 240 && data[i] < 248) byteCount = 3;
                else return false;   
            }else {
                if(data[i] < 128 || data[i] > 191) return false; //less/greater than 10xxxxx
                byteCount--;
            }
        }
        
        //
        
        return byteCount == 0;
    }
};
```

