---
title: "[Development Diary] Real Time Communication APP - Sicker Updated"
date: 2023-05-24T21:32:47+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---

## Intro
I won't mention much about the project again, if you're interested in what is the project about, please check out my previous posts. In the previous posts, i've introduced the project in detail.  
[ChatApp(I)](/post/chat-app-init/)  
[ChatApp(II)](/post/chat-app-demo/)  
[ChatApp(III)](/post/chat-app-update/)  
[ChatApp(IV)](/post/chat-app-final/)  
[ChatApp(V)](/post/chat-app-voice-chat/)  

Here is the demonstration video about the sicker feature. 

<video src="/videos/chat-app/sticker-demo.mp4" controls="controls" width="500"></video> 

In the demonstration video, you can see that the sticker feature is similar to any other Real-time communication app on the internet. User be able to access all available stickers that we are provided and send it to another user or group. But the problem is how can we provide sticker resources to user and where are the sticker come from?

To solve the first problem, we can create a sticker resource by uploading all the necessary image to the server before client or user be able to access it. Each created sticker resources will be assigned a unique identifier as its stickerID. All resources releated to a same sticker id will be renamed in a standardized format for easy access. `stickerID_index.format`.

I designed 2 apis for creating and fetching sticker.  
> POST /api/v1/sticker  -> To create a group of sticker and upload all related sticker to the server
> GET /api/v1/sticker/:id -> To obtain a related sticker resources with a given id

To solve the second problem, for now i just simply download the sticker form Line by Web crawler **(there is illegal problem if the app is published xD)**. So the sticker is just for testing!

## summary
A sticker is an image in png format. To implement the sticker feature ,we just need to obtain a sticker's path and send it to the recevier,similar to sending a normal image. However, there is no need to upload the image to server because the sticker resources are already saved on server.

That is all what i want to share today!

*Sorry about my bad english - I'am still improving my english! ^^*

