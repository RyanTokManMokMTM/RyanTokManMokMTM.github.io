---
title: "[筆記]Palindromic String(迴文字串)"
date: 2022-06-16T12:26:03+08:00
draft: false
tags:
    - string
    - dynamic-programming
categories:
    - note
---
# Introduction
## 什麼是Palindromic String 迴文字串
所謂的Palindromic String(迴文字串) 就是以一個字元為中間，而它的左邊以及右邊的組成字元相同。  
例子:  
`abcdcba` 以`d`為中心的左跟右的字元一樣。   
`cdc`左跟右都為`c`  
`bcdcb` 左跟右都為`b`  
`abcdcba` 左跟右都為`a`  

## 要怎麼知道String是否為什麼是palindrome(迴文)
要知道String是否palindrome，我們先得知道Palindromic的規則:
* 單一的字元都是Palindromic，例如: `a`,`b`,`g`...
* 某字元的左右字元相同,例如: `xax`,`xbx`,`xgx`...
* 某字元自己跟右邊或者左邊相同也是一個也使一個palindrome。例如`aa`,`bb`
* 如果某子串為palindrome,而左跟右字元相同，它也會是一個palindrome。例如palindrome`aba`,它的左右2邊都為字元`x`,`xabax`也使一個palindrome; 相反，左跟右字元不相同,則只有子字串為palindrome。

#### 判斷是否palindrome string
我可以從子串的中心點(middle point)開始往外擴展`i`,`j`,如果`i`跟`j`位置的為相同字元,則繼續往外擴。如果過程中有`i`,`j`位置的字元不相同,我們就可以知道它不是一個palindrome。

在尋找Palindrome的時候，我們必要要考慮到`odd`和`even`case。
* odd case : 會以`odd基數`的方式擴展。
    * 例如: `a` -> `bab` -> `cbabc`...
* even case: 會以`even偶數`的方式擴展
    * 例如: `aa` -> `baab` -> `cbaabc`...

什麼時候會出現這種情況呢?
例如這個例子:`baab`。如果只使考慮到`odd` case,他會被認為不是一個Palindrome。`baa`,`aab`...都不是合法的Palindrom。所以,我們必須考慮到`even` case。`aa`,`baab`是合法的Palindrom。

# Palindrome Template
```c++
    //O(n)
    bool isPalindrome(string str,int i,int j){
        while(i>=0 && j < str.length()){
            if(str[i] != str[j]) return false;
            i--;
            j++;
        }
        return true;
    }
```
```c++
    //中心點為Odd(i)
    isPalindrome(str,i,i);
    //中心點為even(i,i+1)
    isPalindrome(str,i,i+1);
```
