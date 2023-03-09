---
title: "[筆記] Binary Search 演算法"
date: 2023-03-09T13:48:46+08:00
draft: false
categories:
    - note
    - algorithm
tags:
    - note
    - algorithm
author: jackson.tmm
---

Binary Search 演算法是用於在一個有序array中搜尋一個值的演算法 - TC:O(log n)。相較於Linear Search(線性搜尋) - TC:O(n),其效率大大提高。  

這篇文章就主要紀錄Binary Search 的不同的搜尋方式。

## 在有序數組中尋找特定的值
這種問題比較簡單，就只要直接比較值是否一樣，如果一樣直接返回`index`。但如果是比特地值小/大，因為給定的數組是有序的，我們就可以直接將搜尋區間縮小即可(取決於比搜尋的值較大還是較小，較小往較大值的範圍趨近，否則往較小值的範圍趨近) 。  

**尋找特定值之代碼**  
```c++
func binarySearch(vector<int> arr,int value){
    int i = 0;
    int j = arr.size() - 1;

    while(i <= j){
        int mid = i + (j - i) / 2; //middle index between i and j point
        if(arr[mid] == value) return mid; //the value is found.
        else if(arr[mid] < value) i = mid + 1; //the arr[mid] is less than value,search in [mid + 1,j]
        else if(arr[mid] > value) j = mid - 1; // the arr[mid] is greater than value,search in [i,mid - 1];
    }

    return -1; //NOT FOUND
}
```

## 在有序數組中搜尋最接近特地值的最小/最大index
在某些情況下，在特定數值中可能會出現多個一樣的特定值，找到了特別的值後直接返回可能不一樣的最小index或者最大index。哪我們就要透過以下的2種區間搜尋方式來尋找。尋找最小(收縮右邊界)，搜尋最大(收縮左邊界)。

**搜尋左邊界**
```c++
int binarySearch(vector<int> arr,int value){
    int left = 0;
    int right = arr.size(); //

    while(left < right){ //not equals ,coz right = n -> ended when left == right
        int mid = left + (right - left) / 2;
        if(arr[mid] >= value) right = mid; //shrink to left
        else if(arr[mid] > value) left = mid + 1;
    }

    return left;
}
```

```
例子:
[1,2,3,4,4,4,4,4,5,7]，n = 10
尋找給定數組中的value為4最小index -> ans = index : 3

step 1 :
[1(i),2,3,4,4,4(mid),4,4,5,7](j)

step 2 :
[1(i),2,3(mid),4,4,4(j),4,4,5,7]

step 4 :
[1,2,3,4(i),4(mid),4(j),4,4,5,7]

step 5 :
[1,2,3,4(i),4(j),4,4,4,5,7]

step 5 : (i == j) ended -> ans : 3
[1,2,3,4(i)(j),4,4,4,4,5,7]
```

**搜尋右邊界**
```c++
int binarySearch(vector<int> arr,int value){
    int left = 0;
    int right = arr.size();

    while(left < right){
        int mid = left + (right - left) / 2;
        if(arr[mid] <= value) left = mid + 1; //shrink to right
        else if(arr[mid] > value) right = mid;
    }

    return left - 1;
}
```

```
例子:
[1,2,3,4,4,4,4,4,5,7] ,n = 10
尋找給定數組中的value為4最小index -> ans = index : 7

step 1 :
[1(i),2,3,4,4,4(mid),4,4,5,7](j)

step 2:
[1,2,3,4,4,4,4(i),4,5(mid),7](j)

step 2:
[1,2,3,4,4,4,4(i),4(mid),5(j),7]

step 2: ended - i = j -> return i(8) - 1 = 7
[1,2,3,4,4,4,4,4,5(i)(j),7]
```

## 參考資料
[二分搜索怎么用？我又总结了套路](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-48c1d/er-fen-sou-ae51e)  
[我写了首诗，把二分搜索算法变成了默写题](https://labuladong.github.io/algo/di-ling-zh-bfe1b/wo-xie-le--3c789/)