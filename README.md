# Comments-React Module (using Firebase)

![Comments module](https://images.prismic.io/lecodeurnormandv2/Z46p5pbqstJ99p0h_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8020.51.29.png?auto=format,compress "Comments module")
![Comments module](https://images.prismic.io/lecodeurnormandv2/Z46p5pbqstJ99p0g_Captured%E2%80%99e%CC%81cran2025-01-20a%CC%8020.50.39.png?auto=format,compress "Comments module")

Effortlessly add a robust comment system to your blog or website! 🚀  
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
  - Change color for button, text(and svg) and background !
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

  return <Comments firebaseConfig={firebaseConfig} pageUid={pageUid} />;
};

export default Comment;
```

## Props

### Settings

| Property          |  Types  |                         Default                          |
| ----------------- | :-----: | :------------------------------------------------------: |
| firebaseConfig    | object  |                      firebaseConfig                      |
| pageUid           | string  |                         pageUid                          |
| profanityLanguage | string  |               "en" (only "en", "fr", "ru")               |
| preventMultiPosts | boolean | true (the user have to wait other comment to post again) |
| maxChars          | number  |                           1000                           |
| lang              | string  |                     lang (date only)                     |

### Style

| Property         | Types  |               Default               |
| ---------------- | :----: | :---------------------------------: |
| backgroundColor  | string |              "#FFFFFF"              |
| textColor        | string | "#10172A" (surcharge svg color too) |
| buttonColor      | string |              "#232d47"              |
| buttonHoverColor | string |              "#10172A"              |
| fontPrim         | string |     ""(override tailwind font)      |
| fontSec          | string |     "" (override tailwind font)     |

### Texts

```
texts={{
    placeholder=""
    btnAdd=""
    ....
}}
```

| Property         | Types  |                       Default                        |
| ---------------- | :----: | :--------------------------------------------------: |
| placeholder      | string |                    "Your comment"                    |
| btnAdd           | string |                   "Add a comment"                    |
| btnEdit          | string |                        "Edit"                        |
| btnCancel        | string |                       "Cancel"                       |
| errorCharac      | string |        "Please do not exceed 1000 characters"        |
| errorAdd         | string | "You need to wait for another user to add a comment" |
| errorUrlAndMail  | string |   "Please do not include URLs or email addresses"    |
| characLeft       | string |                  "Characters left"                   |
| title            | string |                      "Comments"                      |
| dateAt           | string |                         "at"                         |
| dateThe          | string |                         "on"                         |
| dateEdit         | string |                     "Edited on"                      |
| dateThe          | string |                         "on"                         |
| btnModalConfirm  | string |                      "Confirm"                       |
| titleModalDelete | string |                "Delete this comment"                 |
| connexionTitle   | string |              "Log in to add a comment"               |
| connexionButton  | string |                 "Log in with Google"                 |

## Contact

If you have any question feel free to contact me on my website 😉
www.meetguillaume.dev
