---
title: "[筆記] 平衡樹 Balance Tree"
description: "balance tree"
keywords: "balance, tree"
draft: true
date: 2024-10-31T15:28:20+08:00
lastmod: 2024-10-31T15:28:20+08:00
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
#math: mathjax
# 开启各种图渲染，如流程图、时序图、类图等
# Enable chart render, such as: flow, sequence, classes etc
#mermaid: true
---
## 簡介
在講述Balance Tree之前，我們先來看一種情況。現在我們根據數據來建立一棵Binary Tree，譬如說以下的數據 : [4,5,6,7,8,9,10], 我們就會建立出以下這顆Binary Tree:  
![unbalance-tree](/imgs/helper/unblanceTree.png)

從這顆樹上我們會發現它其實就只是一個Linked List，查詢/插入效率還是一樣是O(n)，為了解決這個問題這裡需要**平衡樹**來幫忙解決。 


## 什麼是平衡樹
從上述可見，查詢的效率是取決於樹的深度，那是不是可以將過深的分支平均到其他分支，使得每顆子樹的深度都差不多，是不是就可以大大提高查詢效率了呢？因此，平衡樹(Balance tree)就是為了解決這個問題而誕生的！
將上述例子轉換成平衡樹的話，會變成這個樣子：
![balance-tree](/imgs/helper/balanceTree.png)

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
  ![ll-rorate](/imgs/helper/LL-rotate.png)
  *在fig 2中，對A節點做了旋轉後，BR節點會變成了A節點的左子樹，因為BR節點在原本的樹中為右子樹，所以永遠都會在B節點的右邊且比A小。*

  2. 左右旋轉 - LR rotation
  - 對不平衡樹的左子樹節點做左旋，再對根節點做右旋
  ![lr-rorate](/imgs/helper/LR-rotate.png)

> 右子樹不平衡 - 跟上面差不多，只是做反方向
  1. 右右不平衡 - RR rotation
  - 對不平衡的根節點做*左旋轉*
  ![RR-rorate](/imgs/helper/RR-rotate.png)
  *在fig 2中，對A節點做了旋轉後，BL節點會變成了A節點的右子樹，因為BRL節點在原本的樹中為左子樹，所以永遠都會在B節點的左邊且比A大。*
  2. 右左不平衡 - RL rotation
   - 對不平衡樹的左子樹節點做右旋，再對根節點做左旋
  ![RL-rorate](/imgs/helper/RL-rotate.png)



**平衡樹的問題**
1. 數據多時，自旋處理多
2. 數據多時，樹高度越來越高，影響查詢效率

### 紅黑樹(Red-black Tree)
紅黑色也就是字面上的意思，樹上只有黑色和紅色2種節點。其他紅色和黑色節點不能相鄰，要麼就是紅黑或者黑紅，不能是紅紅或者黑黑。而紅黑書有一下特點：1
1. 優化AVL tree旋轉多的問題，通過2次旋轉就能達到平衡
2. 分為紅色和黑色節點
3. 允許深子樹的高度不超過淺子樹高度的2x就可以，而非相差1層就要做旋轉。

**紅黑樹的操作**

### B樹(B Tree)家族
#### B 樹
#### B+ 樹
#### B- 樹

## 總結 summary
<!-- 
### 為什麼需要平衡樹

### 平衡樹的類型以及簡單介紹
#### AVL Tree

#### Red black Tree

#### B-Tree & B+ Tree

### 參考 -->
<!--more-->
