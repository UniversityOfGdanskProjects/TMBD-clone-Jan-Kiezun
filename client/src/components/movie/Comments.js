import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getComments } from "../../features/moviesTMDB/commentSlice";

function Comments() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.commentSlice.comments);
  const status = useSelector((state) => state.commentSlice.status);
  const error = useSelector((state) => state.commentSlice.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getComments(id));
    }
  }, [status, dispatch, id]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-800 ">
      <h1>Comments</h1>
      {status === "loading" && <div>Loading...</div>}
      {status === "succeeded" && (
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <div>{comment.text}</div>
              <div>{comment.user_id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;
