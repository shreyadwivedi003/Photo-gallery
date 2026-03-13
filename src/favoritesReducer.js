export const initialState = JSON.parse(localStorage.getItem('favorites')) || [];

export const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const exists = state.find((id) => id === action.payload.id);
      let newState;
      
      if (exists) {
        newState = state.filter((id) => id !== action.payload.id);
      } else {
        newState = [...state, action.payload.id];
      }
      localStorage.setItem('favorites', JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
};