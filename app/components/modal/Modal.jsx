"use client";
import { useState, useEffect, useRef } from "react";
import Button from "./../button/Button";

const Modal = ({ branchThread, mainThreadId, phaseStage }) => {
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const [genre, setGenre] = useState("");
  const [body, setBody] = useState("");
  const [dots, setDots] = useState("");
  const bodyRef = useRef("");

  useEffect(() => {
    const userID = localStorage.getItem("userID");
    setUserId(userID);
  }, [userId]);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setDots((dots) => (dots.length < 4 ? dots + "." : ""));
      }, 300);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    const endpoint = `/api/threads/${mainThreadId.threadId}`;
    fetch(endpoint, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(({ mainThread }) => {
        const content = mainThread.contentBody;
        const genre = mainThread.genre;
        setContent(content);
        setGenre(genre);
      })
      .catch((error) => {
        console.log("Error fetching users:", error);
      });
  }, [mainThreadId]);

  const handleAIGenerate = async (event) => {
    event.preventDefault();

    bodyRef.current = "";
    setIsLoading(true);

    const contentBody = content;
    const storyGenre = genre;

    const endpoint = "https://api.openai.com/v1/completions";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "text-davinci-002",
        prompt: `Given the summary: ${contentBody}, and ${storyGenre} continue the story by writing a paragraph of only three sentences.`,
        temperature: 1.0,
        max_tokens: 100,
      }),
    };

    const response = await fetch(endpoint, options);

    const { choices, error } = await response.json();

    const body = choices[0].text;

    if (!error) {
      branchThread.content = body;
      let index = 0;
      const typingTimer = setInterval(() => {
        bodyRef.current = bodyRef.current + body.charAt(index);
        setBody(bodyRef.current);
        index++;

        if (index >= body.length) {
          clearInterval(typingTimer);
        }
      }, 10);
    }
    setIsLoading(false);
  };

  const openModalEvent = (e) => {
    e.preventDefault();

    setShowModal(true);
  };
  const closeModalEvent = (e) => {
    e.preventDefault();

    setShowModal(false);
  };

  const submitBranchThread = async (e) => {
    e.preventDefault();

    const data = {
      body: e.target.branchContext.value,
      userId: userId,
      mainThreadId: mainThreadId.threadId,
    };

    const JSONdata = JSON.stringify(data);

    const endpoint = "/api/threads/branchThread";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);

    const { threadFromDB, error } = await response.json();

    if (!error) {
      location.reload();
      setShowModal(false);
    } else {
      location.reload();
      return;
    }
  };

  return (
    <>
      <div
        style={{
          height: "150px",
          textAlign: "center",
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
        }}
      >
        {/* Plus Sign to add a branch thread */}
        {Object.values(branchThread).some((e) => e.userId === userId) ||
        phaseStage >= 3 ? null : (
          <button
            onClick={openModalEvent}
            type="button"
            className="z-50 text-gray-500 border border-gray-300 hover:bg-gray-300 hover:text-white focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-full text-sm p-2.5 text-center inline-flex items-center"
          >
            <svg
              aria-hidden="true"
              width="25px"
              height="25px"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 17a1 1 0 102 0v-6h6a1 1 0 100-2h-6V3a1 1 0 10-2 0v6H3a1 1 0 000 2h6v6z"
              />
            </svg>
          </button>
        )}
      </div>
      {showModal ? (
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto max-h-full"
        >
          <div className="relative max-w-full max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-mono text-gray-900 dark:text-white">
                  Title
                </h3>
                <button
                  onClick={closeModalEvent}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="defaultModal"
                >
                  {" "}
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <p className="text-base font-mono text-gray-700 dark:text-gray-400">
                  Continue the story
                </p>
              </div>

              <form className="mx-5" onSubmit={submitBranchThread}>
                <label
                  htmlFor="text-input"
                  className="block mb-3 text-md font-mono text-gray-900 dark:text-white"
                >
                  <textarea
                    name="branchContext"
                    id="text-input"
                    rows="15"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={isLoading ? `Generating text${dots}` : body}
                    onChange={(e) => setBody(e.target.value)}
                    readOnly={isLoading}
                  ></textarea>
                </label>

                <div className="flex items-stretch justify-between px-5 pt-1 pb-3 border-gray-200 rounded-b dark:border-gray-600"></div>
                <div className="absolute  left-3 px-3 border-t p-5">
                  <Button text="AI Generate" onClick={handleAIGenerate} />
                </div>
                <div className="flex justify-end border-t p-5">
                  <Button type="submit" text="Submit" />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
