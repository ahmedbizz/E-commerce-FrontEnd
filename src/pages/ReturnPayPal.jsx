import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {CapturePayment} from "../services/OrederService";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useRef } from "react";


export default function ReturnPayPal() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const executedRef = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const providerOrderId = searchParams.get("token"); 
  const paymentId = searchParams.get("paymentId");
  useEffect(() => {
    const capturePayment = async () => {

      if (executedRef.current) return; // لو تم التنفيذ مسبقًا، لا تنفذ مرة ثانية
      executedRef.current = true;
      try {
        if (!providerOrderId) {
          setMessage("Invalid PayPal return URL.");
          setLoading(false);
          return;
        }

        const res = await CapturePayment(paymentId, providerOrderId);


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
