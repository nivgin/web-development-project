import {
  Box,
  Divider,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import * as styles from "./styles";

interface InstructionListProps {
  instructions: string[];
}

export default function InstructionList({ instructions }: InstructionListProps) {
  if (!instructions || instructions.length === 0) return null;

  return (
    <Box sx={styles.paper}>
      <Box sx={styles.header}>
        <Typography variant="h5" fontWeight="bold">
          Instructions
        </Typography>
      </Box>
      <Divider sx={styles.divider} />
      <Stepper orientation="vertical" nonLinear>
        {instructions.map((step, index) => (
          <Step key={index} active>
            <StepLabel slotProps={{ stepIcon: { sx: styles.stepIconProps } }}>
                <Typography variant="body1" sx={styles.stepContent}>
                    {step}
                </Typography>
            </StepLabel>
            <StepContent>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
