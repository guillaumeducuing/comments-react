import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  Firestore
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import leoProfanity from "leo-profanity";
import moment from "moment";
import "moment/locale/fr";
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
    btnModalConfirm?: string;
    titleModalDelete?: string;
    connexionTitle?: string;
    connexionButton?: string;
    btnLogin?: string;
    btnLogout?: string;
  };
  preventProfanity?: boolean;
  profanityLanguage?: string;
  preventMultiPosts?: boolean;
  maxChars?: number;
}
interface CommentType {
  id: string;
  postId: string;
  username: string;
  comment: string;
  userImage: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
type ProfanityLanguage = "fr" | "en" | "ru";

const Comments: React.FC<CommentProps> = ({
  firebaseConfig,
  pageUid,
  lang = "fr-fr",
  texts = {
    placeholder: "Votre commentaire",
    btnAdd: "Ajouter",
    btnEdit: "Modifier",
    btnCancel: "Annuler",
    errorCharac: "Veuillez ne pas dépasser 1000 caractères",
    errorAdd:
      "Vous devez attendre qu'un autre utilisateur ajoute un commentaire",
    errorUrlAndMail: "Veuillez ne pas ajouter d'URL ou d'adresse mail",
    characLeft: "Caractères restants",
    title: "Commentaires",
    dateAt: "le",
    dateThe: "le",
    dateEdit: "Modifié le",
    btnModalConfirm: "Confirmer",
    titleModalDelete: "Supprimer le commentaire ?",
    connexionTitle: "Connectez-vous pour ajouter un commentaire",
    connexionButton: "Connexion",
    btnLogin: "Connexion",
    btnLogout: "Déconnexion"
  } as any,
  preventProfanity = true,
  profanityLanguage = "fr",
  preventMultiPosts = true,
  maxChars = 1000
}) => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState<Object | any>(null);
  const maxLength = maxChars;

  const formatUsername = (fullName: any) => {
    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names[names.length - 1];
    return `${firstName} ${lastName.charAt(0)}.`;
  };

