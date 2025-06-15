---
title: "[筆記] 平衡樹 Balance Tree"
description: "balance tree"
keywords: "balance, tree"
draft: false
date: 2024-10-31T15:28:20+08:00
lastmod: 2024-11-23T15:28:20+08:00
categories:
  - note
tags:
  - data structure
toc: true
# 原文作者
# Post's origin author name
#author:
# 原文链接
# Post's origin link URL
#link:
# 图片链接，用在open graph和twitter卡片上
# Image source link that will use in open graph and twitter card
#imgs:
# 在首页展开内容
# Expand content on the home page
expand: false
# 外部链接地址，访问时直接跳转
# It's means that will redirecting to external links
#extlink:
# 在当前页面关闭评论功能
# Disabled comment plugins in this post
#comment:
#  enable: false
# 关闭文章目录功能
# Disable table of content
#toc: false
# 绝对访问路径
# Absolute link for visit
#url: "balance-tree.html"
# 开启文章置顶，数字越小越靠前
# Sticky post set-top in home page and the smaller nubmer will more forward.
#weight: 1
# 开启数学公式渲染，可选值： mathjax, katex
# Support Math Formulas render, options: mathjax, katex
math: mathjax
# 开启各种图渲染，如流程图、时序图、类图等
# Enable chart render, such as: flow, sequence, classes etc
#mermaid: true
---
## 簡介
在講述Balance Tree之前，我們先來看一種情況。現在我們根據數據來建立一棵Binary Search Tree，譬如說以下的數據 : [4,5,6,7,8,9,10], 我們就會建立出以下這顆 Binary Search Tree:  
![unbalance-tree](/imgs-custom/helper/balance-tree/unblanceTree.png)

從這顆樹上我們會發現它其實就只是一個Linked List，查詢/插入效率還是一樣是O(n)，為了解決這個問題這裡需要**平衡樹**來幫忙解決。 

## 什麼是平衡樹
從上述可見，查詢的效率是取決於樹的深度，那是不是可以將過深的分支平均到其他分支，使得每顆子樹的深度都差不多，是不是就可以大大提高查詢效率了呢？因此，平衡樹(Balance tree)就是為了解決這個問題而誕生的！
將上述例子轉換成平衡樹的話，會變成這個樣子：
![balance-tree](/imgs-custom/helper/balance-tree/balanceTree.png)

這樣我們查詢的效率從O(n)減少到了O(logn)。  
接下來會簡單介紹幾個比較常見的平衡樹

### AVL 樹(AVL Tree) - self balanced binary search tree
AVL樹又稱平衡二元樹，透過節點旋轉的方式使得子樹的高度差介於1之間，也就是說最深的子樹和最淺的子樹之間的高度不會大於1層。  
AVL樹有以下特點：   
1. 基於二元樹(BST)數據結構 
2. 通過自旋的方式建構平衡樹
3. 每個節點保存1筆數據
3. 左右子樹是一棵平衡樹
5. 子節點保存1份數據

**自旋方式**
*找到不平衡tree的根(root)節點對該節點做旋轉，也就是最近的一個祖先(ancestor)。*
**對不平衡樹的root的3個節點做旋轉，其他節點旋時暫時無視，旋轉過後再處理(放到合理的位置)**
> 左子樹不平衡
  1. 左左旋轉 - LL rotation
  就是左子樹的左邊跟右子樹不平衡，這個選擇比較簡單：
  - 對不平衡樹的根節點做*右旋轉*就可以了。
  ![ll-rorate](/imgs-custom/helper/balance-tree/LL-rotate.png)
  *在fig 2中，對A節點做了旋轉後，BR節點會變成了A節點的左子樹，因為BR節點在原本的樹中為右子樹，所以永遠都會在B節點的右邊且比A小。*

  2. 左右旋轉 - LR rotation
  - 對不平衡樹的左子樹節點做左旋，再對根節點做右旋
  ![lr-rorate](/imgs-custom/helper/balance-tree/LR-rotate.png)

