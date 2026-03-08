import { Box } from "@mui/material";
import PostCard from "../PostCard/PostCard";
import { container, grid } from "./styles";

export interface Post {
  id: number;
  title: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
}

interface PostsGridProps {
  posts: Post[];
}

const PostsGrid = ({ posts }: PostsGridProps) => {
  return (
    <Box sx={container}>
      <Box sx={grid}>
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </Box>
    </Box>
  );
};

export default PostsGrid;