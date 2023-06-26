"use client";

import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import ErrorIcon from "@mui/icons-material/Error";
import styles from "./page.module.css";
import Link from "next/link";

const Register = () => {
  const router = useRouter();

  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is a required field")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is a required field")
      .min(8, "Password must be at least 8 characters"),
    repassword: Yup.string()
      .required("Re-enter the password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  return (
    <Formik
      validationSchema={schema}
      initialValues={{ email: "", password: "", repassword: "" }}
      onSubmit={async (values, { resetForm }) => {
        try {
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          });

          res.status === 201;
          router.push("/login?success=Account has been created");
        } catch (err) {
          setError(err);
          console.log(err);
        }
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
          <h1 className={styles.title}>Register</h1>

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
            <input
              type="password"
              name="repassword"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.repassword}
              placeholder="Confirm Password"
              required
              className={styles.input}
            />
            <p className={styles.error}>
              {errors.repassword && touched.repassword && errors.repassword && (
                <ErrorIcon sx={{ marginRight: "8px" }} />
              )}
              {errors.repassword && touched.repassword && errors.repassword}
            </p>
            <button className={styles.button} type="submit">
              Register
            </button>
          </form>
          <span className={styles.or}>- OR -</span>
          <Link className={styles.link} href="/login">
            Already have a account ?
          </Link>
        </div>
      )}
    </Formik>
  );
};

export default Register;
