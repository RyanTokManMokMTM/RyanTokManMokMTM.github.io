---
title: "[Note]Simple RateLimiter Example Based on IP"
date: 2022-03-30T16:05:57+08:00
draft: false
toc: false
description: "A rate limiter example that implements in gin web framework"
tags: 
    - backend
    - rate limiter
categories:
    - note
author: jackson.tmm
---

### 基於Gin實作Rate Limiter

假設我們有2個APIs,而每個API都需要消耗1個`Tokens`

| uri             | method | desc                         |
| --------------- | ------ | ---------------------------- |
| /api/posts/{id} | GET    | return a simple demo message |
| /ping           | GET    | return pong                  |

**我們先設置一下rate limiter桶子的容量只能放下一個tokens,而tokens則會每秒生產5個。存取API時,若沒有Token可以用，就需要等待token下一次生產並放到桶子裡，才能繼續進行下去。**

```go
var (
	Rate = rate.Every(time.Millisecond * 200) //1s x 10 token
	ReqLimiter      = rate.NewLimiter(RateLimiterRate, 1)
)
```

#### Post API Controller exapmle

```go
type PostCase struct {
}

func (p *PostUseCase) GetPost(ctx *gin.Context) {
	//get params id
	id := ctx.Param("id") //from the path

	//use a token
	if err := limiter.ReqLimiter.Wait(ctx); err != nil {
		ctx.JSON(http.StatusRequestTimeout, gin.H{})
		return
	} //wait for a token is available or return

	ctx.JSON(http.StatusOK, gin.H{
		"msg": "succeed:" + id,
	})
}

```

 #### Ping API Controller exapmle

```go
type HealthCheck struct {
}

func (hc *HealthCheck) Pong(ctx *gin.Context) {
   limiter.ReqLimiter.Wait(ctx)

   ctx.JSON(http.StatusOK, gin.H{
      "msg": "Pong",
   })

}
```

---

### 基於ClientIP 的Rate limiter

由於上面的的例子都是所有人公用一個Rate Limiter，因此，我們這裡簡單實作一個基於IP的Rate Limiter,相同IP下會公用一個Rate Limiter。

實作思路如下:

*   定義Map用於保存不同IP下的Rate Limiter
*   定義Rate Limiter的結構
*   定義一個移除Rate Limiter的function 用於移除不在線的用戶(只會跑一次)

#### 保存Limiter的結構
包含了2個成員(Member):
*   **Limters**: 主要是用於保存不同IP下的Limiter(storage)
*   **Lock** : 因為有可能會有很多人同時存取這個Map,為了防止Race condition,因此需要使用Mutex進行保護

```go
type Limiters struct {
	Limiters map[string]*Limiter
	Lock     sync.Mutex
}
```
#### 定義Rate Limiter的結構
包含了3個成員(Member):
*   **Limter** : 一個rate limiter的實例
*   **LastAccess** : 上次存取這個limiter的時間


```go
type Limiter struct {
	limiter    *rate.Limiter
	lastAccess time.Time
}
```

#### 定義獲取Rate Limiter的Function

這個function主要做的事情是獲取Client IP的Rate limiter(如果存在)。如果不存在,會新建一個新的Rate Limiter，並保存到Map(storage)中。
```go
func (ls *Limiters) GetLimiter(r rate.Limit, b int, key string) *Limiter {
	ls.Lock.Lock()
	defer ls.Lock.Unlock()
	if limiter, ok := ls.Limiters[key]; ok {
		return limiter
	}

	newLimiter := &Limiter{
		limiter:    rate.NewLimiter(r, b),
		lastAccess: time.Now(),
		//key:        key,
	}

	ls.Limiters[key] = newLimiter
	return newLimiter
}	
```

#### 定義一個定期檢查Rate Limiter的function

這個function的主要作用的是在設定的時候到達時，會檢查是否有用戶的沒有存取/訪問的時間已超過設定的時間。如果已超過便會從Limiters的Map中移除，以免資源的浪費

```go
func (ls *Limiters) ClearNotUseLimiter(sec time.Duration) {
	for {
		time.Sleep(sec) //for now just set 1-minutes for testing
		//for all limiter
		for key, l := range ls.Limiters {
			if time.Now().Sub(l.lastAccess) > sec {
				ls.Lock.Lock()
				delete(ls.Limiters, key)
				log.Printf("limiter for ip:%v is removed", key)
				ls.Lock.Unlock()
			}
		}
	}
}
```



### 實作例子

因為每個Request被處理前，必須先確保此用戶(Client IP)沒有超過限制的Request的數目。所以,每個進來的Request都會先經過Middleware做預處理，獲得token後，才能進到處理的程序。

#### Limiter Middleware

這個Middleware中會透過Request Header(context)裡附帶的Client IP 獲得一個Limiter,並透過此Limiter檢查是否可以獲取Token，如果存取為`False`會直接response 一個錯誤訊息`TooManyRequest`

```go
func RateLimiter() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		clientIP := ctx.ClientIP()
		res := app.NewResponse(ctx)
		if clientIP == "" {
			res.ErrorResponse(errCode.ClientError.WithDetail("Client agent info not found or error"))
			ctx.Abort()
		}
		//log.Println(clientIP)
		//limiter : 10 request for each user and a token will generate after 1s
		l := newLimiters(
			//1s to generate a token
			rate.Every(global.AppSetting.LimiterTokenTime),
			global.AppSetting.LimiterBucketSize, //there are total 10 buckets
			clientIP)

		if !l.Allow() {
			res.ErrorResponse(errCode.TooManyRequest)
			ctx.Abort()
		}
		ctx.Next()
	}
}
```

獲取Rate Limiter的function如下圖所示。細心的朋友可以發現這個包含了1個`onceTask.Do`的東西，其實他就是一個go語言內置允許function只跑一次的情況。透過`onceTask.Do`就可以實現一個Function只跑一次，無論呼叫了幾次同一個function,這個function也會只跑一次，直到程序結束。

這個`onceTask.Do`所做的事只有1件，也就是**檢測是否有用戶不活躍，不活躍的用戶會被移除**。它另外一條goroutine中進行，並不會堵塞主goroutin

```go
func newLimiters(r rate.Limit, b int, key string) *limiter.Limiter {
	onceTask.Do(func() {
		log.Println("run once")
		go global.Limiters.ClearNotUseLimiter(global.AppSetting.LimterClearTime)
	})
	return global.Limiters.GetLimiter(r, b, key)
}
```
以上便是基於IP實作Rate Limiter的簡單方法

---
參考資料:  
[[go-pkg] time/rate package](https://pjchender.blogspot.com/2020/11/go-pkg-timerate-package.html)  
[rate Documentation](https://pkg.go.dev/golang.org/x/time/rate)