import React from 'react';
import { Box, Tooltip} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

const IconTooltip = () => {
    return (
      <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="4vh"
        >
          <Tooltip title="This map depicts regions where certain community efforts and projects were developed.">
          <InfoIcon></InfoIcon>
          </Tooltip>
        </Box>
    );
};

export { IconTooltip };