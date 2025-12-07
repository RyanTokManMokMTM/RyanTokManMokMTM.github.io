---
title: "[筆記] 資料庫索引(index)"
description: |
  深入解析資料庫索引機制：B+ Tree、聚簇索引、二級索引、複合索引
  探討索引如何提升查詢效率，包含回表機制和索引規則
  以 MySQL InnoDB 為例的實務應用指南
keywords: "database,index"
date: 2024-12-02T23:31:33+08:00
lastmod: 2024-12-02T23:31:33+08:00

categories:
  - note  
tags:
  - database

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
toc: true
# 绝对访问路径
# Absolute link for visit
#url: "database-index.html"
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

## 前言
之前的文章中，我們有簡單探討過事務相關的課題，而在這篇文章就主要討論 Index 索引相關的課題！ 而索引也跟 B+ tree 相關，如果不了解B+ tree的同學可以去參考之前討論[平衡樹的文章](/achievement/note/balance-tree)。

## 簡介
不知道大家有沒有在學習或者在網上在找資料優惠資料庫查詢效率的時候大部分的答案都是說「**加索引**」，在這篇文章中就會對「索引」進行簡單的探討。 
在開始之前想先給讀者一些問題進行思考，並在閱讀本文過後再給出回答：
1. 什麼是索引？
2. 為什麼加了「索引」可以提高查詢效率？
3. 索引提高查詢效率的同時，能否再進一步提高效率呢？

**本文是以MySQL和InnoDB為前提進行的討論!**

## 索引(Index)
### 什麼是索引
相信大家都有看過書對吧？沒看過也沒有關係，這邊就簡單介紹一下索引的概念吧！  
如果大家在要幾百頁的書本裡面找到某一個特定的資料，那我們是不是會選擇到書本目錄中尋找呢？而這一頁也就是所謂的「目錄/索引頁(Index)」，透過查閱索引頁就能很快的找到

**書本目錄為例：**  
**Harry Potter And The Chamber Of Secrets 的目錄頁：**  
![book-index](/imgs-custom/helper/sql-index/harry-potter-index.png)

如果我們要看*Ch.9*，透過查看目錄就可以知道它在書本的 page 148，直接跳到148頁就好了。  

在資料庫的層面上，也是一樣的情況，我們可以直接透過索引來快速的找到資料。那資料庫的索引到底長什麼樣子呢？  
假設我們有以下情境：
![data](/imgs-custom/helper/sql-index/data.png)

現在從圖中我們可以看得出來，數據頁1因滿了，插入新數據後就會被分成兩頁了，這樣如果我們要查詢數據的時候要怎麼知道數據都放在了那一頁上呢？  
這裡我們是不是就需要一個新的數據頁來保存那些數據在那一頁，而這個用來保存數據的頁就叫做**索引頁**。
![index-page](/imgs-custom/helper/sql-index/index-page.png)

隨著數據的增加，索引頁也會增加，也就變成我們我們熟悉的「B+ Tree」，所以索引樹也就是B+ Tree。
![B+index-page](/imgs-custom/helper/sql-index/B+index-tree.png)

### 資料庫索引的種類

1. Primary key index(主鍵索引/ 聚簇索引)
2. Secondary Index (普通索引 / 二級索引) 
3. Composite Index (複合索引 / 聯合索引)

#### Primary key index(聚簇索引/聚簇索引)

聚簇索引是一種唯一的索引，由InnnoDB自己生成的index。 
聚簇索引有以下特點：
1. 聚簇索引樹中的非葉子節點用單鏈表連接。
2. 聚簇索引樹中的葉子節點中包含了完整的資料  

#### Secondary Index (普通索引 / 二級索引)

聚簇索引只有在查詢條件包含主鍵時，才會生效。如果要查詢的條件不包含主鍵，那麼就不會生效。怎麼辦呢？ 若要加快其他條件的查詢效率，我們可以為條件添加一個索引。**添加索引後，會為該條件建立一顆新的索引頁**。  也就是主建索引頁跟二級索引頁是分開的。  
為`age`這個欄位了一個index，就會建立一個新的索引頁。而這個二級索引頁跟聚簇索引頁的區別是：
1. 二級索引頁除了包含主鍵ID外，還包含了 `age` 這個欄位的值。
2. 二級索引頁中的葉子節點不包含全部的數據。
3. 二級索引頁排序根據 `age` 欄位的值。

