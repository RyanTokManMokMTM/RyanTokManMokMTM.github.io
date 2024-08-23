---
title: "[Leetcode] Binary Tree Inorder Traversal(Easy)"
date: 2022-09-08T20:22:06+08:00
draft: false
tags:
    - binary tree
    - dfs
    - traversal
categories:
    - leetcode
---


## LeetCode 94 - Binary Tree Inorder Traversal
Given the `root` of a binary tree, return *the inorder traversal of its nodes' values.*

example
```
Input: root = [1,null,2,3]
Output: [1,3,2]
```
```
Input: root = []
Output: []
```
```
Input: root = [1]
Output: [1]
```
## How can we solve this problem?
這題很簡單,只要使用中序遍歷即可。
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
public:
    vector<int> inorderTraversal(TreeNode* root) {

        vector<int> res;
        inorder(root,res);
        return res;
    }
    
    void inorder(TreeNode* root,vector<int>& res){
        if(!root) return;
        
        inorder(root->left,res);
        res.emplace_back(root->val);
        inorder(root->right,res);
    }
};
```


