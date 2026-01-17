---
title: "[開發者日記] 聊天通訊APP(四) - 最終章"
date: 2023-05-01T19:25:38+08:00
draft: false
categories:
    - side-project
tags:
    - chat-app
---

### 簡介
在之前[序章](/achievement/chat-app-init)中，雖然已經大概介紹過這個app在幹嘛。但是因為這次是**最終章**的成品展示(或許有些部分沒實現😂)，所以就允許我囉嗦得再說一次吧！

這個app主要是focus在Websocket，也就是實時通訊上。雖然但是HTTP的部分還是不能少的🤣，哈哈哈。所以這個App的Server-side包含了HTTP和Websocket 2個部分。HTTP的部分主要是用作CURD,而Websocket的部分則是用於個人通訊和群組通訊。

### Tech Stack
* SwiftUI
* Golang
* Go-Zero
* Gorm
* Mysql
* Redis
* Docker/Docker-compose


App的功能如下：
* 基礎功能：
    * 用戶登入與註冊
    * 用戶資料修改，包括用戶頭像，名字和狀態訊息(Status Message)
    * 獲取用戶資訊
    * 尋找好友(透過名字查找)
    * 新增/刪除好友
    * 獲取已加好友列表
    * 建立群組，其中建立群組可以選擇要邀請加入的好友，在建立時會一同加入到群組中。
    * 尋找群組(透過群名)
    * 加入未加入的群組/離開已加入的群組
    * 群組資訊修改(群組權限)，可修改群組頭像和群組名稱
    * 獲取群友類表
    * 獲取已加入群組列表
* 額外功能:
    * 新增用戶的限時動態(24小時)
    * 獲取用戶好友動態
    * 獲取特定限時動態
    * 刪掉特定限時動態
    * 回覆特定好友之限時動態 - 透過Websocket 發送訊息給動態用戶
* 核心功能
    * 個人聊天 - 透過Websocket 發送訊息
    * 群組聊天 - 透過Websocket 發送訊息
    * 各聊天室都支援以下訊息:
        1. 文字
        2. 圖片(如:jpg,png)
        3. 文件(如:pdf,docx,txt,ppt,etc.)
        4. 音頻(如:wav,mp3)
        5. 視頻(暫只支援mp4)
### 功能細節(後端)
HTTP API的部分就不一一詳細解說了，也僅僅是CRUD而已，😂哈哈哈。
```
用戶API
- POST /api/v1/user/signup -> 用戶註冊
- POST /api/v1/user/signin -> 用戶登入
- GET /api/v1/user/info -> 獲取特地用戶資訊
- GET /api/v1/user/profile -> 獲取朋友資訊
- PATCH /api/v1/user/info -> 更新資訊
- PATCH /api/v1/UpdateUserStatus -> 更新狀態資訊
- POST /api/v1/UploadUserAvatar -> 上傳並更新用戶頭像
- POST /api/v1/UploadUserCover -> 上傳並更新用戶背景
- GET /api/v1/user/search -> 搜尋用戶
```
```
群組API
- POST /api/v1/group -> 建立群組
- POST /api/v1/group/join/:group_id -> 加入特定群組
- DELETE /api/v1/group/leave/:group_id -> 離開特定群組
- GET /api/v1/group -> 獲取群組資訊
- GET /api/v1/group/members/:group_id -> 獲取群組人員
- POST /api/v1/group/avatar/:group_id -> 更新群組頭像
- PATCH /api/v1/group -> 更新群組資訊
- GET /api/v1/group/search -> 搜尋群組
- GET /api/v1/group/info/uuid/:uuid -> 以UUID搜尋群組
```
```
朋友API
- POST /api/v1/user/friend -> 新增好友
- DELETE /api/v1/user/friend -> 刪除好友
- GET /api/v1/user/friends -> 獲取好友列表
```
```
限時動態API
- POST /api/v1/story -> 新增限時動態
- DELETE /api/v1/story -> 刪除限時動態
- GET /api/v1/stories -> 獲取特地限時動態
- GET /api/v1/stories/active -> 獲取好友限時動態
```
```
訊息API
- GET /api/v1/message -> 獲取特地群組信息
- DELETE /api/v1/message -> 刪除特別訊息
```
```
文件API
- POST /api/v1/file/image/upload -> 上傳圖片
- POST /api/v1/file/upload -> 上傳任何文件
```

