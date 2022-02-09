import os

path = "divided_words"
files = os.listdir(path)
wordsDict = {}
for file in files:
    with open(path + "/" + file, "r") as f:
        words = f.read().split()
        wordsDict[int(file.split('.')[0])] = len(words)
sorted_x = sorted(wordsDict.items(), key=lambda kv: kv[0])
for key, value in sorted_x:
    print("{} Letter Words: {}".format(key, value))
largest = max(wordsDict, key=wordsDict.get)
print("Most amount of words are {} letter words.".format(largest))
