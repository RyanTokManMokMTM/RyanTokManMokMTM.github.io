---
title: "MetaHuman虛擬數字人初探"
date: 2022-06-12T15:01:27+08:00
draft: false
description: This post just share some funny think about matahuman
tags: 
    - matehuman
categories:
    - mateverse 
    - modeling
author: jackson.tmm
---
因為元宇宙(Metaverse)這個概念火熱,所有我就趁著這個機會了解一下在元宇宙領域中本人覺得比較有趣的東西。也就是這篇文章所要分享給各位的**MetaHuman(虛擬數字人/虛擬數位人)**

## 什麼是MetaHuman(虛擬數字人/虛擬數位人)呢?
所謂的MetaHuman(虛擬數字人)是具有數字化形象的虛擬人物，並且具備特定的相貌、性格和性別等人物特征、具備語音，面部表情和肢體動作表達的能力以及擁有人類的思想會具有外界環境與人交流的互動能力。
這裡只是簡略的介紹一下。如果各位對*虛擬數字人*技術或者發展剛興趣的,可以參考這份[虛擬數字人白皮書](http://pg.jrj.com.cn/acc/Res/CN_RES/INDUS/2020/12/19/cdb07e97-aa5f-4f6a-bf9a-7c001bb43b26.pdf)

## 簡單數字人實作
*注:本實作之數字人透過輸入自定義音頻生成，並無溝通等能力*

使用工具:
* Reallusion Character Creator
* Reallusion IClone

**實作步驟也十分的簡單:**  
我們將透過**Reallusion Character Creator**製作我們**數字人**的外觀,然後再將**數字人**傳入**Reallusion IClone**做動畫,也就是透過IClone的音頻生成數字人動畫的功能製作動畫。

Step 1:  
進入**Reallusion Character Creator**製作角色(以博主自定義的角色為例)，如下圖:
![Reallusion Character Creator](/images/metahumanCC/cc4.png)

Step 2:  
將剛才在**CC(Character Creator)** 製作的角色匯入到**IClone**中,如下圖:  
*Character Creator中: File->Export->Send to IClone*
![Reallusion Character Creator](/images/metahumanCC/ic1.png)

匯入音頻文件   
*Modify->Facial->Create Script->Audio File*
![Reallusion Character Creator](/images/metahumanCC/ic2.png)

預覽動畫結果，並渲染動畫
![Reallusion Character Creator](/images/metahumanCC/ic3.png)


## Demo展示
#### 燈光一展示:
<video src="/videos/metahuman1.mp4" controls="controls" width="500" height="300"></video>

#### 燈光二展示
<video src="/videos/metahuman2.mp4" controls="controls" width="500" height="300"></video>

## 結論
有沒有發現很簡單又很好玩呢!我們透過**Reallusion**工具讓我們能在很短的時間內就可以完成一個屬於自己的MetaHuman。除此之外**Reallusion**還提供很多很強大的功能，例如:**圖片生成3D角色模型,手機臉部動作捕捉,與Unreal Engine 5的MetaHuman工具連動**等等，有機會的話再跟大家分享。
最後給大家分享一張虛擬網美照><
![Reallusion Character Creator](/images/metahumanCC/pose.png)

**參考資料:**  
[Reallusion](www.reallusion.com)  