> 右子樹不平衡 - 跟上面差不多，只是做反方向
  1. 右右不平衡 - RR rotation
  - 對不平衡的根節點做*左旋轉*
  ![RR-rorate](/imgs-custom/helper/balance-tree/RR-rotate.png)
  *在fig 2中，對A節點做了旋轉後，BL節點會變成了A節點的右子樹，因為BRL節點在原本的樹中為左子樹，所以永遠都會在B節點的左邊且比A大。*
  2. 右左不平衡 - RL rotation
   - 對不平衡樹的左子樹節點做右旋，再對根節點做左旋
  ![RL-rorate](/imgs-custom/helper/balance-tree/RL-rotate.png)

**平衡樹的問題**
1. 數據多時，自旋處理多
2. 數據多時，樹高度越來越高，影響查詢效率

### 紅黑樹(Red-black Tree)
紅黑色也就是字面上的意思，樹上只有黑色和紅色2種節點，是一種BST。主要還優化了AVL Tree旋轉的問題。  

![red-black-tree](/imgs-custom/helper/balance-tree/red-black-tree.png)
#### 紅黑樹的特徵(property)
1. 節點分為紅色與黑色
2. Root節點必須為黑色
3. 紅色節點的子節點(children)必須為黑色(也就是說紅色節點不能相連)
4. 葉子節點都為空的黑色節點
5. 任意節點到葉子節點所包含的黑色節點都為相同的數量
6. 樹的高度h <= 2*log(n+1)



在講解操作之前，先說明一下`樹的高度h <= 2*log(n+1)`
這裡我一顆二元樹為`n`層，最多容納的數量為`2^n - 1`個節點。 這邊給出2個定義：
> h(x): 從節點(x)到葉子節點的高度  
> bh(x): 從節點(x)到葉子節點的黑色節點的高度  

現在我們先從一顆完整二元樹(Complete binary tree)來看(這邊去掉了所有紅色節點):
![complete-bt](/imgs-custom/helper/balance-tree/complete-bt.png)

從上面的節點公式我們可以得出以下結論：  
$$
  2^{hb(x)} + 1 \leq n 
$$$$
  hb(x) \leq log{_2}(n + 1) 
$$

所以說一顆 complete binary tree 的最大高度是不超過 $$log{_2}(n + 1)$$ 的話，那紅黑樹的最大深度`h`, 是不是就是不會超過2倍的`bh(x)`,$$h(x) \leq 2*log{_2}(n+1)$$

**Q: 為什麼是2倍？而不是3倍？4倍？呢**
**A: 因為紅黑樹的定義，紅色節點的字節點必須是黑色，那最理想的狀態是不是就是紅黑相間的樹，也就是說在這顆全黑節點之間插入紅色節點，也就最多插入bh(x)多層的紅色節點**
![proof](/imgs-custom/helper/balance-tree/proof-bh-and-h-rbt.png)


#### 紅黑樹的插入和旋轉
插入新數據時按著以下規則進行插入:
1. 因為是BST，所以跟著BST查詢到合適的位置
2. 插入的節點需為紅色節點
3. 換色/旋轉操作使得符合紅黑樹定義

這裡會有幾個不同的case:
1. 插入的是root - 不符合`root節點為黑色`特徵  
將紅色節點換成黑色就可以了。
![insert-a-root](/imgs-custom/helper/balance-tree/insert-a-root-rbt.png)
2. 插入的節點與它的parent節點都皆為紅色 - 不符合`紅色節點的子節點為黑色`特徵  
    1. parent節點與它的sliding都為紅色的情況:  
       換顏色就可以了 - `parent和sliding 換成黑色，其grandparent換成紅色`
      ![silbing-red](/imgs-custom/helper/balance-tree/silbing-red-rbt.png)
    2. parent節點的sliding都為黑色的情況:
     這裡會有2個case(這裡只說明再左子樹的情況，右子樹也是一樣的做法，旋轉方向不一樣而已。**這裡的旋轉方式跟AST是一樣的！**)
        1. 插入的節點在右子樹
        2. 插入的節點在左子樹  

        旋轉完過後就換顏色就可以了，parent和sibling換成紅色，其grandparent換成黑色，就解決了紅色節點相鄰的問題了
        ![silbing-black](/imgs-custom/helper/balance-tree/silbing-black-rbt.png)