接下來就核心的Websocket的部分了！
因為要進行通訊，那我們就得預先定義好前端和後端都看得懂的格式，否則難以進行溝通。以下是我定義的格式(我是使用ProtoBuffer)：
```protobuf
message Message {
  string avatar = 1; //user avatar path
  string fromUserName = 2; //sender user name
  string fromUUID = 3; //sender uuid
  string toUUID = 4; //receiver uuid
  string content = 5; //sending content
  int32 contentType = 6; //sending content type. For example 1: text, 2: file, 3: audio, 4: video....
  int32 type = 7; //For example: "heartbeat" for check ing server/client health , video call/audio call ->"webrtc"
  int32 messageType = 8; //1: single 2: group
  string groupName = 9; // will have data iff messageType = 2
  string groupAvatar = 10; //will have data iff messageType = 2
  string urlPath = 11; //file url path or other path
  string fileName = 12; //sending file name
  int32 fileSize = 13; //sending file size
  int32 storyAvailableTime = 14; //reply story created time
}
```
- avatar : 用於存放發送者的頭像URL[]
- fromUserName : 發送者的名字
- fromUUID ： 發送者的UUID
- toUUID : 接收者的UUID
- content : 發送的內容,也就是文字內容
- contentType ： 發送的內容類型(這個待會會說有哪些類型)！
- type : 發送的訊息類型，是心跳監測呢？還是系統訊息呢？還是普通的用戶通訊訊息呢？
- messageType : 單人聊天或者群組聊天的訊息
- groupName : 群組的名稱 - 主要用於前端建立房間的緩存
- groupAvatar : 群組的頭像 - 主要用於前端建立房間的緩存
- urlPath : 發送文件的URL，可以是圖片，文件，音頻或者是其他
- fileName : 發送的文件名字 - 用於前端顯示
- fileSize : 發送文件的大小 - 用於前端顯示
- storyAvailableTime : 顯示動態的建立時間 - 用於前端顯示限時動態的是否可用

剛才說了`contentType`是發送內容的訊息嘛，那我定義了哪些呢？
```golang
const (
	TEXT = iota + 1
	IMAGE
	FILE
	AUDIO
	VIDEO
	STORY
	SYS
)
```
從上可見，我定義了7種。這7種分別是什麼呢？
**messageType** 可以為1(單聊)或者2(群聊)，且**type**為4(訊息類型)
- TEXT - 是純文件類型,只有`content`中有內容。
- IMAGE - 是圖片類型, `urlPath`中會有該圖片的url
- FILE - 是文件類型，`urlPath`包含文件的url,`fileName`包含文件的名稱,`fileSize`包含文件的大小
- AUDIO - 是音頻類型，`urlPath`包含音頻的url
- VIDEO - 是視頻類型，`urlPath`包含視頻的url
- STORY - 是限時動態類型，`urlPath`包含了限時動態的url，`storyAvailableTime`包含了限時動態的建立的時間

**messageType** 只會為2(群聊)，且**type**為4(訊息類型)。*因為目前系統訊息用於通知用戶加入，離開群組等訊息。*
- SYS - 群組系統訊息 ,`content`中有系統訊息內容。



#### 以上的格式是怎麼用於訊息發送的呢？
**A為發送者(UUID:123)，B為接收者(UUID:321)**。

##### 情境一：發送文字。

A 發送`Hello!`給B，以下是發送內容：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "content" : "Hello!",
    "contentType":1, //1 為text,
    "type": 4, //4 為訊息
    "messageType" : 1, //1為單人聊天
}
```

B接收的內容如下:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "content" : "Hello!",
    "contentType":1, //1 為text,
    "type": 4, //4 為訊息
    "messageType" : 1, //1為單人聊天
}
```
---
##### 情境二：發送圖片。
在透過websocket發送內容之前，會先透過API上傳圖片到Server，然後Server會回傳圖片的URL。然後再發送該URL即可。
假設Server回傳的URL如下：
```json
{
    "code":200,
    "path":"/image.jpg"
}
```

A 發送圖片給B，以下是發送內容：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "contentType":2, //2 為image,
    "type": 4, //4 為訊息
    "messageType" : 1, //1為單人聊天
    "urlPath" : "/image.jpg"
}
```

B接收的內容如下:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "contentType":1, //1 為image,
    "type": 4, //4 為訊息
    "messageType" : 1, //1為單人聊天
    "urlPath" : "/image.jpg"
}
```
因為知道`contentType`是`2`,所以知道是圖片類型，也知道`urlPath`保存了圖片的URL。

---

