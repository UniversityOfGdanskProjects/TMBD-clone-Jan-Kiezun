import React, { useEffect, useState } from "react";
import CommentsForm from "./CommentsForm";
import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getComments,
  editComment,
  setStatus,
  deleteComment,
} from "../../features/moviesTMDB/commentSlice";

function Comments() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.commentSlice.comments);
  const status = useSelector((state) => state.commentSlice.status);
  const error = useSelector((state) => state.commentSlice.error);
  const user = useSelector((state) => state.usersSlice.user);
  const [editWhichComment, setEditWhichComment] = useState(null);
  const [editText, setEditText] = useState("");
  const location = useLocation();

  const handleEdit = (id) => (e) => {
    e.preventDefault();
    setEditWhichComment(editWhichComment === id ? null : id);
  };

  const handleEditSubmit = (comment_id, user_id) => (e) => {
    e.preventDefault();
    const text = editText;
    const comment = {
      comment_id,
      user_id,
      text,
      timestamp: Math.floor(Date.now() / 1000),
    };
    dispatch(editComment(comment));
    setTimeout(() => {
      dispatch(getComments(id));
    }, 50);
    setEditWhichComment(null);
  };

  useEffect(() => {
    dispatch(getComments(id));
  }, [location]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 ">
      <h1>Comments</h1>
      <CommentsForm />
      {status === "loading" && <div>Loading...</div>}
      {status === "succeeded" && (
        <ul className="w-11/12 flex flex-col ">
          {comments.map((comment) => (
            <li
              className=" w-full flex flex-col justify-center border-2 border-black rounded-lg p-2 my-2"
              key={comment.id}
            >
              <div className="flex w-full">
                <img
                  className="w-10 h-10 rounded-full"
                  src={`https://i.pravatar.cc/50?u=${comment.user_id}@ashallendesign.co.uk`}
                  alt="Avtr"
                />
                <div>@{comment.user_id}</div>
                <div className="ml-auto text-xl">
                  {new Date(comment.timestamp * 1000).toLocaleString()}
                </div>
              </div>
              <div>{comment.text}</div>
              {editWhichComment === comment.comment_id && (
                <textarea
                  className="w-full h-20 border-2 border-black rounded-lg p-2 my-2"
                  defaultValue={comment.text}
                  onChange={(e) => setEditText(e.target.value)}
                />
              )}

              {(user.id === comment.user_id || user.role === "admin") && (
                <div className="flex w-full gap-4">
                  {editWhichComment === comment.comment_id ? (
                    <button
                      className="ml-auto bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-4 rounded "
                      onClick={handleEditSubmit(
                        comment.comment_id,
                        comment.user_id
                      )}
                    >
                      Save
                    </button>
                  ) : (
                    <div className="ml-auto"></div>
                  )}
                  <button
                    className=" bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-4 rounded "
                    onClick={handleEdit(comment.comment_id)}
                  >
                    {editWhichComment === comment.comment_id
                      ? "Cancel"
                      : "Edit"}
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-4 rounded "
                    onClick={() => {
                      dispatch(
                        deleteComment({ id: comment.comment_id, movie_id: id })
                      );
                      setTimeout(() => {
                        dispatch(getComments(id));
                      }, 50);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;
