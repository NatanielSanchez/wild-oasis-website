import Spinner from "../_components/Spinner";

// This is replaced by a Suspense boundary
function Loading() {
  return (
    <div className="grid items-center justify-center">
      <p className="text-xl text-primary-200">Loading cabins...</p>
      <Spinner />
    </div>
  );
}

export default Loading;
