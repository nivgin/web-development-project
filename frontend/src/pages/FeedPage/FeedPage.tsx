import { Box, CircularProgress } from "@mui/material";
import HeroSection from "../../components/HeroSection/HeroSection";
import PostsGrid from "../../components/PostsGrid/PostsGrid";
import InfiniteScroll from "react-infinite-scroll-component"; 
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAPI } from "../../hooks/useApi";
import FeedEnd from "../../components/FeedEnd/FeedEnd";
import type { Post } from "../../types/Post";

export default function FeedPage() {
  const LIMIT = 6;
  const api = useAPI();

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
  } = useInfiniteQuery({ queryKey: ["posts"], 
    queryFn: ({ pageParam = 1 }) => 
      api.posts.getPosts(pageParam, LIMIT), 
    getNextPageParam: (lastPage, pages) => { 
      if (lastPage.length < LIMIT) 
        return undefined; 
      return pages.length + 1; 
    }, 
    initialPageParam: 1, 
  });

  const posts: Post[] = data?.pages.flatMap((page) => page) ?? [];

  return (
    <Box
      sx={{
        backgroundColor: "#f9f7f5",
        minHeight: "100vh",
      }}
    >
      <HeroSection />
      <InfiniteScroll 
        dataLength={posts.length} 
        next={fetchNextPage} 
        hasMore={!!hasNextPage} 
        loader={ 
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}> 
            <CircularProgress /> 
          </Box> 
        }
        endMessage={
          <FeedEnd />
        } 
      > 
        <PostsGrid posts={posts} /> 
      </InfiniteScroll>
    </Box>
  );
}