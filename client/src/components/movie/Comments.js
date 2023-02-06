import React, { useEffect, useState } from "react";
import CommentsForm from "./CommentsForm";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getComments } from "../../features/moviesTMDB/commentSlice";

function Comments() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.commentSlice.comments);
  const status = useSelector((state) => state.commentSlice.status);
  const error = useSelector((state) => state.commentSlice.error);
  const user = useSelector((state) => state.usersSlice.user);
  const [editComment, setEditComment] = useState(null);

  const handleEdit = (id) => (e) => {
    e.preventDefault();
    setEditComment(editComment === id ? null : id);
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(getComments(id));
    }
  }, [status, dispatch, id]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 ">
      <h1>Comments</h1>
      <CommentsForm />
      {status === "loading" && <div>Loading...</div>}
      {status === "succeeded" && (
        <ul className="w-11/12 flex flex-col ">
          {comments.map((comment) => (
            <li
              className="
                w-full
                flex
                flex-col
                justify-center
                border-2
                border-black
                rounded-lg
                p-2
                my-2
            "
              key={comment.id}
            >
              <div className="flex w-full">
                <img
                  className="w-10 h-10 rounded-full"
                  src={`https://i.pravatar.cc/50?u=${comment.user_id}@ashallendesign.co.uk`}
                  alt="Avtr"
                />
                <div>@{comment.user_id}</div>
                <div className="ml-auto">
                  {new Date(comment.timestamp * 1000).toLocaleString()}
                </div>
              </div>
              <div>{comment.text}</div>
              {
                // textarea for editing
              }
              {editComment === comment.comment_id && (
                <textarea
                  className="w-full h-20 border-2 border-black rounded-lg p-2 my-2"
                  defaultValue={comment.text}
                />
              )}

              {(user.id === comment.user_id || user.role === "admin") && (
                <div className="flex w-full gap-4">
                  {editComment === comment.comment_id ? (
                    <button className="ml-auto bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-4 rounded ">
                      Save
                    </button>
                  ) : (
                    <div className="ml-auto"></div>
                  )}
                  <button
                    className=" bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-4 rounded "
                    onClick={handleEdit(comment.comment_id)}
                  >
                    Edit
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-semibold py-2 px-4 rounded ">
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
