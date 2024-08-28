---
title: "[筆記]Traversal Graph(圖)"
date: 2022-09-08T10:34:50+08:00
draft: true
categories:
    - coding
---
> 總所周知Binary Tree也是圖的一種(單向無環圖)。所以,今天這裡以Binary Tree 為例。
# Introduction
如果今天我們需要以**特定**的方式遍歷一棵*Binary Tree(圖的一種)*我們怎麼做呢? 我們可以透過DSF(深度優先搜尋)以及BFS(廣度優先搜尋)來幫助我們遍歷**Binary Tree**
> DFS - Depath-First Search(深度優先搜尋)其核心理念就是在遍歷Binary Tree時會先遍歷Tree的高度/深度，直到所有Node都被遍歷過。簡單來說就是從root節點出發,沿著Tree的深度遍歷節點(先往下(深度)遍節點，再往右邊(廣度)遍歷)。  
> 透過DSF方式,我們可以獲得Binary Tree的拓撲排序表。前序遍歷(Preorder),中序遍歷(Inorder)以及後續遍歷(PostOrder)  
> * 前序遍歷(Preorder) - Rule: Visit(self) -> left-child -> right-child
> * 中序遍歷(Inorder) - Rule: left-child -> Visit(self) -> right-child
> * 後續遍歷(Postorder) - Rule: left-child -> right-child -> Visit(self)

舉個例子:  
![tree](/imgs/note/tree-example.png)
**Preorder Traversal(VLR)**
1. 查看當前node的val
2. 移動到Left-child
3. 移動到Right-child

```
根據上面這個規則,我們就會得出一下結果:  
[1,2,4,3]
```
---
**Inorder Traversal(LVR)**
1. 移動到Left-child
2. 查看當前node的val
3. 移動到Right-child

```
根據上面這個規則,我們就會得出一下結果:  
[4,2,1,3]
```
---
**Postorder Traversal(LRV)**
1. 移動到Left-child
2. 移動到Right-child
3. 查看當前node的val
```
根據上面這個規則,我們就會得出一下結果:  
[4,2,3,1]
```

從以上例子我們可以發現透過不同的遍歷方式，可以得到一顆**Tree**的不同的拓撲排列。竟然我們能從**Tree**中得到拓撲排序，哪我們能不能從拓撲排序中反推會一棵Tree呢? 對於這個問題,我們先來分析一下這幾個拓撲排序的結構。

*PostOrder(前序) - [1,2,4,3]*  
在前序拓撲中,我們能看出什麼呢?好像暫時什麼都沒看出來，只知道`1`會是**Tree**的**Head**

*Inorder(中序) - [4,2,1,3]*  
在中序拓撲中,仔細觀察的話可以看得出某個數字的**左邊會是Tree的左邊的Node**,而**右邊則會是在Tree的右手邊的Node**。例如: `1` -左[4,2], `1` - 右[4],我們再回去看圖,是不是就我們所說呢?

*Postorder(後序) - [4,2,3,1]*  
在後序拓撲中,我們能看出什麼呢?好像暫時什麼都沒看出來。

從以上分析來看光靠其中一個拓撲排列並不能反推回一棵樹，哪我們是不是可以透過幾個拓撲結構回推呢? 

*透過中序和前序*  

`前序:[1,2,4,3]` , `中序:[4,2,1,3]`  
1. 從前序中找到**Node Head**(通常都為未訪問的第一個為Head)
2. 再根據這個**Node Head**去中序中找到該**Node**的左邊的**Node**以及右邊**Node**
3. 回到第一步,直到所有node都被訪問過

```markdown
例如:  
首先,我們知道Root是1 : 前序:[2,4,3]  
從中序我們得知左:[4,2],右:[3] -> 因為右邊只有1個值,所以直接會是right-sub tree的Head : 前序:[2,4]  
左手邊的Head會是前序的第一個值,也就是2。再根據中序,得知道2的左:[4],右:[1,3](已經被訪問過了),所以只剩下4,插入到2的左手邊，同時前序也剩下4未被訪問 : 前序:[]

最後整棵樹會是
            1
        2       3
    4 

```

<!-- 首先,我們先要知道目前的head是多少,從前序中我們知道是`1`, 哪些node是`1`的左子樹和右子樹的node呢?   
從中序中我們知道是`1`的左邊包含了`[4,2]`,而右邊則包含了`[3]`。問題又來了，左邊的哪個node會是`1`的左子樹的`head`呢?,我們在回到前序`1`的下一個node會是`2`,哪2將會是`1`的左子樹的head,然後再回到中序，查看`2`的左右node就可得知道`2`的左邊是`[4]`,右邊`[1,3](1是2的parent) - 無視`，因為`2`的左邊只有1個node,而前序中`2`的下一個是`4`。所有`2 left-> 4` -->


> BFS - Breadth-First Search(廣度優先搜尋)其核心理念就是在遍歷Binary Tree時先遍歷廣度/寬度，直至所有Node都被遍歷。透過BFS,我們可以知道Binary Tree的最大深度。簡單而言就是，從root的節點開始遍歷，並沿Tree的寬度遍歷節點(先遍歷完同一層的Node後，再遍歷下一層)。  