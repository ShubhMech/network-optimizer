import React, { useEffect, useState } from 'react';
import {
  XYPlot,
  MarkSeries,
  LineSeries,
  LabelSeries,
  Hint,
  FlexibleXYPlot
} from 'react-vis';
import { Box, Paper, Typography } from '@mui/material';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force';

interface Node {
  id: string;
  x?: number;
  y?: number;
  type: 'plant' | 'warehouse' | 'customer';
  size: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface NetworkVisualizationProps {
  shippingPlan: any;
  warehousesOpened: string[];
}

const NetworkVisualization: React.FC<NetworkVisualizationProps> = ({
  shippingPlan,
  warehousesOpened
}) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    // Create nodes and links from shipping plan
    const nodesMap = new Map<string, Node>();
    const linksArray: Link[] = [];

    // Add plants
    shippingPlan.plant_to_warehouse.forEach((ship: any) => {
      if (!nodesMap.has(ship.plant)) {
        nodesMap.set(ship.plant, {
          id: ship.plant,
          type: 'plant',
          size: 10
        });
      }
    });

    // Add warehouses
    warehousesOpened.forEach((warehouse: string) => {
      nodesMap.set(warehouse, {
        id: warehouse,
        type: 'warehouse',
        size: 8
      });
    });

    // Add customers and links
    shippingPlan.warehouse_to_customer.forEach((ship: any) => {
      if (!nodesMap.has(ship.customer)) {
        nodesMap.set(ship.customer, {
          id: ship.customer,
          type: 'customer',
          size: 6
        });
      }
      linksArray.push({
        source: ship.warehouse,
        target: ship.customer,
        value: ship.amount
      });
    });

    // Add plant-to-warehouse links
    shippingPlan.plant_to_warehouse.forEach((ship: any) => {
      linksArray.push({
        source: ship.plant,
        target: ship.warehouse,
        value: ship.amount
      });
    });

    // Use D3 force simulation to layout the network
    const simulation = forceSimulation(Array.from(nodesMap.values()))
      .force('charge', forceManyBody().strength(-1000))
      .force('center', forceCenter(300, 300))
      .force(
        'link',
        forceLink(linksArray)
          .id((d: any) => d.id)
          .distance(100)
      );

    // Run the simulation
    for (let i = 0; i < 300; ++i) simulation.tick();

    setNodes(Array.from(nodesMap.values()));
    setLinks(linksArray);
  }, [shippingPlan, warehousesOpened]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'plant':
        return '#1f77b4';
      case 'warehouse':
        return '#ff7f0e';
      case 'customer':
        return '#2ca02c';
      default:
        return '#000000';
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Network Visualization
      </Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <FlexibleXYPlot>
          {/* Draw links */}
          {links.map((link, i) => {
            const sourceNode = nodes.find(n => n.id === link.source);
            const targetNode = nodes.find(n => n.id === link.target);
            if (!sourceNode?.x || !sourceNode?.y || !targetNode?.x || !targetNode?.y) return null;

            return (
              <LineSeries
                key={i}
                data={[
                  { x: sourceNode.x, y: sourceNode.y },
                  { x: targetNode.x, y: targetNode.y }
                ]}
                stroke="#ddd"
                strokeWidth={Math.sqrt(link.value) * 0.5}
              />
            );
          })}

          {/* Draw nodes */}
          <MarkSeries
            data={nodes.map(node => ({
              x: node.x || 0,
              y: node.y || 0,
              size: node.size * 3,
              color: getNodeColor(node.type)
            }))}
            onValueMouseOver={(value: any) => {
              const node = nodes.find(n => n.x === value.x && n.y === value.y);
              if (node) setHoveredNode(node);
            }}
            onValueMouseOut={() => setHoveredNode(null)}
          />

          {/* Node labels */}
          <LabelSeries
            data={nodes.map(node => ({
              x: (node.x || 0) + 10,
              y: (node.y || 0) + 10,
              label: node.id
            }))}
          />

          {/* Hover tooltip */}
          {hoveredNode && (
            <Hint value={{ x: hoveredNode.x, y: hoveredNode.y }}>
              <div style={{ background: 'white', padding: '5px', border: '1px solid #ccc' }}>
                <strong>{hoveredNode.id}</strong>
                <br />
                Type: {hoveredNode.type}
              </div>
            </Hint>
          )}
        </FlexibleXYPlot>
      </Box>
    </Paper>
  );
};

export default NetworkVisualization; 