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
    <div className="bg-[#111]/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-medium mb-2 text-lg">{title}</h3>
      <div
        className={`text-2xl font-bold ${color} ${
          amount === "Loading..." ? `animate-pulse ${color}` : " "
        }`}
      >
        {amount}
      </div>
    </div>
  );
}
