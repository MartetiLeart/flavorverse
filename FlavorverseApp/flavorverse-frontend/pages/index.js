import Link from "next/link";

export default function Home() {
  return (
    <div
      className="home-container"
      style={{
        backgroundImage: "url('/image.jpg')",
      }}
    >
      <div className="home-content">
        <h1 className="display-4 mb-4">Welcome to Flavorverse</h1>
        <p className="lead mb-4">
          Your source for healthy and delicious recipes!
        </p>
        <Link href="/recipes" className="btn btn-primary btn-lg">
          View All Recipes
        </Link>
      </div>
    </div>
  );
}
