import { Box, CircularProgress, Divider, List, Typography } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAPI } from "../../hooks/useApi";
import type { Comment } from "../../types/Comment";
import CommentItem from "../Comment/Comment";
import * as styles from "./styles";

interface CommentListProps {
  postId: string;
}

const LIMIT = 10;

export default function CommentList({ postId}: CommentListProps) {
  const api = useAPI();

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) =>
      api.comments.getCommentsByPostId(postId, pageParam, LIMIT),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < LIMIT) return undefined;
      return pages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });

  const comments: Comment[] = data?.pages.flatMap((page) => page) ?? [];

  return (
    <Box sx={styles.paper}>
      <Box sx={styles.header}>
        <Typography variant="h6" fontWeight="bold">
          Comments ({comments.length ?? "0"})
        </Typography>
      </Box>
      <Divider sx={styles.divider} />
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        }
      >
        <List disablePadding>
          {comments.map((comment) => (
            <CommentItem key={comment._id} content={comment.content} sender={comment.sender} />
          ))}
        </List>
      </InfiniteScroll>
    </Box>
  );
}
