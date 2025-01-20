# Comments-React Module (using Firebase)

![Comments module](https://images.prismic.io/lecodeurnormandv2/Z46p5pbqstJ99p0h_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8020.51.29.png?auto=format,compress "Comments module")
![Comments module](https://images.prismic.io/lecodeurnormandv2/Z46p5pbqstJ99p0g_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8020.50.39.png?auto=format,compress "Comments module")

Effortlessly add a robust comment system to your blog or application! 🚀  
The **Comments-React Module** is a lightweight, feature-packed library built with modern tools like **React**, **TypeScript**, and **Tailwind CSS**.  
Designed for flexibility and ease of use, it offers a seamless way to manage comments while maintaining control over customization and moderation.

![Démonstration GIF](https://images.prismic.io/lecodeurnormandv2/Z46ylpbqstJ99p4T_comments-react-1-.gif?auto=format,compress)

---

## ✨ Features

- **Firebase Integration**: All comments are stored securely in Firebase, ensuring scalability and reliability.
- **Full CRUD Support**: Add, edit, or delete your comment with ease.
- **Smart Moderation**: Built-in profanity filtering using the powerful [leo-profanity](https://www.npmjs.com/package/leo-profanity) module.
- **Customizable**:
  - Support for changing languages and text.
  - Adjustable character limits to suit your needs.
  - Prevent spamming with anti-multi-post protection.
- **Modern Tech Stack**: Built with **React**, **TypeScript**, and styled using **Tailwind CSS** for a clean and responsive UI.

---

## 🚀 Quick Start

### Installation

Install the package via npm or yarn:

```bash
npm install comments-react
```

## Firebase config

this module use firebase config so you have to [create an account](https://firebase.google.com/products/firestore).(it's free, choose Firestore Database)

```
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
  };
```

### 1. Add Google Authentication

![Google Auth](https://images.prismic.io/lecodeurnormandv2/Z444dJbqstJ99obX_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8012.48.40.png?auto=format,compress "Google Auth")

### 2. Create collection named "comments" (empty, this module will hydrate it)

![Create collection](https://images.prismic.io/lecodeurnormandv2/Z444dZbqstJ99obY_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8012.48.59.png?auto=format,compress "Create collection")

### 3. Protect with rules

![Rules](https://images.prismic.io/lecodeurnormandv2/Z445_ZbqstJ99ob7_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8012.56.28.png?auto=format,compress "Rules")

## Exemple of your component

```jsx
"use client";

import { Comments } from "comments-react";

const Comment = ({ pageUid, lang }: { pageUid: string, lang: string }) => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
  };

  return (
    <Comments
      firebaseConfig={firebaseConfig}
      pageUid={pageUid}
      preventProfanity={true}
      profanityLanguage="en" // only "en","fr","ru"
      preventMultiPosts={true} // the user have to wait other comment to post another
      maxChars={1000}
      texts={{
        placeholder: "Your comment",
        btnAdd: "Add a comment",
        btnEdit: "Edit",
        btnCancel: "Cancel",
        errorCharac: "Please do not exceed 1000 characters",
        errorAdd: "You need to wait for another user to add a comment",
        errorUrlAndMail: "Please do not include URLs or email addresses",
        characLeft: "Characters left",
        title: "Comments",
        dateAt: "at",
        dateThe: "on",
        dateEdit: "Edited on",
        btnModalConfirm: "Confirm",
        titleModalDelete: "Delete this comment",
        connexionTitle: "Log in to add a comment",
        connexionButton: "Log in with Google"
      }}
      backgroundColor="#FFFFFF"
      lang={lang}
    />
  );
};

export default Comment;
```

## Contact

If you have any question feel free to contact me on my website :)
www.meetguillaume.dev
