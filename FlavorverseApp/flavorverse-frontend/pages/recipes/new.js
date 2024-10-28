import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is jpg/jpeg
      if (!file.type.match("image/jpe?g")) {
        setError("Please select only JPG/JPEG images");
        e.target.value = ""; // Clear the input
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(""); // Clear any previous errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append(
      "ingredients",
      JSON.stringify(ingredients.split(",").map((ing) => ing.trim()))
    );
    formData.append("instructions", instructions);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (res.ok) {
        router.push("/recipes");
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to create recipe");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1 className="text-center mb-4">Create New Recipe</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image (JPG/JPEG only):</label>
            <input
              type="file"
              className="form-control"
              accept=".jpg,.jpeg"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <div className="mt-2">
                <img src={previewUrl} alt="Preview" className="img-preview" />
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Ingredients (comma-separated):</label>
            <input
              type="text"
              className="form-control"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Instructions:</label>
            <textarea
              className="form-control"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              required
              rows="4"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Create Recipe
          </button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}
