import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface TermsOfServiceModalProps {
  open: boolean;
  handleClose: () => void;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ open, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80%', maxWidth: '600px', bgcolor: 'background.paper', padding: '2rem',
        boxShadow: 24, borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom>
          Terms of Service
        </Typography>
        {/* Terms of Service 내용 추가 */}
        <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
          By using this service, you agree to the following terms...
        </Typography>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default TermsOfServiceModal;