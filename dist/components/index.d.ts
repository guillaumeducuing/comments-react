import React from "react";
import { Firestore } from "firebase/firestore";
import "../index.css";
interface CommentProps {
    firebaseConfig: object;
    pageUid: string;
    lang?: string;
    styles?: Record<string, string>;
    texts?: {
        placeholder?: string;
        btnAdd?: string;
        btnEdit?: string;
        btnCancel?: string;
        errorCharac?: string;
        errorAdd?: string;
        errorUrlAndMail?: string;
        characLeft?: string;
        title?: string;
        dateAt?: string;
        dateThe?: string;
        dateEdit?: string;
    };
    preventProfanity?: boolean;
    maxChars?: number;
    db: Firestore;
    app: Firestore;
    auth: any;
}
declare const Comments: React.FC<CommentProps>;
export default Comments;
