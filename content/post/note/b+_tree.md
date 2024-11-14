---
title: "[筆記] B+ Tree"
description: "b+ tree"
keywords: "b+ tree"
draft: true
date: 2024-10-28T12:23:11+08:00
lastmod: 2024-10-28T12:23:11+08:00

categories:
  - note
tags:
  - data structure

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
#expand: true
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
#url: "b+_tree.html"
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

### 什麼是B+ 樹
我們先看看B+ tree的定義，再來看看他長什麼樣子：  
**定義: **
B+ 樹是一種平衡樹(Balance Tree)，而B+ 樹可以包含二個或以上的子節點，所以是N元平衡樹。 B+ 樹的特點如下：
1. 子節點且非葉子節點中包含n個key，其n個key對應一棵n元樹
2. 葉子節點包含了key的全部的數據，數據只有在葉子節點中命中
3. 子節點包含了其子樹節點的最小/最大的key
4. 對於一棵m元的B+樹，每個子節點最多為m-1個key，也就是最多保存m-1筆紀錄。
5. 相連葉子節點通過pointer連結
6. 節點的元素key的左子樹都是小於這個key，右子樹都是大於或者等於它。 
7. 子節點/葉子階段都是有序的


### B+ 樹操作
我們知道了B+ 樹有序的了，現在對它進行操作：  
1. 查詢  
  1. 根據Key來對B+ tree進行Binary Search來查找。不論找到或者找不到，都會從Root到葉子走出一條路徑。
  2. 從Root開始隨機查詢。
2. 插入
  這裡會有不同的情況:
3. 移除
### 參考

<!--more-->
