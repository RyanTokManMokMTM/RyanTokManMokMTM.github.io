---
title: "[Leetcode] Construct String from Binary Tree(Easy)"
date: 2022-09-07T10:12:28+08:00
draft: false
tags:
    - binary tree
    - array
    - recursive
    - dsf
categories:
    - leetcode

---

## LeetCode 606 - Construct String from Binary Tree
Given the `root` of a binary tree, construct a string consisting of parenthesis and integers from a binary tree with the preorder traversal way, and return it.

Omit all the empty parenthesis pairs that do not affect the one-to-one mapping relationship between the string and the original binary tree.
example
```
Input: root = [1,2,3,4]
Output: "1(2(4))(3)"
Explanation: Originally, it needs to be "1(2(4)())(3()())", but you need to omit all the unnecessary empty parenthesis pairs. And it will be "1(2(4))(3)"
```

```
Input: root = [1,2,3,null,4]
Output: "1(2()(4))(3)"
Explanation: Almost the same as the first example, except we cannot omit the first parenthesis pair to break the one-to-one mapping relationship between the input and the output
```

## How can we solve this problem?
這題就是要讓我們講以`string`的方式輸出**Binary Tree**。只要注意他的規則就可以解決這題。  
* **node**的*children*都會被`()`包裹住
* **node**如果有`left-child`沒有`right-child`可以無視`right-child`的`()`  
* **node**如果有`right-child`沒有`left-child`,`left-child`的位置必須包含一個`()`  
根據以上這幾條輸出規則，透過**postorder traversal**就可以解決。
> postorder traversal : traverse Left-child -> Right-child -> self node

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
    string tree2str(TreeNode* root) {
        string res;
        solution(root,res);
        return res;
    }
    
    //Solution A
    string constructStr(TreeNode* root){
        if(!root) return "";
        string cur = to_string(root->val);
        
        if(root->left)  cur += '(' + tree2str(root->left) +')';
        else if(root->right)  cur += "()"; //for no left child but right child case
        
        if(root->right) cur += '(' + tree2str(root->right) +')';
        
        return cur;
    }
    

    //Solution B
    void solution(TreeNode* root,string &res){
        if(!root) return;
        res += to_string(root->val);
        if(root->left || root->right){
            res+= "(";
            solution(root->left,res);
            res+= ")";
            
            if(root->right){
                res+= "(";
                solution(root->right,res);
                res+= ")";
            }
        }

    }
};
```


