import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NetworkVisualization from './components/NetworkVisualization';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Input = styled('input')({
  display: 'none',
});

interface OptimizationParams {
  truck_capacity: number;
  shipping_cost_per_mile: number;
  warehouse_fixed_cost: number;
  max_one_day_distance: number;
  regular_hours: number;
  overtime_hours: number;
  overtime_cost_multiplier: number;
}

interface FileUpload {
  plants?: File;
  customers?: File;
  products?: File;
  demand?: File;
  capacity?: File;
  plant_distances?: File;
  customer_distances?: File;
}

interface NetworkMetrics {
  total_transportation_cost: number;
  total_production_cost: number;
  total_warehouse_cost: number;
  total_revenue: number;
}

function App() {
  const [files, setFiles] = useState<FileUpload>({});
  const [params, setParams] = useState<OptimizationParams>({
    truck_capacity: 10.0,
    shipping_cost_per_mile: 2.0,
    warehouse_fixed_cost: 10000.0,
    max_one_day_distance: 450.0,
    regular_hours: 720.0,
    overtime_hours: 360.0,
    overtime_cost_multiplier: 1.5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: keyof FileUpload) => {
    if (event.target.files && event.target.files[0]) {
      setFiles(prev => ({
        ...prev,
        [type]: event.target.files![0]
      }));
    }
  };

  const handleParamChange = (param: keyof OptimizationParams) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParams(prev => ({
      ...prev,
      [param]: Number(event.target.value)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(files).forEach(([key, file]) => {
        formData.append(`${key}_file`, file);
      });
      formData.append('params', JSON.stringify(params));

      const response = await fetch('http://localhost:8000/api/optimize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Optimization failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderMetricsChart = (metrics: NetworkMetrics) => {
    const data = [
      {
        name: 'Transportation',
        cost: metrics.total_transportation_cost,
      },
      {
        name: 'Production',
        cost: metrics.total_production_cost,
      },
      {
        name: 'Warehouse',
        cost: metrics.total_warehouse_cost,
      },
      {
        name: 'Revenue',
        cost: metrics.total_revenue,
      },
    ];

    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Cost Breakdown
        </Typography>
        <Box sx={{ height: 400 }}>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" fill="#8884d8" />
          </BarChart>
        </Box>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Network Optimizer
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Data Files
              </Typography>
              
              {['plants', 'customers', 'products', 'demand', 'capacity', 'plant_distances', 'customer_distances'].map((type) => (
                <Box key={type} sx={{ mb: 2 }}>
                  <label htmlFor={`${type}-file`}>
                    <Input
                      accept=".xlsx,.xls"
                      id={`${type}-file`}
                      type="file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleFileChange(e, type as keyof FileUpload)
                      }
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                    >
                      Upload {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')} File
                      {files[type as keyof FileUpload] && ' ✓'}
                    </Button>
                  </label>
                </Box>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Optimization Parameters
              </Typography>
              
              {Object.entries(params).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                  type="number"
                  value={value}
                  onChange={handleParamChange(key as keyof OptimizationParams)}
                  fullWidth
                  margin="normal"
                />
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || Object.keys(files).length < 7}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Optimize Network'}
              </Button>
            </Box>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {results && (
            <>
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Optimization Results
                  </Typography>
                  <Typography>
                    Status: {results.status}
                  </Typography>
                  <Typography>
                    Objective Value: ${results.objective_value.toLocaleString()}
                  </Typography>
                  <Typography>
                    Warehouses Opened: {results.warehouses_opened.join(', ')}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <NetworkVisualization
                  shippingPlan={results.shipping_plan}
                  warehousesOpened={results.warehouses_opened}
                />
              </Grid>

              <Grid item xs={12}>
                {renderMetricsChart(results.network_metrics)}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default App; 