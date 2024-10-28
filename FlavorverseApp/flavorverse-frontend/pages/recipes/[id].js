import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/recipes/${id}`)
        .then((res) => res.json())
        .then((data) => setRecipe(data));
    }
  }, [id]);

  if (!recipe) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="recipe-detail d-flex align-items-start">
        {recipe.image && (
          <div className="recipe-detail-image-container me-4">
            <img
              src={`data:${recipe.image.contentType};base64,${recipe.image.data}`}
              alt={recipe.title}
              className="recipe-detail-image"
            />
          </div>
        )}
        <div className="recipe-detail-content">
          <h1 className="mb-4">{recipe.title}</h1>
          <div className="mb-4">
            <h3 className="h4">Ingredients:</h3>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="h4">Instructions:</h3>
            <p className="lead">{recipe.instructions}</p>
          </div>
          <Link href="/recipes" className="btn btn-primary mt-3">
            Back to Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
