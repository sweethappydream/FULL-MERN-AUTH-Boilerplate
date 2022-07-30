const authReducer = (state, action) => {
  switch (action.type) {
    case "loggedIn":
      return { ...state, ...action.payload, loggedin:true };
    case "loggedOut":
      return { ...state, loggedin: false };
    default:
      throw new Error();
  }
};

export default authReducer;
