---
title: "[筆記] 淺談資料庫事務(Transcation)"
description: |
  深入解析資料庫事務機制：ACID特性、隔離級別、一致性問題
  探討幻讀、不可重複讀、髒讀的解決方案
  包含 MVCC 機制和版本鏈的實作原理
keywords: "database,transcation"
draft: false
date: 2024-11-23T22:11:45+08:00
lastmod: 2024-12-01T22:25:45+08:00
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
toc: true
# 绝对访问路径
# Absolute link for visit
#url: "database-transcation.html"
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
這篇文章主要是想要討論一下資料庫筆一個重要的概念**事務(Transcation)**。接下來的文章主要會分成一下幾個部分繼續討論：
1. 什麼是資料庫的事務(Transcation)
2. 事務(Transcation)的4大特性為何
3. 一致性問題和解決方法
4. MVCC和鎖的簡單介紹


## 什麼是事務(Transcation)
在資料庫系統中，我們都會對數據進行讀寫操作，但是如果我們要對數據做一系列的操作(2個或以上的操作)，正在被操作的數據我們不希望能被其他人修改從而影響了結果，而且即便途中操作失敗，也希望他能回到原本的狀態。而資料庫為我們提供一個這樣的方法使得數據的操作要麼是**全部都成功，要麼全部都是失敗**，這就是事務(Transcation)，也可以稱之為「交易」。  

一個很經典的例子「銀行轉帳」，小明給小黃轉100塊。我們期待的操作如下：
1. 小明帳戶減少100塊
2. 小黃帳戶增加100塊

這2部的操作都應該要成功執行才對，不可能小明的帳戶減少了錢，小黃的帳戶沒有增加錢或者小明的帳戶根本就沒錢，還能成功的吧？所以事務(Transcation)就是確保整個交易能夠都完成，或者都是失敗的情況並rollback會到原本的狀態。

## 事務(Transcation)的4大特性
我們可能經常聽到資料庫的ACID，那ACID到底是什麼？能吃的嗎xD？  
ACID 是原子性(Automicity)、一致性(Consistency)、隔離性(Isolatio)以及永續性(Durablity)的簡寫。所有資料庫的事務(Transcation)的操作都需要符合這4個特性，這也稱之為資料庫的ACID特性。

- **原子性(Automicity)**  
什麼是原子性呢？簡單的來說就是整個事務(Transcation)的操作要麼就是全部被成功操作，要麼就是全部都操作失敗，不存在一部分成功一部分失敗的情況。
- **一致性(Consistency)**  
什麼是一致性呢？就是修改的數據必須符合定義好的資料庫規則。例如資料欄位型態、外鍵等。
- **隔離性(Isolation)**  
什麼是隔離性？每個獨立的事務(Transcation)是互相獨立的，不應該受到其他事務(Transcation)的影響。
- **永續性(Durablity)**  
什麼是永續性？就是事務(Transcation)提交後，被永久保存數據到硬碟的意思。  

從上面介紹 ACID 中，ACD 的意思就是字面上的意思很好理解，但是唯獨隔離性`I(Isolation)`比較複雜難懂一些。所以這邊會單獨拿出來討論討論！
### 資源競爭問題
資料庫進行操作不讀就是寫，但在 concurrent 的情況下，對同一資源進行操作就會有一下幾種的問題：
1. Read-Read - 對同一資源進行read的操作，這裡不會存在併發安全的問題。
2. Read-Write - 一方對同一資源進行讀操作，另一方對同一資源進行寫的操作。
3. Write-Write - 雙方都對同一資源進行寫的操作

### Read-Write的問題
如果一個 transaction 先讀，另外一個再寫，接著結束。是不會有並發安全的問題。  
但是 transaction 一般會含有很多個子操作，所以可能會產生以下的一致性問題。  

以下是常見的一致性問題：  

