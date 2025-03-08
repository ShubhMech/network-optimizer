# Network Optimizer

A web application for optimizing network logistics and supply chain operations. This application helps optimize:
- Plant-to-warehouse shipping
- Warehouse-to-customer shipping
- Direct plant-to-customer shipping
- Production costs (regular and overtime)
- Transportation costs
- Warehouse locations and operations

## Features

1. **Optimization Engine**
   - Linear programming optimization using PuLP
   - Multi-objective optimization considering costs and constraints
   - Support for multiple products, plants, warehouses, and customers

2. **Interactive Visualization**
   - Network graph visualization showing plants, warehouses, and customers
   - Flow visualization with weighted edges
   - Cost breakdown charts
   - Interactive tooltips and hover effects

3. **Data Management**
   - Excel file upload for all data inputs
   - Support for large-scale networks
   - Customizable optimization parameters

## Project Structure

```
network-optimizer/
├── backend/
│   ├── main.py           # FastAPI backend server
│   └── requirements.txt  # Python dependencies
└── frontend/
    ├── src/
    │   └── App.tsx      # Main React component
    ├── package.json     # Node.js dependencies
    └── tsconfig.json    # TypeScript configuration
```

## Prerequisites

1. Python 3.8 or higher
2. Node.js 14 or higher
3. npm or yarn

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd network-optimizer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

The backend server will run on http://localhost:8000

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on http://localhost:3000

## Preparing Input Data

Prepare the following Excel files:

1. **Plants Data (`plants.xlsx`)**
   - Plant ID
   - Location
   - Capacity information

2. **Customers Data (`customers.xlsx`)**
   - Customer ID
   - Location
   - Demand information

3. **Products Data (`products.xlsx`)**
   - Product ID
   - Product specifications

4. **Annual Demand Data (`demand.xlsx`)**
   - Customer ID
   - Product ID
   - Demand quantities
   - Revenue per unit

5. **Production Capacity Data (`capacity.xlsx`)**
   - Plant ID
   - Product ID
   - Regular capacity
   - Overtime capacity
   - Production costs

6. **Plant Distances Data (`plant_distances.xlsx`)**
   - Plant ID
   - Customer/Warehouse ID
   - Distance in miles

7. **Customer Distances Data (`customer_distances.xlsx`)**
   - Customer pairs
   - Distance in miles

## Using the Application

1. Open http://localhost:3000 in your browser

2. Upload your data files using the file upload buttons

3. Adjust optimization parameters if needed:
   - Truck capacity (tons per truck)
   - Shipping cost per mile
   - Warehouse fixed cost
   - Maximum one-day delivery distance
   - Regular production hours
   - Overtime hours
   - Overtime cost multiplier

4. Click "Optimize Network" to run the optimization

5. View the results:
   - Network visualization showing optimal flow
   - Cost breakdown charts
   - Detailed shipping and production plans
   - Key performance metrics

## API Documentation

The backend API documentation is available at http://localhost:8000/docs when the backend server is running.

## Troubleshooting

1. **Backend Issues**
   - Ensure Python virtual environment is activated
   - Check if all required Python packages are installed
   - Verify Excel file formats match expected schema

2. **Frontend Issues**
   - Clear browser cache if changes aren't reflecting
   - Check browser console for any JavaScript errors
   - Verify Node.js and npm versions are compatible

3. **Data Issues**
   - Ensure all Excel files have the correct column names
   - Check for missing or invalid data
   - Verify units are consistent across all files

## Support

For issues and feature requests, please create an issue in the repository. 