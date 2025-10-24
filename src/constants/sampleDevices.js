// src/constants/sampleDevices.js
const sampleDevices = [
  // Amit Sharma's devices (USER001)
  {
    id: "dev001",
    userId: "USER001",
    name: "iPhone 14 Pro",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:B7",
    ip: "192.168.1.142",
    additionDate: "2024-08-15",
    lastUsageDate: "2 hours ago",
    dataUsage: "245 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev002",
    userId: "USER001",
    name: "Lenovo ThinkPad",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D1",
    ip: "192.168.1.159",
    additionDate: "2024-09-01",
    lastUsageDate: "10 minutes ago",
    dataUsage: "1.5 GB",
    online: true,
    blocked: false
  },
  
  // Neeta Singh's devices (USER012)
  {
    id: "dev003",
    userId: "USER012",
    name: "MacBook Air",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:C8",
    ip: "192.168.1.156",
    additionDate: "2024-07-22",
    lastUsageDate: "1 hour ago",
    dataUsage: "1.2 GB",
    online: true,
    blocked: false
  },
  {
    id: "dev004",
    userId: "USER012",
    name: "iPhone 12 Mini",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C1",
    ip: "192.168.1.146",
    additionDate: "2024-08-30",
    lastUsageDate: "6 hours ago",
    dataUsage: "234 MB",
    online: false,
    blocked: false
  },
  
  // Rajesh Kumar's devices (USER003)
  {
    id: "dev005",
    userId: "USER003",
    name: "iPhone 13",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:B8",
    ip: "192.168.1.143",
    additionDate: "2024-06-10",
    lastUsageDate: "3 hours ago",
    dataUsage: "189 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev006",
    userId: "USER003",
    name: "MacBook Pro 16",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D2",
    ip: "192.168.1.160",
    additionDate: "2024-07-15",
    lastUsageDate: "20 minutes ago",
    dataUsage: "3.2 GB",
    online: true,
    blocked: false
  },
  
  // Vikram Chatterjee's devices (USER007)
  {
    id: "dev007",
    userId: "USER007",
    name: "Dell XPS 15",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:C9",
    ip: "192.168.1.157",
    additionDate: "2024-05-18",
    lastUsageDate: "30 minutes ago",
    dataUsage: "890 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev008",
    userId: "USER007",
    name: "Google Pixel 7",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C2",
    ip: "192.168.1.147",
    additionDate: "2024-09-05",
    lastUsageDate: "4 hours ago",
    dataUsage: "345 MB",
    online: false,
    blocked: false
  },
  
  // Divya Nair's devices (USER008)
  {
    id: "dev009",
    userId: "USER008",
    name: "Samsung Galaxy S22",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:B9",
    ip: "192.168.1.144",
    additionDate: "2024-06-28",
    lastUsageDate: "5 hours ago",
    dataUsage: "567 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev010",
    userId: "USER008",
    name: "Asus ROG",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D3",
    ip: "192.168.1.161",
    additionDate: "2024-07-10",
    lastUsageDate: "25 minutes ago",
    dataUsage: "2.8 GB",
    online: true,
    blocked: false
  },
  
  // Sanjay Rao's devices (USER005)
  {
    id: "dev011",
    userId: "USER005",
    name: "HP Pavilion",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D0",
    ip: "192.168.1.158",
    additionDate: "2024-08-20",
    lastUsageDate: "15 minutes ago",
    dataUsage: "2.1 GB",
    online: true,
    blocked: true
  },
  {
    id: "dev012",
    userId: "USER005",
    name: "Samsung Galaxy Tab S8",
    type: "mobile",
    category: "Tablet",
    mac: "00:1B:44:11:3A:E5",
    ip: "192.168.1.170",
    additionDate: "2024-09-03",
    lastUsageDate: "2 hours ago",
    dataUsage: "678 MB",
    online: true,
    blocked: false
  },
  
  // Rahul Desai's devices (USER009)
  {
    id: "dev013",
    userId: "USER009",
    name: "iPad Pro",
    type: "mobile",
    category: "Tablet",
    mac: "00:1B:44:11:3A:C0",
    ip: "192.168.1.145",
    additionDate: "2024-09-12",
    lastUsageDate: "45 minutes ago",
    dataUsage: "432 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev014",
    userId: "USER009",
    name: "Microsoft Surface",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D4",
    ip: "192.168.1.162",
    additionDate: "2024-08-05",
    lastUsageDate: "1 hour ago",
    dataUsage: "1.8 GB",
    online: true,
    blocked: false
  },
  
  // Ravi Kumar's devices (USER011)
  {
    id: "dev015",
    userId: "USER011",
    name: "OnePlus 11",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C3",
    ip: "192.168.1.148",
    additionDate: "2024-07-18",
    lastUsageDate: "3 hours ago",
    dataUsage: "456 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev016",
    userId: "USER011",
    name: "Acer Aspire",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D5",
    ip: "192.168.1.163",
    additionDate: "2024-06-22",
    lastUsageDate: "50 minutes ago",
    dataUsage: "2.3 GB",
    online: true,
    blocked: false
  },
  
  // Anita Shah's devices (USER013)
  {
    id: "dev017",
    userId: "USER013",
    name: "Xiaomi 13 Pro",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C4",
    ip: "192.168.1.149",
    additionDate: "2024-08-08",
    lastUsageDate: "4 hours ago",
    dataUsage: "389 MB",
    online: false,
    blocked: false
  },
  {
    id: "dev018",
    userId: "USER013",
    name: "HP Envy",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D6",
    ip: "192.168.1.164",
    additionDate: "2024-07-25",
    lastUsageDate: "35 minutes ago",
    dataUsage: "1.9 GB",
    online: true,
    blocked: false
  },
  
  // Vipin Nair's devices (USER014)
  {
    id: "dev019",
    userId: "USER014",
    name: "Vivo X90",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C5",
    ip: "192.168.1.150",
    additionDate: "2024-09-01",
    lastUsageDate: "1 hour ago",
    dataUsage: "523 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev020",
    userId: "USER014",
    name: "Lenovo IdeaPad",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D7",
    ip: "192.168.1.165",
    additionDate: "2024-06-30",
    lastUsageDate: "22 minutes ago",
    dataUsage: "2.6 GB",
    online: true,
    blocked: false
  },
  
  // Suresh Kumar's devices (USER015)
  {
    id: "dev021",
    userId: "USER015",
    name: "Realme GT 2",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C6",
    ip: "192.168.1.151",
    additionDate: "2024-07-12",
    lastUsageDate: "5 hours ago",
    dataUsage: "412 MB",
    online: false,
    blocked: false
  },
  
  // Pooja Joshi's devices (USER016)
  {
    id: "dev022",
    userId: "USER016",
    name: "Oppo Find X5",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:C7",
    ip: "192.168.1.152",
    additionDate: "2024-08-25",
    lastUsageDate: "2 hours ago",
    dataUsage: "345 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev023",
    userId: "USER016",
    name: "Dell Inspiron",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D8",
    ip: "192.168.1.166",
    additionDate: "2024-07-05",
    lastUsageDate: "40 minutes ago",
    dataUsage: "1.7 GB",
    online: true,
    blocked: false
  },
  
  // Ramesh Iyer's device (USER017)
  {
    id: "dev024",
    userId: "USER017",
    name: "Asus ZenBook",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:D9",
    ip: "192.168.1.167",
    additionDate: "2024-06-15",
    lastUsageDate: "3 days ago",
    dataUsage: "850 MB",
    online: false,
    blocked: false
  },
  
  // Anita Kapoor's devices (USER018)
  {
    id: "dev025",
    userId: "USER018",
    name: "Nothing Phone 2",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CA",
    ip: "192.168.1.153",
    additionDate: "2024-09-10",
    lastUsageDate: "30 minutes ago",
    dataUsage: "298 MB",
    online: true,
    blocked: false
  },
  {
    id: "dev026",
    userId: "USER018",
    name: "MSI Prestige",
    type: "laptop",
    category: "Laptop",
    mac: "00:1B:44:11:3A:DA",
    ip: "192.168.1.168",
    additionDate: "2024-08-12",
    lastUsageDate: "18 minutes ago",
    dataUsage: "3.1 GB",
    online: true,
    blocked: false
  },
  
  // Sita Kumari's device (USER019)
  {
    id: "dev027",
    userId: "USER019",
    name: "Motorola Edge 40",
    type: "mobile",
    category: "Smartphone",
    mac: "00:1B:44:11:3A:CB",
    ip: "192.168.1.154",
    additionDate: "2024-07-28",
    lastUsageDate: "6 hours ago",
    dataUsage: "478 MB",
    online: false,
    blocked: false
  }
];

export default sampleDevices;