*這些步驟會一直做，直到整顆樹都符合紅黑色的定義。圖中root為紅色的只是簡單演示，可當作其中的一顆subtree。*

#### 紅黑樹建立過程
```txt
基於[0,3,5,7,2,6,4]建立紅黑樹
```
![create-rb-tree](/imgs-custom/helper/balance-tree/create-rb-tree.png)


### B樹(B Tree)家族
AVL tree 以及 red-black tree 都是基於二元樹來做調整和平衡的，但是如果數據很多的情況下，整顆樹的高度是不是就會變得很高，例如`n = 10000`, 其tree 的高度為:  
$$
  h = log{_2}(10000)
$$

因為每個節點最多存一筆數據，使得數據量越大樹的深度就會越深/高。那會不會有一種方法每個子節點並不只保存一筆數據而是可以保存多筆數據呢？B Tree就實作了這個！

#### B-Tree
B樹是一種平衡且多路的搜尋樹，多用於磁盤外部的資料結構。 B樹有以下的特徵：
1. 所有葉子節點都會在同一層
2. 每個節點最多含有`m`個子節點
3. 除了root和葉子節點外，都最少含有`ceil(m/2)`個子節點
4. 如過root節點不是葉子，最少要有2個子節點
5. 每個子節點包含`n`個key，且`ceil(m/2) - 1 <= n <= m - 1`
7. key是按升序排序

![b-tree](/imgs-custom/helper/balance-tree/b-tree.png)

##### B-Tree 簡單查詢
![b-tree-search](/imgs-custom/helper/balance-tree/b-tree-search.png)

##### B-Tree 建立過程例子
![create-b-tree](/imgs-custom/helper/balance-tree/create-b-tree.png)

如果單看資料庫結構的話可能會看不出有什麼問題，但是從硬碟結構的層面來看的話就會有效率的問題了。  
*關於硬碟的結構可以參考[wiki](https://zh.wikipedia.org/zh-tw/%E7%A1%AC%E7%9B%98)的說明，這裡就不多做說明了。*

我們知道了數據是保存在了硬碟的seator(扇區/磁區)的，那就是說有儲存大小的限制。如果按著B-Tree的方式來儲存的話，每次讀取的時候都會把每個節點的數據都完整讀取出來，這樣就會使得每棵tree所能保存的key的大小有限,也就是說可能需要建立多棵樹才能保存多筆相關數據，所以B+ tree就是解決了這個問題。
#### B+ 樹
基於B樹進行了優化。B樹的每個子節點，除了保存了key還都保存了完整數據，導致磁盤每一頁保存的key數據有限。
- 非葉子節點只保存key，不保存數據
- 葉子節點保存了完整數據
- 葉子節點之間都有個pointer形成雙向linked-list

![b+_tree](/imgs-custom/helper/balance-tree/b+tree.png)

## 總結
我們在這邊文章中討論了二元搜尋樹(Binary search tree)的問題，也簡單了介紹了什麼是平衡樹(Balance Tree)以及常用的平衡樹種類:
- AVL Tree
- Red-black Tree
- B Tree
- B+ Tree
這裡也是簡單介紹，如果日後有機會的話會根據每棵樹詳細的寫一篇文章來做探討。

## 參考資料
- [硬碟Wiki](https://zh.wikipedia.org/zh-tw/%E7%A1%AC%E7%9B%98)  
- [AVL-tree](https://www.youtube.com/watch?v=jDM6_TnYIqE)
- [紅黑樹](https://www.youtube.com/watch?v=aPqz3jyl8ak)
- [B樹](https://cloud.tencent.com/developer/article/1691641)
