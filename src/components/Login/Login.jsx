import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { app } from "../../config/firebase.config";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { loginUser, validateUser } from "../../api";
import { actionType } from "../../Context/reducer";
import { useStateValue } from "../../Context/StateProvider";
import "./login.css";

const GoogleLogin = ({ click }) => {
  return (
    <button
      type="submit"
      className="flex items-center justify-center gap-2 cursor-pointer duration-100 ease-in-out transition-all w-full border-2 border-gray-300 rounded-md text-gray-500 text-sm py-2"
      onClick={click}
    >
      <FcGoogle className="text-xl" />
      Continue with Google
    </button>
  );
};

const Login = ({ setAuth }) => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue();
  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then(() => {
      setAuth(true);
      firebaseAuth.onAuthStateChanged((userCred) => {
        if (userCred) {
          userCred
            .getIdToken()
            .then((token) => {
              validateUser(token)
                .then((data) => {
                  dispatch({
                    type: actionType.SET_USER,
                    user: data,
                  });
                })
                .catch((error) => {
                  console.error(error);
                });
            })
            .catch((error) => {
              console.error(error);
            });
          navigate("/home", { replace: true });
        } else {
          setAuth(false);
          dispatch({
            type: actionType.SET_USER,
            user: null,
          });
          navigate("/login");
        }
      });
    });
  };
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, []);

  return (
    <div className="cont">
    <div id="loginform" className="background-login">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-5 shadow min-h-500 min-w-800 items-center mx-auto bg-white">
        <div className="p-0 w-full">
          <ImageRightBlock />
        </div>
        <div className="p-0 w-full ">
          <LoginForm click={loginWithGoogle} setAuth={setAuth} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;

const LoginForm = ({ click, setAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const firebaseAuth = getAuth(app);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, []);

  const navigateToSignup = () => {
    navigate("/signup");
  };

  const loginWithEmailAndPassword = async (email, password) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password).then(
        (userCred) => {
          setAuth(true);
          firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
              userCred
                .getIdToken()
                .then((token) => {
                  localStorage.setItem("token", token);
                  loginUser(token, email, password)
                    .then((data) => {
                      dispatch({
                        type: actionType.SET_USER,
                        user: data,
                      });
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                })
                .catch((error) => {
                  console.error(error);
                });
              navigate("/home", { replace: true });
            } else {
              setAuth(false);
              dispatch({
                type: actionType.SET_USER,
                user: null,
              });
              navigate("/login");
            }
          });
        }
      );
    } catch (error) {
      setError("Невірний вхід, перевірте пошту і пароль");
      setEmail("");
      setPassword("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    loginWithEmailAndPassword(email, password)
    .then(() => {
    })
    .catch((err) => {
      setError(err.message);
    });
  };

  return (
    <div className="px-5">
      <div className="flex h-full">
        <div className="self-center mx-auto">
          <div className="text-center mb-5 font-semibold text-xl">
            Авторизуватися
          </div>
          <div className="flex items-center justify-between mb-5">
            <GoogleLogin click={click} />
          </div>
          <div className="text-gray-login font-semibold text-center mt-4 mb-2">
            АБО
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="border-2 border-gray-300 rounded-md py-2 px-4 w-full"
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                className="border-2 border-gray-300 rounded-md py-2 px-4 w-full"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex items-center justify-between mt-5">
              <button
                type="submit"
                className="px-3 text-black border-2 border-gray-300 rounded-full py-2 sign-button"
              >
                Увійти
              </button>
              <div className="text-sm text-gray-500">
                Новий юзер,{" "}
                <a className="text-gray-login" onClick={navigateToSignup}>
                  Зареєструйся тут
                </a>
              </div>
            </div>
          </form>
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
