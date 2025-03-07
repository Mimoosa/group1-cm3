import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditProductPage = () => {
  const [product, setProduct] = useState(null); // Initialize product state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const { id } = useParams();
  
  // Declare state variables for form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [stockQuantity, setStockQuantity] = useState();
  const [supplierName, setSupplierName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rating, setRating] = useState()
  
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user ? user.token : null;
  
  const navigate = useNavigate();
  
  const updateProduct = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.ok;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  };
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setProduct(data); // Set the product data
        
        // Initialize form fields with fetched product data
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
        setStockQuantity(data.stockQuantity);
        setSupplierName(data.supplier.name);
        setContactEmail(data.supplier.contactEmail);
        setContactPhone(data.supplier.contactPhone);
        setRating(data.supplier.rating);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Stop loading after fetch
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Handle form submission
  const submitForm = async (e) => {
    e.preventDefault();
    
    const updatedProduct = {
      id,
      title,
      category,
      description,
      supplier: {
        name: supplierName,
        contactEmail,
        contactPhone,
        rating,
      },
    };
    
    const success = await updateProduct(updatedProduct);
    if (success) {
      // toast.success("Product Updated Successfully");
      navigate(`/products/${id}`);
    } else {
      // toast.error("Failed to update the product");
    }
  };
  
  return (
    <div className="create">
      <h2>Update Product</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <form onSubmit={submitForm}>
          <label>Product title:</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label>Product type:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Furniture">Furniture</option>
          </select>
          <label>Product Description:</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label>Price:</label>
          <input
            type="number"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label>Stock Quantity:</label>
          <input
            type="number"
            required
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />
          <label>Supplier Name:</label>
          <input
            type="text"
            required
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
          />
          <label>Contact Email:</label>
          <input
            type="text"
            required
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
          <label>Contact Phone:</label>
          <input
            type="text"
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
          <label>Rating:</label>
          <input
            type="number"
            required
            value={rating}
            min={1}
            max={5}
            onChange={(e) => setRating(e.target.value)}
          />
          <button>Update Product</button>
        </form>
      )}
    </div>
  );
};

export default EditProductPage;
