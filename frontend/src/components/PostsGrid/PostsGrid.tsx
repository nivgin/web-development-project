import { Box } from "@mui/material";
import PostCard from "../PostCard/PostCard";
import { container, grid } from "./styles";
import type { Post } from "../../types/Post";

interface PostsGridProps {
  posts: Post[];
  linkSuffix?: string;
}

const PostsGrid = ({ posts, linkSuffix }: PostsGridProps) => {
  return (
    <Box sx={container}>
      <Box sx={grid}>
        {posts.map((post) => (
          <PostCard key={post._id} {...post} linkSuffix={linkSuffix} />
        ))}
      </Box>
    </Box>
  );
};

export default PostsGrid;