import * as React from "react";

function Add(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"
      height="40"
      viewBox="0 0 48 48"
      width="40"
      
      {...props}
    >
      <path d="M0 0h48v48H0z" fill="none" />
      <path d="M8 12H4v28c0 2.21 1.79 4 4 4h28v-4H8V12zm32-8H16c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-2 18h-8v8h-4v-8h-8v-4h8v-8h4v8h8v4z" />
    </svg>
  );
}

export default Add;
