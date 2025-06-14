---
title: "[筆記]TrieTree(前綴樹/字典樹)"
date: 2022-06-21T11:19:28+08:00
draft: false
tags:
    - data structure
categories:
    - note
---

# Introduction
## 什麼是TrieTree?  
> Trie稱為前綴樹或字典樹,是有序樹的一種,Node的key通常為String類型。Trie Tree與Binary-Searching Tree不同的點是,Trie Tree的Key並不會直接保存在Node中,而是它在Tree中的位置所決定的。一個Node中的所有的childrens都有相同的Prefix(前綴)。假設有個Node的key 為`T`,它的children將會是`Time`, `Tim`, `Test`等,因為他們都會相同的Prefix(前綴)`T`。

## Trie Tree 的應用
* 字符前綴匹配 - 網頁URL,搜尋等
    * 搜索關鍵字時,返回前綴最相似的可能結果

## Trie Tree 結構圖  
![TrieTree](/imgs-custom/note/trieTree.png)

# Trie Tree Template
```c++
class TrieNode{
public:
    TrieNode(){
        //suppose we are considering a string consist with a-z
        //at most 26 childrens for a node
        child = vector<TrieNode*>(26);
    }
    vector<TrieNode*> child; //
    bool isWord = false; //indicate current word is a word

    void AddNode(string& str){
        TrieNode*root = this;
        for(int i = 0;i<str.length();i++){
            //adding a node that key is str[i]
            if(!root->child[str[i] - 'a']) root->child[str[i] - 'a'] = new TrieNode();
            root = root->child[str[i] - 'a'];
        }
    }

    //Other function define here...
    //Find a word etc...
};
```

#### 參考資料  
https://zh.wikipedia.org/wiki/Trie
