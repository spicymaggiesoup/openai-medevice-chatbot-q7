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

export function SkeletonChatLoading() {
  return (
    <div className="p-4 border border-gray-200 bg-white rounded-lg">
      <div className="flex justify-between items-start animate-pulse">
        <div className="flex-1">
          <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-5 w-5 bg-gray-200 rounded ml-4" />
      </div>
    </div>
  );
}

export function SkeletonDepartmentLoading() {
 return (
    <div className="p-4 border border-gray-200 bg-white rounded-lg">
      <div className="flex justify-between items-center animate-pulse">
        <div className="flex-1">
          <div className="h-3 w-[100%] bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}