#### Composite Index (複合索引 / 聯合索引) 

複合索引（Composite Index）是指在一個資料表中同時使用多個欄位來建立索引的情況。這邊跟普通索引的差不多的，只是建立的索引會包含多個不同的欄位。
例如為`age`和`name`這兩個欄位建立一個複合索引。不過這裡值得注意的是,**建立(`age`,`namge`)以及建立(`name`,`age`)是不一樣的，他們會建立不同索引樹！**
這邊先不說這兩個索引樹的差別，先賣個關子xD。
而這個複合索引頁跟二級索引的區別是：
1. 複合索引除了主鍵ID外，還包含了多個欄位的數據。
2. 其他的二級索引無疑

在討論其他課題前，在這邊有一條問題要大家思考：  
Q: **除了聚簇索引樹外，主建ID在這邊的作用會是什麼呢？ 這裡交給讀者思考一下，哈哈哈。**

### InnoDB索引規則
在討論添加索引的規則之前，我們先來看看一句查詢是如何透過索引來找到資料的。
假設我們現在有如下這個資料庫表：
![user-example](/imgs-custom/helper/sql-index/example-index-user.png)
*這邊只是簡單的示範一下，圖中只包含前幾筆資料用作演示*

#### 查詢條件包含主鍵 
```sql
select * from user where id = 12;
```
因為我們的User表格包含了聚簇索引樹，對聚簇索引樹進行Binary search就很快的找到了，id = 12的資料。
![pk-index-search](/imgs-custom/helper/sql-index/pk-index-search.png)
*查詢路徑為橘色路徑*
最後得出結果為:
```json
{
  "id": 12,
  "name": "Jonna",
  "age": 18,
}
```

從上面的圖中可以看到,查詢條件包含了主鍵的情況下，透過索引就很快的找到資料。

#### 查詢條件不包含主鍵
現在為User表格添加二級以及聯合索引,索引分別為一下：  

二級索引： `age`, 並生成一些索引樹(index), 這邊我們簡稱為「Age 二級索引樹」。
![age-2nd-index](/imgs-custom/helper/sql-index/2nd-index-tree.png)

聯合索引： （`age`,`name`） 並生成一些索引樹(index), 這邊我們簡稱為「Age&Name 聯合索引樹」。  
![composite-index](/imgs-custom/helper/sql-index/composite-index-tree.png)

從上面圖可以看得出來 *「二級索引」* 以及 *「聯合索引」* 的主要區別是: 
- 聯合索引會包含1個或者多個非唯一欄位的數據
- 二級索引會包含1個唯一欄位的數據

---

現在來模擬包含「二級索引」以及「聯合索引」的查詢情境：
1. 查詢「二級索引」的查詢語句
```sql
select `id`,`age` from user where age = 18;
```

這裡的查詢語句包含了 `where age = 18` 這個查詢條件，而且我們也為`age`這個欄位建立了索引，所以直接透過「Age 二級索引樹」查詢資料，以下為查詢路徑:
![age-2nd-index-search](/imgs-custom/helper/sql-index/2nd-index-search.png)

從圖中可以清晰看到，透過Binary Search 很快就能找到`age = 18`的資料。而在葉子節點中，也包含了查詢的資料 (select `id`,`age`)，因此直接返回就好了。
最終結果為：
```json
{
  "id" : 54,
  "age": 18
}
```


2. 查詢「聯合索引」的查詢語句
```sql
select `id`, `age`, `name` from user where age = 89 and name = "Ken";
```

這裡的查詢語句包含了 `where age = 89 and name = "Ken"` 這個查詢條件，而且我們也為`age`和`name`欄位建立了聯合索引，所以直接透過「Age&Name 聯合索引樹」查詢資料，以下為查詢路徑:
![composite-index-search](/imgs-custom/helper/sql-index/composite-index-search.png)
從圖中可以清晰看到，透過Binary Search 很快就能找到`age = 89`和`name = "Ken"`的資料。而在葉子節點中，也包含了查詢的資料 (select `id`,`age`,`name`)，因此直接返回就好了。
最終結果為：
```json
[
  {
  "id" : 44,
  "age": 89,
  "name": "Ken"
  },
  {
  "id" : 77,
  "age": 89,
  "name": "Ken"
  }
]
```