#### 幻讀(Phantom read)
現在有個情境就是T1和T2都對數據表`user_record`進行操作。
1. T1先讀取一次數據表返回了一筆數據
2. T2再對資料表新增/移除了一筆數據並提交了
3. T1再次讀取資料表發現跟上一次查詢的數據的數量不一樣了(出現幻覺了？)

這種在同一個transaction內查詢返回數據數量不一致的情況，我們就叫它**幻讀(Phantom read)**,就像是出現了幻覺一樣。

![phantom-read](/imgs-custom/helper/transactions/phantom-read.png)  

#### 不可重複讀(non-repeated read)
現在有個情境就是T1和T2都對數據表`user_record`進行操作。
1. T1查詢了id為1的user數據
2. T2對id為1的user數據進行了更新並提交了
3. T1再次查詢id為1的user數據，發現跟上一次查詢的數據不一樣了

這種在同一個transaction內查詢返回的數據不一致的情況，我們就叫它**不可重複讀(non-repeated read)**。

![non-repeated-read](/imgs-custom/helper/transactions/non-repeated-read.png)  

#### 髒讀(dirty read)
現在有個情境就是T1和T2都對數據表`user_record`進行操作。
1. T1查詢了id為1的user數據
2. T2對id為1的user數據進行了更新但**還沒提交(commited)**
3. T1再次查詢id為1的user數據，讀取到了另外一個transaction並沒有提交的數據修改

這種在同一個transaction內讀取到另一個transactio還沒被提交的數據，我們就叫它**髒讀(dirty read)**。

![dirty-read](/imgs-custom/helper/transactions/dirty-read.png)


**總結以上這幾個一致性問題**
|問題|解釋|
|:--|:--:|
|幻讀|同一事務(Transcation)中讀取到不同數量的數據|
|不可重複讀|同一事務(Transcation)中讀到到了不同的數據|
|髒讀|同一事務(Transcation)中讀取到了其他事務(Transcation)未被提交的數據|

#### 一致性問題的解決方案
從上述可以看到Read-Write會有可能發生上述的一致性的問題。但是如果在Write-Write的情況下呢？也就是多個transaction都對同一個資訊進行讀寫，這時候會發生什麼問題呢？是不是會發生資源競爭。  
在**寫多讀少**的況下，我們第一個想法是不是就是對競爭的資源加鎖對吧？確實對於**寫多讀少**的情況，確實是要透過加鎖的方式的解決，但是如果是**讀多寫少**的情況下呢？如果也對資源加鎖的話，全部讀數據的操作不就要先等待寫的操作結束了，其他事務(Transcation)才能讀取相關數據。難不成就真的只有加鎖來解決嗎？ 

其實不然，對於寫操作而言要解決一致性問題，就必須透過加鎖的方式來解決，但是對於讀操作而言，我們是不是用一個機制來讀取數據就好了，例如現在有人正在對數據進行修改，我是不是只要知道這個修改前的最新數據是什麼就可以了？可以想像成Git的概念，根據不同情況來讀取不同版本的數據。這個機制就是**MVCC(Multi-Version Concurrency Control)**。   

不過在討論MVCC之前，先來討論一下什麼是**根據不同的情況來讀取不同版本的數據**。
從上面的描述我們知道了，在併發讀取的時候有可能會發生幻讀、不可重複讀、髒讀這幾種情況，這幾種情況也是有影響嚴重性之分的：

![read-consistency](/imgs-custom/helper/transactions/read-consistency.png)

不過這3個一致性問題也只是理論上的知識，所以database會根據隔離級別的定義實作自己的db來解決這些問題。
**4種隔離級別:**
1. Serializable 串行
2. Repeatable-Read 可重複讀
3. Read-Committed 讀已提交
4. Read-Uncommitted 讀未提交

這幾個隔離級別都分別可以解決不同的一致性問題。
![isolation-level](/imgs-custom/helper/transactions/isolation-level.png)

