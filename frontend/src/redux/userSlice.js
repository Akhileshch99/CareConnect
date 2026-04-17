const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  userId: localStorage.getItem('userId') || null,
  isLoading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        role: action.payload.role,
        userId: action.payload.userId,
        user: action.payload.user,
        error: null,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        userId: null,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
