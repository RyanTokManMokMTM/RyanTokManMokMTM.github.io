---
title: "[Development Diary] Real Time Communication APP(II) - Demo"
date: 2023-04-24T12:24:38+08:00
draft: false
categories:
    - dev-diary
    - side-project
tags: 
    - side-project  
---


This article is demostrate current progress of the app:  

<video src="/videos/chat-app/full-demo-1.mp4" controls="controls" width="500" height="300"></video> 

### Demo Description
The details of the app have been introduced in [[Development Diary] Real Time Communication APP - Get Started](/post/chat-app-init). Please read the article if you want to know more.  

In this article, I'll demonstrate all the items listed below: 
* User login and registration
* Edit user information, including uploading Avatar, Cover, and modifying Status Message
* Add friends
* Send messages to friends; if the other party is online, they will receive the message instantly; otherwise, it will be saved as an offline message and sent when the user is online.
* Create user groups
* Join user groups
* Search for groups
* Group communication; only users who have joined the group can receive messages
* One-on-one chat, where one party can send messages as long as they are friends, without both needing to be friends
* Post personal updates to stories, viewable only by added friends
* Pull-to-refresh to update friends' stories
* Comment on stories and send via socket to specific users

[Backend Github](https://github.com/RyanTokManMokMTM/chat-app-server)  
[IOS Client Github](https://github.com/RyanTokManMokMTM/swiftui-chat-app)