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
  FormControl,
} from "@mui/material";
import {
  GetProductById,
  UpdateProductById,
  getCategories,
} from "../../../services/productService";
import { GetBrands } from "../../../services/BransService";
import { GetTargetGroups } from "../../../services/TargetGroupService";
import { GetSizes } from "../../../services/SizeService";
import { GetTaxCategorys } from "../../../services/TaxesService";
import Avatar from "@mui/material/Avatar";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { ToastContainer } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";

export default function UpdateProduct() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Price: "",
    CostPrice: "",
    CategoryId: "",
    BrandId: "",
    TargetGroupId: "",
    TaxCategoryId: "",
    SupplierId: "",
    clientFile: null,
    imageUrl: "",
    clientFiles: [],
    productSizes: [],
    productImages: [],
  });

  const [preview, setPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [targetGroups, setTargetGroups] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [Taxes, setTaxes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await GetProductById(id);

        setFormData({
          Name: res.data.name || "",
          Description: res.data.description || "",
          Price: res.data.price || "",
          CostPrice: res.data.costPrice || "",
          CategoryId: res.data.categoryId || "",
          BrandId: res.data.brandId || "",
          TargetGroupId: res.data.targetGroupId || "",
          TaxCategoryId: res.data.taxCategoryId || "", // ✅ fixed
          SupplierId: res.data.supplierId || "",
          imageUrl: res.data.imageUrl || "",
          clientFile: null,
          clientFiles: [],
          productImages: res.data.productImages || [],
          productSizes: res.data.productSizes || [],
        });

        setPreview(
          res.data.imageUrl
            ? `${import.meta.env.VITE_BASE_URL}/images/Products/${res.data.imageUrl}`
            : null
        );

        setGalleryPreview(
          res.data.productImages?.map(
            (img) => `${import.meta.env.VITE_BASE_URL}/images/Products/${img.imageUrl}`
          ) || []
        );
      } catch (error) {
        if (error.response && error.response.data) {
          const { errors, message } = error.response.data;

          if (errors && typeof errors === "object") {
            const allErrors = Object.values(errors).flat();
            setError(allErrors.join("\n"));
            return;
          }

          if (Array.isArray(message)) {
            setError(message.join("\n"));
            return;
          }

          if (typeof message === "string") {
            setError(message);
            return;
          }
        }
        setError(t("errorr_message"));
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await getCategories();
        setCategories(catRes.data);
        const brandsRes = await GetBrands();
        setBrands(brandsRes.data.items);
        const tgRes = await GetTargetGroups();
        setTargetGroups(tgRes.data);
        const sizesRes = await GetSizes();
        setAvailableSizes(sizesRes.data);
        const taxeRes = await GetTaxCategorys();
        setTaxes(taxeRes.data);
      } catch (error) {
        if (error.response && error.response.data) {
          const { errors, message } = error.response.data;

          if (errors && typeof errors === "object") {
            const allErrors = Object.values(errors).flat();
            setError(allErrors.join("\n"));
            return;
          }

          if (Array.isArray(message)) {
            setError(message.join("\n"));
            return;
          }

          if (typeof message === "string") {
            setError(message);
            return;
          }
        }
        setError(t("errorr_message"));
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

  const handelCahngeSize = (size) => {
    setFormData((prev) => {
      const exists = prev.productSizes.some((s) => s.id === size.id);
      const updatedSizes = exists
        ? prev.productSizes.filter((s) => s.id !== size.id)
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (
          !["clientFiles", "productSizes", "productImages", "clientFile"].includes(key) &&
          value !== "" &&
          value !== null
        ) {
          data.append(key, value);
        }
      });

      if (formData.clientFile) data.append("clientFile", formData.clientFile);

      if (formData.clientFiles.length > 0) {
        formData.clientFiles.forEach((file) =>
          data.append("clientFiles", file)
        );
      }

      data.append("ProductSizes", JSON.stringify(formData.productSizes));

      await UpdateProductById(data, id);
      setSuccess(t("update_success"));
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join("\n")
          : t("errorr_message")
      );
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
          {/* Main Image */}
          <FormControl
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box position="relative" display="inline-block">
              <input
                type="file"
                id="clientFile"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="clientFile" style={{ cursor: "pointer" }}>
                <Avatar
                  variant="square"
                  src={
                    preview ||
                    (formData.imageUrl
                      ? `${import.meta.env.VITE_BASE_URL}/Products/${formData.imageUrl}`
                      : "/public/Images/AddPic.webp")
                  }
                  sx={{ width: "100%", height: "100%", transition: "0.3s" }}
                />
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

          {/* Gallery */}
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

          {/* Fields */}
          <TextField
            label={t("Name")}
            name="Name"
            fullWidth
            value={formData.Name}
            onChange={handleChange}
          />
          <TextField
            label={t("Description")}
            name="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.Description}
            onChange={handleChange}
          />
          <TextField
            label={t("Price")}
            name="Price"
            type="number"
            fullWidth
            value={formData.Price}
            onChange={handleChange}
          />
          <TextField
            label={t("CostPrice")}
            name="CostPrice"
            type="number"
            fullWidth
            value={formData.CostPrice}
            onChange={handleChange}
          />

          {/* Sizes */}
          <FormControl>
            <label>{t("SelectSizes")}</label>
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
                    checked={formData.productSizes.some(
                      (s) => s.id === size.id
                    )}
                    onChange={() => handelCahngeSize(size)}
                  />
                  {size.name}
                </label>
              ))}
            </Box>
          </FormControl>

          {/* Category */}
          <Select
            name="CategoryId"
            value={formData.CategoryId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">{t("SelectCategory")}</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>

          {/* Brand */}
          <Select
            name="BrandId"
            value={formData.BrandId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">{t("SelectBrand")}</MenuItem>
            {brands.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </Select>

          {/* Target Group */}
          <Select
            name="TargetGroupId"
            value={formData.TargetGroupId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">{t("SelectTargetGroup")}</MenuItem>
            {targetGroups.map((tg) => (
              <MenuItem key={tg.id} value={tg.id}>
                {tg.name}
              </MenuItem>
            ))}
          </Select>

          {/* Tax Category */}
          <Select
            name="TaxCategoryId"
            value={formData.TaxCategoryId}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">{t("SelectTaxCategory")}</MenuItem>
            {Taxes.map((tax) => (
              <MenuItem key={tax.id} value={tax.id}>
                {tax.name}
              </MenuItem>
            ))}
          </Select>

          {/* Supplier */}
          <select
            name="SupplierId"
            value={formData.SupplierId}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, marginBottom: 20 }}
          >
            <option value="">{t("SelectSupplier")}</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : t("Save")}
          </Button>

          <Button
            startIcon={<ArrowBack />}
            component={Link}
            to="/System/products"
            fullWidth
            variant="contained"
            sx={{ backgroundColor: "rgb(200, 122, 122)" }}
          >
            {t("Back")}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