有人可能會問：**「上面兩個查詢語句都包含了查詢『索引樹的數據』，但如果要獲取其他數據怎麼辦？」**  
還記得上面有問過讀者一個問題嗎？**「ID在除了主建索引樹外的索引中的作用會是什麼呢？」**。這裡就可以回答以上的這個問題了，哈哈哈！  
我們有了這個主鍵ID，是不是就拿著這個ID回到聚簇索引樹就可以獲取完整的數據了(聚簇索引樹葉子包含了完整的數據)! 這個透過其他索引樹拿取ID再回到聚簇索引樹獲取數據的方式就是 **「回表 (Back to the table)」**。

但是除了回表外，這裡的ID還有另外的作用。就是當數據都一樣的情況下，怎麼排序？因為主鍵是唯一的，是不是就可以透過ID來排序了！  
![duplicated-data-sorting](/imgs-custom/helper/sql-index/duplicate-data-sorting-by-id.png)

#### 進一步提高索引查詢效率
從上面的介紹過後，我們都對 **「索引是什麼」** 以及 **「索引如何加快查詢」**有個基本的理解，但是在運用上，我們要如何運用索引提高查詢效率呢？接下來給大家介紹一下。   
其實要進一步提高查詢的效率，就是減少 **「回表(Back to the table)」** 這個動作。  

**為什麼要減少回表或者避免回表呢？**  
假設現在我們獲取到了查詢數據的ID，需要透過查詢聚簇索引樹來獲取完整的數據，然而非聚簇索引樹的數據的的排序方式是根據欄位的值來進行排序的，而非ID。若所需回表的數據就已經在記憶體中了，這樣效率不會太差，但需要到硬碟中讀取的話需要做IO的操作，而且所需所在頁可能分佈在了在不同位置上，從而導致隨機IO的情況(例如數據一共有10個頁，數據在第一頁跟最後一頁，就要讀取2個頁，而且不是在鄰近的位置)。

以下介紹的方法都是減少回表的方法，這些方法都是在查詢的時候透過索引來獲取數據的。

##### 索引覆蓋(Index Cover)
其實上面的例子就有出現過索引覆蓋的方法，簡單來說就是查詢的數據在索引樹中已經包含了，也就沒有必要再透過回表的方式來獲取數據了。  
例如上述的`select age from user where age = 18` 這個查詢語句中，查詢的數據在二級索引樹中已經包含了，所以就不用再透過回表的方式來獲取數據了，直接返回就好了。

##### 索引下推(Index Condition Pushdown，ICP)
這樣是資料庫引擎(InnoDB)所提供的功能，我們無需自行操作，默認是開啟的。 **MySQL5.6 才支持 ICP**
這邊舉例說明就會知道什麼是「索引下推」了。  

我們現在建立一個複合索引 (`age`,`name`), 並執行以下查詢語句：   
```sql
select `id`, `age`, `name` from user where age = 89 and name like "%en";
```

這裡只有`age`是可以走索引的，而模糊查詢`name`是無法走索引的，因為name沒有被覆蓋到，因此需要透過回表的方式來獲取數據。

在沒有ICP的情況下，會透過回表的方式來獲取數據，接著資料庫引擎在回傳所有符合`name = 89`的數據到 `Server` 層，最後 `Server` 層再透過 `where` 條件把不符合的模糊查詢 `name` 的數據過濾掉。

假設我們現在有一個情況，資料庫中有1萬條數據是符合`age = 89`，但`name`以`en`結尾的就只有1筆數據，在這樣的情況下，是不是就是要回表1萬次，最後在把1萬條數據返回給伺服器層再透過 `where` 條件把不符合的模糊查詢 `name` 的數據過濾掉？最後返回給 `Client` 的缺只有1筆數據，這樣效率會很差。

