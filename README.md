# DevOps assignment

## Description

This project is a web application developed as part of a group assignment for a studying project of JYU course TJTS5901 - Continuous Software Engineering in spring semester 2024. 
Detailed course information is found here: https://sisu.jyu.fi/student/courseunit/otm-64c92c23-a413-48ad-ac29-9ae54ba0b658

The application allows users to perform off-market trades for a single stock, specifically focused on APPLE (AAPL). Orders are matched outside of a stock exchange, and the web application interacts with end users through a REST API. It fetches the latest market data of the stock from a feed to validate the price of input orders.

More info about the data used: https://docs.marketdata.app/docs/api.

The application can be used for example in Postman https://www.postman.com/ or in other similar API platform.


## Installation

To install the project, follow these steps:
1. Clone the repository to your local machine
   ```bash
   git clone https://github.com/eppmakin/DevOps.git
2. Navigate to the project directory
   ```bash
   cd DevOps
3. Install dependencies
   ```bash
   npm install

## Usage

After installation, you can run the web application by executing the following command:
```bash
npm start
```


Once the application is running, you can access it in `http://localhost:3000`.

For more information: check test files.
