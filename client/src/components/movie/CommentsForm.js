import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postComment } from "../../features/moviesTMDB/commentSlice";

function CommentsForm() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.usersSlice.user);
  const selectedMovie = useSelector((state) => state.moviesSlice.selectedMovie);

  return (
    <Formik
      initialValues={{ text: "" }}
      validationSchema={Yup.object({
        text: Yup.string()
          .max(500, "Must be 500 characters or less")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        const comment = {
          text: values.text,
          timestamp: Math.floor(Date.now() / 1000),
          user_id: user.id,
          movie_id: selectedMovie.id,
        };
        setTimeout(() => {
          alert(JSON.stringify(comment, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      <Form className="  w-11/12 flex justify-center items-center text-2xl font-bold gap-2">
        <Field
          className="w-full h-20 border-2 border-black rounded-lg p-2 my-2 text-sm"
          name="text"
          type="textarea"
        />
        <button
          className=" w-20 h-20 border-2 border-black rounded-lg  p-2  my-2 text-lg hover:bg-gray-400"
          type="submit"
        >
          Submit
        </button>
      </Form>
    </Formik>
  );
}

export default CommentsForm;
