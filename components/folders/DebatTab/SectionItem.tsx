import * as React from "react";

import Typography from "@mui/material/Typography";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

function TimelineDot() {
  return (
    <Box
      sx={(theme) => ({
        mx: "auto",
        borderWidth: 2,
        borderColor: theme.palette.grey[400],
        width: 40,
        height: 40,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <Box
        sx={{
          bgcolor: "black",
          width: 8,
          height: 8,
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}

interface ParoleItemProps {
  title: string | null;
  subtitle?: string | null;
}

export default function SectionItem(props: ParoleItemProps) {
  const { title, subtitle } = props;

  return (
    <TimelineItem sx={{ minHeight: 100 }}>
      <TimelineSeparator sx={{ minWidth: 50 }}>
        <TimelineConnector />
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent sx={{ my: "auto" }}>
        <Stack direction="column" spacing={1}>
          <Typography variant="body1" fontWeight="bold">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" fontWeight="light">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </TimelineContent>
    </TimelineItem>
  );
}
