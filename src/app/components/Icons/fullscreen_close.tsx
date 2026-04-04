interface FullscreenClose {
  className?: string;
  style?: React.CSSProperties;
}

const FullscreenClose = ({ className, style }: FullscreenClose) => (
  <svg
    className={className}
    style={{ ...style }}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3L10 10M10 10H4M10 10V4M21 21L14 14M14 14H20M14 14V20"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default FullscreenClose;
