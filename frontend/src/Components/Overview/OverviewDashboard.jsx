import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { PieChart } from "react-minimal-pie-chart";
import "./OverviewDashboard.css"
const OverviewDashboard = () => {
  return (
    <Box sx={{ display: "flex", p: 2 }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, bgcolor: "#F4F6F8", p: 2, minHeight: "100vh" }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Agency Information</Typography>
          <Box display="flex" alignItems="center" mt={2} mb={4}>
            <img src="path_to_user_image" alt="User" style={{ borderRadius: "50%", width: 50, height: 50 }} />
            <Box ml={2}>
              <Typography>Agent Name</Typography>
              <Typography variant="body2">@JohnDoe_FP</Typography>
            </Box>
          </Box>
        </Box>
        <Typography>Navigation</Typography>
        <Box sx={{ mt: 2 }}>
          <button variant="contained" color="primary" fullWidth>
            Dashboard
          </button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: 3 }}>
        <Typography variant="h4" mb={2}>
          Dashboard
        </Typography>
        <Grid container spacing={2} alignItems="stretch">
          {/* Left Column with 4 Boxes */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ height: "100%", p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="primary">Policies Sold</Typography>
                    <Typography variant="h4">25.6K</Typography>
                    <Typography color="textSecondary">+20.1% from last month</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="green">Completed Applications</Typography>
                    <Typography variant="h4">500</Typography>
                    <Typography color="textSecondary">+18.1% from last month</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="orange">Renewals</Typography>
                    <Typography variant="h4">320</Typography>
                    <Typography color="textSecondary">+18.1% from last month</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={3} sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h6" color="blue">New Leads</Typography>
                    <Typography variant="h4">250</Typography>
                    <Typography color="textSecondary">+25% from last month</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column with Pie Chart and Legend in Row */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ height: "100%", p: 2 }} className="box-shadow">
              <Typography variant="h6" mb={2} textAlign="center">Score Pie Chart</Typography>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Pie Chart */}
                <PieChart
                  data={[
                    { title: "Completed", value: 30, color: "#4CAF50" },
                    { title: "Policy Sales", value: 20, color: "#2196F3" },
                    { title: "Renewals", value: 25, color: "#FFC107" },
                    { title: "New Leads", value: 25, color: "#FF5722" }
                  ]}
                  lineWidth={15}
                  radius={40}
                  rounded
                  animate
                  label={() => "81.30%"}
                  labelStyle={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    fill: '#333'
                  }}
                  labelPosition={0}
                  className="pie_img"
                />

                {/* Legend */}
                <Box ml={4}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box sx={{ width: 10, height: 10, bgcolor: "#4CAF50", borderRadius: "50%", mr: 1 }} />
                    <Typography variant="body2">Completed</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box sx={{ width: 10, height: 10, bgcolor: "#2196F3", borderRadius: "50%", mr: 1 }} />
                    <Typography variant="body2">Policy Sales</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box sx={{ width: 10, height: 10, bgcolor: "#FFC107", borderRadius: "50%", mr: 1 }} />
                    <Typography variant="body2">Renewals</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box sx={{ width: 10, height: 10, bgcolor: "#FF5722", borderRadius: "50%", mr: 1 }} />
                    <Typography variant="body2">New Leads</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default OverviewDashboard;
