import { useContext } from 'react';
import { MyListContext } from '../context/MyListContext'; 

export const useMyListContext = () => {
  const myListContext = useContext(MyListContext); 

  if (!myListContext) {
    throw new Error('useMyListContext must be used inside a MyListProvider');
  }

  return myListContext;
};
