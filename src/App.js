import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App({ length = 6 }) {
  const [code, setCode] = useState(new Array(length).fill(""));
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  showLoading;
  const [clientErrorMessage, setClientErrorMessage] = useState("");
  const inputsRef = useRef([]);
  const submitBtnRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://codevalidation-api.onrender.com/api/verify"
        );
        console.log("Verification Number:", response.data.message);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    resetInputValidation();
    serverErrorMessage && setServerErrorMessage("");
    clientErrorMessage && setClientErrorMessage("");
    const prevValue = code[index];
    const newValue = value.replace(prevValue, "");
    if (isNaN(newValue)) return;
    const newCode = [...code];
    newCode[index] = newValue;
    setCode(newCode);
    if (value !== "" && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }
    if (index === length - 1) {
      inputsRef.current[index].blur();
    }
  };
  const handlePaste = (e, index) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      const digit = pastedData.charAt(i);
      if (!isNaN(digit)) {
        newCode[i] = digit;
      }
    }
    setCode(newCode);
    if (pastedData.length < length) {
      inputsRef.current[pastedData.length].focus();
    }
    if (pastedData.length >= length) {
      inputsRef.current[index].blur();
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !code[index]) {
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[index - 1] = "";
        return newCode;
      });
      inputsRef.current[index - 1].focus();
    }
  };
  const validateInput = () => {
    let valid = true;
    for (let i = 0; i < length; i++) {
      if (!code[i].length > 0) {
        inputsRef.current[i].classList.add("border-red-500");
        valid = false;
      }
    }
    return valid;
  };
  const resetInputValidation = () => {
    for (let i = 0; i < length; i++) {
      if (inputsRef.current[i].classList.contains("border-red-500")) {
      }
      inputsRef.current[i].classList.remove("border-red-500");
    }
  };

  const handleSubmit = async () => {
    if (validateInput()) {
      const VerificationCode = JSON.stringify({ code: code.join("") });
      const customConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      setShowLoading(true);
      await axios
        .post(
          "https://codevalidation-api.onrender.com/api/verify",
          VerificationCode,
          customConfig
        )
        .then((response) => {
          setShowLoading(false);
          if (response.status === 200) {
            navigate("/success-page");
          } else {
            setServerErrorMessage(response.data.error);
          }
        })
        .catch((error) => {
          setServerErrorMessage(error.response.data.error);
        });
    } else {
      setClientErrorMessage("Please inter 6 digit code");
    }
  };
  return (
    <div>
      <div className="text-center text-red-500 pt-4">
        !! Check console for verification code !!
      </div>
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-bold">Verification code:</h1>
          <div className="input-area w-[400px]">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={(e) => handlePaste(e, index)}
                  className={`border ${
                    serverErrorMessage ? "border-red-500 " : "border-gray-500 "
                  }rounded-xl text-2xl w-full px-5 py-2 border-l-[3px] border-t-[3px]  focus:border-[#100249] focus:outline-none`}
                />
              ))}
            </div>
          </div>
          {serverErrorMessage && (
            <span className="inline-flex text-sm text-red-700">
              {serverErrorMessage}
            </span>
          )}
          {clientErrorMessage && (
            <span className="inline-flex text-sm text-red-700">
              {clientErrorMessage}
            </span>
          )}
          {showLoading && (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
          <button
            onClick={handleSubmit}
            ref={submitBtnRef}
            className="bg-[#100249] hover:bg-[#190370] uppercase text-white text-xl font-bold py-2 px-16 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
