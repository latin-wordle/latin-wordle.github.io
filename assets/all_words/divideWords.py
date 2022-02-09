with open('listall.txt', 'r') as f:
    words = f.read().splitlines()
    currentWord = 1
    total_count = len(words)
    for word in words:
        print("Processing... " + str(currentWord) + "/" + str(total_count) + " " + str(
            currentWord / total_count * 100) + "%")
        with open('divided_words/' + str(len(word)) + ".txt", 'a') as file:
            file.write(word + "\n")
        currentWord += 1
    print("Done!")
