
function getName(product) {
  return product.name || product.title || product.productName || "পণ্য";
}

function getPrice(product) {
  return Number(
    product.price ??
    product.currentPrice ??
    product.averagePrice ??
    0
  );
}

function getChange(product) {
  return Number(
    product.priceChangePercent ??
    product.changePercent ??
    product.change ??
    0
  );
}

const icons = ["🍚", "🫘", "🥔", "🧅", "🌶️", "🐟", "🥚", "🫙"];

export default function PriceTicker({ products = [] }) {
  const items = products.length ? products : [
    { name: "বাজার দর", price: 0, change: 0 },
  ];

  const tickerItems = [...items, ...items];

  return (
    <div className="overflow-hidden border-b border-green-900 bg-green-950 text-white">
      <div className="flex min-h-11 items-center">
        <span className="z-10 shrink-0 bg-green-800 px-3 py-3 text-xs font-bold sm:px-5">
          আজকের বাজার
        </span>

        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track">
            {tickerItems.map((product, index) => {
              const change = getChange(product);
              const price = getPrice(product);

              return (
                <div
                  key={`${getName(product)}-${index}`}
                  className="flex shrink-0 items-center gap-2 px-5 text-sm"
                >
                  <span>{icons[index % icons.length]}</span>
                  <span className="font-medium">{getName(product)}</span>
                  <span className="text-green-200">
                    {new Intl.NumberFormat("bn-BD").format(price)} টাকা
                  </span>
                  <span
                    className={
                      change > 0
                        ? "text-green-300"
                        : change < 0
                          ? "text-red-300"
                          : "text-gray-300"
                    }
                  >
                    {change > 0 ? "▲" : change < 0 ? "▼" : "—"}
                    {new Intl.NumberFormat("bn-BD", {
                      maximumFractionDigits: 1,
                    }).format(Math.abs(change))}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}