export function formatPrice(number) {
    return new Intl.NumberFormat("EN-EG", {
      style: "currency",
      currency: "SAR"
    }).format(number);
  }
  