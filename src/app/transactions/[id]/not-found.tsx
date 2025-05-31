export default function NotFound() {
  return (
    <div className="text-center text-red-400 mt-20">
      <h1 className="text-3xl font-bold">Transaction Not Found</h1>
      <p className="mt-2 text-gray-300">
        The transaction you're looking for doesn't exist.
      </p>
    </div>
  );
}
