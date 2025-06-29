---
title: "[Note]What Is JWT(Json Web Token)-EN"
date: 2022-03-24T13:52:49+08:00
draft: false
toc: false
mermaid: true
description: |
  JWT (JSON Web Token) 完整解析：Header、Payload、Signature 三部分結構
  探討 JWT 在身份認證中的應用和工作流程
  包含 HMAC 簽名演算法和 Base64URL 編碼機制
tags: 
    - token
    - backend
categories: 
    - note
author: jackson.tmm
---

## What is JWT(Json Web Token)?
The full name of JWT is Json Web Token. Acccording to the definition, JWT is a proposed Internet standard for creating data with optinal signature and/or opntional encryption whose payload holds JSON that asserts some number of clamis.  
It's used for *identity authentication* between client and the server that allows accessing resources in the server.

## The Structure of JWT
JWT consists of three parts including:
* Header
* Payload
* Signature

### JWT Header
Header typically consists of two parts
* type : *what's the type of the token*
* algorithm : *what algorithm  does this token use to sign/encrypt*. such as SHA256,RAS or HMAC
```json
{
  "typ" : "jwt",
  "alg" : "HS256"
}
```
This information will be encoded by *base64Url algorithm* in order to generate the JWT Header

### JWT payload 
In payload  is typically  saving some users information and other useful information.  

*Be carefulthat payload must not include any secret information due to base64Url algorithm is easy to be decrypted.*

JWT Payload standard claims 
```json
{
  "sub" :"",//subject
  "aud" :"",//audience
  "jti" :"",//jwt id
  "iat" :"",//Issued at
  "iss" :"",//Issuer - who is the publisher of the jwt
  "nbf" :"",//Not Before - JWT is not available before the time jwt set.
  // other user information that developer set
  //for example:
  "user_name" : "jackson_tmm",
  "email" : "admin@admin.com"
}
```
This information will be encoded by *base64Url algorithm* in order to generate the JWT Payload

### Signature
The Signature is used to authenticate whether information has been modified during transmission and authenticate the sender that sent this JWT.

### To Generate JWT Token
Following this function
```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret)
```
And these three partes will be combined by a `.` as following format: `xxx.yyy.zzz`
```
//exmaple
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF_xSJyQQ
```

### How it work between Client and server
```mermaid { bc="#eee" }
sequenceDiagram
    Client->>Server:POST /authentication {username:xxx..}
    Note over Client,Server: User logs in
    alt is authenticated
    Server->>Client:HTTP Status:200 {"token":eyxxx.xx.x}
    Note over Server,Client: Loged in Succeed
    else Unauthorized
    Server->>Client: HTTP Status:401 {"msg":xxx}
    Note over Server,Client: Loged in Failed
    end
    Client->>Server: POST /user/profile {"Authorization":"Bear token"} 
    Note over Server,Client: Get User Profile with token
    alt succeed
    Server-->Client: HTTP Status:200 {"profile":eyxxx.xx.x}
    Note over Server,Client: Succeed and response a profile
    else Unauthorized
    Server-->Client: HTTP Status:401 {"msg":xxx}
	Note over Server,Client: Unauthorized(token error)
    end
```