import { Box } from "@mui/material";

// --- Child Component 1 ---
const LeftComponent = () => {
  return (
    <Box sx={{ height: "100%", border: "1px dashed #ccc" }}>
      <h2>Left Side</h2>
    </Box>
  );
};

// --- Child Component 2 ---
const RightComponent = () => {
  return (
    <Box sx={{ height: "100%", border: "1px dashed #ccc" }}>
      <h2>Right Side</h2>
    </Box>
  );
};

// --- Main Page Component ---
const CreatePage = () => {
  return (
    // Parent container using MUI theme background
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100%",
        bgcolor: "background.default", // Automatically maps to your MUI theme's background
        boxSizing: "border-box",
      }}
    >
      {/* Left Block */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#fff", // Or 'common.white' if preferred
          p: "5px", // MUI natively handles string values like this exactly as CSS
          boxSizing: "border-box",
        }}
      >
        <LeftComponent />
      </Box>

      {/* Right Block */}
      <Box
        sx={{
          flex: 1,
          bgcolor: "#fff",
          p: "5px",
          boxSizing: "border-box",
        }}
      >
        <RightComponent />
      </Box>
    </Box>
  );
};

export default CreatePage;
