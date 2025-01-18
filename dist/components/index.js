var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, getDocs, serverTimestamp, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { db, app } from "../lib/firebase";
// import leoProfanity from "leo-profanity";
import moment from "moment";
import "../index.css";
var Comments = function (_a) {
    var 
    // firebaseConfig,
    // app,
    // db,
    pageUid = _a.pageUid, _b = _a.lang, lang = _b === void 0 ? "en" : _b, _c = _a.styles, styles = _c === void 0 ? {} : _c, _d = _a.texts, texts = _d === void 0 ? {
        placeholder: "Votre commentaire",
        btnAdd: "Ajouter",
        btnEdit: "Modifier",
        btnCancel: "Annuler",
        errorCharac: "Veuillez ne pas dépasser 1000 caractères",
        errorAdd: "Vous ne pouvez pas ajouter un commentaire en double",
        errorUrlAndMail: "Veuillez ne pas ajouter d'URL ou d'adresse mail",
        characLeft: "Caractères restants",
        title: "Commentaires",
        dateAt: "le",
        dateThe: "le",
        dateEdit: "le",
        btnModalConfirm: "Confirmer",
        titleModalDelete: "Supprimer le commentaire ?",
        connexionTitle: "Connectez-vous pour ajouter un commentaire",
        connexionButton: "Connexion",
        btnLogin: "Connexion",
        btnLogout: "Déconnexion"
    } : _d;
    var auth = getAuth(app);
    var provider = new GoogleAuthProvider();
    var _e = useState(""), comment = _e[0], setComment = _e[1];
    var _f = useState([]), comments = _f[0], setComments = _f[1];
    var _g = useState(null), editingCommentId = _g[0], setEditingCommentId = _g[1];
    var _h = useState(null), user = _h[0], setUser = _h[1];
    var _j = useState(null), errorMessage = _j[0], setErrorMessage = _j[1];
    var _k = useState(false), isModalOpen = _k[0], setIsModalOpen = _k[1];
    var maxLength = 1000;
    var formatUsername = function (fullName) {
        var names = fullName.split(" ");
        var firstName = names[0];
        var lastName = names[names.length - 1];
        return "".concat(firstName, " ").concat(lastName.charAt(0), ".");
    };
    // leoProfanity.loadDictionary("fr");
    useEffect(function () {
        var q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
        var unsubscribe = onSnapshot(q, function (snapshot) {
            var fetchedComments = snapshot.docs
                .filter(function (doc) { return doc.data().postId === pageUid; })
                .map(function (doc) {
                var _a, _b;
                return (__assign(__assign({ id: doc.id }, doc.data()), { createdAt: (_a = doc.data().createdAt) === null || _a === void 0 ? void 0 : _a.toDate(), updatedAt: (_b = doc.data().updatedAt) === null || _b === void 0 ? void 0 : _b.toDate() }));
            });
            setComments(fetchedComments);
        });
        return function () { return unsubscribe(); };
    }, [pageUid]);
    useEffect(function () {
        var unsubscribeAuth = onAuthStateChanged(auth, function (currentUser) {
            setUser(currentUser);
        });
        return function () { return unsubscribeAuth(); };
    }, []);
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var emailPattern, urlPattern, commentsRef, q, snapshot, userComments, consecutiveComments, commentRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!user)
                        return [2 /*return*/];
                    if (comment.length > 1000) {
                        setErrorMessage(texts.errorCharac);
                        return [2 /*return*/];
                    }
                    emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
                    urlPattern = /\b(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*\b|\b(?:www\.)[^\s/$.?#].[^\s]*\b/;
                    if (emailPattern.test(comment) || urlPattern.test(comment)) {
                        setErrorMessage(texts.errorUrlAndMail);
                        return [2 /*return*/];
                    }
                    if (!(user.displayName && pageUid)) return [3 /*break*/, 8];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    commentsRef = collection(db, "comments");
                    q = query(commentsRef, orderBy("createdAt", "desc"));
                    return [4 /*yield*/, getDocs(q)];
                case 2:
                    snapshot = _a.sent();
                    userComments = snapshot.docs
                        .filter(function (doc) {
                        return doc.data().userId === user.uid && doc.data().postId === pageUid;
                    })
                        .map(function (doc) {
                        var _a;
                        return (__assign(__assign({}, doc.data()), { createdAt: (_a = doc.data().createdAt) === null || _a === void 0 ? void 0 : _a.toDate() }));
                    });
                    if (userComments.length > 0 && !editingCommentId) {
                        consecutiveComments = userComments.slice(0, 1);
                        if (consecutiveComments.length === 1) {
                            setErrorMessage(texts.errorAdd);
                            return [2 /*return*/];
                        }
                    }
                    if (!editingCommentId) return [3 /*break*/, 4];
                    commentRef = doc(db, "comments", editingCommentId);
                    return [4 /*yield*/, updateDoc(commentRef, {
                            comment: comment,
                            updatedAt: serverTimestamp()
                        })];
                case 3:
                    _a.sent();
                    setEditingCommentId(null);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, addDoc(commentsRef, {
                        postId: pageUid,
                        username: user.displayName,
                        comment: comment,
                        userImage: user.photoURL,
                        userId: user.uid,
                        createdAt: serverTimestamp()
                    })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    setComment("");
                    setErrorMessage(null);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    if (error_1 instanceof Error) {
                        console.error("Erreur lors de l'ajout ou modification du commentaire :", error_1.message);
                    }
                    else {
                        console.error("Erreur inconnue", error_1);
                    }
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleModalDeleteComment = function () {
        setIsModalOpen(true);
        handleCancelEdit();
        setErrorMessage("");
    };
    var handleDeleteComment = function (comment) { return __awaiter(void 0, void 0, void 0, function () {
        var commentRef, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(user && user.uid === comment.userId)) return [3 /*break*/, 4];
                    isModalOpen && setIsModalOpen(false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    commentRef = doc(db, "comments", comment.id);
                    return [4 /*yield*/, deleteDoc(commentRef)];
                case 2:
                    _a.sent();
                    setComments(function (prevComments) {
                        return prevComments.filter(function (c) { return c.id !== comment.id; });
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Erreur lors de la suppression du commentaire :", error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleEditComment = function (comment) {
        setEditingCommentId(comment.id);
        setComment(comment.comment);
        setErrorMessage("");
    };
    var handleCancelEdit = function () {
        setEditingCommentId(null);
        setComment("");
    };
    var handleLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, signInWithPopup(auth, provider)];
                case 1:
                    result = _a.sent();
                    setUser(result.user);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    if (error_3 instanceof Error) {
                        console.error("Erreur lors de la connexion : ", error_3.message);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, signOut(auth)];
                case 1:
                    _a.sent();
                    setUser(null);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    if (error_4 instanceof Error) {
                        console.error("Erreur lors de la déconnexion : ", error_4.message);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("section", { className: "pt-[60px] pb-[60px] bg-slate-50 z-10 relative" },
        React.createElement("div", { className: "container mx-auto" },
            React.createElement("div", { className: styles.container },
                React.createElement("div", { className: "flex justify-between" },
                    React.createElement("div", { className: "flex h-full sticky top-[120px]" }, user ? (React.createElement("form", { onSubmit: handleSubmit, className: editingCommentId ? styles.editing : "" },
                        React.createElement("div", { className: "flex items-center gap-[10px]" },
                            React.createElement("img", { src: user.photoURL || undefined, alt: user.displayName || undefined, className: "w-[40px] h-[40px] rounded-full" }),
                            React.createElement("h3", { className: "text-l font-bold text-black" }, formatUsername(user.displayName)),
                            user && (React.createElement("div", { className: styles.logout, onClick: handleLogout },
                                React.createElement("svg", { className: "w-[20px] h-[20px] fill-none ", viewBox: "0 0 24 24" },
                                    React.createElement("path", { className: " stroke-black stroke-2 stroke-linecap-round stroke-linejoin-round", d: "M21 12L13 12" }),
                                    React.createElement("path", { className: " stroke-black stroke-2 stroke-linecap-round stroke-linejoin-round", d: "M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9" }),
                                    React.createElement("path", { className: " stroke-black stroke-2 stroke-linecap-round stroke-linejoin-round", d: "M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19" }))))),
                        React.createElement("textarea", { value: comment, onChange: function (e) {
                                setComment(e.target.value);
                                setErrorMessage("");
                            }, onFocus: function () { return setErrorMessage(""); }, maxLength: maxLength, placeholder: texts.placeholder, required: true, className: "h-[100px] font-medium resize-none outline-none p-[10px] border-gray-300 rounded-8 bg-gray-50" }),
                        React.createElement("div", { className: styles.container_bottom },
                            comment.length > 0 && (React.createElement("span", { className: styles.caracter },
                                maxLength - comment.length,
                                " ",
                                texts.characLeft)),
                            React.createElement("div", { className: styles.container_btns },
                                React.createElement("button", { type: "submit" }, editingCommentId ? texts.btnEdit : texts.btnAdd),
                                editingCommentId && (React.createElement("button", { type: "button", onClick: handleCancelEdit }, texts.btnCancel))),
                            errorMessage && (React.createElement("span", { className: styles.error }, errorMessage))))) : (React.createElement("div", { className: "connexion flex flex-col gap-[40px]" },
                        React.createElement("div", { className: styles.title },
                            React.createElement("h4", { className: "text-3xl font-bold text-black" }, texts.connexionTitle)),
                        React.createElement("div", { className: "flex items-center justify-center gap-[20px] border border-gray-300 rounded-6 p-[20px] bg-gray-50 hover:cursor-pointer hover:bg-gray-100", onClick: handleLogin },
                            React.createElement("svg", { className: "w-[24px] h-[24px]", viewBox: "-3 0 262 262", xmlns: "http://www.w3.org/2000/svg", preserveAspectRatio: "xMidYMid" },
                                React.createElement("path", { d: "M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027", fill: "#4285F4" }),
                                React.createElement("path", { d: "M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1", fill: "#34A853" }),
                                React.createElement("path", { d: "M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782", fill: "#FBBC05" }),
                                React.createElement("path", { d: "M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251", fill: "#EB4335" })),
                            React.createElement("h4", { className: "text-xl font-bold text-black" }, texts.connexionButton))))),
                    React.createElement("div", { className: "flex flex-col gap-[20px]" }, comments
                        .slice()
                        .reverse()
                        .map(function (comment) { return (React.createElement("div", { className: "relative flex flex-col border border-gray-300 rounded-10 bg-gray-50 p-[15px]hover:cursor-pointer hover:bg-gray-100 p-[20px] w-[500px] gap-[10px]", key: comment.id },
                        React.createElement("div", { className: styles.container_top },
                            React.createElement("div", { className: "flex items-center gap-[10px]" },
                                React.createElement("img", { src: comment.userImage, alt: comment.username, className: "w-[40px] h-[40px] rounded-full" }),
                                React.createElement("h3", { className: "text-l font-bold text-black" }, formatUsername(comment.username)),
                                React.createElement("div", { className: "flex items-center gap-[10px]" },
                                    React.createElement("div", { className: styles.created },
                                        React.createElement("span", { className: "text-sm text-black" }, texts.dateThe +
                                            " " +
                                            moment(comment.createdAt)
                                                .locale(lang)
                                                .format("LL") +
                                            " " +
                                            texts.dateAt +
                                            " " +
                                            moment(comment.createdAt)
                                                .locale(lang)
                                                .format("LT"))),
                                    comment.updatedAt && (React.createElement("div", { className: styles.modified },
                                        React.createElement("span", { className: "text-sm text-black" }, texts.dateEdit +
                                            " " +
                                            moment(comment.updatedAt)
                                                .locale(lang)
                                                .format("LL") +
                                            " " +
                                            texts.dateAt +
                                            " " +
                                            moment(comment.updatedAt)
                                                .locale(lang)
                                                .format("LT")))))),
                            user && user.uid === comment.userId && (React.createElement("div", { className: styles.container_btn },
                                React.createElement("button", { onClick: function () { return handleEditComment(comment); } },
                                    React.createElement("svg", { className: styles.edit, viewBox: "0 0 24 24" },
                                        React.createElement("path", { d: "M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" }),
                                        React.createElement("path", { d: "M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" }))),
                                React.createElement("button", { onClick: function () { return handleModalDeleteComment(); } },
                                    React.createElement("svg", { className: styles.delete, viewBox: "0 0 24 24" },
                                        React.createElement("path", { d: "M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" }),
                                        React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" })))))),
                        React.createElement("p", { className: "text-sm text-black" }, comment.comment),
                        isModalOpen && (React.createElement("div", { className: styles.modal_delete },
                            React.createElement("div", { className: styles.container_modal },
                                React.createElement("h4", null, texts.titleModalDelete),
                                React.createElement("div", { className: styles.container_btns },
                                    React.createElement("button", { type: "button", onClick: function () { return handleDeleteComment(comment); } }, texts.btnModalConfirm),
                                    React.createElement("button", { type: "button", onClick: function () { return setIsModalOpen(false); } }, texts.btnCancel))))))); })))))));
};
export default Comments;
