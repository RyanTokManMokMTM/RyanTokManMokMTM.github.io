---
title: "[Development Diary] Real Time Communication APP(IV) - Final"
date: 2023-05-01T19:25:38+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

### 簡介
Previous [article](/post/chat-app-init), I has discussed about the app. You can read more from it.  

In this article, I'll show what have I done in this final version, perhaps there may have some feature not yet implemented xD. Before I jump into today's topic, let me repeat what features will be included.

This application focuses on Websocket, which is used to implement real-time communication. The server-side has implemented HTTP and Websocket; HTTP is for CRUD, and Websocket is for communication.

### Tech Stack
* SwiftUI
* Golang
* Go-Zero
* Gorm
* Mysql
* Redis
* Docker/Docker-compose


### Features ：
* Basic：  
    * User login and registration
    * User profile modification, including user avatar, name, and status message
    * Retrieve user information
    * Search for friends (by name)
    * Add/Delete friends
    * Retrieve friend list
    * Create a group, where you can select friends to invite, and they will be added to the group upon creation.
    * Search for groups (by group name)
    * Join unjoined groups/leave joined groups
    * Modify group information (group permissions), including changing the group avatar and group name
    * Retrieve group member list
    * Retrieve list of joined groups
* Extra:
    * Add user stories (24 hours)
    * Retrieve user friend stories
    * Retrieve specific stories
    * Delete specific stories
    * Reply to a specific friend's story - send a message to the story user via WebSocket
* Core
   * One-on-one chat - send messages via WebSocket
   * Group chat - send messages via WebSocket
   * All chat rooms support the following message types:
    1. Text
    2. Images (e.g., jpg, png)
    3. Files (e.g., pdf, docx, txt, ppt, etc.)
    4. Audio (e.g., wav, mp3)
    5. Video (currently only supports mp4)
   
### APIs - CRUD
```
User API
- POST /api/v1/user/signup
- POST /api/v1/user/signin
- GET /api/v1/user/info
- GET /api/v1/user/profile 
- PATCH /api/v1/user/info
- PATCH /api/v1/UpdateUserStatus
- POST /api/v1/UploadUserAvatar 
- POST /api/v1/UploadUserCover 
- GET /api/v1/user/search 
```
```
Group API
- POST /api/v1/group 
- POST /api/v1/group/join/:group_id 
- DELTE /api/v1/group/leave/:group_id 
- GET /api/v1/group 
- GET /api/v1/group/members/:group_id 
- POST /api/v1/group/avatar/:group_id 
- PATCH /api/v1/group 
- GET /api/v1/group/search 
- GET /api/v1/group/info/uuid/:uuid 
```
```
Friend API
- POST /api/v1/user/friend 
- DELETE /api/v1/user/friend 
- GET /api/v1/user/friends
```
```
Story API
- POST /api/v1/story 
- DELETE /api/v1/story 
- GET /api/v1/stories 
- GET /api/v1/stories/active
```
```
Message API
- GET /api/v1/message 
- DELETE /api/v1/message =
```
```
File API
- POST /api/v1/file/image/upload
- POST /api/v1/file/upload 
```

Core - Websocket
Because of communication between client and server, we need to define a meaningful format for the frontend and backend to communicate.

```protobuf
message Message {
  string avatar = 1; //user avatar path
  string fromUserName = 2; //sender user name
  string fromUUID = 3; //sender uuid
  string toUUID = 4; //receiver uuid
  string content = 5; //sending content
  int32 contentType = 6; //sending content type. For example 1: text, 2: file, 3: audio, 4: video....
  int32 type = 7; //For example: "heatbeat" for checking server/client health , video call/audio call ->"webrtc"
  int32 messageType = 8; //1: single 2: group
  string groupName = 9; // will have data iff messageType = 2
  string groupAvatar = 10; //will have data iff messageType = 2
  string urlPath = 11; //file url path or other path
  string fileName = 12; //sending file name
  int32 fileSize = 13; //sending file size 
  int32 storyAvailableTime = 14; //reply story created time
}
```

- avatar : sender's avatar URL path
- fromUserName : sender name
- fromUUID ： sender uuid
- toUUID : receiver uuid
- content :content
- contentType ： content type - TEXT/IMAGE etc.
- type : Type of message - Heart /RTC/ Message etc.
- messageType : message Type - Single Or Group
- groupName : Group name
- groupAvatar : Group avatar URL path
- urlPath : content URL path - File/Image etc.
- fileName : File name
- fileSize : File size
- storyAvailableTime : shared story time  
 
`contentType` defination
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
The meaning of 7 content types  
**messageType** will be `1(single chat)/2(Group chat)`，and **type** will be `4`:
- TEXT - Only` content` has data
- IMAGE -  `urlPath`  image URL path
- FILE - `urlPath` has image URL path,`fileName` has the file name ,`fileSize` has the file size
- AUDIO - `urlPath` has audio file url
- VIDEO - `urlPath` has video file url
- STORY - is an Instance story type，`urlPath` has story url path ，`storyAvailableTime` has the story available time

