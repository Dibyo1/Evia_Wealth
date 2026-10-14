const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateExactPDF(outputPath) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 80, bottom: 80, left: 85, right: 85 },
    bufferPages: false,
    info: {
      Title: 'COMMISSION-DISCLOSURE-ARN-300286',
      Author: '',
      Subject: 'Commission Disclosure'
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const leftMargin = 85;
  const contentWidth = 425; // 595.28 - 170

  // ================= PAGE 1 =================
  doc.font('Helvetica').fontSize(10).fillColor('#000000');

  let y = 80;

  // Disclaimer:
  doc.text('Disclaimer:', leftMargin, y);
  y += 26;

  // Disclaimer paragraph 1
  doc.lineGap(3.5);
  doc.text(
    'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The NAVs of the schemes may go up or down depending upon the factors and forces affecting the securities market including the fluctuations in the interest rates. The past performance of the mutual funds is not necessarily indicative of future performance of the schemes. The Mutual Fund is not guaranteeing or assuring any dividend under any of the schemes and the same is subject to the availability and adequacy of distributable surplus. Investors are requested to review the prospectus carefully and obtain expert professional advice with regard to specific legal, tax and financial implications of the investment/participation in the scheme.',
    leftMargin,
    y,
    { width: contentWidth, align: 'left' }
  );

  y += doc.heightOfString(
    'Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The NAVs of the schemes may go up or down depending upon the factors and forces affecting the securities market including the fluctuations in the interest rates. The past performance of the mutual funds is not necessarily indicative of future performance of the schemes. The Mutual Fund is not guaranteeing or assuring any dividend under any of the schemes and the same is subject to the availability and adequacy of distributable surplus. Investors are requested to review the prospectus carefully and obtain expert professional advice with regard to specific legal, tax and financial implications of the investment/participation in the scheme.',
    { width: contentWidth, lineGap: 3.5 }
  ) + 20;

  // Disclaimer paragraph 2
  doc.text(
    'While all efforts have been taken to make this web site as authentic as possible, please refer to the print versions, notified Gazette copies of Acts/Rules/Regulations for authentic version or for use before any authority. We will not be responsible for any loss to any person/entity caused by any short-coming, defect or inaccuracy inadvertently or otherwise crept in the Mutual Funds Sahi Hai web site.',
    leftMargin,
    y,
    { width: contentWidth, align: 'left' }
  );

  y += doc.heightOfString(
    'While all efforts have been taken to make this web site as authentic as possible, please refer to the print versions, notified Gazette copies of Acts/Rules/Regulations for authentic version or for use before any authority. We will not be responsible for any loss to any person/entity caused by any short-coming, defect or inaccuracy inadvertently or otherwise crept in the Mutual Funds Sahi Hai web site.',
    { width: contentWidth, lineGap: 3.5 }
  ) + 26;

  // Disclosure:
  doc.text('Disclosure:', leftMargin, y);
  y += 24;

  const disclosureLines = [
    "We are a NISM certified / AMFI registered mutual fund distributor and not an RIA. We get compensated / incentivised by AMCs. We don't charge any fees for our services.",
    'We distribute only regular schemes.',
    'This is on a best effort basis and rates are updated as and when actual rates are received from AMCs.',
    'Details of Scheme level commission on Mutual funds are available with our team and would be produced on demand.',
    'Below are the AMCs we are empanelled with:'
  ];

  disclosureLines.forEach((line) => {
    doc.text(line, leftMargin, y, { width: contentWidth, align: 'left' });
    y += doc.heightOfString(line, { width: contentWidth, lineGap: 3.5 }) + 10;
  });

  y += 4;

  const page1AMCs = [
    '01. Aditya Birla Sunlife MF',
    '02. DSP Blackrock MF',
    '03. HDFC MF',
    '04. HSBC MF (L&T MF Merged With HSBC MF)',
    '05 ICICI Prudential MF',
    '06. Bandhan MF (Formerly Known As IDFC MF)',
    '07. 360 Asset One MF (Formerly Known As IIFL MF)',
    '08. Kotak MF'
  ];

  page1AMCs.forEach((amc) => {
    doc.text(amc, leftMargin, y, { width: contentWidth, align: 'left' });
    y += 14.5;
  });

  // ================= PAGE 2 =================
  doc.addPage();
  y = 80;

  const page2AMCs = [
    '09. Mahindra Manulife MF',
    '10. PPFAS MF',
    '11. SBI MF',
    '12. Shriram MF',
    '13. Tata MF',
    '14. Union MF',
    '15. Franklin Templeton MF',
    '16. WhiteOAK MF',
    '17. Navi MF',
    '18. Helios MF',
    '19. Axis MF',
    '20. Baroda BNP Paribhas MF',
    '21. Bank Of India MF',
    '22. Canara Robeco MF',
    '23. Edelweiss MF',
    '24. Groww MF',
    '25. Invesco MF',
    '26. ITI MF',
    '27. JM Financial MF',
    '28. LIC MF',
    '29. Mirae Asset MF',
    '30. Motilal Oswal MF',
    '31. Nippon MF',
    '32. NJ MF',
    '33. PGIM India MF',
    '34. Quant MF',
    '35. Quantum MF',
    '36. Samco MF',
    '37. Sundaram MF',
    '38. Taurus MF',
    '39. Trust MF',
    '40. UTI MF',
    '41. Bajaj Finserv MF',
    '42. Old Bridge MF',
    '43. The Wealth Company'
  ];

  page2AMCs.forEach((amc) => {
    doc.text(amc, leftMargin, y, { width: contentWidth, align: 'left' });
    y += 15.5;
  });

  // ================= PAGE 3 =================
  doc.addPage();
  y = 80;

  const col1Width = 195;
  const col2Width = 110;
  const tableX = leftMargin;
  const tableWidth = col1Width + col2Width;

  // Header row
  const headerHeight = 28;
  doc.rect(tableX, y, tableWidth, headerHeight).lineWidth(0.8).stroke('#000000');
  // Divider between col 1 and col 2
  doc.moveTo(tableX + col1Width, y).lineTo(tableX + col1Width, y + headerHeight).stroke('#000000');

  doc.font('Helvetica-Bold').fontSize(9.5);
  doc.text('Scheme Types', tableX + 6, y + 9);
  doc.text('Trail 1st Year\nonwards', tableX + col1Width + 6, y + 4, { lineGap: 1.5 });

  y += headerHeight;

  const tableRows = [
    ['Liquid/Ultra Short-Term Schemes', '0.05% - 0.65%'],
    ['Short Term Income Funds', '0.05% - 0.65%'],
    ['Income Funds', '0.05% - 1.00%'],
    ['Gilt Funds', '0.05% - 0.65%'],
    ['Hybrid Debt/Monthly Income Plans', '0.05% - 0.75%'],
    ['Arbitrage Funds', '0.05% - 0.60%'],
    ['Fund of Funds', '0.25% - 0.50%'],
    ['ELSS', '0.50% - 1.50%'],
    ['Index Funds', '00.0% - 0.75%'],
    ['Equity/ Hybrid Equity/ Balance Funds', '0.50% - 1.50%'],
    ['Fixed Maturity Plans', 'Variable']
  ];

  doc.font('Helvetica').fontSize(9);

  tableRows.forEach(([scheme, trail]) => {
    const rowHeight = 16.5;
    doc.rect(tableX, y, tableWidth, rowHeight).lineWidth(0.8).stroke('#000000');
    doc.moveTo(tableX + col1Width, y).lineTo(tableX + col1Width, y + rowHeight).stroke('#000000');

    doc.text(scheme, tableX + 6, y + 4);
    doc.text(trail, tableX + col1Width + 6, y + 4);

    y += rowHeight;
  });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

async function main() {
  const targetDir = path.join(process.cwd(), 'public', 'documents');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const p1 = path.join(targetDir, 'commission-disclosure.pdf');
  const p2 = path.join(targetDir, 'COMMISSION-DISCLOSURE-ARN-300286.pdf');

  console.log('Generating exact commission disclosure PDF...');
  await generateExactPDF(p1);
  console.log('Generated:', p1);

  fs.copyFileSync(p1, p2);
  console.log('Copied to:', p2);

  const distDir = path.join(process.cwd(), 'dist', 'documents');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(p1, path.join(distDir, 'commission-disclosure.pdf'));
    fs.copyFileSync(p1, path.join(distDir, 'COMMISSION-DISCLOSURE-ARN-300286.pdf'));
    console.log('Copied to dist/documents');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
