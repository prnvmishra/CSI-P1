export const MatrixIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="7" y1="7" x2="7" y2="17" />
    <line x1="11" y1="7" x2="11" y2="17" />
    <line x1="15" y1="7" x2="15" y2="17" />
    <line x1="19" y1="7" x2="19" y2="17" />
  </svg>
);