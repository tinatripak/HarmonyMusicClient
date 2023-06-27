import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signUp.css";
import { app } from "../../config/firebase.config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { registerUser } from "../../api";

const Register = () => {
  return (
    <div id="loginform" className="background-login">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 shadow row-width">
        <div className="p-0 bg-card">
          <SignUp />
        </div>
        <div className="p-0">
          <ImageRightBlock />
        </div>
      </div>
    </div>
  );
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [equalityPasswordError, setEqualityPasswordsError] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const firebaseAuth = getAuth(app);

  const signUpWithEmailAndPassword = async () => {
    if (!name || name.length < 5) {
      setNameError("Ім'я і прізвище повинно містити принаймні п'ять символів");
    } else {
      setNameError("");
    }
    if (!email || email.length < 7) {
      setEmailError("Електронна пошта повинна містити принаймні сім символів");
    } else {
      setEmailError("");
    }
    if (!password || password.length < 6) {
      setPasswordError("Пароль повинен містить більше шістьох символів");
    } else {
      setPasswordError("");
    }
    if (confirmationPassword === password) {
      try {
        await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await registerUser({ name, email, password });
        navigate("/login", { replace: true });
      } catch (error) {
        console.log(error);
      }
    } else {
      setEqualityPasswordsError("Паролі не співпадають");
    }
  };

  const handleSubmit =  (e) => {
    e.preventDefault();
    setError("");
    signUpWithEmailAndPassword()
    .then(() => {
    })
    .catch((err) => {
      setError(err.message);
    });
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="px-5 mt-32">
        <div className="flex h-full">
          <div className="self-center mx-auto">
            <div className="text-center mb-5 font-semibold text-xl">
              Створити акаунт
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                  type="text"
                  placeholder="Ім'я"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {nameError && <div className="text-red-600 ml-3">{nameError}</div>}
              <div className="mb-3">
                <input
                  className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                  type="email"
                  placeholder="Електронна пошта"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError && <div className="text-red-600 ml-3">{emailError}</div>}
              <div className="mb-3">
                <input
                  className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {passwordError && <div className="text-red-600 ml-3">{passwordError}</div>}
              <div className="mb-3">
                <input
                  className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                  type="password"
                  placeholder="Підтвердження пароля"
                  value={confirmationPassword}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                />
              </div>
              {equalityPasswordError && <div className="text-red-600 ml-3">{equalityPasswordError}</div>}
              <div className="flex items-center justify-between mt-5 gap-5 ml-3">
                <button
                  type="submit"
                  className="px-3 text-black border-2 border-gray-300 rounded-full py-2 sign-button"
                >
                  Зареєструватися
                </button>
                <div className="text-sm text-gray-500">
                  Уже маєте акаунт?<br></br>
                  <a className="text-gray-login" onClick={navigateToLogin}>
                    Увійти тут
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageRightBlock = () => {
  return (
    <div className="image-right">
      <div className="flex h-full">
        <div className="self-center mx-auto">
          <div className="text-center text-xl leading-10">ЛАСКОВО ПРОСИМО</div>
          <div className="text-center harmony leading-10">HARMONY</div>
          <div className="text-center leading-10">
            Музика в житті кожного. Це назавжди
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
