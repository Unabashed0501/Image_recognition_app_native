// actions.ts

interface Product {
    id: string;
    isFavorite: boolean;
    imageUrl: string;
    type: string;
    title: string;
  }
  
  export const ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
  export const REMOVE_FROM_FAVORITES = "REMOVE_FROM_FAVORITES";
  
  // Define action interfaces
  export interface AddToFavoritesAction {
    type: typeof ADD_TO_FAVORITES;
    payload: Product;
  }
  
  export interface RemoveFromFavoritesAction {
    type: typeof REMOVE_FROM_FAVORITES;
    payload: string; // Assuming productId is a string
  }
  
  // Define a union type of all possible action types
  export type FavoritesActionTypes =
    | AddToFavoritesAction
    | RemoveFromFavoritesAction;
  
  // Define action creators
  export const addToFavorites = (product: Product): AddToFavoritesAction => ({
    type: ADD_TO_FAVORITES,
    payload: product,
  });
  
  export const removeFromFavorites = (
    productId: string
  ): RemoveFromFavoritesAction => ({
    type: REMOVE_FROM_FAVORITES,
    payload: productId,
  });
  