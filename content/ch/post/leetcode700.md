---
title: "[Leetcode] Search in a Binary Search Tree(EASY)"
date: 2022-04-14T15:05:44+08:00
draft: false
tags:
    - binary search tree
    - recursion
    - binary Tree
categories:
    - leetcode
---
## LeetCode 700 - Search in a Binary Search Tree
You are given the root of a binary search tree (BST) and an integer val.

Find the node in the BST that the node's value equals val and return the subtree rooted with that node. If such a node does not exist, return null.

example
```
Input: root = [4,2,7,1,3], val = 2
Output: [2,1,3]

Input: root = [4,2,7,1,3], val = 5
Output: []
```

## How can we solve this problem?
在解決問題之前，我們需要知道什麼是`Binary Search Tree`。根據`BST`的定義:  
* `Binary Search Tree` 基於`Binary Tree`
* `left sub-tree`的所有Node value 都小於root value 
* `right sub-tree`的所有Node value 都大於root value 
* `Binary Search Tree`的key/value都是unique的
<!-- Before solving this problem, we need to kown what is a Binary Search Tree. According to Binary Search Tree definition:   -->
<!-- * `Binary Search Tree` is base on a Binary Tree
* All elememts in `left sub-tree` are less than root value 
* All elememts in `right sub-tree` are greater than root value
* Key/Value in `Binary Search Tree` are unique -->

現在我們知道什麼是`BST`了。這個問題是要在`BST`中找`val`，我們通過以下幾個條件以及遞歸幫我們求解:  
* `left sub-tree`的所有Node value 都小於root value 
* `right sub-tree`的所有Node value 都大於root value 

如果`val`是小於root,就移動到`左子樹(left sub-tree)`，否者移動到`右子樹(right sub-tree)`,直到找到`val`並返回`root的pointer`或者沒有找到返回`null`
<!-- 
Now we know what is a `Binary Search Tree`, so we can start to solve this problem. This problem is asking about the sub-tree of the value. For solving this problem, we can use recursion to help us to search the value by applying some rules of `Binary Search Tree`: -->
<!-- * All elememts in `left sub-tree` are less than root value 
* All elememts in `right sub-tree` are greater than root value -->


<!-- If the `val` is less than the root value, pass the left child pointer to the recursive function. Otherwise, pass the right child pointer to the recursive function. After it finds the value, return its root as the result. -->

<!-- ## The solving steps:
1. 定義一個遞歸函數同於進行binary searching
2. 在遞歸函數中定義搜尋的條件
3. 如果找到返回`root pointer`,否則返回`null` -->
#### Solution:
<!-- 1. Define a recursive function for binary search
1. Define some conditions for searching
2. If the value is found ,return the root. Otherwise return NULL  -->
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
    TreeNode* searchBST(TreeNode* root, int val) {
        if(root == nullptr) return root;
        
        //check val
        if(root->val > val){
            //go to left
            return searchBST(root->left,val); //
        }else if(root->val < val){
            return  searchBST(root->right,val);
        }else{
            return root;
        }
    }
};
```


