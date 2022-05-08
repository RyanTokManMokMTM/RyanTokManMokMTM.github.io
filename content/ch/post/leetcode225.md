---
title: "[Leetcode] Implement Stack using Queues(EASY)"
date: 2022-05-05T09:39:35+08:00
draft: false
tags:
    - stack
    - queue
    - design
categories:
    - leetcode
---


## LeetCode 225 - Implement Stack using Queues
Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (`push`, `top`, `pop`, and `empty`).

Implement the `MyStack` class:
* void `push(int x)` Pushes element x to the top of the stack.
* int `pop()` Removes the element on the top of the stack and returns it.
* int `top()` Returns the element on the top of the stack.
* boolean `empty()` Returns `true` if the stack is empty, `false` otherwise.

**Notes**:
* You must use only standard operations of a queue, which means that only `push to back`, `peek/pop` from front, `size` and is empty operations are valid.
* Depending on your language, the queue may not be supported natively. You may simulate a queue using a list or deque (double-ended queue) as long as you use only a queue's standard operations.


example
```
Input
["MyStack", "push", "push", "top", "pop", "empty"]
[[], [1], [2], [], [], []]
Output
[null, null, null, 2, 2, false]

Explanation
MyStack myStack = new MyStack();
myStack.push(1);
myStack.push(2);
myStack.top(); // return 2
myStack.pop(); // return 2
myStack.empty(); // return False
```

## How can we solve this problem?
這題就是要我們用`Queue`來模擬`Stack`。做這題之前我們要先知道`Queue`和`Stack`的差異。
* `Queue`是First In First Out, 也就是先進去的element會先被拿出來
* `Stack`是First In Last Out, 也就是先進去的element最後才會被拿出來  

`push(int x)`:  
如果要用`Queue`來模擬`Stack`就要注意在`Queue`中的最後一個元素會是`Stack`的第一個元素。所以，這題我們可以用比較簡單粗暴的方式來解決。因為我們已經知道後進(`Last In`)`Stack`的值會是第一個元素。因此,我們可以直接用一個`variable`保存最後插入進`Queue`的element即可。  

`pop()`  
如果我們要移除element，就必須要將`Queue`的最後一個元素搬到最前面，同時因為最前面的元素會被移除，所以我們用於保存最後插入進`Queue`的`variable`所記錄的值也必須被改變，變成`Queue`的倒數第二個element。因此我們要先將`Queue`中最後的2個element搬到最前面，第一個便是我們`stack`的`top`,而第二個是我們要`pop`的element。最後，我們記錄完`top`的值後，插入到`Queue`的尾巴，並返回要`Queue`的`front`即可。

`clear()`:    
只需將空的`Queue`取代成當前不是空的`Queue`即可。

`empty()`:  
只需檢查`Queue`是否為`empty()`即可。

#### Solution:

```c++
class MyStack {
public:
    queue<int> q;
    int t;
    // queue<int> q2;
    MyStack() {
        
    }
    
    //O(N)
    void push(int x) {
        // q2.push(x);
        // while(!q.empty()){
        //     q2.push(q.front());q.pop();
        // }
        // q = q2;
        // clear(q2);
        q.push(x);
        t = x;
    }
    
    //O(1)
    int pop() {
        // if(empty()) return -1;
        // int value = q.front();q.pop();
        
        //get the last 2 elements
        int size = q.size();
        while(size-- > 2) {
            q.push(q.front());
            q.pop();
        }
        
        //getting the 2th top value in stack
        t = q.front();
        q.push(q.front()); //push it at the back of the queue
        q.pop();
        
        //getting the 1th top value in stack
        int popVal = q.front();
        q.pop();
        return popVal;
    }
    
    void clear(queue<int>& q){
	    queue<int> empty;
	    swap(empty, q);
    }
    
    int top() {
        // if(empty()) return -1;
        // return q.front();
        return t;
        
    }
    
    bool empty() {
        return q.empty() ? true : false; 
    }
};

/**
 * Your MyStack object will be instantiated and called as such:
 * MyStack* obj = new MyStack();
 * obj->push(x);
 * int param_2 = obj->pop();
 * int param_3 = obj->top();
 * bool param_4 = obj->empty();
 */
```


