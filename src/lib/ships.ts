export interface ShipData {
    name: string;
    cruiseLine: string;
    imo: string;
    length: string;
    beam: string;
    grossTonnage: string;
    draft: string;
}

export const SHIPS: ShipData[] = [
    { name: "Amera", cruiseLine: "Phoenix Reisen", imo: "8700280", length: "205.00", beam: "29.00", grossTonnage: "39,051", draft: "6.90" },
    { name: "Anthem of the Seas", cruiseLine: "RCCL", imo: "9656101", length: "347.10", beam: "49.00", grossTonnage: "168,666", draft: "8.50" },
    { name: "Arcadia", cruiseLine: "Carnival UK", imo: "9226906", length: "285.10", beam: "32.30", grossTonnage: "84,342", draft: "8.10" },
    { name: "Azamara Onward", cruiseLine: "SP Cruises", imo: "9187887", length: "180.45", beam: "25.46", grossTonnage: "30,312", draft: "5.80" },
    { name: "Azamara Pursuit", cruiseLine: "SP Cruises", imo: "9210220", length: "180.45", beam: "25.76", grossTonnage: "30,277", draft: "5.90" },
    { name: "Carnival Splendor", cruiseLine: "Carnival Cruise Lines", imo: "9333163", length: "289.75", beam: "35.54", grossTonnage: "113,573", draft: "8.30" },
    { name: "Celebrity Edge", cruiseLine: "Celebrity Cruises", imo: "9812705", length: "306.00", beam: "39.00", grossTonnage: "130,818", draft: "8.40" },
    { name: "Celebrity Solstice", cruiseLine: "Celebrity Cruises", imo: "9362530", length: "317.20", beam: "36.88", grossTonnage: "121,878", draft: "8.23" },
    { name: "Coral Princess", cruiseLine: "Princess Cruises", imo: "9229659", length: "293.50", beam: "32.20", grossTonnage: "91,627", draft: "8.20" },
    { name: "Crown Princess", cruiseLine: "Princess Cruises", imo: "9293399", length: "289.60", beam: "36.00", grossTonnage: "113,561", draft: "8.80" },
    { name: "Crystal Serenity", cruiseLine: "Crystal Cruises", imo: "9243667", length: "250.00", beam: "32.00", grossTonnage: "68,870", draft: "7.50" },
    { name: "Discovery Princess", cruiseLine: "Princess Cruises", imo: "9837468", length: "329.92", beam: "47.00", grossTonnage: "145,281", draft: "8.49" },
    { name: "Disney Wonder", cruiseLine: "Disney Cruises", imo: "9126819", length: "294.00", beam: "32.00", grossTonnage: "83,000", draft: "7.70" },
    { name: "Douglas Mawson", cruiseLine: "Aurora Expeditions", imo: "9992713", length: "104.40", beam: "18.40", grossTonnage: "8,181", draft: "5.30" },
    { name: "Heritage Adventurer", cruiseLine: "Heritage Expeditions", imo: "9000168", length: "122.00", beam: "17.00", grossTonnage: "8,378", draft: "5.00" },
    { name: "Island Princess", cruiseLine: "Princess Cruises", imo: "9230402", length: "294.00", beam: "32.30", grossTonnage: "92,822", draft: "8.30" },
    { name: "Le Soleal", cruiseLine: "Ponant", imo: "9641675", length: "142.10", beam: "18.00", grossTonnage: "10,992", draft: "4.90" },
    { name: "MSC Magnifica", cruiseLine: "MSC Cruises", imo: "9387085", length: "293.80", beam: "32.00", grossTonnage: "95,128", draft: "7.80" },
    { name: "Noordam", cruiseLine: "Holland America Line", imo: "9230115", length: "285.00", beam: "32.00", grossTonnage: "82,897", draft: "8.00" },
    { name: "Norwegian Spirit", cruiseLine: "Norwegian Cruise Lines", imo: "9141065", length: "268.00", beam: "37.00", grossTonnage: "75,904", draft: "8.42" },
    { name: "Queen Mary 2", cruiseLine: "Cunard", imo: "9241061", length: "345.00", beam: "44.00", grossTonnage: "148,528", draft: "10.00" },
    { name: "Riviera", cruiseLine: "Oceania Cruises", imo: "9438078", length: "251.00", beam: "32.00", grossTonnage: "66,084", draft: "7.32" },
    { name: "Scenic Eclipse II", cruiseLine: "Scenic Group", imo: "9850460", length: "168.00", beam: "22.00", grossTonnage: "17,592", draft: "5.70" },
    { name: "Seabourn Quest", cruiseLine: "Seabourn Cruise Line", imo: "9483126", length: "198.19", beam: "26.00", grossTonnage: "32,477", draft: "6.60" },
    { name: "Seabourn Sojourn", cruiseLine: "Seabourn Cruise Line", imo: "9417098", length: "197.00", beam: "27.00", grossTonnage: "32,477", draft: "6.60" },
    { name: "Seven Seas Explorer", cruiseLine: "Regent Seven Seas", imo: "9703150", length: "223.74", beam: "31.00", grossTonnage: "55,254", draft: "7.10" },
    { name: "Seven Seas Mariner", cruiseLine: "Regent Seven Seas", imo: "9210139", length: "216.93", beam: "28.30", grossTonnage: "48,075", draft: "6.40" },
    { name: "Seven Seas Navigator", cruiseLine: "Regent Seven Seas", imo: "9064126", length: "170.00", beam: "24.00", grossTonnage: "28,803", draft: "7.30" },
    { name: "Silver Dawn", cruiseLine: "Silversea Cruises", imo: "9857937", length: "213.00", beam: "26.00", grossTonnage: "40,855", draft: "6.70" },
    { name: "Silver Moon", cruiseLine: "Silversea Cruises", imo: "9838618", length: "212.90", beam: "26.00", grossTonnage: "40,844", draft: "6.70" },
    { name: "Silver Nova", cruiseLine: "Silversea Cruises", imo: "9886213", length: "243.60", beam: "34.00", grossTonnage: "55,051", draft: "7.10" },
    { name: "The World", cruiseLine: "Residensea Ltd", imo: "9219331", length: "196.35", beam: "30.00", grossTonnage: "43,188", draft: "7.00" },
    { name: "Vasco Da Gama", cruiseLine: "Nicko Cruises", imo: "8919245", length: "219.00", beam: "31.00", grossTonnage: "55,877", draft: "7.80" },
    { name: "Viking Orion", cruiseLine: "Viking Ocean Cruises", imo: "9796250", length: "227.00", beam: "28.80", grossTonnage: "47,800", draft: "6.70" },
    { name: "Viking Sky", cruiseLine: "Viking Ocean Cruises", imo: "9650420", length: "227.00", beam: "28.80", grossTonnage: "47,800", draft: "6.70" },
    { name: "Viking Venus", cruiseLine: "Viking Ocean Cruises", imo: "9833175", length: "227.00", beam: "28.80", grossTonnage: "47,800", draft: "6.70" },
    { name: "Villa Vie Odyssey", cruiseLine: "Villa Vie Residence", imo: "9000699", length: "196.00", beam: "23.00", grossTonnage: "24,344", draft: "5.41" },
    { name: "Volendam", cruiseLine: "Holland America Line", imo: "9156515", length: "237.00", beam: "32.00", grossTonnage: "61,214", draft: "8.10" },
    { name: "Zaandam", cruiseLine: "Holland America Line", imo: "9156527", length: "202.00", beam: "32.00", grossTonnage: "61,396", draft: "8.10" },
];