現在對這張圖進行說明：
- **Read-Uncommitted** 這個隔離強度是最低的，可見他完全沒有解決幻讀、不可重複讀、髒讀這幾種一致性問題。
- **Read-Committed** 這個隔離強度只解決了髒讀這個一致性問題。從他字面上可以看的出來，只允許讀取提交了的事務(Transcation)的數據。
- **Repeatable-Read** 這個隔離強度解決了二個一致性問題：幻讀、不可重複讀。
- **Serializable** 這個就是最強的隔離強度，它解決了幻讀、不可重複讀、髒讀這幾種一致性問題。

MVCC就可以根據這幾種隔離級別來解決一致性問題。

##### MVCC(Multi-Version Concurrency Control)
什麼是MVCC呢？  
MVCC的概念就是在讀取數據的時候，不是直接讀取資料庫最新的數據，而是讀取最近一次讀取的數據的數據版本，就像是對數據進行Git的版本控制一樣，通過欄位進行判斷來獲取不同版本的數據。

為了更好的進行說明在這邊就先簡單的說一下MySQL保存日誌的格式:  
![data-field](/imgs-custom/helper/transactions/data-field.png)
- RoolPointer : 等下就會知道他的作用了xD
- TrxId : 這是一個事務(Transcation)的ID，如果沒分配的話就是0
- OtherInfos : 其他的信息
- Datas : 真實的數據

##### 版本鏈 Version Chain
若一筆數據被操作的次數多了，就會通過日誌來記錄每一次的操作資訊並透過`RollPointer`來連接起來,形成一條單向鏈。
![version-chain](/imgs-custom/helper/transactions/version-chain.png)
這邊先從事務(Transcation)100開始進行更新操作，接著就是事務(Transcation)200連續更新了2次，最後再是事務(Transcation)300更新了一次，這樣就形成了一條版本鏈。 資料庫通過版本鏈來控制不同事物訪問對相同數據，這就是MVCC的基本概念。

##### 各隔離級別如何透過版本鏈解決問題
對於隔離級別`read-uncommitted`來說，不需要解決，因為根本就沒差別。  
對於隔離級別`Serializable`來說，需要通過鎖才能實現，MVCC容不下這尊大佛。  

對於其餘的2種隔離級別`Read-Committed`和`Repeatable-Read`來說可以通過版本鏈來解決。現在我們知道了MVCC機制是通過版本鏈來記錄相同數據的不同版本，但問題是**如何通過版本鏈來解決一致性問題**？那些數據才能被當前事務(Transcation)是可讀取的，那些數據是不能讀取呢。這裡InnoDB就提出來一個概念：    
**ReadView**
在 ReadView 裡面保存著一些數據，通過判斷當前事務(Transcation)和ReadView中的數據的版本來判斷這些數據是否可以被讀取。  
- `m_ids` - 在生成RV時，當前系統active的事務(Transcation)的id
- `min_trx_id` - 最小的事務(Transcation)ID，也就是`m_ids`列表中最小的`trx_id`
- `max_trx_id` - 最大的事務(Transcation)ID，也就是`m_ids`列表中最大的`trx_id`
- `create_trx_id` - 建立RV的事務(Transcation)ID

有了這些資料結構後，只要按照規則走就可以知道MVCC的鏈中版本對當前事務(Transcation)是可讀取的/可見的。
1. 從版本鏈的最頂端也就是最新版開始進行判斷
2. 若訪問的版本的`trx_id`與RV的`create_trx_id`相符，可以訪問數據
3. 若訪問的版本`trx_id < min_trx_id`，也就是說在生成RV的時候已經被提交了，可以訪問數據
4. 若訪問版本的`trx_id > max_trx_id`，也就是說在生成RV之後才被建立的，不可以訪問
5. 若訪問的版本的`trx_id`在`min_trx_id`和`max_trx_id`之間，就需要看看`trx_id`是否在`m_ids`中，如果在就表示生成RV的時候是active德狀態，不可以訪問，不在就可以訪問。
6. 如果當前版本對事務(Transcation)不可見，就沿著鏈往下走，並重複步驟1-5。

