export const msalConfig = {
  auth: {
    clientId:
      "7875d36a-5ffa-47ff-988b-e6a1aa43cb21",

    authority:
      "https://login.microsoftonline.com/3aa2e272-823e-4297-b843-ab38c1aca984",

    redirectUri: "http://localhost:5173/login",
  },

  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};