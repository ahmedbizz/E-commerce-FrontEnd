import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Card,
} from "@mui/material";
import { addProduct, getCategories } from "../../../services/productService";
import { GetBrands } from "../../../services/BransService";
import { GetTargetGroups } from "../../../services/TargetGroupService";
import { GetSizes, DeleteSizeByID } from "../../../services/SizeService";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";

import { ToastContainer, toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

export default function AddProductForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    CostPrice: "",
    CategoryId: "",
    BrandId: "",
    SupplierId: "",
    TargetGroupId: "",
    clientFile: null,
    clientFiles: [],
    productImages: [],
    productSizes:[]
  });

  const [preview, setPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandsRes, setbrands] = useState([]);
  const [TargetGroupRes, setTargetGroup] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sizes, setSizes] = useState([]);
  // تحميل القوائم من الـ API
  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await getCategories();
        setCategories(catRes.data);
        const brandsRes = await GetBrands();
        setbrands(brandsRes.data.items);
        const TargetGroup = await GetTargetGroups();
        setTargetGroup(TargetGroup.data);
      } catch {
        setError("فشل في تحميل البيانات المساعدة.");
      }
    }
    fetchData();
  }, []);

  const fetchDataRelod = async()=>{
    try {
      const catRes = await getCategories();
      setCategories(catRes.data);
      const brandsRes = await GetBrands();
      setbrands(brandsRes.data.items);
      const TargetGroup = await GetTargetGroups();
      setTargetGroup(TargetGroup.data);
    } catch {
      setError("فشل في تحميل البيانات المساعدة.");
    }

  }

  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await GetSizes(); // خدمة API تجلب الأحجام
        setAvailableSizes(res.data);
      } catch (err) {
        console.error("Error fetching sizes", err);
      }
    };
    fetchSizes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handelCahngeSize = (size) => {
    setFormData((prev) => {
      const exists = (prev.productSizes||[]).some((s) => s.id === size.id);
      const updatedSizes = exists
        ? (prev.productSizes||[]).filter((s) => s.id !== size.id)
        : [...prev.productSizes, size];

      return { ...prev, productSizes: updatedSizes };
    });
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, clientFiles: files }));
      setGalleryPreview(files.map((file) => URL.createObjectURL(file)));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, clientFile: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.Name || !formData.Price || !formData.clientFile) {
      setError("يرجى ملء الحقول المطلوبة (الاسم، السعر، والصورة).");
      return;
    }

    if (isNaN(formData.Price) || Number(formData.Price) <= 0) {
      setError("السعر يجب أن يكون رقماً أكبر من الصفر.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key !== "clientFiles" &&
          value !== null &&
          value !== undefined &&
          value !== ""
        )
          data.append(key, value);
      });

      if (formData.clientFiles.length > 0) {
        formData.clientFiles.forEach((file) => {
          data.append("clientFiles", file); // لازم الـ API يستقبلها بنفس الاسم
        });
      }
      // إضافة الأحجام

      formData.productSizes.forEach((size, index) => {
        console.log(size)
        data.append(`ProductSizes[${index}].Id`, size.id); // <-- استخدم capital I إذا كانت في DTO هكذا
      });
      
      

      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      await addProduct(data);

      setSuccess("تم إضافة المنتج بنجاح!");
      setFormData({
        Name: "",
        Description: "",
        Price: "",
        CostPrice: "",
        CategoryId: "",
        BrandId: "",
        SupplierId: "",
        TargetGroupId: "",
        clientFile: null,
        clientFiles: [],
        productImages: [],
        productSizes:[]
      });
      setPreview(null);
      setGalleryPreview([]);
      setAvailableSizes([]);
      fetchDataRelod();
    } catch (error) {
      console.log(error)
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          // لو الرسائل كثيرة، اعرضهم كلهم
          setError(messages.join("\n"));
        } else {
          // لو رسالة واحدة فقط
          setError(messages);
        }
      } else {
        setError(t("errorr_message"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="Card-Continer">
      <Card className="Card" variant="outlined">
        <ToastContainer />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box position="relative" display="inline-block">
              {/* Hidden input */}
              <input
                type="file"
                id="clientFile"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {/* Label acts as clickable avatar */}
              <label htmlFor="clientFile" style={{ cursor: "pointer" }}>
                <Avatar
                  variant="square"
                  alt="Profile"
                  src={preview || "/public/Images/AddPic.webp"}
                  sx={{
                    width: "100%",
                    height: "100%",
                    transition: "0.3s",
                  }}
                />
                {/* Camera icon overlay */}
                <Box
                  position="absolute"
                  bottom={0}
                  right={0}
                  bgcolor="white"
                  borderRadius="50%"
                  p={0.5}
                >
                  <AddAPhotoIcon fontSize="small" />
                </Box>
              </label>
            </Box>
          </FormControl>
          <FormControl>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              style={{ margin: "10px 0" }}
            />
            <Box display="flex" gap={1} flexWrap="wrap">
              {galleryPreview.map((src, index) => (
                <Avatar
                  key={index}
                  src={src}
                  variant="square"
                  sx={{ width: 70, height: 70 }}
                />
              ))}
            </Box>
          </FormControl>

          <FormControl>
            <TextField
              label="اسم المنتج"
              name="Name"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.Name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="الوصف"
              name="Description"
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
              value={formData.Description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="السعر"
              name="Price"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.Price}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <TextField
              label="سعر التكلفة"
              name="CostPrice"
              type="number"
              fullWidth
              sx={{ mb: 2 }}
              value={formData.CostPrice}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <label>اختر الأحجام</label>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gridAutoRows: "68px",
              }}
            >
              {availableSizes.map((size) => (
                <label key={size.id}>
                  <input
                    type="checkbox"
                    value={size.id}
                    checked={(formData.productSizes || []).some((s) => s.id === size.id)}
                    onChange={() => handelCahngeSize(size)}
                  />

                  {size.name}
                </label>
              ))}
            </Box>
          </FormControl>

          <FormControl>
            <Select
              name="CategoryId"
              value={formData.CategoryId}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">اختر الفئة</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Select
              name="BrandId"
              value={formData.BrandId}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">اختر الفئة</MenuItem>
              {(brandsRes || []).map((B) => (
                <MenuItem key={B.id} value={B.id}>
                  {B.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Select
              name="TargetGroupId"
              value={formData.TargetGroupId}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="">اختر الفئة</MenuItem>
              {(TargetGroupRes || []).map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <select
            name="SupplierId"
            value={formData.SupplierId}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, marginBottom: 20 }}
          >
            <option value="">اختر المورد</option>
            {(suppliers || []).map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "إضافة المنتج"}
          </Button>
          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to={`/products`}
            sx={{
              backgroundColor: "rgb(200, 122, 122)",
              boxShadow: "0px 6px 0px rgb(240, 240, 175, 1)",
            }}
            fullWidth
            variant="contained"
          >
            Back
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