**messageType** will be 2(Group chat) only，and **type** will be 4。
- SYS - System message ,`content` has the message of the SYS。



#### How does the format work in communication?？  
**A: Sender(UUID:123)，B: Receiver(UUID:321)**。 

##### Situation 1: Sending texe

A send `Hello!` to B：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "content" : "Hello!",
    "contentType":1, //1: text,
    "type": 4, //4: message
    "messageType" : 1, //1: single chat
}
```

B received message:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "content" : "Hello!",
    "contentType":1, //1 : text,
    "type": 4, //4: message
    "messageType" : 1, //1: single chat
}
```
---  
##### Situation 2 ：Sending image
1. Uploading the image to sever and obtaining the image path
2. Sending the path to B

```json
{
    "code":200,
    "path":"/image.jpg"
}
``` 

A sending to image to B：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "contentType":2, //2: image,
    "type": 4, //4: message
    "messageType" : 1, //1: single chat
    "urlPath" : "/image.jpg"
}
```

B received message:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "321",
    "contentType":1, //1 : image,
    "type": 4, //4 : message
    "messageType" : 1, //1: single chat
    "urlPath" : "/image.jpg"
}
```
Because of `contentType` is `2`,then we know it's a image and `urlPath` save an image url。  

---
The situations above are single chatting, what about group chat?  

Because the recipient of the group chat will be the UUID of the group, if it is not processed, the sender will be the person who sent the message, and an error will occur when processing on the Client-side (because the sender is A, not the group)  

```
Solution：
Sender : A -> Group // A send a message to group
Receiver : B <- Group // B receive a menssage from group
```

**A : Sender(UUID:123)，B : Receiver(UUID:321), Group G: (UUID:G123)**。 
##### Situation 1：Sending text
A send `Hello!` to group G：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123",
    "toUUID" : "G123", //Group UUID : G123
    "content" : "Hello!",
    "contentType":1, //1 :text,
    "type": 4, //4 : message
    "messageType" : 2, //2 : group chat
    "groupName":"groupName#1", //UUID：G123's group name
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123's group avatar
}
```

B received message:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "G123", //Group UUID : G123
    "toUUID" : "321", //receiver uuid : 321
    "content" : "Hello!",
    "contentType":1, //1 : Text,
    "type": 4, //4 : message
    "messageType" : 2, //2: group chat
    "groupName":"groupName#1", //UUID：G123 - group name
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 - group avatar
}
```

---  
##### Situation：Sending image  
1. Uploading the image to sever and obtaining the image path
2. Sending the path to Group G
```json
{
    "code":200,
    "path":"/image.jpg"
}
``` 

A sending image to group G：
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "123", //sender UUID
    "toUUID" : "G123", //group UUID
    "contentType":2, //2 : image,
    "type": 4, //4 : message
    "messageType" : 2, //2 : group chat
    "urlPath" : "/image.jpg",
    "groupName":"groupName#1", //UUID：G123 - group name
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 - group avatar
}
```

B received message:
```json
{
    "avatar":"/default.jpg",
    "fromUserName":"A",
    "fromUUID" : "G123", //group UUID
    "toUUID" : "321", //receiver UUID
    "contentType":2, //2 : image,
    "type": 4, //4 : message
    "messageType" : 2, //2: group chat
    "urlPath" : "/image.jpg",
    "groupName":"groupName#1", //UUID：G123 - group name
    "groupAvatar":"/defaultGroup.jpg", //UUID：G123 - group avatar
}
```

These examples are the baisc usage of commnication by defined format. Although only two usages are explained, the same applies to other types, just the information is different! 😁

#### You may ask： During the communication, if the receiver is not online, will the message be gone??

That is a good question! I have struggled with this issue for a long time and finally found a solution.Is to save the message up and re-send it to the offline user when they are online again.
In this app, I used Redis to implement this solution because when users receive offline messages successfully, they will be removed. In comparison to SQL, we will operate it frequently, which will affect its performance. So I decided not to use SQL to do this.  

> Retrieved user offline message
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

> Added user offline message into redis
```golang
ctx := context.Background()
_, err := variable.RedisConnection.RPush(ctx, mem.MemberInfo.Uuid, messageBytes).Result()
if err != nil {
    logx.Error("offline message to redis err %s", err.Error())
}
```

Every offline message is just serialized to a string. When we need the offline message, just obtain the string and deserialize it. It's easy to send it back to the user!


### Final version Demo
<video src="/videos/chat-app/chat-app-final.mp4" controls="controls" width="500"></video> 

### Source Code
[Frontend](https://github.com/RyanTokManMokMTM/swiftui-chat-app)  
[Backend](https://github.com/RyanTokManMokMTM/chat-app-server)

