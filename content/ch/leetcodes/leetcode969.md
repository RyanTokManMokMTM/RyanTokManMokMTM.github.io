---
title: "[Leetcode] Pancake Sorting(Medium)"
date: 2022-09-15T00:31:46+08:00
draft: false
tags:
    - array
    - reverse
    - recursive
categories:
    - leetcode
---


## LeetCode 969 - Pancake Sorting
Given an array of integers `arr`, sort the array by performing a series of **pancake flips**.

In one pancake flip we do the following steps:

* Choose an integer `k` where `1 <= k <= arr.length`.
* Reverse the sub-array `arr[0...k-1]` (**0-indexed**).
For example, if arr = `[3,2,1,4]` and we performed a pancake flip choosing `k = 3`, we reverse the sub-array `[3,2,1]`, so arr = `[1,2,3,4]` after the pancake flip at k = 3.

Return an array of the `k`-values corresponding to a sequence of pancake flips that sort arr. Any valid answer that sorts the array within `10 * arr.length` flips will be judged as correct.
example
```
Input: arr = [3,2,4,1]
Output: [4,2,4,3]
Explanation: 
We perform 4 pancake flips, with k values 4, 2, 4, and 3.
Starting state: arr = [3, 2, 4, 1]
After 1st flip (k = 4): arr = [1, 4, 2, 3]
After 2nd flip (k = 2): arr = [4, 1, 2, 3]
After 3rd flip (k = 4): arr = [3, 2, 1, 4]
After 4th flip (k = 3): arr = [1, 2, 3, 4], which is sorted.
```
```
Input: arr = [1,2,3]
Output: []
Explanation: The input is already sorted, so there is no need to flip anything.
Note that other answers, such as [3, 3], would also be accepted.
```

## How can we solve this problem?
這題我我們要關注的點是如何將當前數字範圍(`[0,n)`)中最大的元素移動到`array`的最後。從上述例子中，我們可以觀察到:  
* 翻轉[0,最大值的Index] -> 最大值就會被移動到最前面
* 翻轉[0,n) -> 最大值就會被移動的最後面
我們只需要重複以上步驟，每次做完就代表著[n-i,n-1]的這段範圍是已經被排序了。所以，每次做完只關注`n-i-i`即可(就是當前位置的前面的所有**未排序**元素`[x,x,x,|y(n-i),y,y(n-1)]`)。
#### Solution:
class Solution {
public:
    vector<int> pancakeSort(vector<int>& arr) {
         vector<int> res;
        /*
        [3,2,4,1] -> we need to move the large value to the end
        //move the large element to the  front then flip n-1
        [4,2,3,1] 4(3)
        [1,3,2,4] n 4
        
        [3,1,2,4] 3(2)
        [2,1,3,4] n-1 3
        [1,2,3,4] 1 ,3 2 ,4
        */
        
        // we need to push the large number to the back
        // so we need to find out the maxinum number in [0,n]
        // then reverse [0,maxinum index] and then reverse whole list to make the large number at the end of the list(n)
        
        for(auto it = arr.end(); it != arr.begin(); it--){
            auto maxVal = max_element(arr.begin(),it);
            
            //where is this element in the list
            if(distance(maxVal,it) > 1){
                //if current val is not the maxinum
                if(maxVal != arr.begin()){ //if current value is not the first one -> no need to put it at the front of the array
                    reverse(arr.begin(),maxVal + 1);
                    res.push_back(distance(arr.begin(),maxVal) + 1);
                }
                
                //move the maxinum value to the back
                reverse(arr.begin(),it);
                res.push_back(distance(arr.begin(),it)); //don't filp sorted element at the end of the array
            }
        }
        
        // filp(arr,arr.size());
        return res;
    }
    
    
    
//     void filp(vector<int>& arr,int n){
//         if(n == 0) return;
        
//         //find the maximun
//         int max = 0;
//         int idx = 0;
//         for(int i = 0;i<n;i++){
//             if(arr[i] > max){
//                 max = arr[i];
//                 idx = i; 
//             }
//         }
        
//         // move the max value to the front -> flip idx + 1
//         res.push_back(idx + 1);
//         //swap the value
//         swapVal(arr,0,idx);
        
//         //move the large element to the end
//         swapVal(arr,0,n-1);
//         res.push_back(n);
        
//         //need doing this approach til sorted
//         filp(arr,n-1);
//     }
    
//     void swapVal(vector<int>& arr,int i,int j){
//         while(i < j){
//             int temp = arr[i];
//             arr[i] = arr[j];
//             arr[j] = temp;
//             i++;
//             j--;
//         }
//     }
};
```


