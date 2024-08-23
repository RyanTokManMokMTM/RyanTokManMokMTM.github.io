---
title: "[總結]Leetcode 週賽第319場復盤總結"
date: 2022-11-13T11:45:46+08:00
draft: false
tag: 
    - leetcode-contest
categories:
    - summary
---
# 今日為2022年11月13日(週日) - Leetcode 週賽第319場
> 目前參加週賽主要的目的是學習跟訓練，所有當前主要focus在解Easy 跟 Medium的題目，Hard的題目暫且先跳過了

### 週賽題目如下:
1. Convert the Temperature - **Easy**
2. Number of Subarrays With LCM Equal to K - **Medium**
3. Minimum Number of Operations to Sort a Binary Tree by Level - **Medium**

### Convert the Temperature - Easy

You are given a non-negative floating point number rounded to two decimal places `celsius`, that denotes **the temperature in Celsius**.

You should convert Celsius into **Kelvin** and **Fahrenheit** and return it as an array `ans = [kelvin, fahrenheit].`

Return the array `ans`. Answers within **10<sup>5</sup>** of the actual answer will be accepted.

**Example**
```
Input: celsius = 36.50
Output: [309.65000,97.70000]
Explanation: Temperature at 36.50 Celsius converted in Kelvin is 309.65 and converted in Fahrenheit is 97.70.
```
```
Input: celsius = 122.11
Output: [395.26000,251.79800]
Explanation: Temperature at 122.11 Celsius converted in Kelvin is 395.26 and converted in Fahrenheit is 251.798.
```
##### 解題思路
這題沒有什麼難度呢，就直接代題目給的公式就可以**AC**了
```c++
class Solution {
public:
    vector<double> convertTemperature(double celsius) {
        double kelvin = celsius + 273.15;
        double Fahrenheit  = celsius * 1.80 + 32;
        return {kelvin,Fahrenheit};
    }
};
```

### Number of Subarrays With LCM Equal to K - Medium
Given an integer array `nums` and an integer `k`, return the number of **subarrays** of **nums** where the least common multiple of the subarray's elements is `k`.

A **subarray** is a contiguous non-empty sequence of elements within an array.

The **least common multiple of an array** is the smallest positive integer that is divisible by all the array elements.

**Example**
```
Input: nums = [3,6,2,7,1], k = 6
Output: 4
Explanation: The subarrays of nums where 6 is the least common multiple of all the subarray's elements are:
- [3,6,2,7,1]
- [3,6,2,7,1]
- [3,6,2,7,1]
- [3,6,2,7,1]
```

```
Input: nums = [3], k = 2
Output: 0
Explanation: There are no subarrays of nums where 2 is the least common multiple of all the subarray's elements.
```
##### 解題思路
這一題要注意的是*LCM*的計算以及*subarry*的定義
> Subarray 是 在array中連續的一組array，跟subsequence不一樣呢~  

這題的重點是要關注`subarray`的部分，也就是我們要知道`[i : n-1] where i = 0 to n - 1`的`LCM`是否與K相等。 所以我們要一個一個subarray的去找從`size為1` 擴展至`n - i - 1`, 檢查擴展的過程中是否存在`LCM`與K相等。

*注：因為LCM的算計過程中會進行multipy,所以不能使用sign int, 需使用unsign int。否者會overflow.*
```c++
class Solution {
public:
    int subarrayLCM(vector<int>& nums, int k) {
        int ans = 0;
        for(int i = 0;i<nums.size();i++){
            unsigned int curLCM = 1;
            for(int j = i;j<nums.size();j++){
                curLCM = lcm(curLCM,nums[j]); //[for i to n]
                if(curLCM == k) ans++;
            }
        }
        
        return ans;
    }
};
```

### Minimum Number of Operations to Sort a Binary Tree by Level - Medium  
You are given the root of a binary tree with **unique values**.

In one operation, you can choose any two nodes **at the same level** and swap their values.

Return the minimum number of operations needed to make the values at each level sorted in a **strictly increasing order**.

The **level** of a node is the number of edges along the path between it and the root node.

**Example**
```
     1        
    /   \     
  4       3   
 / \     / \  
7   6   8    5
       /    / 
      9    10 
Input: root = [1,4,3,7,6,8,5,null,null,null,null,9,null,10]
Output: 3
Explanation:
- Swap 4 and 3. The 2nd level becomes [3,4].
- Swap 7 and 5. The 3rd level becomes [5,6,8,7].
- Swap 8 and 7. The 3rd level becomes [5,6,7,8].
We used 3 operations so return 3.
It can be proven that 3 is the minimum number of operations needed.
```

