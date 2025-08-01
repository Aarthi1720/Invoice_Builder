import React from "react";
import BalanceIcon from "../../assets/Finance Lottie file.json";
import PaidIcon from "../../assets/Payment Done Character Animation.json";
import UnpaidIcon from "../../assets/Payments.json";
import Lottie from "lottie-react";

const SummaryCards = ({ totalAmount, totalPaid, totalUnpaid }) => {
  const cards = [
    {
      label: "Total Amount",
      value: totalAmount,
    },
    {
      label: "Total Paid",
      value: totalPaid,
    },
    {
      label: "Total Unpaid",
      value: totalUnpaid,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex justify-between items-center md:flex md:flex-col bg-white rounded-xl shadow p-5 gap-4 xl:justify-between xl:items-center xl:flex-row"
        >
          <div>
            <div className="text-[18px] font-medium text-gray-500">
              {card.label}
            </div>
            {card.label === "Total Amount" && (
              <Lottie
                animationData={BalanceIcon}
                loop={true}
                style={{ width: 70, height: 70 }}
              />
            )}
            {card.label === "Total Paid" && (
              <Lottie
                animationData={PaidIcon}
                loop={true}
                style={{ width: 70, height: 70 }}
              />
            )}
            {card.label === "Total Unpaid" && (
              <Lottie
                animationData={UnpaidIcon}
                loop={true}
                style={{ width: 80, height: 80 }}
              />
            )}
          </div>
          <div className="text-2xl mt-10 md:mt-0 xl:mt-10 font-semibold text-gray-700">
            ₹{Number(card.value || 0).toLocaleString("en-IN")}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
