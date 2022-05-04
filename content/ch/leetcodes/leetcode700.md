---
title: "Search in a Binary Search Tree(easy)"
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
Before solving this problem, we need to kown what is a Binary Search Tree. According to Binary Search Tree definition:  
* `Binary Search Tree` is base on a Binary Tree
* All elememts in `left sub-tree` are less than root value 
* All elememts in `right sub-tree` are greater than root value
* Key/Value in `Binary Search Tree` are unique

Now we know what is a `Binary Search Tree`, so we can start to solve this problem. This problem is asking about the sub-tree of the value. For solving this problem, we can use recursion to help us to search the value by applying some rules of `Binary Search Tree`:
* All elememts in `left sub-tree` are less than root value 
* All elememts in `right sub-tree` are greater than root value


If the `val` is less than the root value, pass the left child pointer to the recursive function. Otherwise, pass the right child pointer to the recursive function. After it finds the value, return its root as the result.

## The solving steps:
1. Define a recursive function for binary search
2. Define some conditions for searching
3. If the value is found ,return the root. Otherwise return NULL 
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


