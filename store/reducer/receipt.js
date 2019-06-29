import axios from 'axios'; //for the microservice express app

//Action types
const RECEIPT = 'RECEIPT';
const IMAGE = 'IMAGE';
const RESET = 'RESET'; 

//Initial State
const initialState = { 
  image: '',
  itemList: [],
  itemDetail: {},
  totalpreTax: 0,
  total: 0,
  tax: 0,
  loading: true,
};

//Action creator
const gotReceipt = receiptObj => ({
  type: RECEIPT,
  itemList: receiptObj.itemList,
  itemDetail: receiptObj.itemDetail,
  total: receiptObj.total,
  tax: receiptObj.tax,
  totalpreTax: receiptObj.totalpreTax,
});

const gotImage = imgUri => ({
  type: IMAGE,
  image: imgUri,
});

const resetReceipt = () => ({
  type: RESET,
});

//change this in the REACT NATIVE CODE CALLS
export const updateReceipt = updatedInfo => {
  return dispatch => {
    try {
      dispatch(gotReceipt(updatedInfo));
    } catch (error) {
      console.error(error);
    }
  };
};

export const postProcessReceipt = imageBase64 => {
  return async dispatch => {
    try {
      const { data } = await axios.post(
        'https://8kj27oaa3h.execute-api.us-east-1.amazonaws.com/dev/testImg',
        { image: imageBase64 }
      );

      console.log('\n\n\n LAMBDA RES',data, '\n\n\n');
      // let mockdata = {
      //   itemDetail: [
      //     {
      //       item: 'Lamb',
      //       price: '21.00', 
      //       quantity: '1',
      //     },
      //     {
      //       item: 'Moroccan Vegetable Couscous', 
      //       price: '12.00',  
      //       quantity: '1',
      //     }, 
      //     {
      //       item: 'Pellegrino Sparkling',
      //       price: '3.00',
      //       quantity: '1',
      //     },
      //   ],
      //   itemList: [
      //     '1 Lamb 21.00',
      //     '1 Moroccan Vegetable Couscous 12.00',
      //     '1 Pellegrino Sparkling 3.00',
      //   ],
      //   tax: 3.2,
      //   total: 39.2,
      // };

      data.receipt.totalpreTax = data.receipt.total - data.receipt.tax;
      dispatch(gotReceipt(data.receipt));
    } catch (error) {
      console.log(error); 
    }
  };
};

export const resetingReceipt = () => {
  return dispatch => {
    try {
      dispatch(resetReceipt());
    } catch (error) {
      console.error(error);
    }
  };
};

export const getImage = imgUri => {
  return dispatch => {
    try {
      dispatch(gotImage(imgUri));
    } catch (error) {
      console.error(error);
    }
  };
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIPT:
      return {
        ...state,
        itemList: action.itemList,
        itemDetail: action.itemDetail,
        total: action.total,
        tax: action.tax,
        loading: false,
        totalpreTax: action.totalpreTax,
      };
    case IMAGE:
      return {
        ...state,
        image: action.image,
      };
    case RESET:
      state = initialState;
      return {
        ...state,
      };
    default:
      return state;
  }
}