對於不同的隔離級別`Read-Committed`和`Repeatable-Read`的不同就是生成RV的方式不同:
- `Read-Committed` 每次讀取數據都會生成新的RV
- `Repeatable-Read` 只有在第一次讀取時候才會生成，之後無論多少次select都會使用之前生成的RV

###### 簡單例子
**Read-Committed**
現在我們有3個事務(Transcation)分別為T1, T2 和 T3，他們都會分別對數據表`user_record`進行操作，我們來看看他在隔離級別下的行為會怎麼樣的。
> ！InnoDB預設的隔離級別為repeatable-Read，所以這裡要先設置為read-committed  
![mvcc-example3-read-commited-1](/imgs-custom/helper/transactions/mvcc-example1.png)  

1. T1更新了資料庫中id為1的user數據2次但還沒有commit
2. T2對其他數據表進行了其他操作
3. T3查詢id 為1的數據且還沒commit

你猜T3會傳回來的數據會是什麼呢？  
接下來我們跟著上面所說的步驟來看看會傳回來的數據是什麼。

從版本鏈中看到：
1. `trx_id`為100且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
2. `trx_id`為100且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
3. `trx_id`為99且`trx_id < min_trx_id`,也就是說該版本在建立ReadView的時候已經被提交了，可以訪問數據

所以，最後返回的數據是` { id : 1, name : 'UserA', gender: 'M' }` ，而不是未提交的最新數據 ` { id : 1, name : 'user_u', gender: 'M' }`。是不是很神奇！！

接下來我們再做進一步的操作，看看會傳回什麼數據。
![mvcc-example3-read-commited-2](/imgs-custom/helper/transactions/mvcc-example2.png)  

1. T1 提交了剛才的更新操作
2. T2 更新了數據表2次且還沒提交
3. T3 再次查詢id 為1的數據且還沒commit

這次我們再來看看T3會回傳什麼數據？
從版本鏈中看到：  
1. `trx_id`為200且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
2. `trx_id`為200且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
3. `trx_id`為100且`trx_id < min_trx_id`,也就是說該版本在建立ReadView的時候已經被提交了(就是T1的數據在生成RV之前被提交了)，可以訪問數據

所以，最後返回的數據是T1 提交過後的數據 `{ id : 1, name : 'user_u', gender: 'M' }`

從這個例子可以看到，Read-Committed的隔離級別髒讀(Dirty Read)，但是不可重複讀(Non-repeated Read)還是存在的，因為可以讀取到被提交了的數據。 接下來就說說 Repeated Read 行為會怎麼樣的。

**Repeatable-Read**
其實運作流程跟Read-Committed這個隔離級別很像的，只不過生成RV的時機是只有第一次查詢的時候。我們就拿上面的例子來說一下。
![mvcc-example3-repeated-read-1](/imgs-custom/helper/transactions/mvcc-example1.png)  

1. T1更新了資料庫中id為1的user數據2次但還沒有commit
2. T2對其他數據表進行了其他操作
3. T3查詢id 為1的數據且還沒commit

這裡就不重複說明了，跟上面是一樣的，因為這是T3第一次查詢數據表，然後就會生成一個RV。接下來就是重點呢。最後T3會回傳結果：`{ id : 1, name : 'UserA', gender: 'M' }`

接著進行了以下操作：
1. T1 提交了剛才的更新操作
2. T2 更新了數據表2次且還沒提交
3. T3 再次查詢id 為1的數據且還沒commit  
![mvcc-example3-repeated-read-2](/imgs-custom/helper/transactions/mvcc-example3.png)

可以看到Read View 的內容是跟第一次查詢的是一樣的, 接著我們再按照流程走走看，會發生什麼。  
1. `trx_id`為200且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
2. `trx_id`為200且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
3. `trx_id`為100且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
4. `trx_id`為100且`min_trx_id`和`max_trx_id`之間，且在`m_ids`中存在，所以不能訪問。我們沿著鏈往下走
5. `trx_id`為99且`trx_id < min_trx_id`,也就是說該版本在建立ReadView的時候已經被提交了，可以訪問數據

