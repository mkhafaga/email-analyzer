# email-analyzer
The project aims to analyze the user's sent emails in order to extract the repeated patterns. Give the user the 
ability to export these snippets in order to integrate them with TextBlaze to save time.

> Node Development Version: `v14.19.3`

The project is divided into two modules:

- email-analyzer-backend.
- email-analyzer-frontend.

**About email-analyzer-backend:**
> This is the backend module. It's implemented using expressjs. 
> It has 2 APIs: 
> - /analyze-sent-messages: This one is responsible for listing the emails in the sent folder, read these emails and 
> using the help of a Trie data structure it can extract the repeated text.
> - /exportCsv: It delivers csv files created from the previous api
>
> The backend module has a utility class called Tri in WordsTrie.js file. It represents my understanding of a Word 
> Trie. It's a prefix tree that can be used to solve problems like longest common substring, longest common 
> subsequence, common substrings and more.                                                                           
>I also included 2 cases of jest tests in __tests__ folder. 
>
**How to startup email-analyzer-backend:**
>Now we are in email-analyzer folder:              
>- cd email-analyzer-backend
>- npm install
>- npm start                                                                                                         
>
> It will start and will use port 9000.
> 
>
**About email-analyzer-frontend:**
>This is the client module. It's implemented using reactjs. I've also used the following libraries:
> 
>- [React Google Login](https://github.com/anthonyjgrove/react-google-login) to implement login/logout to google 
   > account.
>- [React Bootstrap](https://react-bootstrap.github.io/) to create bootstrap based UI.
>- [React Router v5](https://v5.reactrouter.com/) for navigation.
>

**How to startup email-analyzer-frontend:**
>Now we are in email-analyzer folder:
>- cd email-analyzer-frontend
>- npm install
>- npm start   
>
> It will start and will use port 3000.
