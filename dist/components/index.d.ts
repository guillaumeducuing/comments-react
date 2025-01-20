import React from "react";
import "moment/locale/fr";
import "../index.css";
interface CommentProps {
    firebaseConfig: object;
    pageUid: string;
    lang?: string;
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
        btnModalConfirm?: string;
        titleModalDelete?: string;
        connexionTitle?: string;
        connexionButton?: string;
        btnLogin?: string;
        btnLogout?: string;
    };
    backgroundColor?: string;
    textColor?: string;
    buttonColor?: string;
    fontPrimary?: string;
    fontSecondary?: string;
    preventProfanity?: boolean;
    profanityLanguage?: string;
    preventMultiPosts?: boolean;
    maxChars?: number;
}
declare const Comments: React.FC<CommentProps>;
export default Comments;
