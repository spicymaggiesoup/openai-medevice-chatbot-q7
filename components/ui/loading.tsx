import { useState, CSSProperties } from "react";
import HashLoader from "react-spinners/HashLoader";

type Props = {
  isShow: boolean;
  override?: any;
};

export function Loading({ isShow, override }: Props) {
  let [loading, setLoading] = useState(isShow);

  return (
    <HashLoader
      color="#fff"
      loading={loading}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}