---
title: "Leetcode Weekly Contest 331(第一次參加競賽)"
date: 2022-09-18T16:32:34+08:00
draft: false
tags:
    - leetcode-contest
categories:
    - coding
---

> 今天是我第一次參加**Leetcode 雙週賽**，所以想記錄一下今天的競賽題目。希望能透過博客來記錄自己的競賽狀況。

**本週AC題數為:4/4**

## 題目 
### 2413. Smallest Even Multiple(EASY) - AC
Given a positive integer `n`, return the smallest positive integer that is a multiple of both `2` and `n`.  
#### Example
```
Input: n = 5
Output: 10
Explanation: The smallest multiple of both 5 and 2 is 10.
```

```
Input: n = 6
Output: 6
Explanation: The smallest multiple of both 6 and 2 is 6. Note that a number is a multiple of itself.
```
#### Solution
這題主要是讓我們返回一個最小的整數是可以同時被`n`和`2`整除。哪解這題的思路也很簡單，就是如果`n`可以被`2`整除，就直接放回`n`否者就返回`2 * n`即可。

```c++
class Solution {
public:
    int smallestEvenMultiple(int n) {
        return n % 2 == 0 ? n : 2 * n;
    }
};
```

### 2414. Length of the Longest Alphabetical Continuous Substring(Medium) - AC

An **alphabetical continuous string** is a string consisting of consecutive letters in the alphabet. In other words, it is any substring of the string `"abcdefghijklmnopqrstuvwxyz"`.

* For example, `"abc"` is an alphabetical continuous string, while `"acb"` and `"za"` are not.
Given a string `s` consisting of lowercase letters only, return *the length of the **longest** alphabetical continuous substring*.

### Example
```
Input: s = "abacaba"
Output: 2
Explanation: There are 4 distinct continuous substrings: "a", "b", "c" and "ab".
"ab" is the longest continuous substring.
```
```
Input: s = "abcde"
Output: 5
Explanation: "abcde" is the longest continuous substring.
```

### Solution
這題主要是要讓我們在給定字串找到最長的`按字母順序`的長度(`a`之後一定是`b`,`ac`並不成立`按字母順序`)。我們可以透過`Sliding Window`的方式來幫助我們找到最長的。    
* 如果當前`window` 長度為 `0`,向右滑動(往右增長)
* 如果當前`字符`**為**`前面字符`的**ASCII CODE  + 1**，則符合按字母順序， 向右滑動(往右增長)。並更新最大值。
* 如果當前`字符`**不為**`前面字符`的**ASCII CODE  + 1**，重置`Window`長度,並將`window`最左邊設置為當前位置。

```c++
class Solution {
public:
    int longestContinuousSubstring(string s) {
        //longest continuous substring.
        //consecutive letters
        int res = 1; //at least one
        //continuous 
        int left = 0;
        int right = 0;
        int i = 0;
        int n = s.length();
        while(right < n){
            if(left == right) right++;
            else if((s[right] - 'a') == (s[right  - 1] - 'a') + 1 ){
                //check current right and previous
                right ++;
                res = max(res,right - left);
            }else left = right; //reset window
        }
        return res;
    }
};
```
---
### 2415. Reverse Odd Levels of Binary Tree(Medium) - AC
Given the `root` of a **perfect** binary tree, reverse the node values at each **odd** level of the tree.

* For example, suppose the node values at level 3 are `[2,1,3,4,7,11,29,18]`, then it should become `[18,29,11,7,4,3,1,2]`.
Return `the root of the reversed tree`.

A binary tree is **perfect** if all parent nodes have two children and all leaves are on the same level.

The **level** of a node is the number of edges along the path between it and the root node.

