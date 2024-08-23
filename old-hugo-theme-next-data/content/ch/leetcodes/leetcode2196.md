---
title: "[Leetcode] Create Binary Tree From Descriptions(Medium)"
date: 2022-09-06T21:45:02+08:00
draft: false
tags:
    - binary tree
    - array
    - hash map
categories:
    - leetcode
---

## LeetCode 2196 - Create Binary Tree From Descriptions
You are given a 2D integer array `descriptions` where `descriptions[i] = [parenti, childi, isLefti]` indicates that parenti is the **parent** of childi in a **binary** tree of **unique** values. Furthermore,

* If `isLefti == 1`, then **child<sub>i</sub>** is the left child of **parent<sub>i</sub>**.
* If `isLefti == 0`, then **child<sub>i</sub>** is the right child of **parent<sub>i</sub>**.
Construct the binary tree described by `descriptions` and return *its **root***.

The test cases will be generated such that the binary tree is **valid**.
example
```
Input: descriptions = [[20,15,1],[20,17,0],[50,20,1],[50,80,0],[80,19,1]]
Output: [50,20,80,15,17,19]
Explanation: The root node is the node with value 50 since it has no parent.
The resulting binary tree is shown in the diagram.
```

```
Input: descriptions = [[1,2,1],[2,3,0],[3,4,1]]
Output: [1,2,null,null,3,4]
Explanation: The root node is the node with value 1 since it has no parent.
The resulting binary tree is shown in the diagram.
```

## How can we solve this problem?
這是給定一個2維的Array,根據`Array[i]`建構一棵`Binary tree`。主要得問題是哪一個是成為**Tree root**呢?要怎麼知道有哪些`Child Node`呢?  
* 我們透過`Map`來幫助我們記錄所有**Child Node**,以便之後的建構  
* 因每個**Child Node**都必須有一個**Parent Node**,也就是說在`Map`中能找到的**Node**必定是有**Parent**的，當找到1個**Node**沒有在`Map`中，也就代表著該**Node**必定是整棵`Binary Tree`的`Head`。  
根據`1`跟`2`的邏輯,並使用一個Loop來建構`Binary Tree`即可。

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
    TreeNode* createBinaryTree(vector<vector<int>>& des) {
        unordered_map<int,TreeNode*> m;
        TreeNode* head = nullptr;

        //creating all node ->child node
        for(int i = 0;i<des.size();i++)
            m[des[i][1]] = new TreeNode(des[i][1]); // all child node,except head node
        
        for(int i = 0;i<des.size();i++){
            //getting root node from map
            if(m.find(des[i][0]) == m.end()){ //getting head node
                TreeNode* root = new TreeNode(des[i][0]);
                head = root;
                m[des[i][0]] = root;
            }
            if(des[i][2]){
                m[des[i][0]]->left = m.find(des[i][1]) == m.end() ? new TreeNode(des[i][1]) : m[des[i][1]];
            }else {
                m[des[i][0]]->right = m.find(des[i][1]) == m.end() ? new TreeNode(des[i][1]) : m[des[i][1]];;   
            }
        }
        return head;
    }
};
```


