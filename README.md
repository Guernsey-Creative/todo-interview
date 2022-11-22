# ToDo list interview project

Thanks for taking the time to interview! We really appreciate it, and we hope to see the best of your work.

## Rules

Please do this interview project on your own, without the help of anyone else.
With that being said, you are more than welcome to use the internet.
Google and Stack Overflow are invaluable tools in our daily lives, and we wouldn't expect you to do your best work without them.

We'd really like to see every part of your development process, so please _record your screen while you work_.

In addition to writing the code required by the instructions, write down your answers to the questions in the instructions directly in this README file.

## Getting started

Make a fork of this repo on your own GitHub account and then clone it down to your personal computer.

You should be able to spin this app up using `yarn install` and `yarn start` (or `npm` if you prefer).
If you have trouble, please don't hesitate to reach out.

## Important Project contents

There are a few files that are important for this app:

### App.tsx

The main logic of the "frontend" of this app is in App.tsx. You should start your work there.

### ApiClient.ts

An API client that interacts with a fake database. Read the file over, but you should not need to edit it until the bonus section

## Instructions

1. The page doesn't change when you click the "Add ToDo" button. Why not?
   Fix this bug and describe the tradeoffs in your implementation. Would your solution work if a user had lots of (1,000,000+) todos?
   It's perfectly fine if the answer is no, but please discuss what would go wrong when the number of ToDos increases significantly
2. "Mark Done" doesn't appear to work at all. Why not?
   Fix this bug and make sure the page updates once the ToDo has been marked as "done".
   How could the API have been better designed to make the bug more noticeable?
3. The ApiClient takes an argument `mockDelay`. Set that to `true` on line 5 of `App.tsx`.
   Add some visual indication to the UI during the initial "loading" time and any time the page is waiting for the server to respond.
   The style design doesn't need to look good, but it should indicate what the user can and cannot do.
4. Make the todo items re-orderable using drag-and-drop. You are more than welcome to use a 3rd party library for this, or you can roll vanilla.
   If you chose to use a library, why did you pick that library? If you chose to write the logic yourself, why did you choose to do that?

## Tips

- The project needs some organization. Feel free to create as many files and/or components as you need.
- Git is your friend. Commit often and use descriptive commit messages. Push your work to GitHub so you don't lose it.
- Get it working and then make it look good. Don't get lost in the perfect solution before you have a working solution.
- Include more comments than you would in normal code. This will help us understand your thought process.
- Take breaks when you need them.

## Responses

Please write your responses to the questions in the instructions here. Please indicate any tradeoffs you made.

1.  To fix the bug, I re-rendered the view by updating the state. Initially, I thought we could move out the `apiClient.getToDos()` function to a re-usable function (`fetchLatestTodos`) because that would force the component to re-render with the updated list.

    However, in a real context, we probably don't want to make that many API calls. So, the tradeoff for an additional API call was to update the state, which has some similar code being re-used from the `apiClient`, but I think that's a small tradeoff.

    Additionally, I added memoization to the `TodoList` component--let React handle caching under the hood. I think memoizing the component is a good step at performance, in case we have 1 million or more todos. However, if we have that many Todos we will also want to consider virtual scrolling, so the browser doesn't crash for a user. We can save that for when there's more time :)

2.  Similar to the "Add ToDo" bug, the view was not updating with latest changes after saving the updated list in the `apiClient`.

    Also, the `toggleDone` in the App was passing the ToDo's `label` instead of the `id`, which wouldn't properly find the ToDo in the list.

    If we couldn't find the ToDo to toggle, the API could have returned an error because you cannot toggle a ToDo as done if it doesn't exist.

3.  While the App is loading, whether that's adding a ToDo or marking a ToDo as done, I added loading states to the buttons. I added a disabled state for the buttons, so the user could not click the buttons while the app is in a loading state.

    There is also a loading message when a list is being pulled in.

4.  I rolled with a third party package because of the time constraints and my previous experience with Drag and Drop within projects. To get something up quickly, a package has been simpler to implement because it's documented and typically has examples and use-cases that have already been considered. I usually look to make sure the stars on a GitHub repo, how often it's downloaded on NPM, and if it's well documented.

I chose the `react-beautiful-dnd` package because it's built, used, and maintained by Atlassian. Also, packages like `react-beautiful-dnd` have options to handle more complex dragging that rolling Vanilla might be more troublesome to maintain. However, I fully realize for a simplistic list drag-and-drop, pulling in a package may be overkill.

Given more time to read through the native HTML drag-and-drop API features on MDN, I might choose to go with an independent implementation, especially if we never go beyond re-ordering a list. So, the cost of maintaining our own implementation would be relatively low overhead than rolling with another library.

## Submitting

To submit your code, send us a link to your repo.
Once we confirm that we've downloaded your work, please delete the repo you created so future candidates don't accidentally find your solution.

To submit your screen recording, please reach out to schedule a time we can use https://webwormhole.io/ to transfer the large file.
