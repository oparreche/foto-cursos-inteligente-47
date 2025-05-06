
export const generateInvoiceNumber = (): string => {
  const prefix = "NFS-";
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${year}-${randomDigits}`;
};
