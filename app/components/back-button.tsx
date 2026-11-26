import { Link } from "react-router";
import "./back-button.css";

export function BackButton({ light = false }: { light?: boolean }) {
  return (
    <Link className={`back-button${light ? " back-button--light" : ""}`} to="/" aria-label="Back to home">
      <img src="/images/back-button.svg" alt="" />
    </Link>
  );
}
