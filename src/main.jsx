import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";
import "./app.css";

import {
  PublicClientApplication,
} from "@azure/msal-browser";

import {
  MsalProvider,
} from "@azure/msal-react";

import {
  msalConfig,
} from "./adapters/auth/authConfig";

const msalInstance =
  new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {

  ReactDOM.createRoot(
    document.getElementById("root")
  ).render(

    <BrowserRouter>

      <MsalProvider
        instance={msalInstance}
      >

        <App />

      </MsalProvider>

    </BrowserRouter>
  );
});