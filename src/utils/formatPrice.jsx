export function formatPrice(number) {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "SAR"
    }).format(number);
  }
  