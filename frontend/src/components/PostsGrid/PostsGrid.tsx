import { Box } from "@mui/material";
import PostCard from "../PostCard/PostCard";
import { container, grid } from "./styles";
import type { Post } from "../../types/Post";

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