"use client";

import { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./page.module.css";
import ErrorIcon from "@mui/icons-material/Error";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SnackBar from "@/components/SnackBar";

const Login = () => {
  const session = useSession();
  const router = useRouter();
  const params = useSearchParams();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (params) {
      setError(params.get("error"));
      setSuccess(params.get("success"));
    }
  }, [params]);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard");
  }

  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters"),
  });

  return (
    <>
      <Formik
        validationSchema={schema}
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, { resetForm }) => {
          signIn("credentials", {
            email: values.email,
            password: values.password,
          });
          resetForm();
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="text"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Email"
                autoComplete="off"
                required
                className={styles.input}
              />
              <p className={styles.error}>
                {errors.email && touched.email && errors.email && (
                  <ErrorIcon sx={{ marginRight: "8px" }} />
                )}
                {errors.email && touched.email && errors.email}
              </p>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Password"
                required
                className={styles.input}
              />
              <p className={styles.error}>
                {errors.password && touched.password && errors.password && (
                  <ErrorIcon sx={{ marginRight: "8px" }} />
                )}
                {errors.password && touched.password && errors.password}
              </p>
              <button className={styles.button} type="submit">
                Login
              </button>
            </form>
            <span className={styles.or}>- OR -</span>
            <Link className={styles.link} href="/register">
              Create new account
            </Link>
          </div>
        )}
      </Formik>
      <SnackBar success={success} error={error} />
    </>
  );
};

export default Login;
