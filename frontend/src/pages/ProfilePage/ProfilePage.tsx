import { Box, CircularProgress, Divider, Typography } from "@mui/material";
import { useQuery, useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { useAPI } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import UserInfo from "../../components/UserInfo/UserInfo";
import PostsGrid from "../../components/PostsGrid/PostsGrid";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedEnd from "../../components/FeedEnd/FeedEnd";
import type { Post } from "../../types/Post";

export default function ProfilePage() {
  const LIMIT = 12;
  const api = useAPI();
  const { user: userId } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => api.users.getUserById(userId!),
    enabled: !!userId,
  });

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["posts", "sender", userId],
    queryFn: ({ pageParam = 1 }) =>
      api.posts.getPostsBySender(userId!, undefined, pageParam, LIMIT),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < LIMIT) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    enabled: !!userId,
  });

  const posts: Post[] = data?.pages.flatMap((page) => page) ?? [];

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: "80px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "lg", mt: "80px", mx: "auto" }}>
      {user && <UserInfo user={user} />}
      <Divider />
      <Typography variant="h5" sx={{ fontWeight: 700, px: 3, pt: 3, pb: 1 }}>
        My Recipes
      </Typography>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={<FeedEnd />}
      >
        <PostsGrid posts={posts} linkSuffix="/manage" />
      </InfiniteScroll>
    </Box>
  );
}
