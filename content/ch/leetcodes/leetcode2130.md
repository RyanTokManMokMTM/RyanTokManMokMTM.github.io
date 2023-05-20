---
title: "Leetcode2130"
date: 2023-05-18T15:44:17+08:00
draft: false
tags:
    - list
    - two pointer
categories:
    - leetcode
---
## LeetCode 341 - Flatten Nested List Iterator
In a linked list of size n, where n is even, the ith node (0-indexed) of the linked list is known as the twin of the (n-1-i)th node, if 0 <= i <= (n / 2) - 1.

For example, if n = 4, then node 0 is the twin of node 3, and node 1 is the twin of node 2. These are the only nodes with twins for n = 4.
The twin sum is defined as the sum of a node and its twin.
Given the head of a linked list with even length, return the maximum twin sum of the linked list.

example
```
Input: head = [5,4,2,1]
Output: 6
Explanation:
Nodes 0 and 1 are the twins of nodes 3 and 2, respectively. All have twin sum = 6.
There are no other nodes with twins in the linked list.
Thus, the maximum twin sum of the linked list is 6. 
```
```
Input: head = [4,2,2,3]
Output: 7
Explanation:
The nodes with twins present in this linked list are:
- Node 0 is the twin of node 3 having a twin sum of 4 + 3 = 7.
- Node 1 is the twin of node 2 having a twin sum of 2 + 2 = 4.
Thus, the maximum twin sum of the linked list is max(7, 4) = 7. 
```
```
Input: head = [1,100000]
Output: 100001
Explanation:
There is only one node with a twin in the linked list having twin sum of 1 + 100000 = 100001.
```

## How can we solve this problem?
The question told us the length of the given list will be even. So, We can try to use two-pointer approach to find out which node is the n/2<sup>th</sup>. After we found it out, there's a problem we are facing on, is that the twins node of the n/2<sup>th</sup> is n/2 - 1<sup>th</sup> node. Thus, we need to reverse all nodes before n/2<sup>th</sup> node. Then we can keep moving the pointer and find the maxinum twin's til the end of the list.  

A simple graph of this approch
```
Orignal List: a->b->c->d->e->f
the n/2th node : d

reverse all nodes before b:
a<-b<-c d->e->f

both list has the same length ,the ending condtion will be either list a or list b.
```
#### Solution(Recursion):
我們可以在`initial`透過Recursive Function來遍歷`Input`,並把所有`Integer`先Push到Array/List裡面。然後在定義一個pointer用於存取`Next`的值即可。
```c++
/**
 * // This is the interface that allows for creating nested lists.
 * // You should not implement it, or speculate about its implementation
 * class NestedInteger {
 *   public:
 *     // Return true if this NestedInteger holds a single integer, rather than a nested list.
 *     bool isInteger() const;
 *
 *     // Return the single integer that this NestedInteger holds, if it holds a single integer
 *     // The result is undefined if this NestedInteger holds a nested list
 *     int getInteger() const;
 *
 *     // Return the nested list that this NestedInteger holds, if it holds a nested list
 *     // The result is undefined if this NestedInteger holds a single integer
 *     const vector<NestedInteger> &getList() const;
 * };
 */

//calling hasNext -> next
class NestedIterator {
    vector<int> ans;
    // vector<NestedInteger> list;
    int cur = 0;
    void getValue(vector<NestedInteger>& data){
        for(int i = 0;i<data.size();i++){
            if(data[i].isInteger()) ans.push_back(data[i].getInteger());
            else getValue(data[i].getList());
        }
    }
public:
    NestedIterator(vector<NestedInteger> &nestedList) {
        getValue(nestedList);
    }
    
    int next() {
        return ans[cur++];
    }
    
    bool hasNext() {
        return cur < ans.size() ? true:false;
    }
};

/**
 * Your NestedIterator object will be instantiated and called as such:
 * NestedIterator i(nestedList);
 * while (i.hasNext()) cout << i.next();
 */
```

#### Solution:
```c++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    int pairSum(ListNode* head) {
        ListNode* slow = head, *fast = head;
        ListNode* pre = nullptr ,*cur = nullptr, *nxt = nullptr;
        int ans = 0;
        while(fast != nullptr){
            fast = fast->next;
            if(fast != nullptr){
                fast = fast->next;
            }

            //reverse the head list
            cur = slow;
            nxt = slow->next;
            cur->next = pre;
            pre = cur;   
            slow = nxt;
        }

        ListNode* left = pre,*right = slow;

        while(left != nullptr && right != nullptr){
            ans = max(ans , left->val + right->val);
            left = left->next;
            right = right->next;
        }
        return ans;
    }
};
```
