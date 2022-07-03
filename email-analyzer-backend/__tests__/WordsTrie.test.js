import Trie from '../utils/WordsTrie.js';

describe('Trie Test', () => {
    const trie = new Trie();
    test('It should return common substrings when given 2 strings with common substrings', () => {
        // Arrange
        const messages = [
            `Dear Mohamed, It's time for us to leave crossover and have a new journey. Let's hope the new journey will be great. Best regards, Mohamed Khafaga`,
            `Dear Mohamed, It's time for us to leave crossover and have a new journey. What do you think will happen in the future?`
        ];

        // Act
        messages.forEach(messageBody => {
            const messageBodyWords = messageBody.match(/\S+/g);
            if (messageBodyWords) {
                for (let i = 0; i < messageBodyWords.length; i++) {
                    trie.add(messageBodyWords, trie.root, i);
                }
            }
        });

        const suffixes = Array.from(trie.print());

        // Assert
        expect(suffixes).toHaveLength(1);
        expect(suffixes[0]['text']).toBe(`Dear Mohamed, It's time for us to leave crossover and have a new journey.`);
        expect(suffixes[0]['occurrences']).toBe(2);

    });
    test('It should return nothing when given 2 strings with no common substrings', () => {
        // Arrange
        const messages = [
            `Hi Sandeep, At the time I got the offer to write the book I had a stable working life and sometime I could make use of by writing the book.`,
            `Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard ever since the 1500s`
        ];

        // Act
        messages.forEach(messageBody => {
            const messageBodyWords = messageBody.match(/\S+/g);
            if (messageBodyWords) {
                for (let i = 0; i < messageBodyWords.length; i++) {
                    trie.add(messageBodyWords, trie.root, i);
                }
            }
        });

        const suffixes = Array.from(trie.print());

        // Assert
        expect(suffixes).toHaveLength(0);
    });
});