```
   1   
  / \  
 3   2 
/ \ / \
7 6 5 4
Input: root = [1,3,2,7,6,5,4]
Output: 3
Explanation:
- Swap 3 and 2. The 2nd level becomes [2,3].
- Swap 7 and 4. The 3rd level becomes [4,6,5,7].
- Swap 6 and 5. The 3rd level becomes [4,5,6,7].
We used 3 operations so return 3.
It can be proven that 3 is the minimum number of operations needed.
```

```
   1  
  / \ 
 2   3
/ \ / 
4 5 6 
Input: root = [1,2,3,4,5,6]
Output: 0
Explanation: Each level is already sorted in increasing order so return 0.
```

##### 解題思路(這題查的資料)
這題主要的難點是當我們拿到了每個level的Node的數時候，我們要怎麼得知**最少的swap到正確的位置**是多少呢？？

假設我們現在有下面的這個情況
```
2 - 4 - 1 - 5  
```
我們要透過最少的swap的次數，使之變為有序的。
哪應該要怎麼解呢？

我們是不是只需要將他們移動到他們各自對應的正確的`index`就可以了呢?  
比如: `2 - 4 - 1 - 5` 這裡的`1`應該在`index 0`的位置,`2`應該在`index 1` 的位置,如此類推。最後就會得出 `1 - 2 - 4 -5`  

由此可見，我們只需要將錯誤的`index` 與 正確的`index`連接在一起(也就是Swap) ，哪我們只要知道一共有多少條node連接到同一條edge上 , 哪我們就知道`swap`了多少回了。  
例如： `7 6 4 5`  => `7(移動到5的位置) -> 5(移動到6的位置) -> 6(移動到4的位置) -> 4`代表了 `swap(7,5)` + `swap(5,6)` + `swap(6,4)`
`swap(7,5)` => `5 6 4 7`
`swap(5,6)` => `6 5 4 7`
`swap(6,4)` => `4 5 6 7`

只要對每層level建立一個`directed graph`就可以知道最少`swap`了多少次。

**輔助函數** -> *因為我們計算的是edge的數目,而我們遍歷了node的數目，node = edge + 1,所以需要-1*
```c++
    int helper(vector<int>& res){
        if(res.size() <= 1) return 0; //no need
        
        int swapTime = 0;
        vector<pair<int,int>> g;
        for(int i = 0;i<res.size();i++){ //building the graph //O(res.size())
            g.push_back({res[i],i});
        }
        
        sort(g.begin(),g.end());//sort it by value not index
        vector<int> nodeVisited(res.size());
        for(int i = 0;i<res.size();i++){
            
            //if current value need to keep in current index -> continue or is already swapped
            if(nodeVisited[i] || g[i].second == i) continue;
            
            int count = 0;
            int start = i;
            while(!nodeVisited[start]){
                nodeVisited[start] = true;
                start = g[start].second;
                count++;
            }
            if(count > 1) swapTime += count - 1;
        }
        return swapTime;
    }
```

**遍歷每一個Level，透過BFS即可**
```c++
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    int minimumOperations(TreeNode* root) {
        if(root == nullptr) return 0;
        queue<TreeNode*> q;
        q.push(root);
        int minTime = 0;
        while(!q.empty()){
            int size = q.size();
            vector<int> res;
            for(int i = 0;i<size;i++){
                auto front = q.front();q.pop();
                res.push_back(front->val);
                if(front->left != nullptr) q.push(front->left);
                if(front->right != nullptr) q.push(front->right);
            }
            
            minTime += helper(res);
        }
        
        return minTime;
    }
    
    int helper(vector<int>& res){
        if(res.size() <= 1) return 0; //no need
        
        int swapTime = 0;
        vector<pair<int,int>> g;
        for(int i = 0;i<res.size();i++){ //building the graph //O(res.size())
            g.push_back({res[i],i});
        }
        
        sort(g.begin(),g.end());//sort it by value not index
        vector<int> nodeVisited(res.size());
        for(int i = 0;i<res.size();i++){
            
            //if current value need to keep in current index -> continue or is already swapped
            if(nodeVisited[i] || g[i].second == i) continue;
            
            int count = 0;
            int start = i;
            while(!nodeVisited[start]){
                nodeVisited[start] = true;
                start = g[start].second;
                count++;
            }
            if(count > 1) swapTime += count - 1;
        }
        return swapTime;
    }

};
```

## 總結
* 對於Graph的處理以及思路需要加強改善, 特別是需要自己建立`Graph`的題目。