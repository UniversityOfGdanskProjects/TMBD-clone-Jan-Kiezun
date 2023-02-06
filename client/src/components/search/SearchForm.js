import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getGenres } from "../../features/moviesTMDB/searchSlice";
import {
  getSearchedMovies,
  setSearchValues,
} from "../../features/moviesTMDB/searchSlice";
function SearchForm() {
  const dispatch = useDispatch();
  const { genres } = useSelector((state) => state.searchSlice);
  const [order, setOrder] = useState("ASC");

  useEffect(() => {
    dispatch(getGenres());
  }, [dispatch]);

  return (
    <Formik
      initialValues={{
        search: "",
        genres: [],
        sort: "popularity",
        order: false,
      }}
      validationSchema={Yup.object({
        search: Yup.string(),
        genres: Yup.array().of(Yup.string()),
        sort: Yup.string(),
        order: Yup.string(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        const { search, genres, sort, order } = values;
        const ascOrDesc = order ? "DESC" : "ASC";
        dispatch(
          getSearchedMovies({
            searchTerm: search,
            genres,
            sort,
            order: ascOrDesc,
          })
        );
        dispatch(
          setSearchValues({
            searchTerm: search,
            genres,
            sort,
            order: ascOrDesc,
          })
        );
        setSubmitting(false);
      }}
    >
      <Form className="m-4 p-4 min-w-[300px] h-full min-h-[calc(100vh-100px)] flex flex-col sticky gap-4 text-black bg-gradient-to-br from-gray-800 to-gray-900">
        <div>
          <label
            className=" text-white text-2xl font-bold select-none mb-2"
            htmlFor="search"
          >
            Search
          </label>
          <Field
            className="w-full h-10 px-2 text-xl rounded-md border-2 border-gray-300 focus:outline-none focus:border-green-500"
            name="search"
            type="text"
          />
        </div>

        <div>
          <label
            className=" text-white text-2xl font-bold select-none mb-2"
            htmlFor="genres"
          >
            Genres
          </label>
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
        </div>

        <div>
          <label
            className=" text-white text-2xl font-bold select-none mb-2 pr-2"
            htmlFor="sort"
          >
            SortBy
          </label>
          <Field name="sort" as="select">
            <option value="popularity">Popularity</option>
            <option value="vote_average">Vote Average</option>
            <option value="vote_count">Vote Count</option>
            <option value="release_date">Release Date</option>
          </Field>
        </div>

        <div>
          <label
            className=" text-white text-2xl font-bold select-none mb-2"
            htmlFor="order"
          >
            Order
          </label>
          <Field
            className="mx-2 w-4 h-4 px-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-green-500"
            name="order"
            type="checkbox"
            onClick={() => setOrder(order === "ASC" ? "DESC" : "ASC")}
          />
          <label
            className=" text-white text-2xl font-bold select-none mb-2"
            htmlFor="order"
          >
            {order}
          </label>
        </div>
        <button
          className="
              w-full
              h-10
              mt-auto
              bg-green-500
              hover:bg-green-600
              rounded-md
              text-white
              font-bold
              text-xl
              focus:outline-none
          "
          type="submit"
        >
          Search
        </button>
      </Form>
    </Formik>
  );
}

export default SearchForm;
