//Action types
const ALL_DINERS = 'ALL_DINERS';
const ADD_DINER = 'ADD_DINER';
const RESET = 'RESET';

//Action creator
const gotDiners = diners => ({
  type: ALL_DINERS,
  diners,
});

const addDiner = newDiner => ({
  type: ADD_DINER,
  newDiner,
});

const resetDiners = () => ({
  type: RESET,
});

//Initial State
const initialState = {
  diners: [
    {
      name: 'Me',
      phone: '5126531206',
      total: 0, 
      items: [],
      venmo: 'https://venmo.com/code?user_id=1499309883260928941',
    },
  ],
};

export const updateDiners = diners => {
  return dispatch => {
    try {
      dispatch(gotDiners(diners));
    } catch (error) {
      console.error(error);
    }
  };
};

export const addNewDiner = newDiner => {
  return dispatch => {
    try {
      dispatch(addDiner(newDiner));
    } catch (error) {
      console.error(error);
    }
  };
};

export const resetingDiners = () => {
  return dispatch => {
    try {
      dispatch(resetDiners());
    } catch (error) {
      console.log(error);
    }
  };
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ALL_DINERS:
      return { ...state, diners: action.diners };
    case ADD_DINER:
      return { ...state, diners: [action.newDiner] };
    case RESET:
      state = initialState;
      return state;
    default:
      return state;
  }
}
