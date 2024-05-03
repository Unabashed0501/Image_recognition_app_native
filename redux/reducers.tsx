// reducers.ts

import {
    ADD_TO_FAVORITES,
    REMOVE_FROM_FAVORITES,
    FavoritesActionTypes,
  } from "./actions";
  
  interface Product {
    id: string;
    isFavorite: boolean;
    imageUrl: string;
    type: string;
    title: string;
  }
  
  export interface FavoritesState {
    favoriteItems: Product[];
  }
  
  export interface RootState {
    products: Product[];
  }
  
  const initialState: FavoritesState = {
    favoriteItems: [],
  };
  
  const favoritesReducer = (
    state = initialState,
    action: FavoritesActionTypes
  ): FavoritesState => {
    switch (action.type) {
      case ADD_TO_FAVORITES:
        console.log(`Adding Favorites: ${action.payload.title}`);
        return {
          ...state,
          favoriteItems: [...state.favoriteItems, action.payload],
        };
      case REMOVE_FROM_FAVORITES:
        console.log(`Removing Favorites: ${action.payload}`);
        return {
          ...state,
          favoriteItems: state.favoriteItems.filter(
            (item) => item.id !== action.payload
          ),
        };
      default:
        return state;
    }
  };
  
  // combine reducers
  // import { combineReducers } from "redux";
  
  export default favoritesReducer;
  