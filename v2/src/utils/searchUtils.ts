import type { NavigateFunction } from 'react-router-dom';

export const searchKeyword = (key: string, navigate: NavigateFunction) => {
  let searchKey = key.trim().toLowerCase();
  
  if (searchKey.startsWith('0x')) {
    searchKey = searchKey.substring(2);
  }
  
  if (searchKey.length <= 1) return;

  console.log(searchKey, searchKey.length);
  
  if (searchKey.length === 64) {
    navigate(`/transaction/${searchKey}`);
  } else if (searchKey.length === 40) {
    navigate(`/account/0x${searchKey}`);
  } else if (searchKey.match(/[^0-9]+/) === null) {
    navigate(`/block/${searchKey}`);
  } else if (searchKey.match(/[0-9a-z_]+/)) {
    navigate(`/transactions?action=${searchKey}`);
  } else {
    alert('Unknown Format');
  }
};

export const shortAddress = (address: string, left = 2, right = 4) => {
  return `${address.substring(0, left + 2)}..${address.substring(address.length - right, address.length)}`;
};

export const ncgFormat = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}; 