  // preventProfanity
  useEffect(() => {
    const validLanguages: ProfanityLanguage[] = ["fr", "en", "ru"];
    if (
      preventProfanity &&
      validLanguages.includes(profanityLanguage as ProfanityLanguage)
    ) {
      leoProfanity.loadDictionary(profanityLanguage as ProfanityLanguage);
    } else {
      console.warn(
        `Language '${profanityLanguage}' is not supported by leo-profanity. Defaulting to 'fr'.`
      );
      leoProfanity.loadDictionary("fr");
    }
  }, [profanityLanguage, preventProfanity]);

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedComments = snapshot.docs
        .filter(doc => doc.data().postId === pageUid)
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }));
      setComments(fetchedComments as CommentType[]);
    });

    return () => unsubscribe();
  }, [pageUid]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (comment.length > 1000) {
      setErrorMessage(texts.errorCharac);
      return;
    }

    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const urlPattern =
      /\b(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*\b|\b(?:www\.)[^\s/$.?#].[^\s]*\b/;

    if (emailPattern.test(comment) || urlPattern.test(comment)) {
      setErrorMessage(texts.errorUrlAndMail);
      return;
    }
    const cleanedComment = preventProfanity
      ? leoProfanity.clean(comment)
      : comment;

    if (user.displayName && pageUid) {
      try {
        const commentsRef = collection(db, "comments");
        const q = query(commentsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const userComments = snapshot.docs
          .filter(
            doc =>
              doc.data().userId === user.uid && doc.data().postId === pageUid
          )
          .map(doc => ({
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate()
          }));
        // Handle the case where the user has already commented
        if (userComments.length > 0 && !editingCommentId && preventMultiPosts) {
          const consecutiveComments = userComments.slice(0, 1);
          if (consecutiveComments.length === 1) {
            setErrorMessage(texts.errorAdd);
            return;
          }
        }

        if (editingCommentId) {
          const commentRef = doc(db, "comments", editingCommentId);
          await updateDoc(commentRef, {
            comment: cleanedComment,
            updatedAt: serverTimestamp()
          });
          setEditingCommentId(null);
        } else {
          await addDoc(commentsRef, {
            postId: pageUid,
            username: user.displayName,
            comment: cleanedComment,
            userImage: user.photoURL,
            userId: user.uid,
            createdAt: serverTimestamp()
          });
        }

        setComment("");
        setErrorMessage(null);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Erreur lors de l'ajout ou modification du commentaire :",
            error.message
          );
        } else {
          console.error("Erreur inconnue", error);
        }
      }
    }
  };

  const handleModalDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    handleCancelEdit();
    setErrorMessage("");
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    try {
      const commentRef = doc(db, "comments", commentToDelete);
      await deleteDoc(commentRef);
      setComments(prevComments =>
        prevComments.filter(c => c.id !== commentToDelete)
      );
      setCommentToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    }
  };

  const closeModal = () => {
    setCommentToDelete(null);
  };

  const handleEditComment = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setComment(comment.comment);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setComment("");
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la connexion : ", error.message);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la déconnexion : ", error.message);
      }
    }
  };

  return (
    <section className="pt-[60px] pb-[60px] bg-white z-10 relative w-full">
      <div className="container px-4 w-full lg:mx-auto lg:px-0">
        <div className="flex flex-col-reverse justify-between lg:flex-row">
          <div className="flex h-full sticky top-[120px] w-full lg:w-[500px]">
            {user ? (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-4 mt-5 lg:mt-0"
              >
                <div className="flex items-center gap-[10px]">
                  <img
                    src={user.photoURL || undefined}
                    alt={user.displayName || undefined}
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <h3 className="text-xl font-grotesk-variable   text-slate-900 ">
                    {formatUsername(user.displayName)}
                  </h3>
                  {user && (
                    <div className="cursor-pointer" onClick={handleLogout}>
                      <svg
                        className="w-[20px] h-[20px] fill-none "
                        viewBox="0 0 24 24"
                      >
                        <path
                          className=" stroke-black stroke-2 stroke-linecap-round stroke-linejoin-round"
                          d="M21 12L13 12"
                        />
                        <path
                          className=" stroke-black stroke-2 stroke-linecap-round stroke-linejoin-round"
                          d="M18 15L20.913 12.087V12.087C20.961 12.039 20.961 11.961 20.913 11.913V11.913L18 9"
                        />
                        <path
                          className=" stroke-black stroke-2 stroke-linecap-round stroke-linejoin-round"
                          d="M16 5V4.5V4.5C16 3.67157 15.3284 3 14.5 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H14.5C15.3284 21 16 20.3284 16 19.5V19.5V19"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <textarea
                  value={comment}
                  onChange={e => {
                    setComment(e.target.value);
                    setErrorMessage("");
                  }}
                  onFocus={() => setErrorMessage("")}
                  maxLength={maxLength}
                  placeholder={texts.placeholder}
                  required
                  className="h-[120px] font-inter-regular resize-none outline-none p-[10px] border-gray-500 border-[1px] rounded-[8px] text-slate-900 placeholder:text-gray-500"
                />
                <div className="flex flex-col gap-[8px] w-full">
                  {comment.length > 0 && (
                    <span className="font-inter-regular text-sm text-gray-500 text-right">
                      {maxLength - comment.length} {texts.characLeft}
                    </span>
                  )}
                  <div className="flex gap-[8px] w-full">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 text-white px-[10px] py-[8px] rounded-[8px] font-grotesk-variable hover:bg-slate-800 ease-in-out duration-300"
                    >
                      {editingCommentId ? texts.btnEdit : texts.btnAdd}
                    </button>
                    {editingCommentId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="w-full bg-slate-900 text-white px-[10px] py-[8px] rounded-[8px] font-grotesk-variable hover:bg-slate-800 ease-in-out duration-300"
                      >
                        {texts.btnCancel}
                      </button>
                    )}
                  </div>
                  {errorMessage && (
                    <span className="font-inter-regular text-red-400">
                      {errorMessage}
                    </span>
                  )}
                </div>
              </form>
            ) : (
              <div className="connexion flex flex-col gap-[20px] w-full">
                <div className="text-center">
                  <h4 className="font-grotesk-variable text-xl text-slate-900 mt-8 lg:mt-0">
                    {texts.connexionTitle}
                  </h4>
                </div>
                <div
                  className="flex items-center justify-center gap-[20px] border border-gray-500 rounded-[10px] p-[15px] bg-gray-50 hover:cursor-pointer hover:bg-gray-200 ease-in-out duration-300"
                  onClick={handleLogin}
                >
                  <svg
                    className="w-[24px] h-[24px]"
                    viewBox="-3 0 262 262"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                  >
                    <path
                      d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      fill="#4285F4"
                    />
                    <path
                      d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      fill="#34A853"
                    />
                    <path
                      d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                      fill="#FBBC05"
                    />
                    <path
                      d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      fill="#EB4335"
                    />
                  </svg>
                  <h4 className="text-xl font-bold text-slate-900 ">
                    {texts.connexionButton}
                  </h4>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[20px]">
            {comments
              .slice()
              .reverse()
              .map(comment => (
                <div
                  className="relative flex flex-col border border-gray-300 rounded-[8px] bg-gray-50 p-[15px] w-full gap-[10px] shadow-md ease-in-out duration-300 lg:w-[500px]"
                  key={comment.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <img
                        src={comment.userImage}
                        alt={comment.username}
                        className="w-[40px] h-[40px] rounded-full"
                      />
                      <h3 className=" font-grotesk-variable text-l text-slate-900 ">
                        {formatUsername(comment.username)}
                      </h3>
                      <div className="flex flex-col items-start">
                        <div>
                          <span className="font-inter-regular text-xsm  text-slate-900 ">
                            {texts.dateThe +
                              " " +
                              moment(comment.createdAt)
                                .locale(lang)
                                .format("LL") +
                              " " +
                              texts.dateAt +
                              " " +
                              moment(comment.createdAt)
                                .locale(lang)
                                .format("LT")}
                          </span>
                        </div>
                        {comment.updatedAt && (
                          <div className="-mt-[5px]">
                            <span className="font-inter-regular text-xsm text-slate-900 ">
                              {texts.dateEdit +
                                " " +
                                moment(comment.updatedAt)
                                  .locale(lang)
                                  .format("LL") +
                                " " +
                                texts.dateAt +
                                " " +
                                moment(comment.updatedAt)
                                  .locale(lang)
                                  .format("LT")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {user && user.uid === comment.userId && (
                      <div className="flex gap-2">
                        <button onClick={() => handleEditComment(comment)}>
                          <svg
                            className="w-[15px] h-[15px] fill-none "
                            viewBox="0 0 24 24"
                          >
                            <path
                              className="stroke-black stroke-2"
                              d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                            />
                            <path
                              className="stroke-black stroke-2"
                              d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleModalDeleteComment(comment.id)}
                        >
                          <svg
                            className="w-[15px] h-[15px] fill-none "
                            viewBox="0 0 24 24"
                          >
                            <path
                              className="fill-black"
                              d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z"
                            />
                            <path
                              className="fill-black"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className=" font-grotesk-variable text-md text-slate-900 ">
                    {comment.comment}
                  </p>
                  {commentToDelete === comment.id && (
                    <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-20 backdrop-blur-sm rounded-[8px] z-10">
                      <div className="flex flex-col gap-[20px] w-full h-full justify-center items-center ">
                        <h4 className="font-grotesk-variable text-l text-slate-900">
                          {texts.titleModalDelete}
                        </h4>
                        <div className="flex gap-[8px] w-full justify-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteComment()}
                            className="w-fit bg-slate-900 text-white px-[10px] py-[8px] rounded-[8px] font-grotesk-variable hover:bg-slate-800 ease-in-out duration-300"
                          >
                            {texts.btnModalConfirm}
                          </button>
                          <button
                            type="button"
                            onClick={() => closeModal()}
                            className="w-fit bg-slate-900 text-white px-[10px] py-[8px] rounded-[8px] font-grotesk-variable hover:bg-slate-800 ease-in-out duration-300"
                          >
                            {texts.btnCancel}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Comments;
