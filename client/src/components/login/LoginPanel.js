import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  setLoginStatus,
} from "../../features/moviesTMDB/usersSlice";
import { useNavigate } from "react-router-dom";

function LoginPanel() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.usersSlice);
  const navigate = useNavigate();

  useEffect(() => {
    users.loginStatus === "logged in" && navigate("/home");
  }, [users.loginStatus, navigate]);

  return (
    <div
      className="w-full h-screen flex justify-center items-center
    bg-gradient-to-r from-blue-300 to-blue-400"
    >
      <Formik
        validateOnChange={false}
        initialValues={{ id: "", password: "" }}
        validationSchema={Yup.object({
          id: Yup.string().required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(loginUser(values));
          setSubmitting(false);
        }}
      >
        <div className="w-1/2 h-1/2 bg-gray-200 rounded-lg shadow-lg">
          <h1 className="text-3xl text-center mt-6">Login</h1>
          <Form className="flex flex-col justify-center items-center mt-4">
            <label htmlFor="id">ID</label>
            <Field
              className=" w-1/2 h-10 border-2 border-gray-300 rounded-lg px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              name="id"
              type="text"
            />
            <div className="text-red-500 text-xs italic font-bold text-center w-full mt-1">
              <ErrorMessage name="id" />
            </div>
            <label htmlFor="password">Password</label>
            <Field
              className=" w-1/2 h-10 border-2 border-gray-300 rounded-lg px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              name="password"
              type="password"
            />
            <div className="text-red-500 text-xs italic font-bold text-center w-full mt-1">
              <ErrorMessage name="password" />
            </div>
            <div className=" flex justify-center items-center w-full mt-2 gap-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1"
              >
                Login
              </button>
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1"
                onClick={() => {
                  dispatch(setLoginStatus("idle"));
                  navigate("/register");
                }}
              >
                Register
              </button>
            </div>
          </Form>
          {users.loginStatus === "failed" && (
            <div className="text-red-500 text-xs italic font-bold text-center w-full mt-1">
              {users.error}
            </div>
          )}
        </div>
      </Formik>
    </div>
  );
}

export default LoginPanel;