### Example
```
Input: root = [2,3,5,8,13,21,34]
Output: [2,5,3,8,13,21,34]
Explanation: 
The tree has only one odd level.
The nodes at level 1 are 3, 5 respectively, which are reversed and become 5, 3.
```
```
Input: root = [7,13,11]
Output: [7,11,13]
Explanation: 
The nodes at level 1 are 13, 11, which are reversed and become 11, 13.
```
---
### Solution
這道題就是要讓我們翻轉`Complete Binary Tree`中，**奇數**層的`Node`。我們可以透過`BFS`來解題，會比較簡單，因為`BFS`可以很清楚的知道當前遍歷的是那一層。只要層數為奇數我們就做*數值交換(Swap)*即可。
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
    TreeNode* reverseOddLevels(TreeNode* root) {
        if(!root) return nullptr; 
        queue<TreeNode*> q;
        q.push(root);
        int depth = -1;

        while(!q.empty()){
            int size = q.size();
            depth++; 
            vector<TreeNode*> temp;
            for(int i = 0;i<size;i++){
                auto front = q.front();q.pop();
                if(front->left) q.push(front->left);
                if(front->right) q.push(front->right);
                
                if((depth + 1) % 2 == 0) temp.push_back(front);
            }
            
            if((depth + 1) % 2 == 0){
                int left = 0;
                int right = temp.size() - 1;
                 while(left < right){
                    swap(temp[left++]->val,temp[right--]->val);
                }   
            }

        }
        
        
//         for(int i = 0;i<node.size();i++){
//             int left = 0;
//             int right = node[i].size() - 1;
//             while(left < right){
//                 swap(node[i][left++]->val,node[i][right--]->val);
//             }
//         }
        return root;
    }
};
```
---
### 2416. Sum of Prefix Scores of Strings(Hard) - AC

You are given an array `words` of size `n` consisting of **non-empty** strings.

We define the **score** of a string `word` as the **number** of strings `words[i]` such that word is a **prefix** of `words[i]`.

* For example, if `words = ["a", "ab", "abc", "cab"]`, then the score of "ab" is 2, since "ab" is a prefix of both `"ab"` and `"abc"`.
Return an *array `answer` of size `n` where `answer[i]`s is the **sum** of scores of every **non-empty** prefix of `words[i]`*.

**Note** that a string is considered as a prefix of itself.


### Example
```
Input: words = ["abc","ab","bc","b"]
Output: [5,4,3,2]
Explanation: The answer for each string is the following:
- "abc" has 3 prefixes: "a", "ab", and "abc".
- There are 2 strings with the prefix "a", 2 strings with the prefix "ab", and 1 string with the prefix "abc".
The total is answer[0] = 2 + 2 + 1 = 5.
- "ab" has 2 prefixes: "a" and "ab".
- There are 2 strings with the prefix "a", and 2 strings with the prefix "ab".
The total is answer[1] = 2 + 2 = 4.
- "bc" has 2 prefixes: "b" and "bc".
- There are 2 strings with the prefix "b", and 1 string with the prefix "bc".
The total is answer[2] = 2 + 1 = 3.
- "b" has 1 prefix: "b".
- There are 2 strings with the prefix "b".
The total is answer[3] = 2.
```

```
Input: words = ["abcd"]
Output: [4]
Explanation:
"abcd" has 4 prefixes: "a", "ab", "abc", and "abcd".
Each prefix has a score of one, so the total is answer[0] = 1 + 1 + 1 + 1 = 4.
```
---
### Solution
這題有一點難理解，就是要我們計算以`words[i]` 為`prefix`(以`words[i][0...j]`為前綴)的字符串有多少個。例如`abc`,他的prefix會有3個`[a,ab,abc]`。我們只要知道`words`中有哪些字符串以`a`、`ab`和`abc`為prefix，他們的個數加總起來便是`words[i]`的答案。 

哪我們要怎麼知道有哪些字符串包含這些前綴呢？我們可以透過`字典樹/前綴樹(Tire Tree)`。  
1. 按著`Words` List 建立`Tire Tree`，並為每個`Node`設置一個`Counter`，用於計數有多少個字符有相同的prefix。
2. 按著`Words` 遍歷`Tire Tree`並將經過的`Tree Node`的`Counter`的數值累加起來，便會得到`words[i]`的分數。

```c++
class TrieTree {
    public:
        TrieTree(){
            children = vector<TrieTree*>(26,nullptr);
        }
        int samePrefixCount = 0;//how many string have the same prefix
        vector<TrieTree*> children;
    
};


class Solution {
public:
    vector<int> sumPrefixScores(vector<string>& words) {
        TrieTree *root = new TrieTree();
        for(int i = 0;i<words.size();i++){
            BuildTree(words[i],root);
        }
        
        vector<int> res(words.size(),0);
        for(int i = 0;i<words.size();i++){
            res[i] = countPrefixSum(words[i],root);
        }
        
        return res;
    }
    
    void BuildTree(string& str, TrieTree *root){
        TrieTree *head = root;
        for(int i = 0;i<str.length();i++){
            if(head->children[str[i] - 'a'] == nullptr) head->children[str[i] - 'a'] = new TrieTree();
            head = head->children[str[i] - 'a'];
            head->samePrefixCount++;
        }
    }
    
    int countPrefixSum(string& str, TrieTree *root){
        int count = 0;
        TrieTree *head = root;
        for(int i = 0;i<str.length();i++){
            head = head->children[str[i] - 'a'];
            count += head-> samePrefixCount;
        }
        return count;
    }
};
```

## 總結
今天這4道題可能是比較簡單，所以才能順利的做完。接下來每週都會去參加**LeetCode競賽**，不論有沒有做出來都會寫一篇文章做總結。希望自己能透過競賽知道自己的不足之處！