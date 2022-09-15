---
title: "[Leetcode] Combination Sum III(Medium)"
date: 2022-05-10T11:41:43+08:00
draft: false
tags:
    - array
    - math
    - recursion
    - back-tracking
categories:
    - leetcode
---

## LeetCode 216 - Combination Sum III
Find all valid combinations of `k` numbers that sum up to `n` such that the following conditions are true:

* Only numbers 1 through 9 are used.
* Each number is used **at most once**.
Return a *list of all possible valid combinations*. The list must not contain the same combination twice, and the combinations may be returned in any order.

example
```
Input: k = 3, n = 7
Output: [[1,2,4]]
Explanation:
1 + 2 + 4 = 7
There are no other valid combinations.
```

```
Input: k = 3, n = 9
Output: [[1,2,6],[1,3,5],[2,3,4]]
Explanation:
1 + 2 + 6 = 9
1 + 3 + 5 = 9
2 + 3 + 4 = 9
There are no other valid combinations.
```

```
Input: k = 4, n = 1
Output: []
Explanation: There are no valid combinations.
Using 4 different numbers in the range [1,9], the smallest sum we can get is 1+2+3+4 = 10 and since 10 > 1, there are no valid combination.
```
## How can we solve this problem?
這題主要關注的點是數字範圍為`[1,9]`，每個結果中，數字只能使用一次，而且數字必須是順序排列。例如:`2,3,4`,`1,2,5`。解決這題我們可以用**back-traking**大法。只要我們當前的`Sum`大於`n`我們就直接退回back track回上一步,因為數值只會越來越大，並不是我們想要的。如果*Ans*我們所需的`k`個就直接判斷是否等於`n`，如果是就直接加入到我們的*result*即可。
#### Solution:

```c++
class Solution {
    vector<vector<int>> res;
    vector<int> tmp;
public:
    vector<vector<int>> combinationSum3(int k, int n) {
        solution(n,k,0,1);
        return res;
    }
    
    void solution(int n,int k,int sum,int start){
        
        if(k==0){
            if(sum == n) res.push_back(tmp);
            return;
        }
        
        if(sum > n) return;
        
        for(int i = start;i<=9;i++){
            tmp.push_back(i);
            solution(n,k-1,sum + i,i+1);
            tmp.pop_back();
        }
    }
};
```


