import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getGenres } from "../../features/moviesTMDB/searchSlice";
import { addMovie } from "../../features/moviesTMDB/moviesSlice";

function AddMovieForm() {
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.searchSlice);

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  return (
    <Formik
      initialValues={{
        title: "",
        overview: "",
        release_date: "",
        tagline: "",
        budget: "",
        revenue: "",
        popularity: "",
        genres: [],
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(50, "Must be 50 characters or less")
          .required("Required"),
        overview: Yup.string()
          .max(500, "Must be 500 characters or less")
          .required("Required"),
        release_date: Yup.date().required("Required"),
        tagline: Yup.string()
          .max(50, "Must be 50 characters or less")
          .required("Required"),
        budget: Yup.number().required("Required"),
        revenue: Yup.number().required("Required"),
        popularity: Yup.number().required("Required"),
        genres: Yup.array().of(Yup.string()).required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        const movie = {
          title: values.title,
          overview: values.overview,
          release_date: values.release_date,
          tagline: values.tagline,
          budget: values.budget,
          revenue: values.revenue,
          popularity: values.popularity,
          genres: values.genres,
        };

        dispatch(addMovie(movie));

        setSubmitting(false);
      }}
    >
      <Form
        className="
      flex gap-2 text-gray-800
      "
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <Field name="title" type="text" />
          <div className="text-red-500">
            <ErrorMessage name="title" />
          </div>

          <label htmlFor="overview">Overview</label>
          <Field name="overview" type="text" />
          <div className="text-red-500">
            <ErrorMessage name="overview" />
          </div>

          <label htmlFor="release_date">Release Date</label>
          <Field name="release_date" type="date" />
          <div className="text-red-500">
            <ErrorMessage name="release_date" />
          </div>

          <label htmlFor="tagline">Tagline</label>
          <Field name="tagline" type="text" />
          <div className="text-red-500">
            <ErrorMessage name="tagline" />
          </div>

          <label htmlFor="budget">Budget</label>
          <Field name="budget" type="text" />
          <div className="text-red-500">
            <ErrorMessage name="budget" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="revenue">Revenue</label>
          <Field name="revenue" type="text" />
          <div className="text-red-500">
            <ErrorMessage name="revenue" />
          </div>

          <label htmlFor="popularity">Popularity</label>
          <Field name="popularity" type="text" />
          <div className="text-red-500">
            <ErrorMessage name="popularity" />
          </div>

          <label htmlFor="genres">Genres</label>
          <Field
            className="
          w-full h-30 text-sm h-40 px-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-green-500
          "
            name="genres"
            as="select"
            multiple
          >
            {genres?.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre}
              </option>
            ))}
          </Field>

          <button
            className="
          mt-auto w-full h-10 text-sm text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-50
        "
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
}

export default AddMovieForm;
