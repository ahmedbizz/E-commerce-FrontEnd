import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../services/axiosInstance";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

export default function ReturnPayPal() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const providerOrderId = searchParams.get("token"); // PayPal يعيد token كمعرف الطلب

  useEffect(() => {
    const capturePayment = async () => {
      try {
        if (!providerOrderId) {
          setMessage("Invalid PayPal return URL.");
          setLoading(false);
          return;
        }

        const res = await axios.post("/Payment/CapturePaypal", {
          ProviderOrderId: providerOrderId,
        });

        if (res.data?.message) {
          setMessage(res.data.message);
        } else {
          setMessage("Payment processed successfully.");
        }
      } catch (err) {
        console.error(err);
        setMessage("Failed to capture payment. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [providerOrderId]);

  return (
    <Box textAlign="center" mt={5}>
      {loading ? (
        <CircularProgress size={80} />
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            {message}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ mt: 3 }}
          >
            Go to Home
          </Button>
        </>
      )}
    </Box>
  );
}
