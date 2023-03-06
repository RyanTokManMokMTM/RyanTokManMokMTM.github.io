---
title: "[筆記] KMP - Knuth-Morris-Pratt 演算法"
date: 2023-03-06T12:32:40+08:00
draft: false
categories:
    - note
    - algorithm
tags:
    - note
    - algorithm
author: jackson.tmm
---

KMP(Knuth-Morris-Pratt) 算法是一個用於字符串匹配的一個算法，但確實有點抽象和複雜，因此打算寫一篇筆記來紀錄一下這個算法！  
給定一個`text`以及`pattern`字符串，透過KMP 算法可以在`text`中是否存在`pattern`這個字符串。
```note
    返回在text中匹配pattern的index的位置。如果沒有找到則返回-1.

    case 1:
    text : aaaaaabcccd
    pattern : aaabc 

    aaaaaabcccd
       aaabc
    
    我們可以看到text的index = 3的位置匹配到了pattern，因此返回3
    ---------------------------------------------------------------
    case 2:
    text : aaaaaabcccd
    pattern : aabd

    可以看到text中並不存在這個pattern，因此返回-1 
```

如果我們透過暴力解也可以找到`text`中是否存在pattern，但TC為**O(n * m)**,其中n為`text`的長度以及m為`pattern`的長度。代碼如下：  
```c++
int strStr(string text,string pattern) {
    int n = text.size();
    int m = pattern.size();

    for(int i = 0;i < n;i++){
       int j;
       for(j = 0;j <,;j++) {
            if(text[i+j] != pattern[j]) break;
       }
   

        if(j == m) return i;
    }

    return -1; //pattern isn't exist in text
}
```
以上這個算法，`pattern`對會與`text`進行匹配，即便是不存在的字符也會進行比較，多做了無必要的操作。例如：  
```
text :  aaabaaac
pattern aaac

使用暴力解的話，pattern中並不存在b這個字符串，但還會把text的i pointer給回退回去，從下一個index 開始比較。

Step:
aaabaaac
aaac 
(不匹配)

aaabaaac
 aaac
(不匹配)

aaabaaac
  aaac
(不匹配)

aaabaaac
   aaac
(不匹配)

aaabaaac
    aaac
(匹配) -> return result
```
從以上例子我們看的出來，暴力解重複比較的不存在的字符數次。如果我們知道不存在的字符，是不是可以直接跳過前面的比較呢？
例如:  
```
aaabaaac
aaac 
(不匹配)

aaabaaac
    aaac 
(匹配) -> return result

example 2:
aaaaaaac (j = 3)
aaac (i = 3) 
(不匹配)

aaaaaaac (j = 4)
 aaac (i = 3)
(不匹配)

aaaaaaac (j = 5)
  aaac (i = 3)
(不匹配)

aaaaaaac (j = 6)
   aaac (i = 3)
(不匹配)

aaaaaaac (j = 7)
    aaac (i = 3)
(不匹配)
```
即便是沒有匹配，text的pointer 也不會退回去，一直往前走。這就是KMP算法，透過預計算的方式，知道在不匹配的情況下，把pattern 移動到正常匹配的位置。因此直接從**TC:O(n*m)** 降至 **O(n)**,但是因為要保存紀錄，因此**SC：O(m)**。透過空間換取時間的作法。

## 算法說明與設計
我們現在知道了透過KMP算法可以有效率的找出`pattern`是否存在於`text`中。前面我們有提及到KMP是透過預先計算在不同情況下有不同的移動方式，問題是我們要如何計算呢？  

