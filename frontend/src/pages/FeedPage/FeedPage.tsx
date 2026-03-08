import { Box } from "@mui/material";
import HeroSection from "../../components/HeroSection/HeroSection";
import PostsGrid from "../../components/PostsGrid/PostsGrid";

export default function FeedPage() {
  const posts = [
    {
      id: 3,
      title: "Classic Cheeseburger",
      image: "/cheeseburger.jpg",
      description: "Juicy grilled beef patty with melted cheese.",
      likes: 342,
      comments: 21,
    },
    {
      id: 4,
      title: "Avocado Toast",
      image: "/avocadotoast.jpg",
      description: "Crispy sourdough topped with smashed avocado.",
      likes: 198,
      comments: 9,
    },
    {
      id: 5,
      title: "Chicken Curry",
      image: "/chickencurry.jpg",
      description: "Aromatic curry simmered with tender chicken.11111111111111111111111111",
      likes: 412,
      comments: 37,
    },
    {
      id: 6,
      title: "Chocolate Brownies",
      image: "/chocolatebrownies.jpg",
      description: "Rich, fudgy brownies with a crackly top.",
      likes: 501,
      comments: 44,
    },
    {
      id: 7,
      title: "Greek Salad",
      image: "/greeksalad.jpg",
      description: "Fresh veggies with feta and olive oil.",
      likes: 167,
      comments: 12,
    },
    {
      id: 8,
      title: "Margherita Pizza",
      image: "/margaritapizza.jpg",
      description: "Classic pizza with tomato, mozzarella, and basil.",
      likes: 623,
      comments: 58,
    },
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#f9f7f5",
        minHeight: "100vh",
      }}
    >
      <HeroSection />
      <PostsGrid posts={posts} />
    </Box>
  );
}