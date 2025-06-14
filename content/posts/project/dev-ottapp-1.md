---
title: "[開發日記]OTT電影社群APP(一)"
date: 2022-09-06T12:36:22+08:00
draft: false
tags: 
    - movie-app
categories:
    - side-project
---

> 最近這2個月都沒有更新發文章，主要是因為這2個月都在專注重構畢業專題的項目，也是只OTT電影平台。  
> 今天這篇文章主要是跟大家分享這2個月所開發的進度和目前開發到的階段，以此作為這個項目的開發日記。

### 目前的成果
```廢話少說，先上圖！```

#### 前端UI:
##### 主界面
![main](/imgs-custom/ott_app/home_img/main.png)
> 包含APP4個主要得核心功能 
> 1. 電影預覽與電影搜尋 - 提供了以電影類別預覽以及根據電影情況的預覽。如熱門電影,最受歡迎等...
> 2. 用戶電影評論與影評分享 - 可允許用戶在觀看完電影後，寫下觀後感與他人分享
> 3. 聊天與通知 - 可與朋友進行即時討論
> 4. 用戶個人頁 - 包含了用戶基本訊息,發佈的文章,喜歡的電影以及收藏的電影

##### 電影搜尋/預覽界面
![search](/imgs-custom/ott_app/home_img/searchAndDiscover.png)
> 功能如下：  
> 讓用戶以文字的方式進行電影的查詢  
> 讓用戶按著電影類別來預覽不同的電影

> 未實現功能如下：  
> 1. 刷新以及獲取更多資料

##### 電影資訊界面
![detail](/imgs-custom/ott_app/home_img/movieDetail.png)
> 功能如下：  
> 1. 提供電影基本以及詳細資訊(包含電影說明,演員,成員,宣傳影片等)
> 2. 為用戶提供OTT資源(如有串流平台提供資源)，並直連至該平台進行觀看
> 3. 為用戶提供相似的電影
> 4. 用戶可以點讚或者收藏電影

> 未實現功能如下：  
> 1. 刷新以及獲取更多資料

##### 用戶社群與文章發佈界面
![social](/imgs-custom/ott_app/home_img/social.png)
> 功能如下：  
> 1. 為用戶推送最新的電影評論文章
> 2. 為用戶推送關注用戶的最新評論文章
> 3. 用戶可以對文章直接評論以及點讚
> 4. 用戶可以自行建立文章，發表電影感想
> 5. 文章都會提供電影導向連接，可直接跳轉至電影詳細

> 未實現功能如下：  
> 1. 留言點讚
> 2. 刷新以及獲取更多資料

##### 聊天與通知界面
![chat](/imgs-custom/ott_app/home_img/chatAndNotification.png)
> 這部分的界面目前只使用了假數據進行UI設計，還沒設計對應的API  
> 這部分會使用到Websocket 技術的幫助(還在研究當中QQ)

> 未實現功能如下：  
> 1. 用戶與用戶之間的對話
> 2. 為用戶推送點讚,關注,留言的通知
> 3. 直接搜尋好友進行通訊 
> 4. 刷新以及獲取更多資料

##### 個人與他人資訊界面
![profile](/imgs-custom/ott_app/home_img/profile.png)
> 功能如下：  
> 1. 用戶可以編輯更新個人資訊
> 2. 用戶可以觀看用戶發表文章
> 3. 用戶可以觀看用戶點讚電影
> 4. 用戶可以觀看用戶收藏列表
> 5. 用戶可以建立自定義的片單

> 未實現功能如下：  
> 1. 移除片單
> 2. 移除片單中的電影
> 3. 刷新以及獲取更多資料
---
#### 後端API
#### 已完成

#### SERVER HEALTH
![server_health](/imgs-custom/ott_app/backend/health_api.png)

#### USER API
![user_api](/imgs-custom/ott_app/backend/user_api.png)

#### USER GENRE API
![user_genre_api](/imgs-custom/ott_app/backend/user_genre_api.png)

#### MOVIE API
![user_genre_api](/imgs-custom/ott_app/backend/movie_api.png)

#### USER GENRE API
![custom_list](/imgs-custom/ott_app/backend/custom_list_api.png)

#### POST LIKES API
![custom_list](/imgs-custom/ott_app/backend/post_like_api.png)

#### LIKED MOVIE API
![custom_list](/imgs-custom/ott_app/backend/like_movie_api.png)

#### COMMENT LIKES API
![custom_list](/imgs-custom/ott_app/backend/comment_like_api.png)

#### FRIEND API
![custom_list](/imgs-custom/ott_app/backend/friend_api.png)

#### COMMENT API
![custom_list](/imgs-custom/ott_app/backend/comment_api.png)

#### 待完成
* Websocket
* 消息推送
* Unit Test
* 部署至K8S以及AWS


### 總結
以上內容就是我7-8月之間所完成的開發事項。但APP還有很多地方沒有完成和完善！讓我們期待下一次的**開發日記**(*❦ω❦)  
謝謝各位的耐心觀看！