export default function About() {
  return (
    <div
      className="about-container"
      style={{
        backgroundImage: "url('/image1.jpg')", // Use image1 as background
      }}
    >
      <div className="about-content">
        <h1>About Flavorverse</h1>
        <p className="lead">
          Flavorverse is your go-to platform for discovering and sharing
          delicious and healthy recipes. Our mission is to bring together food
          enthusiasts from around the world to explore new flavors and culinary
          experiences.
        </p>
        <p>
          Whether you're a seasoned chef or a home cook, Flavorverse offers a
          wide range of recipes to suit every taste and dietary preference. Join
          our community today and start your culinary adventure!
        </p>
      </div>
    </div>
  );
}
