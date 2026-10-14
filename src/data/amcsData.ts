export interface AMCItem {
  number: string;
  name: string;
  fullName: string;
}

export const RAW_AMCS_NAMES = [
  "01. Aditya Birla Sunlife MF",
  "02. DSP Blackrock MF",
  "03. HDFC MF",
  "04. HSBC MF (L&T MF Merged With HSBC MF)",
  "05. ICICI Prudential MF",
  "06. Bandhan MF (Formerly Known As IDFC MF)",
  "07. 360 Asset One MF (Formerly Known As IIFL MF)",
  "08. Kotak MF",
  "09. Mahindra Manulife MF",
  "10. PPFAS MF",
  "11. SBI MF",
  "12. Shriram MF",
  "13. Tata MF",
  "14. Union MF",
  "15. Franklin Templeton MF",
  "16. WhiteOAK MF",
  "17. Navi MF",
  "18. Helios MF",
  "19. Axis MF",
  "20. Baroda BNP Paribas MF",
  "21. Bank Of India MF",
  "22. Canara Robeco MF",
  "23. Edelweiss MF",
  "24. Groww MF",
  "25. Invesco MF",
  "26. ITI MF",
  "27. JM Financial MF",
  "28. LIC MF",
  "29. Mirae Asset MF",
  "30. Motilal Oswal MF",
  "31. Nippon MF",
  "32. NJ MF",
  "33. PGIM India MF",
  "34. Quant MF",
  "35. Quantum MF",
  "36. Samco MF",
  "37. Sundaram MF",
  "38. Taurus MF",
  "39. Trust MF",
  "40. UTI MF",
  "41. Bajaj Finserv MF",
  "42. Old Bridge MF",
  "43. The Wealth Company",
] as const;

export const AMCS_LIST: AMCItem[] = RAW_AMCS_NAMES.map((item) => {
  const dotIndex = item.indexOf(".");
  const number = item.substring(0, dotIndex).trim();
  const name = item.substring(dotIndex + 1).trim();
  return {
    number,
    name,
    fullName: item,
  };
});
