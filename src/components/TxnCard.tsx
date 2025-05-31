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
      <h3 className="mb-2 font-bold text-xs">{title}</h3>
      <div
        className={`text-sm font-bold ${color} ${
          amount === "Loading..." ? `animate-pulse ${color}` : " "
        }`}
      >
        {amount}
      </div>
    </div>
  );
}
