import * as React from "react";
interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

const Hamburger = ({ className, style }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 512 351.67"
    className={className}
    style={{
      ...style,
    }}
  >
    <path
      fillRule="nonzero"
      d="M0 0h512v23.91H0V0zm0 327.76h512v23.91H0v-23.91zm0-163.88h512v23.91H0v-23.91z"
    />
  </svg>
);

export default Hamburger;
