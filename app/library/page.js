"use client";

import axios from "axios";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import GetAudioTime from "@/components/GetAudioTime";

export default function Library() {
  const [libraryList, setLibraryList] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLibraryList = async (uid) => {
      try {
        const userDoc = doc(firestore, `users/${uid}`);
        const userDocSnap = await getDoc(userDoc);

        if (userDocSnap.exists()) {
          setLibraryList(userDocSnap.data().libraryList || []);
          console.log(libraryList);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error loading library list: ", error);
      }
    };

    if (user) {
      fetchLibraryList(user.uid);
    }
  }, [user]); // Fetch libraryList when user changes

  useEffect(() => {
    const fetchFinishedBooks = async (uid) => {
      try {
        const userDoc = doc(firestore, `users/${uid}`);
        const userDocSnap = await getDoc(userDoc);

        if (userDocSnap.exists()) {
          setFinishedBooks(userDocSnap.data().finishedBooks || []);
        } else {
          console.log("no such doc!");
        }
      } catch (error) {
        console.error("error loading finished list: ", error);
      }
    };

    if (user) {
      fetchFinishedBooks(user.uid);
    }
  }, [user]);

  const saveLibraryList = async (libraryList) => {
    if (!user) return;

    const userDocRef = doc(firestore, `users/${user.uid}`);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, { libraryList });
    } else {
      await setDoc(userDocRef, { libraryList });
    }
  };

  useEffect(() => {
    const saveLibraryListToFirestore = async () => {
      try {
        if (!user) return;

        const userDocRef = doc(firestore, `users/${user.uid}`);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          await updateDoc(userDocRef, { libraryList });
        } else {
          await setDoc(userDocRef, { libraryList });
        }
      } catch (error) {
        console.error("Error saving library list to Firestore: ", error);
      }
    };

    saveLibraryListToFirestore();
  }, [libraryList, user]);

  useEffect(() => {
    if (user) {
      saveLibraryList(libraryList);
    }
  }, [libraryList, user]);

  return (
    <>
      <Sidebar />
      <Search />
      <div className="row">
        <div className="container">
          <div className="foryou__title">Saved Books</div>
          {libraryList && libraryList.length > 0 ? (
            <>
              <div className="foryou__subtitle">{libraryList.length} items</div>
              <div className="foryou__recommended--books">
                {libraryList.map((book) => (
                  <a
                    key={book.id}
                    className="foryou__recommended--books-link"
                    href={`/book/${book.id}`}
                  >
                    <figure className="book__image--wrapper">
                      <img
                        className="book__image"
                        src={`${book.imageLink}`}
                        alt="book"
                      />
                    </figure>
                    <div className="recommended__book--title">{book.title}</div>
                    <div className="recommended__book--author">
                      {book.author}
                    </div>
                    <div className="recommended__book--subtitle">
                      {book.subTitle}
                    </div>
                    <div className="recommended__book--details-wrapper">
                      <div className="recommended__book--details">
                        <div className="recommended__book--details-icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                            <path d="M13 7h-2v6h6v-2h-4z"></path>
                          </svg>
                        </div>

                        <div className="recommended__book--details-text">
                          <GetAudioTime audioLink={book.audioLink} />
                        </div>
                      </div>
                      <div className="recommended__book--details">
                        <div className="recommended__book--details-icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 1024 1024"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                          </svg>
                        </div>
                        <div className="recommended__book--details-text">
                          {book.averageRating}
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="foryou__title">Finished</div>
              <div className="foryou__subtitle">{finishedBooks.length} items</div>
              <div className="foryou__recommended--books">
                {finishedBooks.map((finishedBook) => (
                  <a
                    key={finishedBook.id}
                    className="foryou__recommended--books-link"
                    href={`/book/${finishedBook.id}`}
                  >
                    <figure className="book__image--wrapper">
                      <img
                        className="book__image"
                        src={`${finishedBook.imageLink}`}
                        alt="book"
                      />
                    </figure>
                    <div className="recommended__book--title">{finishedBook.title}</div>
                    <div className="recommended__book--author">{finishedBook.author}</div>
                    <div className="recommended__book--subtitle">{finishedBook.subTitle}</div>
                    <div className="recommended__book--details-wrapper">
                      <div className="recommended__book--details">
                        <div className="recommended__book--details-icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                            <path d="M13 7h-2v6h6v-2h-4z"></path>
                          </svg>
                        </div>
                        <div className="recommended__book--details-text">
                          <GetAudioTime audioLink={finishedBook.audioLink} />
                        </div>
                      </div>
                      <div className="recommended__book--details">
                        <div className="recommended__book--details-icon">
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 1024 1024"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                          </svg>
                        </div>
                        <div className="recommended__book--details-text">{finishedBook.averageRating}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="foryou__subtitle">0 items</div>
              <div className="finished__books--block-wrapper">
                <div className="finished__books--title">
                  Save your favorite books!
                </div>
                <div className="finished__books--sub-title">
                  When you save a book, it will appear here.
                </div>
              </div>
              <div className="foryou__title">Finished</div>
              <div className="foryou__subtitle">0 items</div>
              <div className="finished__books--block-wrapper">
                <div className="finished__books--title">Done and dusted!</div>
                <div className="finished__books--sub-title">
                  When you finish a book, you can find it here later.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
