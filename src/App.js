import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App({ length = 6 }) {
  const [code, setCode] = useState(new Array(length).fill(""));
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [clientErrorMessage, setClientErrorMessage] = useState("");
  const inputsRef = useRef([]);
  const submitBtnRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://codevalidation.onrender.com/api/verify");
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
      await axios
        .post(
          "https://codevalidation.onrender.com/api/verify",
          VerificationCode,
          customConfig
        )
        .then((response) => {
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
