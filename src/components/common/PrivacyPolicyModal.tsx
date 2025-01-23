import { Modal, Box, Typography, Button } from '@mui/material';

interface PrivacyPolicyModalProps {
  open: boolean;
  handleClose: () => void;
}

const PrivacyPolicyModal = ({ open, handleClose }: PrivacyPolicyModalProps) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80%', maxWidth: '600px', bgcolor: 'background.paper', padding: '2rem',
        boxShadow: 24, borderRadius: 2
      }}>
        <Typography variant="h6" gutterBottom>
          Privacy Policy
        </Typography>
        {/* Privacy Policy 내용 추가 */}
        <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
          Your privacy is important to us...
        </Typography>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default PrivacyPolicyModal;