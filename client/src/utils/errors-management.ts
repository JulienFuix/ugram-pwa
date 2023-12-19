import { toast } from "react-toastify";

export const errorTypes = {
  1: { description: "BadRequest" },
  2: { description: "NotAuthenticated" },
  3: { description: "PaymentError" },
  4: { description: "Forbidden" },
  5: { description: "NotFound" },
  6: { description: "MethodNotAllowed" },
  7: { description: "NotAcceptable" },
  8: { description: "Timeout" },
  9: { description: "Conflict" },
  10: { description: "LengthRequired" },
  11: { description: "Unprocessable" },
  12: { description: "TooManyRequests" },
  13: { description: "GeneralError" },
  14: { description: "NotImplemented" },
  15: { description: "BadGateway" },
  16: { description: "Unavailable" },
  17: { description: "need 2fa code to validate call" },
  18: { description: "Wrong 2fa code" },
  19: { description: "Duplicate value" },
  20: { description: "2FA code expire!" },
  21: { description: "A password is needed to execute this call" },
  401: { description: "Invalid Login" },
} as any;

export default function displayToastErrorByErrorCode(errorCode: string) {
  toast.error(errorTypes[errorCode]?.description || "Error", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
