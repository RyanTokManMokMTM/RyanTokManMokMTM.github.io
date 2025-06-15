---
title: "[筆記] Binary Search 演算法"
date: 2023-03-09T13:48:46+08:00
draft: false
categories:
    - note
tags:
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
        else if(arr[mid] < value) left = mid + 1;
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

### 實際例子
[**Leetcode - 2187. Minimum Time to Complete Trips**](https://leetcode.com/problems/minimum-time-to-complete-trips/)

You are given an array `time` where `time[i]` denotes the time taken by the i<sup>th</sup> bus to complete one trip.    

Each bus can make multiple trips **successively**; that is, the next trip can start **immediately after** completing the current trip. Also, each bus operates independently; that is, the trips of one bus do not influence the trips of any other bus.   

You are also given an integer `totalTrips`, which denotes the number of trips all buses should make in total. Return the *minimum time required for all buses to complete at least `totalTrips` trips*.  

```
example 1
Input: time = [1,2,3], totalTrips = 5
Output: 3
Explanation:
- At time t = 1, the number of trips completed by each bus are [1,0,0]. 
  The total number of trips completed is 1 + 0 + 0 = 1.
- At time t = 2, the number of trips completed by each bus are [2,1,0]. 
  The total number of trips completed is 2 + 1 + 0 = 3.
- At time t = 3, the number of trips completed by each bus are [3,1,1]. 
  The total number of trips completed is 3 + 1 + 1 = 5.
So the minimum time needed for all buses to complete at least 5 trips is 3.
```

```
Input: time = [2], totalTrips = 1
Output: 2
Explanation:
There is only one bus, and it will complete its first trip at t = 2.
So the minimum time needed to complete 1 trip is 2.
```

這題給定的數組中每個數字代表的數字表示i<sup>th</sup> `Bus`完成一次`trip`所要的次數，題目要我們找出所有`Bus`總共能完成`trip time`的最少次數是多少.  
我們看得出來這題就是要讓我們在一個區間裡面找出一個最小能達到特定值的值，所以我們可以通過Binary Search來找。  
首先我們要先定義最小值值和最大值是多少，最小值就是`time`數組中最小能完成一次`trip`的值(*小於這個值就代表沒有一輛`Bus`可以完成啊，哈哈哈哈*)。哪最大值呢？因為我們要求的最少能夠完成`total trip`的次數，哪我們最多是不是就是最小的哪輛`Bus`跑了`total trip`那麼多次呢？(超過了這個值就一定不會是最少了～)。  
所以區間為 `[low，low * total trip]`，然後我們就可以從這個裡面取值，取一個符合條件切最小的值即可。

**題解(Solution)**
```c++
long long minimumTime(vector<int>& time, int totalTrips) {
        long long min = *min_element(time.begin(),time.end());
        long long low = min, heigh = min * totalTrips;

        while(low < heigh){
            //try to tarvel by mid speed
            long long mid = low + (heigh - low) / 2;
            long long total = 0;

            //TODO: calculate the total time in the array 
            for(int i = 0; i < time.size();i++) total += (mid / time[i]);
            if(total >= totalTrips) {
                heigh = mid; //may be the mininum time - lock it
            }else {
                low = mid + 1; // move forward
            }
        }
        return heigh;
    }
};
```

## 參考資料
[二分搜索怎么用？我又总结了套路](https://labuladong.github.io/algo/di-yi-zhan-da78c/shou-ba-sh-48c1d/er-fen-sou-ae51e)  
[我写了首诗，把二分搜索算法变成了默写题](https://labuladong.github.io/algo/di-ling-zh-bfe1b/wo-xie-le--3c789/)