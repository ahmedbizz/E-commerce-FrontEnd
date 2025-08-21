import React, { useState, useEffect } from "react";
import { Box, TextField, Button, CircularProgress, Alert, Select ,MenuItem,Card} from "@mui/material";
import { addProduct ,getCategories} from "../../../services/productService";
import { GetBrands} from "../../../services/BransService";
import { GetTargetGroups} from "../../../services/TargetGroupService";

import Avatar from "@mui/material/Avatar";

import { ToastContainer, toast } from "react-toastify";
import FormControl from "@mui/material/FormControl";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    CostPrice: "",
    CategoryId: "",
    BrandId:"",
    SupplierId: "",
    TargetGroupId:"",
    clientFile: null,
  });

  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brandsRes, setbrands] = useState([]);
  const [TargetGroupRes, setTargetGroup] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        if(value !== null && value !== undefined && value !== "")
        data.append(key, value);
      });

      

      await addProduct(data);

      setSuccess("تم إضافة المنتج بنجاح!");
      setFormData({
        Name: "",
        Description: "",
        Price: "",
        CostPrice: "",
        CategoryId: "",
        BrandId:"",
        SupplierId: "",
        TargetGroupId:"",
        clientFile: null,
      });
      setPreview(null);
    } catch (err) {
      console.log(err)
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<Box className="Card-Continer" >
      <Card className="Card"  variant="outlined">
      <ToastContainer/>
    
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
              <input type="file" 
                id="clientFile"
              accept="image/*" 
              onChange={handleImageChange}
               style={{ display: "none"}} />
  
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
        <TextField label="اسم المنتج" name="Name" fullWidth sx={{ mb: 2 }} value={formData.Name} onChange={handleChange} />
        </FormControl>
        <FormControl>
        <TextField label="الوصف" name="Description" fullWidth multiline rows={3} sx={{ mb: 2 }} value={formData.Description} onChange={handleChange} />
        </FormControl>
        <FormControl>
        <TextField label="السعر" name="Price" type="number" fullWidth sx={{ mb: 2 }} value={formData.Price} onChange={handleChange} />
        </FormControl>
        <FormControl>
        <TextField label="سعر التكلفة" name="CostPrice" type="number" fullWidth sx={{ mb: 2 }} value={formData.CostPrice} onChange={handleChange} />
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
      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
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
    {(brandsRes ||[]).map((B) => (
      <MenuItem key={B.id} value={B.id}>{B.name}</MenuItem>
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
{(TargetGroupRes ||[]).map((t) => (
<MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
))}
</Select>
</FormControl>
        <select name="SupplierId" value={formData.SupplierId} onChange={handleChange} style={{ width: "100%", padding: 10, marginBottom: 20 }}>
          <option value="">اختر المورد</option>
          {(suppliers || []).map((sup) => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>
  
    
  
  
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
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
