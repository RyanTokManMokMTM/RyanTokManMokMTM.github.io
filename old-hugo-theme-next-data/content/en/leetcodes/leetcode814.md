---
title: "[Leetcode] Binary Tree Pruning(Medium)"
date: 2022-09-06T21:30:56+08:00
draft: false
tags:
    - binary tree
    - dfs
    - recursive
categories:
    - leetcode
---


## LeetCode 814 - Binary Tree Pruning
Given the `root` of a binary tree, return the same tree where every subtree (of the given tree) not containing a `1` has been removed.

A subtree of a node `node` is node plus every node that is a descendant of `node`.

example
```
Input: root = [1,null,0,0,1]
Output: [1,null,0,null,1]
Explanation: 
Only the red nodes satisfy the property "every subtree not containing a 1".
The diagram on the right represents the answer.
```

```
Input: root = [1,0,1,0,0,0,1]
Output: [1,null,1,null,1]
```

## How can we solve this problem?
這題是要讓我們移除所有不包含`1`的`sub-tree`。所以，我們只要透過`DFS`判斷一下`node`的`left-sub tree` 以及 `right-sub tree` 是否都不包含`1`:
    1. 如果左右子樹都不包含`1`且當前`node`為0, 直接返回`nullptr`
    2. 若當前節點為`1`就返回自身
    2. 左子樹不包含`1`, 當前`node`的左子樹設成`nullptr`;同理右子樹不包含`1`,當前`node` 的右子數設為`nullptr`
#### Solution:
```c++
class Solution {
public:
    TreeNode* pruneTree(TreeNode* root) {
        if(!root) return nullptr;
        
        root->left = solution(root->left); //contain 1?
        root->right = solution(root->right); //contain 1?
    
        if (root->val == 0 && !root->left && !root->right) return nullptr; //remove itself

        return root;
    }
    
    // TreeNode* solution(TreeNode* root){
    //     if(!root) return nullptr;
        
    //     root->left = solution(root->left); //contain 1?
    //     root->right = solution(root->right); //contain 1?
    
    //     if(root->val == 0 && !root->left && !root->right) return nullptr; //remove itself

    //     return root;
    // }
    
    // bool solutionA(TreeNode* root){
    //     if(!root) return false;
    //     if(!root->left && !root->right) return root->val == 1;
        
    //     bool left = solution(root->left); //contain 1?
    //     bool right = solution(root->right); //contain 1?
        
    //     if(!left) root->left = nullptr;
    //     if(!right) root->right = nullptr;
        
    //     return left || right || root->val == 1;
    // }
};
```


