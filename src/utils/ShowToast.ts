import {toast} from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.css";

const showToastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    bodyClassName: "text-center primary-font",
  });
};
const showToastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    bodyClassName: "text-center primary-font",
  });
};
const showToastWarning = (message: string) => {
  toast.warn(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    bodyClassName: "text-center primary-font",
  });
};

export {showToastError, showToastSuccess, showToastWarning};
