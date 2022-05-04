---
title: "Trim a Binary Search Tree"
date: 2022-04-15T18:29:14+08:00
draft: false
tags:
    - binary Search Tree
    - binary Tree
    - recursion
categories:
    - leetcode
---

## LeetCode 669 - Trim a Binary Search Tree

Given the root of a binary search tree and the lowest and highest boundaries as `low` and `high`, trim the tree so that all its elements lies in `[low, high]`. Trimming the tree should not change the relative structure of the elements that will remain in the tree (i.e., any node's descendant should remain a descendant). It can be proven that there is a **unique answer**.

Return *the root of the trimmed binary search tree*. Note that the root may change depending on the given bounds.

 
example
```
Input: root = [1,0,2], low = 1, high = 2
Output: [1,null,2]

Input: root = [3,0,4,null,2,null,null,1], low = 1, high = 3
Output: [3,2,null,1]
```

## How can we solve this problem?
We are going to apply the recursive function. Because the `Input` is a binary search tree and all left child nodes of the `low` node are less than the `low` node. So, the simple solution is that change its parent's left child to its right child node. And the `heigh` bound is similar to `low` bound solution but changes its parent's right child to its left child node.

## The solving steps:
1. Find the low bound node and the heigh bound node
   1. Low bound
      1. 



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
    TreeNode* trimBST(TreeNode* root, int low, int high) {
        //space : O(tree node size for all nodes value are between low and height)
        //time : O(tree node size for all nodes)
        return TrimBST(root,low,high);
    }
    
    
    TreeNode* TrimBST(TreeNode* root,int low,int height){
        if(!root) return nullptr;
        //if the root value is less than height ,go right sub-tree 
        //if the root value is greater than low ,go left sub-tree
        if(root->val < low){
            // root->left = nullptr;
            return TrimBST(root->right,low,height);
        }else if(root->val > height){
            // root->right = nullptr;
            return TrimBST(root->left,low,height);
        }
        
        //left
        root->left = TrimBST(root->left,low,height);
        //right
        root->right = TrimBST(root->right,low,height);
        // cout << root->val << "\n";
        return root;
    }
};
```

