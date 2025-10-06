// Firebase Configuration
// Note: Replace these with your actual Firebase project credentials
export const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com/",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Example Firebase Realtime Database structure for labels:
/*
{
  "labels": {
    "common": {
      "welcome": "Welcome to Our App",
      "loading": "Loading...",
      "error": "Something went wrong",
      "retry": "Try Again",
      "save": "Save",
      "cancel": "Cancel",
      "ok": "OK"
    },
    "interests": {
      "title": "Select Your Interests",
      "subtitle": "Choose what you're passionate about",
      "searchPlaceholder": "Search interests...",
      "noResults": "No interests found",
      "selectedCount": "{count} selected"
    },
    "categories": {
      "title": "Browse Categories",
      "refreshing": "Refreshing categories...",
      "pullToRefresh": "Pull to refresh",
      "emptyState": "No categories available"
    },
    "buttons": {
      "continue": "Continue",
      "back": "Back",
      "next": "Next",
      "finish": "Finish",
      "skip": "Skip"
    }
  }
}
*/
