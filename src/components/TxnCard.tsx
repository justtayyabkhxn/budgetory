export function TxnCard({
  title,
  amount,
  color,
}: {
  title: string;
  amount: string;
  color: string;
}) {
  return (
    <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col  justify-center">
        <h3 className="text-xl font-semibold text-gray-300 mb-1">
          {title}
        </h3>
        <div
          className={`text-xl md:text-xl font-bold ${color} ${
            amount === "Loading..." ? `animate-pulse ${color}` : ""
          }`}
        >
          {amount}
        </div>
      </div>
    </div>
  );
}