以上都是單聊的情況，那群聊呢？群聊就跟單聊有些不一樣了呢😂
因為群聊是的接收對象會是群組的UUID,如果不處理一下的話，哪發送者會是發送訊息的人，在Client-side做處理的時候會出錯(因為發送者是A，不是群，哈哈哈)
```
群組訊息發送思路：
發送者 : A -> Group // A 發送訊息到群組
接收者 : B <- Group // B 接收來自群組的訊息
```

**A為發送者(UUID:123)，B為接收者(UUID:321), 群組G(UUID:G123)**。
##### 情境一：發送文字。
A 發送`Hello!`給到群組G，以下是發送內容：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "G123", //發送給群組UUID為G123的群組
    "content" : "Hello!",
    "contentType":1, //1 為text,
    "type": 4, //4 為訊息
    "messageType" : 2, //2為群組聊天
    "groupName":"groupName#1", //UUID：G123 群名字
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 群頭像URL
}
```

B接收的內容如下:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "G123", // 群組UUID為G123的發送訊息
    "toUUID" : "321", //接收者UUID為321
    "content" : "Hello!",
    "contentType":1, //1 為text,
    "type": 4, //4 為訊息
    "messageType" : 2, //2為單人聊天
    "groupName":"groupName#1", //UUID：G123 群名字
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 群頭像URL
}
```

---
##### 情境二：發送圖片。
在透過websocket發送內容之前，會先透過API上傳圖片到Server，然後Server會回傳圖片的URL。然後再發送該URL即可。
假設Server回傳的URL如下：
```json
{
    "code":200,
    "path":"/image.jpg"
}
```

A 發送圖片給B，以下是發送內容：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123", //發送者UUID
    "toUUID" : "G123", //群組UUID
    "contentType":2, //2 為image,
    "type": 4, //4 為訊息
    "messageType" : 1, //2為群組聊天
    "urlPath" : "/image.jpg",
    "groupName":"groupName#1", //UUID：G123 群名字
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 群頭像URL
}
```

B接收的內容如下:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "G123", //群組UUID
    "toUUID" : "321", //接收者UUID
    "contentType":2, //2 為image,
    "type": 4, //4 為訊息
    "messageType" : 1, //2為群組聊天
    "urlPath" : "/image.jpg",
    "groupName":"groupName#1", //UUID：G123 群名字
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 群頭像URL
}
```

以上便是在個人聊天和群組聊天中透過自定義資料結構的基本用法，雖然只說明了2種用法,分別是文本和圖片，但對於其他類型也是一樣的，只是資料不一樣而已罷了！😁

#### 你有可能會問：欸，如果在通訊的過程中，用戶沒有在線或者沒有連接上server，哪訊息不就消息了嗎？哪用戶不就收不到訊息了？
這個問題問的好，對於這個問題我也google很久解決方案。最後找到了解決方案，也就是將離線的消息，也就是用戶接收不到的消息用一個Container保存起來。當用戶上線時，或者重新連接到server時，就將這個消息發送
給他就好了(傳輸過程中丟失的問題，暫時不考慮蛤🤣)！這樣用戶就能在離線的情況下也能收到發送給他們的消息了！
而在這個APP裡面我是透過Redis來實現的。因為我們的消息一但發送給用戶就會馬上刪除掉了，如果用SQL的話，就頻繁的做IO，影響效能。所以這裡就使用Redis來幫我實現。而是用來Hash的數據類型來保每個用戶的離線消息！

> 獲取用戶離線消息
```golang
len, err := variable.RedisConnection.LLen(ctx, u.Uuid).Result()
if err != nil {
    logx.Error("getting Redis length err ", err)
    return
}

messages, err := svcCtx.RedisClient.LRange(ctx, u.Uuid, 0, len).Result()
if err != nil {
    w.WriteHeader(http.StatusBadRequest)
    logx.Errorf("get offline messages error %s ", err.Error())
    return
}
```

> 新增用戶離線消息
```golang
ctx := context.Background()
_, err := variable.RedisConnection.RPush(ctx, mem.MemberInfo.Uuid, messageBytes).Result()
if err != nil {
    logx.Error("offline message to redis err %s", err.Error())
}
```

而每條離線消息就只是把傳輸的Message 序列化成String而已，也就是每條離線消息都是String。當獲取的時候只要反序列化就可以繼續傳送了，非常的方便！


### 最終Demo
<video src="/videos/chat-app/chat-app-final.mp4" controls="controls" width="500"></video>

### Source Code
[Frontend](https://github.com/RyanTokManMokMTM/swiftui-chat-app)
[Backend](https://github.com/RyanTokManMokMTM/chat-app-server)
