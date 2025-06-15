---
title: "[Leetcode] Reverse Linked List II(Medium)"
date: 2022-07-21T11:09:21+08:00
draft: false
tags:
    - list
    - recursive
categories:
    - leetcode
---




## LeetCode 92 -  Reverse Linked List II
Given the `head` of a singly linked list and two integers `left` and `right` where `left <= right`, reverse the nodes of the list from position `left` to position `right`, and return the *reversed list*.

example
```
Input: head = [1,2,3,4,5], left = 2, right = 4
Output: [1,4,3,2,5]
```
```
Input: head = [5], left = 1, right = 1
Output: [5]
```

## How can we solve this problem?
這一題的問題非常的簡單,就是要讓我們在給定的一個`list`中翻轉(Reverse)`[left,right]`之間的Node,並返回結果。這題跟**Reverse Linked List I**解法類似,不同的是多了個翻轉範圍。  
首先，我們要做的是在的翻轉的開始的位置。然後再透過recursive來翻轉List,最後返回的`node/head`再由`left`位置的Node的前一個`Node`接起來(如有)就可以了~

![LeetCode92](/imgs-custom/leetcodesHelper/92-helper.png)
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
    ListNode* theNodeAfter = nullptr;
    // ListNode* pre = nullptr;
    // ListNode* starting = nullptr;
    // ListNode* last = nullptr;
    // ListNode* first = nullptr;
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        // if(head->next == nullptr) return head;
        // if(left == right) return head;
//         //getting the starting point
//         int n = right - left;
//         starting = head;
//         while(--left > 0){
//             pre = starting;
//             starting = starting->next;
//         }
//         // cout << starting->val << endl;
//         reverseList(0,n,starting); //reverse list between left and right
//         if(pre != nullptr) pre->next = first;
//         else head = first;
//         last->next = afterBreak;
        if(left == 1){
            //found
            //reverse the list
            return reverseList(right,head); //reverse the list and return the new head which node is the right node
        }
        
        head->next = reverseBetween(head->next,left - 1,right - 1); //keep finding the starting point
        return  head;
    }

    
    ListNode* reverseList(int right,ListNode* head){ 
        if(right == 1){
            theNodeAfter = head->next;
            return head;
        }
        
        ListNode* last = reverseList(right-1,head->next); 
        head->next->next=head;
        head->next=theNodeAfter; //
        return last;
    }
    
//     void reverseList(int i ,int n,ListNode* head){ 
//         if(i == n){
//             afterBreak = head->next;
//             head->next = nullptr;
//             first = head;
//             last = head;
//             return;
//         }
        
//         reverseList(i+1,n,head->next); 
//         head->next =nullptr;
//         last->next = head;
//         last = last->next;
//     }
};
```