在有ICP的情況下，這樣的過濾方式直接在引擎層來完成。在我們的例子中`name`剛好是聯合索引的一部分，所以直接透過聯合索引的 `name` 欄位來判斷`name`是否包含`en`結尾，最後只有1筆數據符合，也就是只有1筆數據會進行回表操作。最後返回給 `Server` 的也就只有1筆數據。 從1萬次回表操作優化到了1次，大大提交了效率！ 
這裡的重點的無法走索引的條件**是索引的一部分**才能透過索引下推的方式。


### 索引失效
有些情況下索引會失效，譬如說使用對索引使用了函數(SUM,AVG等)、比較反向運算子(<>, != 等)等等。但這邊就先不討論這些情況，就討論一下最常見的最左匹配原則以及模糊查詢的情況

##### 最左匹配原則(Leftmost Match) 
什麼是最左匹配原則呢？我們建立聯合索引的時候，會根據從左至右的順序來建立索引樹，例如(A,B,C)這個索引樹的規則就是這樣的:  
如果數據A欄位的數據相同，就會根據B的數據來進行比較，如果B欄位的數據也相同，就會根據C欄位的數據來進行比較。最後葉子節點的排序就是根據這個索引(A,B,C)。  

![leftmost-match](/imgs-custom/helper/sql-index/leftmost-match.png)
從圖中先根據`age`欄位進行了排序，同樣為`age = 1`的，則根據`name`繼續排序，最後再根據`code`進行排序，若都一樣則會用ID作為最後排序。  
若符合最左匹配原則的話，就可以透過這顆索引樹來獲取數據，而不需要全表掃描。什麼情況是符合最左匹配原則呢？很簡單，只要查詢順序根據建立索引時候的順序來進行查詢就好了。  

我們的索引是: (`age`,`name`,`code`),以下情況都可以走這個索引
```sql
select `id`, `age` from user where age = 18;
```
因為包含了索引最左邊的`age`，所以符合最左匹配原則。

```sql
select `id`, `age` from user where age = 18 and name = "Jonna";
select `id`, `age` from user where name = "Jonna" and age = 18;
```
這2句都可以走索引，因為也包含了`age`這個最左的欄位，而且不用理會他們的順序問題，因為優化器會幫我們優化！

但如果是這種情況就會失效
```sql
select `id`, `age` from user where name = `Andy`;
```
因為我們的索引是是先根據`age`來進行排序的，如果要先找`name`這筆數據的話，而`name`沒有`age`過濾的情況下尋找，就跟全表掃描一樣的效果。因為只看`name`的數據在這個索引樹中是沒有排序可言的，可能`Andy`在最前面，另外一個`Andy`在最後面，都不知道哪個在前面，所以就是全表掃描的效果。

所以一句話概況就是**最左索引欄位**要包含在查詢條件中,才能走這顆索引樹。

##### 模糊查詢
只有以下這幾種情況模糊查詢會導致索引失效:
- `name LIKE %en`
- `name LIKE %en%`

因為我們的索引樹根據字符進行排序的，而以上的情況都不考慮`name`前面的字符串為何，也就無法進行比較，所以就會進行全表掃描。

不過`name LIKE ke%`這種情況下,依然可以走索引，因為可以對值進行前綴匹配(Prefix match)。

## 總結
在這邊文章中，我們簡單的討論了：
- 索引是什麼以及索引如何加快搜尋的
- 如何在高效使用Index以及什麼是回表操作並避免回表操作
  - 索引覆蓋(Index cover)
  - 索引下推(Index Condition Pushdown) 
- 索引失效的常見情況
  - 最左匹配原則(Leftmost-match)
  - 模糊查詢(LIKE)

還記得前面給各位讀者提出的問題嗎，相信各位讀者心中已經知道答案了，這裡我就不再重複了xD。
1. 什麼是索引？
2. 為什麼加了「索引」可以提高查詢效率？
3. 索引提高查詢效率的同時，能否再進一步提高效率呢？ 

希望這篇文章讓大家對索引有更深入的了解，謝謝大家！  
如果有任何補充或者錯誤，歡迎在留言區留言喔!

## 參考資料
[聊一聊怎么用好MySQL索引这件事儿](https://juejin.cn/achievement/7075528696748048420#heading-13)  
[MySQL 系列文 - 索引的相關知識(5) - 何謂 ICP (Index Condition Pushdown)](https://ithelp.ithome.com.tw/articles/10230362)  