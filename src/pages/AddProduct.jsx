import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import { addProduct } from "../services/productService"; // تأكد من وجود هذه الخدمة لإرسال البيانات

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "imageFile") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // تحقق بسيط من الحقول المطلوبة
    if (!formData.Name || !formData.Price || !formData.ImageUrl) {
      setError("يرجى ملء الحقول المطلوبة (الاسم، السعر، والصورة).");
      return;
    }

    // تحقق من أن السعر رقم إيجابي
    if (isNaN(formData.Price) || Number(formData.Price) <= 0) {
      setError("السعر يجب أن يكون رقماً أكبر من الصفر.");
      return;
    }

    setLoading(true);

    try {
      // تجهيز البيانات لإرسالها (FormData لدعم رفع الملفات)
      const data = new FormData();
      data.append("Name", formData.Name);
      data.append("Description", formData.Description);
      data.append("Price", formData.Price);
      data.append("ImageUrl", formData.ImageUrl);
      data.append("CostPrice", formData.CostPrice);
      data.append("CategoryId", formData.CategoryId);
      data.append("SupplierId", formData.SupplierId);

      // استدعاء خدمة إضافة المنتج (تأكد أن API يقبل FormData)
      await addProduct(data).then((res)=>console.log(res));

      setSuccess("تم إضافة المنتج بنجاح!");
      setFormData({ Name: "", Description: "", Price: 0, ImageUrl: null, CostPrice:0,CategoryId:null,SupplierId:null});
    } catch (err) {
      setError("حدث خطأ أثناء إضافة المنتج، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        إضافة منتج جديد
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="اسم المنتج"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            fullWidth
          />

          <TextField
            label="وصف المنتج"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <TextField
            label="السعر (ريال)"
            name="Price"
            value={formData.Price}
            onChange={handleChange}
            required
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            fullWidth
          />
                    <TextField
            label="السعر (ريال)"
            name="CostPrice"
            value={formData.CostPrice}
            onChange={handleChange}
            required
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            fullWidth
          />
                    <TextField
            label="CategoryId "
            name="CategoryId"
            value={formData.CategoryId}
            onChange={handleChange}
            required
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
            fullWidth
          />

          <Button variant="contained" component="label">
            رفع صورة المنتج *
            <input
              type="file"
              name="ImageUrl"
              accept="image/*"
              hidden
              onChange={handleChange}
            />
          </Button>
          {formData.ImageUrl && (
            <Typography variant="body2">
              تم اختيار الملف: {formData.ImageUrl.Name}
            </Typography>
          )}

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          {success && (
            <Typography color="success.main" variant="body2">
              {success}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            size="large"
          >
            {loading ? <CircularProgress size={24} /> : "إضافة المنتج"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
