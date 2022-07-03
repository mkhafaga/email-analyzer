class TrieNode {
    constructor() {
        this.children = new Map();
        this.end = false;
        this.occurrences = 0;
        this.visited = false;
    }

    setEnd = function (end) {
        this.end = end;
    }

    isEnd = function () {
        return this.end;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.root.occurrences = 2;
    }

    add(input, node = this.root, index) {
        if (input.length === index) {
            node.setEnd(true);
            return;
        } else if (!node.children.has(input[index])) {
            const childNode = new TrieNode();
            childNode.occurrences++;
            node.children.set(input[index], childNode);
            return this.add(input, node.children.get(input[index]), index + 1);
        } else {
            const childNode = node.children.get(input[index]);
            childNode.occurrences++;
            return this.add(input, childNode, index + 1);
        }
    }

    // traverse(this.root, string);
    print() {
        const suffixes = [];
        let newTerritory = 0;
        let wordsCount = 0;
        const traverse = function (node, string) {
            if (!node.visited) {
                newTerritory += 1;
                node.visited = true;
            }
            wordsCount++;
            if (node.children.size > 0) {
                for (let child of node.children.keys()) {
                    if (node.children.get(child).occurrences < 2) {
                        continue;
                    }
                    traverse(node.children.get(child), string.concat(' ').concat(child));
                }
                if (isDeadEnd(node) && newTerritory > 0) {
                    if (suffixes.length === 0 || (suffixes.length > 0 && !suffixes[suffixes.length - 1]['text'].includes(string))) {
                        let timeSaved = Math.ceil(wordsCount* node.occurrences/40);
                        suffixes.push({text: string.trim(), wordsCount, occurrences: node.occurrences, timeSaved});
                    }
                    newTerritory = 0;
                    wordsCount =0;
                    return;
                }
            } else {
                if (string.length > 0 && newTerritory > 1) {
                    if (suffixes.length === 0 || (suffixes.length > 0 && !suffixes[suffixes.length - 1]['text'].includes(string))) {
                        let timeSaved = Math.ceil(wordsCount* node.occurrences/40);
                        suffixes.push({text: string.trim(), wordsCount, occurrences: node.occurrences, timeSaved});
                    }
                    newTerritory = 0;
                    wordsCount = 0;
                    return;
                }
            }
        }

        const isDeadEnd = function (node) {
            let deadEnd = node.isEnd();
            for (let child of node.children.keys()) {
                deadEnd = deadEnd || node.children.get(child).occurrences < 2;
            }
            return deadEnd;
        }

        traverse(this.root, '');

        const toRemove = [];
        const suffixesSet = new Set(suffixes);
        for (let i = 0; i < suffixes.length; i++) {
            for (let j = 0; j < suffixes.length; j++) {
                if (i === j) {
                    continue;
                }
                if (suffixes[j]['text'].includes(suffixes[i]['text']) || !/\s+/.test(suffixes[i]['text'])) {
                    toRemove.push(suffixes[i]);
                    break;
                }
            }
        }

        toRemove.forEach(word => {
            suffixesSet.delete(word);
        });
        return suffixesSet;
    }
}



module.exports = Trie;
