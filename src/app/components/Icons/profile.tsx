import * as React from "react";
interface SvgProps {
  className?: string;
  style?: React.CSSProperties;
}

const Profile = ({ className, style }: SvgProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 32 32"
    className={className}
    style={{
      fill: "var(--grey-text)",
      stroke: "var(--grey-text)",
      ...style,
    }}
  >
    <circle
      cx={16}
      cy={16}
      r={15}
      fill="none"
      strokeLinejoin="round"
      strokeMiterlimit={10}
    />
    <path
      d="M9 29a5 8.5 0 0 1 14 0"
      strokeWidth={0.5}
      fill="none"
    />
    <circle
      cx={16}
      cy={11.5}
      r={5.5}
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={0.5}
      fill="none"
    />
  </svg>
);
export default Profile;