最後T3再次查詢後的結果依然是`{ id : 1, name : 'UserA', gender: 'M' }`,並非T1提交過後的數據 `{ id : 1, name : 'user_u', gender: 'M' }`了，也就說明了隔離了提交過後的數據了，就是這麼的神奇的機制。

### Write-Write
我們在上面討論完讀一致性是如何解決的，接下來我們來看看寫一致性是如何解決的。寫一致性只能是透過鎖的方式來解決，也就是說我們要將數據鎖住，這樣就能確保只有一個事務(Transcation)可以對數據進行操作，這樣的話就能保證寫一致性了。 

在這裡就簡單介紹一下鎖吧。
#### 鎖Lock
鎖是有顆粒度大小的，就像鎖儲物箱的一個抽屜，跟鎖整個儲物櫃的全部抽屜的區別，一個是只有被鎖的那個抽屜不能使用，而全部抽屜都鎖上的話，整個儲物櫃就不能使用了。所以資料庫也是一樣，鎖的顆粒度包含了2種：
- 行鎖 (Row Lock) - 只鎖其中一行數據
- 表鎖 (Table Lock) - 整個表格都給鎖上  

從不同角度來看這2把鎖的話：
- 大小 : `表鎖`>`行鎖` - 表鎖 = n個行鎖
- 加鎖效率： `表鎖` >`行鎖` ，因為全部行都要加個鎖
- 衝突機率 ： `表鎖` >`行鎖`，行鎖只會擋住鎖的行的數據，表鎖則個表都不允許存取
- 併發性能 ： `表鎖` < `行鎖` ，只對某行數據加鎖，其他行的數據不需要等待


<!-- 
有時候需要把數據鎖上，
1. 例如讀取數時候，其他事務(Transcation)不能寫 
2. 事務(Transcation)`select`需要獨佔數據的時候加鎖，不讓其他事務(Transcation)讀，更不能寫。   -->

若需要把數據上鎖就包含了2個模式：
1. 共享鎖 shared Lock
2. 排他鎖 Exclusive Lock

##### 共享鎖 shared Lock(s鎖 / 讀鎖)
簡稱`s鎖`,可以被其他事務(Transcation)讀取到，也就是多個事務(Transcation)可以共享這個鎖。這把鎖常用於讀取，也被稱爲`讀鎖`。   
<!-- 
**要如何給數據加鎖呢？**
在`select`的時候，添加`LOCK IN SHARE MODE`。例如`select xxxx LOCK IN SHARE MODE`。  
當某個事務(Transcation)使用了這個語句就會獲取到這個數據的`s 鎖`,其他事務(Transcation)也可以使用這個語句來獲取這數據的`s 鎖`  

例如：
T1：
`selecte * from user where id = 1 lock in share mode;`

T2:
`selecte * from user where id = 1 lock in share mode;`
> 同樣可以獲取相同數據，不會因為鎖而卡住 -->

##### 排他鎖 Exclusive Lock(x鎖 / 寫鎖)
簡稱`x 鎖`，當一個事務(Transcation)獲取了某個數據的`x 鎖`，其他事務(Transcation)就不能獲取這筆數據的`x 鎖`和`s 鎖`。通常用於寫，也被稱為`寫鎖`。  
<!-- 
**要如何給數據加鎖呢？**
1. 自動加鎖：
當對機率進行update/delete的時候，會自動對這筆紀錄添加`x 鎖`
2. 手動加鎖
`select xxx FOR UPDATE`的方式添加`x 鎖`，其他事務(Transcation)就不能在獲取了。

例如：
T1:
`update user set name = "test" where id = 1`

T2:
> 被Block住，無法獲取
`select * from user where id = 1 lock in share mode;` 
> 被Block住，無法獲取
`select * from user where id = 1 FOR UPDATE`
> 被Block住，無法獲取
`delete user where id = 1`

