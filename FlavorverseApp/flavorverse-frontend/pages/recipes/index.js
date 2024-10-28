// pages/recipes/index.js
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // "all" or "my"
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, [filter, user]);

  const fetchRecipes = async () => {
    try {
      let url = "http://localhost:5000/api/recipes";
      if (filter === "my" && user) {
        url = "http://localhost:5000/api/user/recipes";
      }

      const res = await fetch(url, {
        headers:
          filter === "my"
            ? {
                Authorization: `Bearer ${user.token}`,
              }
            : {},
      });
      const data = await res.json();
      setRecipes(data);
    } catch (error) {
      setError("Error fetching recipes");
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        setRecipes(recipes.filter((recipe) => recipe._id !== id));
        router.push("/recipes"); // Redirect to all recipes
      } else {
        const data = await res.json();
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to delete recipe");
    }
  };

  return (
    <div className="container">
      <div className="recipe-list-container">
        <h1 className="text-center mb-4">
          {filter === "all" ? "All Recipes" : "My Recipes"}
        </h1>

        <div className="d-flex justify-content-between align-items-center mb-4">
          {user && (
            <div className="btn-group">
              <button
                className={`btn ${
                  filter === "all" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("all")}
              >
                All Recipes
              </button>
              <button
                className={`btn ${
                  filter === "my" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setFilter("my")}
              >
                My Recipes
              </button>
            </div>
          )}

          {user && (
            <Link href="/recipes/new" className="btn btn-primary">
              Create New Recipe
            </Link>
          )}
        </div>

        {!user && (
          <p className="text-center mb-4">
            Please <Link href="/login">login</Link> to create recipes
          </p>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link
              key={recipe._id}
              href={`/recipes/${recipe._id}`}
              className="recipe-card-link"
            >
              <div className="recipe-card">
                <div className="recipe-image-container">
                  {recipe.image ? (
                    <img
                      src={`data:${recipe.image.contentType};base64,${recipe.image.data}`}
                      alt={recipe.title}
                      className="recipe-image"
                    />
                  ) : (
                    <div className="recipe-image-placeholder">No Image</div>
                  )}
                </div>
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  {filter === "all" && (
                    <p className="recipe-author">By {recipe.username}</p>
                  )}
                  {filter === "my" && user && recipe.userId === user.userId && (
                    <button
                      onClick={(e) => {
                        // e.stopPropagation(); // Prevent link navigation
                        handleDelete(recipe._id);
                      }}
                      className="btn btn-danger btn-sm mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
