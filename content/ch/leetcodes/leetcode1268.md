---
title: "[Leetcode] Search Suggestions System[Medium]"
date: 2022-06-19T12:45:24+08:00
draft: true
tags:
    - string
    - trie tree
categories:
    - leetcode
---

## LeetCode 1268 - Search Suggestions System
You are given an array of strings `products` and a string `searchWord`.

Design a system that suggests at most three product names from `products` after each character of `searchWord` is typed. Suggested products should have common prefix with `searchWord`. If there are more than three products with a common prefix return the three lexicographically minimums products.

Return a *list of lists of the suggested products* after each character of `searchWord` is typed.
example:  
```
Input: products = ["mobile","mouse","moneypot","monitor","mousepad"], searchWord = "mouse"
Output: [
["mobile","moneypot","monitor"],
["mobile","moneypot","monitor"],
["mouse","mousepad"],
["mouse","mousepad"],
["mouse","mousepad"]
]
Explanation: products sorted lexicographically = ["mobile","moneypot","monitor","mouse","mousepad"]
After typing m and mo all products match and we show user ["mobile","moneypot","monitor"]
After typing mou, mous and mouse the system suggests ["mouse","mousepad"]
```
```
Input: products = ["havana"], searchWord = "havana"
Output: [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]
```

```
Input: products = ["bags","baggage","banner","box","cloths"], searchWord = "bags"
Output: [["baggage","bags","banner"],["baggage","bags","banner"],["baggage","bags"],["bags"]]
```

## How can we solve this problem?
這題要我們解決的問題是在給定的`products`中,給輸入關鍵字/搜尋關鍵字(`searchWord`)返回建議的`product`，也就是說只要`searchWord`與`products`中的某些`product`的前綴(`prefix`)一致,返回所有包含這個前綴(`prefix`)就可以了。 因為這題會架設*一個一個字*的輸入,所以結果會是`searchWord`的長度哪麼多個List。  
因為這題有關於字串前綴(`Suffix`),我們可以直接透過![Trie Tree](/notes/trietree)來解。我們只需為透過`Products`來建構**Trie Tree**,並加入到*Tree Node*的List中即可(題目說到最多3個，所以List最多保存3個)。  
*因題目要求，結果需為按字典排序(`lexicographically order`),所有要先對`products`進行排序。*

#### Solution:
```c++
class TrieNode{
    //every node have at most 26 trie node (a to z)
    public:
    TrieNode(){
        node = vector<TrieNode*>(26);
    }
    
    vector<TrieNode*> node;
    vector<string> w;
    static void addWords(TrieNode* root ,string str){
        for(int i = 0;i<str.length();i++){
            //check product[i] exists in trie tree or not
            if(root->node[str[i] - 'a'] == nullptr) root->node[str[i] - 'a'] = new TrieNode();
            root =  root->node[str[i] - 'a']; //moving to the tree node
            //append the words
            if(root->w.size() < 3) {
                root->w.push_back(str);
            }
        }
    }

    static vector<vector<string>> getWords(TrieNode* root,string prefix){
        vector<vector<string>> res(prefix.length());
        for(int i = 0;i<prefix.length();i++){
            root = root->node[prefix[i] - 'a'];
            if(root == nullptr) return res;
            for(auto str : root->w) res[i].push_back(str);
        }

        return res;
    }

};

class Solution {
public:
    vector<vector<string>> suggestedProducts(vector<string>& products, string searchWord) {
        vector<vector<string>> res;
        sort(products.begin(),products.end());// n log n
        TrieNode* root = new TrieNode();
        for(auto product : products) TrieNode::addWords(root,product);   
        return TrieNode::getWords(root,searchWord);
    }
};
```