**當事務(Transcation)commit了或結束，鎖就會被釋放**

--- -->

#### 意向鎖 intention lock
Mysql中有2個基本模式，`表鎖`和`行鎖`。他們也包含了`s 鎖`和`x 鎖`。
- 表的`s 鎖(讀鎖)`,`x 鎖(寫鎖)` 
- 行的`s 鎖(讀鎖)`,`x 鎖(寫鎖)`

描述：
當一個事務(Transcation)給表添加了表級別的`s 鎖`：
- 其他事務(Transcation)可以獲取該表的`s 鎖`，但無法獲取`x 鎖`
- 其他事務(Transcation)可以繼續獲取該表某些行的`s 鎖`，但無法獲取某些行的`x 鎖`

當一個事務(Transcation)給表添加了表級別的`x 鎖`：
- 其他事務(Transcation)無法獲取該表或者行的`s 鎖`和`x 鎖`，也就是什麼都不能做

也就是說**s 鎖與s 鎖相容(都可以獲取s鎖，無法獲取x鎖)**，但**x 鎖會與其他互斥都不能獲取**)  

如果要給行添加一個`s 鎖`，必須保證行和表級都不能有`x 鎖`，如果要添加表的`x鎖`，保證表和行級別都不能有`s 鎖`  (要麼就是x鎖 要麼就是s鎖)
若是行級別還好，但是如果是表級別呢？要一行行的找嗎？

**意向鎖 intention lock**
避免遍歷的最好的方法就是在**表級別添加一個flag**
1. 意向共享鎖(Intension shared lock) - `IS鎖`  
當要給行級別加上`s鎖`，需要在表級別加上`IS 鎖`
2. 意向排他鎖(Intension exclusive lock) - `IX鎖`  
當要給行級別加上`x鎖`，需要在表級別加上`IX 鎖`

這裡一來就可以：
- 如果要給表加上`s 鎖`，只要檢查表有沒有`IX鎖`。如有就表示表中有行級別的`x 鎖`，必須等待`x鎖`被釋放，隨後`IX 鎖`也會被釋放，這個時候就可以加表級別的`s 鎖了`
- 如果要給表加上`x 鎖`，只要檢查表有沒有`IX鎖`或`IS鎖`。如有就表示表中有行級別的`x 鎖`或`s 鎖`，必須等待`x鎖`或者`s鎖`被釋放，隨後`IX 鎖`或`IS鎖`也會被釋放，這個時候就可以加表級別的`x 鎖了`

> 意向鎖和意向鎖之間是不衝突   
> 意向鎖和行鎖之間是不衝突

也就是是添加行級別的`s鎖`或`x鎖`時，不需要關心是否添加了`IS鎖`或`IX鎖`。只有添加表級別的時候才需要檢查和判斷

**綜合不同的鎖**
|名稱|級別|說明|
|---|---|---|
|s鎖(共享鎖)| 行/表級別 | 其他事務(Transcation)都可以讀取數據，不會被鎖住，其他事務(Transcation)可以獲得s鎖，但是不能獲得x鎖，也就是不能寫|
|x鎖(互斥鎖)| 行/表級別 | 其他事務(Transcation)都不能讀也不能寫，其他事務(Transcation)不能獲得s鎖和x鎖，也就是說不能讀也不能寫|
|IS鎖(意向共享鎖)| 行級別 | 用於表示事務(Transcation)在該表加了s鎖，一個表可以多個，需要添加表級別鎖時候檢查 |
|IX鎖(意向互斥鎖)| 行級別 | 用於表示事務(Transcation)在該表加了x鎖，一個表可以多個，需要添加表級別鎖時候檢查|

## 總結
以上就是對資料庫事務(Transcation)的淺談，這篇文章中我們討論了事務(Transcation)是什麼、事務(Transcation)的ACID、隔離性的讀一致性以及隔離級別、MVCC和鎖的簡單介紹。

## 參考資料
[事务的隔离级别与MVCC](https://juejin.cn/user/888061126511720/posts)