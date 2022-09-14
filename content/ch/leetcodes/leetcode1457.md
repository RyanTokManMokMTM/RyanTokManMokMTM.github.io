---
title: "[Leetcode] Pseudo-Palindromic Paths in a Binary Tree(MEDIUM)"
date: 2022-09-14T15:27:08+08:00
draft: false
tags:
    - binary tree
    - dfs
    - recursive
    - XOR
categories:
    - leetcode
---

## LeetCode 1457 - Pseudo-Palindromic Paths in a Binary Tree

Given a binary tree where node values are digits from 1 to 9. A path in the binary tree is said to be **pseudo-palindromic** if at least one permutation of the node values in the path is a palindrome.

*Return the number of **pseudo-palindromic** paths going from the root node to leaf nodes.*
example
```
Input: root = [2,3,1,3,1,null,1]
Output: 2 
Explanation: The figure above represents the given binary tree. There are three paths going from the root node to leaf nodes: the red path [2,3,3], the green path [2,1,1], and the path [2,3,1]. Among these paths only red path and green path are pseudo-palindromic paths since the red path [2,3,3] can be rearranged in [3,2,3] (palindrome) and the green path [2,1,1] can be rearranged in [1,2,1] (palindrome).
```
```
Input: root = [2,1,1,1,3,null,null,null,null,null,1]
Output: 1 
Explanation: The figure above represents the given binary tree. There are three paths going from the root node to leaf nodes: the green path [2,1,1], the path [2,1,3,1], and the path [2,1]. Among these paths only the green path is pseudo-palindromic since [2,1,1] can be rearranged in [1,2,1] (palindrome).
```
```
Input: root = [9]
Output: 1
```
## How can we solve this problem?
這一題簡單的來說就是讓我們從**Binary Tree**中找到有幾條`path`是一個*Palindromic(Pseudo-Palindromic)偽迴文串*。
也就是說從`root到leaft`的`path`是一個**Palindromic**。 (我們只需要知道path是否能組成*Palindromic*即可) 

哪我們要怎麼知道`path`是不是**Palindromic**的呢?  
解決這個問題之前,我們先來看一下**Palindromic**分成了以下2個case。  
1. Odd(Path長度為基數): aabbdbbaa => a:2,b:2, d:1 
    > 從這裡我們可以看得出來,只會有**1個值/字符是基數,其餘的都會是偶數**。
2. Even(Path長度為偶數): aabb => a:2,b:2
    > 從這裡我們可以看得出來,所有**值/字符都是偶數**。

所以,我們可以直接通過一個**array**幫助我們計數有多少個值為**基數**。如果基數數目小於或者等於`1`的話,就符合了以上這2個條件，否則不能組成一個**Palindromic**。
#### Solution:
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
    int res = 0;
    int counter = 0;
public:
    int pseudoPalindromicPaths (TreeNode* root) {
        vector<int> counter(10,0); // from 1 - 9
        solution(root,counter);
        return res;
    }
    
    void solution(TreeNode* root,vector<int> &counter){
        //m uses to count how many number in the path
        //for odd case there will only remind 1 number such that xyzUyxz l
        //for even case there will not remind any number such that any number in the path occurs twice
        //example : xxyyzz -> rerange as xyzzyx
        if(root == nullptr) return;
        counter[root->val]++;
        if(!root->left && !root->right){
            //vector sum num be 0 or 1
            int oddOccur = 0;
            for(auto n : counter){
                if(n % 2 == 1) oddOccur ++;
            }
            
            //odd element at most appears once
            if(oddOccur <= 1) res++;
            counter[root->val]--;
            
            return;
        }
    
        solution(root->left,counter);
        solution(root->right,counter);
        
        //check
        counter[root->val]--;
    }
};
```

