import { Box, Button, Stack, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import type { Control, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "../FormInput/FormInput";
import * as styles from "./styles";

export const profileFormSchema = z.object({
  image: z.instanceof(FileList).optional(),
  username: z.string().min(1, "Username is required"),
  password: z.string().or(z.literal("")).optional(),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  control: Control<ProfileFormSchema>;
  handleSubmit: (cb: SubmitHandler<ProfileFormSchema>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: SubmitHandler<ProfileFormSchema>;
  isSubmitting?: boolean;
  imagePreview: string | null;
  onImagePreviewChange: (url: string | null) => void;
}

export default function ProfileForm({ control, handleSubmit, onSubmit, isSubmitting, imagePreview, onImagePreviewChange }: ProfileFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {/* Avatar Upload */}
        <input
          type="file"
          accept="image/*"
          id="profile-image-upload"
          style={{ display: "none" }}
          {...control.register("image", {
            onChange: (e) => {
              const file = e.target.files?.[0];
              if (file) onImagePreviewChange(URL.createObjectURL(file));
              else onImagePreviewChange(null);
            },
          })}
        />
        <Stack alignItems="flex-start" spacing={1}>
          <label htmlFor="profile-image-upload">
            <Box sx={styles.avatarUploadBox(false, imagePreview)}>
              {!imagePreview && <AccountCircleIcon sx={{ fontSize: 56, color: "text.disabled" }} />}
            </Box>
          </label>
          <Typography variant="caption" color="text.secondary">
            Click to upload profile photo
          </Typography>
        </Stack>

        {/* Username */}
        <Typography variant="subtitle1">Username</Typography>
        <FormInput<ProfileFormSchema> name="username" control={control} label="Username" type="text" />

        {/* Password */}
        <Typography variant="subtitle1">New Password</Typography>
        <FormInput<ProfileFormSchema> name="password" control={control} label="New Password (leave blank to keep current)" type="password" />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={styles.submitButton}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </Stack>
    </form>
  );
}
