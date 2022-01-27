filePath = "word.txt"
# read the file and store each word in a list
with open(filePath, "r") as file:
    lines = file.readlines()
    words = []
    for i in range(len(lines)):
        wordList = lines[i].strip().split(" ")
        for word in wordList:
            word = word.lower()
            if len(word) == 5:
                words.append(word)
            else:
                pass
    # remove duplicates
    words = list(set(words))
    # save the words in a new file
    with open("words2.txt", "w") as newFile:
        for word in words:
            newFile.write(word + "\n")