**根據不同的字符會轉移到不同的位置**，這個有沒有很像[FSM(Finite State Machine/ Finite State automaton) 有限狀態機/有限狀態自動機](https://en.wikipedia.org/wiki/Finite-state_machine)呢？  

舉個例子：pattern : ABABC 的FSM如下：  
![FSM](/images/fsm-kmp1.png)

我們可以看到以上的FSM會按照不同匹配到的字符會轉到不用的State！**這個FSM便是KMP算法的重點部分**！

## 實現
要實現KMP的FSM我們透過2D Array來幫組我們。定義如下：
```
n = pattern的長度
c = 字符 - 假設只包含小寫英文字母共26個
states[i][c], 0 < i < n, 0 < c < 26;
j 為當前State, 0 < j < n

例如：
states[3]['a'] = 4
當前狀態為3，如果遇到'a', pattern轉移都狀態4
```

**KMP Search 算法**
```c++
int search(string text,string pattern){
    int n = text.size():
    int m = pattern.size();
    
    int j = 0;
    for(int i = 0;i<n;i++){
        j = states[j][text[i]]; //to which state
        if(j == m) return i - m + 1;
    }

    return -1;
}
```

**哪我們要怎樣建構這個FSM的圖的？**
```c++
for(int i = 0;i < n; i++){
    for(int c = 0; c < 26;c++)
        states[i][c] = j;
}
```

*Q： 這個`j`要怎麼得到呢？*
這裡會分成2種情況：  
1. 匹配的情況    
    匹配的情況就很容易，就一直往前走就好了`j = i + 1`
2. 不匹配的情況：  
    不匹配的情況就比較複雜，有可能會留在原地不動，也有可能回去以前的State。
    這裡我們需要一個人來幫我們處理這個問題，我們使用variable 來幫組我們，而這個variable 和我們的`j`有相同的前綴prefix。
    ```
    例如
    A -> B -> A -> B -> C
         x         j
    ```

    `state[j][text[c]] = state[x][text[c]];`  
    在這個情況下state j 只有在遇到c的情況下 才會往前走，然而我們的x跟j是有著相同的prefix，也就是AB。 假設現在的是A，在不匹配的情況下，我們可以把當前的字符交給x來處理。 在State x 中 遇到A會往前走，所以j便會往後退（畢竟不能往前只能往後退了）。因為j的前綴跟x的前綴是的一樣的，所以把字符交給x來處理，可以盡可能少的回退！ 所以j最後會去到state 3

    不過也有可能當前x state 是無法匹配的情況，哪只要按照state x的路回退即可（x 永遠都會尾隨 j的，而x的狀態也是在以前計算過的，所以只要按照x的紀錄表走就可以）

**KMP 建立FSM**
```c++
void KMP(string pattern) {
    int n = pattern.size();
    vector<vector<char>> states(n,vector<char>(26,0));
    states[0][pattern[0]] = 1; //在狀態0的時候，如何遇到pattern[0]，會到狀態1，而其他情況會原地不動。
    int x = 0; //與j 有相同前綴的變數
    for (int j = 1; j < n ;j++){
        for(int c = 0 ; c < 26 ;c++){
            state[j][pattern[c]] = state[x][pattern[c]];
        }

        //Move to next state iff text[c] == pattern[c]
        state[j][pattern[c]] = j + 1;
        x = state[x][pattern[c]; //to next x state
    }
}

```
### KMP 算法代碼
```c++
class KMP {
    private:
        string pattern;
        vector<vector<char>> states;
    public:
        KMP(string pattern){
            this->pattern = pattern;
            int n = pattern.size();
        
            states = vector<vector<char>> (n,vector<char>(26,0));
            states[0][pattern[0]] = 1; //在狀態0的時候，如何遇到pattern[0]，會到狀態1，而其他情況會原地不動。
            int x = 0; //與j 有相同前綴的變數
            for (int j = 1; j < n ;j++){
                for(int c = 0 ; c < 26 ;c++)
                    state[j][pattern[c]] = state[x][pattern[c]];
                //Move to next state iff text[c] == pattern[c]
                state[j][pattern[c]] = j + 1;
                x = state[x][pattern[c]; //to next x state
            }
        }

        int search(string text) {
            int n = text.size();
            int m = this->pattern.size();

            int j = 0;
            for(int i = 0;i<m;i++){
                j = states[j][text[i]];
                if(j == m) return i - m + 1;
            
            }
            return -1
        }
}
```
## 參考資料
[动态规划之 KMP 算法详解](https://mp.weixin.qq.com/s/r9pbkMyFyMAvmkf4QnL-1g)

